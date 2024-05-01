import * as authentication from '@feathersjs/authentication';
import {HookContext} from '@feathersjs/feathers';
import {fastJoin, ResolverMap} from 'feathers-hooks-common';
import {hooks} from 'feathers-sequelize';
import {ModelStatic, Op, Sequelize} from 'sequelize';
import dehydrate = hooks.dehydrate;
import {BadRequest} from '@feathersjs/errors';
// Don't remove this comment. It's needed to format import lines nicely.

const {authenticate} = authentication.hooks;

interface Position {
    positionId: number;
    quantity: number;
}

function handleFK() {
    return async (context: HookContext) => {
        const {result, data, app} = context;
        const positions: Position[] = data.positions || [];
        const models = app.get('sequelizeClient').models;
        const productsModel: ModelStatic<any> = models.products;
        const orderProductsModel: ModelStatic<any> = models.order_products;
        const joinedProducts: number[] = [];
        const availableProducts: Record<string, number> = {};

        const productsCount = await productsModel.findAll({
            raw: true,
            attributes: [
                'positionId',
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'productsCount']
            ],
            where: {
                positionId: positions.map(position => position.positionId)
            },
            group: ['positionId']
        });

        for (const count of productsCount) {
            availableProducts[count.positionId] = count.productsCount;
        }

        for (const position of positions) {
            const availableQuantity = availableProducts[position.positionId] || 0;
            if (availableQuantity < position.quantity) {
                throw new BadRequest('Недостаточно продуктов');
            }
        }

        await Promise.all(positions.map(async (el) => {
            const products = await productsModel.findAll({
                where: {
                    positionId: el.positionId
                },
                order: [['created_at', 'DESC']],
                limit: el.quantity,
                raw: true
            });
            joinedProducts.push(...products.map((p) => p.id));
        }));
        await Promise.all(joinedProducts.map((productId) => {
            return orderProductsModel.findOrCreate({
                where: {
                    orderId: result.id,
                    productId
                }
            });
        }));
        await orderProductsModel.destroy({
            where: {
                orderId: result.id,
                productId: {
                    [Op.notIn]: joinedProducts
                }
            }
        });
    };
}

function includeProducts() {
    return async (context: HookContext) => {
        const {app} = context;
        const models = app.get('sequelizeClient').models;
        context.params.sequelize = {
            include: [
                {
                    model: models.products,
                    as: 'products',
                    through: {
                        model: models.order_products,
                        attributes: []
                    }
                }
            ],
            raw: false
        };
    };
}

function groupProductsByPosition() {
    const postResolvers: ResolverMap<any> = {
        joins: {
            products: () => async (order: any, context: HookContext) => {
                const {app} = context;
                const {models} = app.get('sequelizeClient');
                const groupedProducts = order.products.reduce((acc: any, product: any) => {
                    if (!acc[product.positionId]) {
                        acc[product.positionId] = [];
                    }
                    acc[product.positionId].push(product);
                    return acc;
                }, {});
                order.positions = await Promise.all(Object.entries(groupedProducts).map(async ([positionId, products]) => {
                    const position = await models.positions.findByPk(positionId);
                    return {
                        position,
                        products
                    };
                }));
                return order;
            }
        }
    };
    return fastJoin(postResolvers);
}

export default {
    before: {
        all: [authenticate('jwt')],
        find: [includeProducts()],
        get: [includeProducts()],
        create: [],
        update: [],
        patch: [],
        remove: []
    },
    after: {
        all: [],
        find: [dehydrate(), groupProductsByPosition()],
        get: [dehydrate(), groupProductsByPosition()],
        create: [handleFK()],
        update: [],
        patch: [],
        remove: []
    },
    error: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    }
};
