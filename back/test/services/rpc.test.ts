import * as assert from 'assert';

import app from '../../src/app';

describe('\'rpc\' service', function () {
    this.timeout(30000);

    let position;

    beforeEach(async () => {
        position = await app.service('positions').create({
            title: 'position1',
            barcode: 'barcode1',
            unit: 'cm'
        });
    });

    describe('CreateProductsWithTags', function () {
        it('should create products with tags', async () => {
            const rpc = app.service('rpc');
            const {result, error} = await rpc.create({
                method: 'CreateProductsWithTags',
                params: {
                    positionId: position.id,
                    tags: ['tag1', 'tag2']
                }
            });
            const products = await app.service('products').find({
                query: {
                    positionId: position.id
                },
                paginate: false
            });
            assert.strictEqual(error, undefined);
            assert.strictEqual(result.createdProducts, 2);
            assert.strictEqual(products.length, 2);
        });
    });

    describe('GetInventory', function () {
        it('should return inventory', async () => {
            await Promise.all([
                app.service('products').create({
                    positionId: position.id,
                    status: 'in_stock',
                    rfid: 'rfid1'
                }),
                app.service('products').create({
                    positionId: position.id,
                    status: 'in_stock',
                    rfid: 'rfid2'
                }),
            ]);
            const rpc = app.service('rpc');
            const {result, error} = await rpc.create({
                method: 'GetInventory',
                params: {}
            });
            assert.strictEqual(error, undefined);
            assert.strictEqual(result.inventory.length, 1);
            assert.strictEqual(result.inventory[0].products.length, 2);
        });
    });
});



