import {BadRequest} from '@feathersjs/errors';
import {Params} from '@feathersjs/feathers';
import {SequelizeServiceOptions, Service} from 'feathers-sequelize';
import {ModelStatic, Op, Sequelize} from 'sequelize';

import {Application} from '../../declarations';

interface Position {
    positionId: number;
    quantity: number;
}

export class Orders extends Service {
    app: Application;

    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
        super(options);
        this.app = app;
    }

    private async getAvailableProducts(positions: Position[]) {
        const {
            products: productsModel
        } = this.app.get('sequelizeClient').models as Record<string, ModelStatic<any>>;
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

        return availableProducts;
    }

    async create(data: any, params?: Params) {
        const positions: Position[] = data.positions || [];
        const sequelize = this.app.get('sequelizeClient') as Sequelize;
        const {
            products: productsModel,
            order_products: orderProductsModel
        } = sequelize.models as Record<string, ModelStatic<any>>;
        const joinedProducts: number[] = [];
        const availableProducts = await this.getAvailableProducts(positions);

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

        const t = await sequelize.transaction();
        const order = await super.create(data, params);
        await Promise.all(joinedProducts.map((productId) => {
            return orderProductsModel.findOrCreate({
                where: {
                    orderId: order.id,
                    productId
                },
                transaction: t
            });
        }));
        await orderProductsModel.destroy({
            where: {
                orderId: order.id,
                productId: {
                    [Op.notIn]: joinedProducts
                }
            },
            transaction: t
        });
        await t.commit();
        return order;
    }
}
