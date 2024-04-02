import * as authentication from '@feathersjs/authentication';
import {HookContext} from '@feathersjs/feathers';
import {fastJoin, ResolverMap} from 'feathers-hooks-common';
import {hooks} from 'feathers-sequelize';
import {ModelStatic, Op} from 'sequelize';
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
        const requestProductsModel: ModelStatic<any> = models.request_products;
        const joinedProducts: number[] = [];
        const availableProducts:Record<string, number> = {};

        await Promise.all(positions.map(async (el) => {
            const productsCount = await productsModel.count({
                where: {
                    positionId: el.positionId
                }
            });
            availableProducts[el.positionId] = productsCount;

        }));

        for (const position of positions) {
            if (!availableProducts[position.positionId] || availableProducts[position.positionId] < position.quantity) {
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
            return requestProductsModel.findOrCreate({
                where: {
                    requestId: result.id,
                    productId
                }
            });
        }));
        await requestProductsModel.destroy({
            where: {
                requestId: result.id,
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
                        model: models.request_products,
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
            products: () => async (request: any, context: HookContext) => {
                const {app} = context;
                const {models} = app.get('sequelizeClient');
                const groupedProducts = request.products.reduce((acc: any, product: any) => {
                    if (!acc[product.positionId]) {
                        acc[product.positionId] = [];
                    }
                    acc[product.positionId].push(product);
                    return acc;
                }, {});
                request.positions = await Promise.all(Object.entries(groupedProducts).map(async ([positionId, products]) => {
                    const position = await models.positions.findByPk(positionId);
                    return {
                        position,
                        products
                    };
                }));
                return request;
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
