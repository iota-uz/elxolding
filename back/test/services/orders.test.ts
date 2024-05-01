import * as assert from 'assert';

import app from '../../src/app';

describe('\'orders\' service', () => {
    it('registered the service', () => {
        const service = app.service('orders');

        assert.ok(service, 'Registered the service');
    });

    it('test create/get order', async () => {
        const service = app.service('orders');
        const [position1, position2] = await Promise.all([
            app.service('positions').create({
                title: 'position1',
                barcode: 'barcode1',
                unit: 'cm'
            }),
            app.service('positions').create({
                title: 'position2',
                barcode: 'barcode2',
                unit: 'dm'
            })
        ]);

        await Promise.all([
            app.service('products').create({
                positionId: position1.id,
                status: 'in_stock',
                rfid: 'rfid1'
            }),
            app.service('products').create({
                positionId: position1.id,
                status: 'in_stock',
                rfid: 'rfid2'
            }),
            app.service('products').create({
                positionId: position2.id,
                status: 'in_stock',
                rfid: 'rfid3'
            }),
        ]);
        const {id} = await service.create({
            type: 'in',
            positions: [
                {
                    positionId: position1.id,
                    quantity: 2
                },
                {
                    positionId: position2.id,
                    quantity: 1
                }
            ]
        });
        const order = await service.get(id);

        assert.strictEqual(order.type, 'in');
        assert.strictEqual(order.positions.length, 2);
        assert.ok(order.positions[0].position.id);
        assert.ok(order.positions[0].position.title);

        assert.strictEqual(order.products.length, 3);
    });

    it('test create order with not enough products', async () => {
        const service = app.service('orders');
        const position1 = await app.service('positions').create({
            title: 'position1',
            barcode: 'barcode1',
            unit: 'cm'
        });

        await app.service('products').create({
            positionId: position1.id,
            status: 'in_stock',
            rfid: 'rfid1'
        });
        try {
            await service.create({
                type: 'in',
                positions: [
                    {
                        positionId: position1.id,
                        quantity: 2
                    }
                ]
            });
            assert.fail('Expected error');
        } catch (e) {
            const orders = await service.find({paginate: false});

            assert.strictEqual(orders.length, 0);
            assert.strictEqual(e.name, 'BadRequest');
            assert.strictEqual(e.message, 'Недостаточно продуктов');
        }
    });
});
