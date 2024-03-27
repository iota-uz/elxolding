import {BadRequest} from '@feathersjs/errors';

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
