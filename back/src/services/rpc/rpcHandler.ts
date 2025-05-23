import {BadRequest} from '@feathersjs/errors';
import {Model, ModelStatic, Op, Sequelize} from 'sequelize';
import XLSX from 'xlsx';

import {Application} from '../../declarations';

type DashboardStats = {
    products: number
    positions: number
    depth: number
    orders: number
};

type XLSXPosition = {
    name: string
    barcode: string
    unit: string
    quantity: number
};

function loadPositionsFromXLSX(fileName: string): XLSXPosition[] {
    const workbook = XLSX.readFile(fileName);
    const sheet_name_list = workbook.SheetNames;
    const positions: XLSXPosition[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], {
        header: ['name', 'barcode', 'unit', 'quantity'],
        range: 4,
    });
    const nonEmptyPositions = positions.filter((el) => {
        return el.barcode && el.name && el.unit && el.quantity && el.quantity > 0;
    });
    return nonEmptyPositions.map((el) => ({
        barcode: el.barcode.toString(),
        name: el.name.trim(),
        unit: el.unit.trim(),
        quantity: el.quantity
    }));
}

export class RpcHandler {
    app: Application;

    constructor(app: Application) {
        this.app = app;
    }

    public async CreateProductsFromTags(data: { positionId?: number, tags?: string[] }): Promise<{
        createdProducts: number
    }> {
        if (!data.positionId || !data.tags || !Array.isArray(data.tags)) {
            throw new BadRequest('Invalid data');
        }
        const {positionId, tags} = data;
        const result = await Promise.all(tags.map(async (tag): Promise<boolean> => {
            try {
                await this.app.service('products').create({
                    positionId,
                    rfid: tag,
                    status: 'in_development'
                });
                return true;
            } catch (e) {
                return false;
            }
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
        const orderProductsModel: ModelStatic<any> = models.order_products;

        const order = await orderModel.findByPk(orderId);
        if (!order) {
            throw new BadRequest('Order not found');
        }
        const records = await orderProductsModel.findAll({
            where: {
                orderId
            },
            raw: true
        });
        const where = {id: {[Op.in]: records.map((record) => record.productId)}};
        if (order.type === 'in') {
            await productsModel.update({status: 'in_stock'}, {where});
        } else {
            await productsModel.destroy({where});
        }
        await order.destroy();
        return {success: true};
    }

    private async createPositionFromXLSX(position: XLSXPosition): Promise<void> {
        const {models} = this.app.get('sequelizeClient');
        const positionsModel: ModelStatic<any> = models.positions;
        const productsModel: ModelStatic<any> = models.products;
        const positionModel = await positionsModel.create({
            title: position.name,
            barcode: position.barcode,
            unit: position.unit
        });
        await productsModel.bulkCreate(
            Array.from({length: position.quantity}).map(() => ({
                positionId: positionModel.id,
                rfid: `${position.barcode}-${Math.random().toString(36).substring(7)}`,
                status: 'in_stock'
            }))
        );
    }

    public async UploadPositionsFromExcel(data: { fileId?: number }): Promise<any> {
        if (!data.fileId) {
            throw new BadRequest('fileId is required');
        }
        const models = this.app.get('sequelizeClient').models as Record<string, ModelStatic<any>>;
        const positionsModel = models.positions;
        const file = await this.app.service('uploads').get(data.fileId);
        const positions = loadPositionsFromXLSX(this.app.get('uploads') + '/' + file.filename);
        const existingPositions = await positionsModel.findAll({
            where: {
                barcode: {
                    [Op.in]: positions.map((el) => el.barcode)
                }
            }
        });
        let updated = 0;
        let created = 0;
        const promises: Promise<any>[] = [];
        for (const el of positions) {
            const existingPosition = existingPositions.find((position) => position.barcode === el.barcode);
            if (existingPosition) {
                updated++;
                promises.push(
                    positionsModel.update(
                        {title: el.name},
                        {
                            where: {
                                barcode: el.barcode
                            }
                        }
                    )
                );
            } else {
                created++;
                promises.push(this.createPositionFromXLSX(el));
            }
        }
        await Promise.all(promises);
        return {updated, created};
    }

    public async ValidateProducts(data: { tags: string[] }): Promise<{ valid: string[], invalid: string[] }> {
        if (!data.tags || !Array.isArray(data.tags)) {
            throw new BadRequest('Invalid data');
        }
        const {models} = this.app.get('sequelizeClient');
        const productsModel: ModelStatic<any> = models.products;

        const products = await productsModel.findAll({
            where: {
                rfid: {
                    [Op.in]: data.tags
                },
                status: 'in_development'
            },
            attributes: ['rfid']
        });
        await productsModel.update({status: 'approved'}, {
            where: {
                rfid: {
                    [Op.in]: data.tags
                }
            }
        });
        const valid = products.map((product) => product.rfid);
        const invalid = data.tags.filter((tag) => !valid.includes(tag));
        return {valid, invalid};
    }

    public async GetInventory(data: { status?: string }): Promise<{ inventory: any[] }> {
        interface Position {
            id: number;
            title: string;
            products: { rfid: string }[];
        }

        const positionsModel = this.app.service('positions').Model;
        const sequelizeClient = this.app.get('sequelizeClient') as Sequelize;

        const status = data.status ? data.status : 'in_stock';

        const positions = <Model<Position>[]>await positionsModel.findAll({
            raw: false,
            include: [
                {
                    model: this.app.service('products').Model,
                    attributes: ['rfid'],
                    where: {
                        status: status
                    },
                    as: 'products'
                }
            ],
            attributes: {
                include: [
                    sequelizeClient.literal(`(
                        SELECT COUNT(*)
                        FROM products
                        WHERE
                            products.position_id = positions.id AND
                            products.status = '${status}'
                    )`)
                ],
                exclude: ['barcode', 'unit', 'createdAt', 'updatedAt']
            },
        });
        const inventory = positions.map(el => el.toJSON()).map((el) => {
            return {
                id: el.id,
                title: el.title,
                tags: el.products.map((product) => product.rfid),
            };
        });
        return {inventory};
    }

    public async CompleteInventoryCheck(data: {
        positions?: { positionId: number, found: number }[]
    }): Promise<Record<string, any>> {
        if (!data.positions || !Array.isArray(data.positions)) {
            throw new BadRequest('Invalid data');
        }
        const {models} = this.app.get('sequelizeClient');
        const positionsModel: ModelStatic<any> = models.positions;
        const productsModel: ModelStatic<any> = models.products;
        const inventoryModel: ModelStatic<any> = models.inventory;
        const inventoryResultsModel: ModelStatic<any> = models.inventory_results;

        const result = await inventoryModel.create({
            status: 'successful',
        });

        await Promise.all(data.positions.map(async (position) => {
            const {positionId, found} = position;
            const positionModel = await positionsModel.findByPk(positionId);
            if (!positionModel) {
                throw new BadRequest('Position not found');
            }
            const products = await productsModel.findAll({
                where: {
                    positionId,
                    status: 'in_stock'
                }
            });
            const expected = products.length;
            await inventoryResultsModel.create({
                inventoryId: result.id,
                positionId,
                expected,
                found,
                difference: found - expected
            });
        }));
        return result;
    }

    public async DashboardStats(): Promise<DashboardStats> {
        const models = this.app.get('sequelizeClient').models as Record<string, ModelStatic<any>>;
        const {products: productsModel, positions: positionsModel, orders: ordersModel} = models;

        const [products, positions, orders] = await Promise.all([
            productsModel.count({where: {status: 'in_stock'}}),
            positionsModel.count({}),
            ordersModel.count({where: {status: 'pending'}})
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
