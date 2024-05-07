import * as authentication from '@feathersjs/authentication';
import {HookContext} from '@feathersjs/feathers';
import {fastJoin, ResolverMap} from 'feathers-hooks-common';
import {hooks} from 'feathers-sequelize';
import {ModelStatic} from 'sequelize';
import dehydrate = hooks.dehydrate;
// Don't remove this comment. It's needed to format import lines nicely.

const {authenticate} = authentication.hooks;

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
                const models = app.get('sequelizeClient').models as Record<string, ModelStatic<any>>;
                const groupedProducts = order.products.reduce((acc: any, product: any) => {
                    if (!acc[product.positionId]) {
                        acc[product.positionId] = [];
                    }
                    acc[product.positionId].push(product);
                    return acc;
                }, {});
                order.positions = await Promise.all(Object.entries(groupedProducts).map(async ([positionId, products]) => {
                    const position = await models.positions.findByPk(positionId, {
                        include: [
                            {
                                model: models.uploads,
                                as: 'photo',
                                attributes: ['filename']
                            }
                        ],
                        raw: true,
                        nest: true
                    });
                    position.photo = position.photo.filename ? (app.get('images_url') + position.photo.filename) : null;
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
        create: [],
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
