import {BadRequest} from '@feathersjs/errors';
import {ModelStatic} from 'sequelize';

import {Application} from '../../declarations';

export class RpcHandler {
    app: Application;

    constructor(app: Application) {
        this.app = app;
    }

    public async CreateProductsWithTags(data: { positionId?: number, tags?: string[] }): Promise<{
        createdProducts: number
    }> {
        if (!data.positionId || !data.tags || !Array.isArray(data.tags)) {
            throw new BadRequest('Invalid data');
        }
        const {positionId, tags} = data;
        const result = await Promise.all(tags.map(async (tag: any) => {
            await this.app.service('products').create({
                positionId,
                rfid: tag,
                status: 'in_development'
            });
        }));
        return {createdProducts: result.length};
    }

    public async CompleteOrder(data: { orderId: number }): Promise<{ success: boolean }> {
        if (!data.orderId) {
            throw new BadRequest('Invalid data');
        }
        const {orderId} = data;
        const {models} = this.app.get('sequelizeClient');
        const orderModel: ModelStatic<any> = models.orders;
        const productsModel: ModelStatic<any> = models.products;

        const order = await orderModel.findByPk(orderId);
        if (!order) {
            throw new BadRequest('Order not found');
        }
        if (order.type === 'in') {
            await productsModel.update({status: 'approved'}, {where: {orderId}});
        } else {
            await productsModel.destroy({where: {orderId}});
        }
        await order.remove();
        return {success: true};
    }

    public async GetInventory(): Promise<{ inventory: any[] }> {
        const positionsModel = this.app.service('positions').Model;
        const positions = await positionsModel.findAll({
            include: [
                {model: this.app.service('products').Model, as: 'products'}
            ],
            raw: false
        });
        return {inventory: positions};
    }

    public async CompleteInventoryCheck(data: { positions: { positionId: number, found: number }[] }): Promise<{
        success: boolean
    }> {
        if (!data.positions || !Array.isArray(data.positions)) {
            throw new BadRequest('Invalid data');
        }
        const {models} = this.app.get('sequelizeClient');
        const positionsModel: ModelStatic<any> = models.positions;
        const productsModel: ModelStatic<any> = models.products;
        const inventoryModel: ModelStatic<any> = models.inventory;
        const inventoryResultsModel: ModelStatic<any> = models.inventory_results;

        const {id} = await inventoryModel.create({
            status: 'completed',
        });

        await Promise.all(data.positions.map(async (position: any) => {
            const {positionId, found} = position;
            const positionModel = await positionsModel.findByPk(positionId);
            if (!positionModel) {
                throw new BadRequest('Position not found');
            }
            const products = await productsModel.findAll({
                where: {
                    positionId,
                    status: 'approved'
                }
            });
            const expected = products.length;
            await inventoryResultsModel.create({
                inventoryId: id,
                positionId,
                expected,
                found,
                difference: found - expected
            });
        }));
        return {success: true};
    }

    public async DashboardStats(): Promise<{ products: number, positions: number, depth: number, orders: number }> {
        const {models} = this.app.get('sequelizeClient');
        const productsModel: ModelStatic<any> = models.products;
        const positionsModel: ModelStatic<any> = models.positions;
        const ordersModel: ModelStatic<any> = models.orders;

        const [products, positions, orders] = await Promise.all([
            productsModel.count({
                where: {
                    status: 'approved'
                }
            }),
            positionsModel.count({}),
            ordersModel.count({
                where: {
                    status: 'pending'
                }
            })
        ]);
        return {products, positions, depth: products / positions, orders};
    }

    getRPCMethods() {
        const properties = Object.getOwnPropertyNames(RpcHandler.prototype) as (keyof RpcHandler)[];
        const methodNames = properties.filter(el => {
            return el[0] == el[0].toUpperCase() && typeof this[el] === 'function';
        });
        return methodNames.reduce((result, key) => {
            return {...result, [key]: this[key]};
        }, {});
    }
}
