import {describe} from 'node:test';

import * as assert from 'assert';

import app from '../../src/app';

describe('\'rpc\' service', function () {
    let positions;

    beforeEach(async () => {
        positions = await Promise.all(([
            app.service('positions').create({
                title: 'position1',
                barcode: 'barcode1',
                unit: 'cm'
            }),
            app.service('positions').create({
                title: 'position2',
                barcode: 'barcode2',
                unit: 'cm'
            }),
        ]));
    });

    describe('CompleteOrder', function () {
        it('should complete "out" order', async () => {
            await Promise.all([
                app.service('products').create({
                    positionId: positions[0].id,
                    status: 'in_stock',
                    rfid: 'rfid1'
                }),
                app.service('products').create({
                    positionId: positions[1].id,
                    status: 'in_stock',
                    rfid: 'rfid2'
                }),
            ]);
            const order = await app.service('orders').create({
                type: 'out',
                positions: [
                    {
                        positionId: positions[0].id,
                        quantity: 1
                    },
                    {
                        positionId: positions[1].id,
                        quantity: 1
                    }
                ]
            });

            const rpc = app.service('rpc');
            const {error} = await rpc.create({
                method: 'CompleteOrder',
                params: {
                    orderId: order.id
                }
            });
            assert.strictEqual(error, undefined);

            const {data: products} = await app.service('products').find({
                query: {
                    status: 'in_stock'
                }
            });
            assert.strictEqual(products.length, 0);

            const {data: orders} = await app.service('orders').find({});
            assert.strictEqual(orders.length, 0);
        });
    });

    it('should complete "in" order', async () => {
        await Promise.all([
            app.service('products').create({
                positionId: positions[0].id,
                status: 'approved',
                rfid: 'rfid1'
            }),
            app.service('products').create({
                positionId: positions[1].id,
                status: 'approved',
                rfid: 'rfid2'
            }),
        ]);
        const order = await app.service('orders').create({
            type: 'in',
            positions: [
                {
                    positionId: positions[0].id,
                    quantity: 1
                },
                {
                    positionId: positions[1].id,
                    quantity: 1
                }
            ]
        });

        const rpc = app.service('rpc');
        const {error} = await rpc.create({
            method: 'CompleteOrder',
            params: {
                orderId: order.id
            }
        });
        assert.strictEqual(error, undefined);

        const {data: products} = await app.service('products').find({
            query: {
                status: 'in_stock'
            }
        });
        assert.strictEqual(products.length, 2);

        const {data: orders} = await app.service('orders').find({});
        assert.strictEqual(orders.length, 0);
    });

    describe('CreateProductsFromTags', function () {
        it('should create products with tags', async () => {
            const rpc = app.service('rpc');
            const {result, error} = await rpc.create({
                method: 'CreateProductsFromTags',
                params: {
                    positionId: positions[0].id,
                    tags: ['tag1', 'tag2']
                }
            });
            const products = await app.service('products').find({
                query: {
                    positionId: positions[0].id
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
                    positionId: positions[0].id,
                    status: 'in_stock',
                    rfid: 'rfid1'
                }),
                app.service('products').create({
                    positionId: positions[0].id,
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
            assert.strictEqual(result.inventory[0].tags.length, 2);
        });
    });

    describe('CompleteInventoryCheck', function () {
        it('should complete inventory check', async () => {
            await Promise.all([
                app.service('products').create({
                    positionId: positions[0].id,
                    status: 'in_stock',
                    rfid: 'rfid1'
                }),
                app.service('products').create({
                    positionId: positions[0].id,
                    status: 'in_stock',
                    rfid: 'rfid2'
                }),
            ]);
            const rpc = app.service('rpc');
            const {result, error} = await rpc.create({
                method: 'CompleteInventoryCheck',
                params: {
                    positions: [
                        {
                            positionId: positions[0].id,
                            found: 2
                        }
                    ]
                }
            });
            const results = await app.service('inventory-results').find({
                query: {
                    inventoryId: result.id
                },
                paginate: false
            });
            assert.strictEqual(error, undefined);
            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].expected, 2);
            assert.strictEqual(results[0].found, 2);
        });
    });
});



