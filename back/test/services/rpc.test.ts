import * as assert from 'assert';

import app from '../../src/app';


describe('\'rpc\' service', function () {
    this.timeout(30000);

    describe('OpexAggregateMeta', function () {
        it('OpexAggregateMeta test', async () => {
            const subdivision = await app.service('subdivisions').create({
                name: 'ПЕГАС',
            });
            const account = await app.service('accounts').create({
                name: 'ПЕГАС',
                subdivisionId: subdivision.id,
                currency: 'usd'
            });
            const opex = await app.service('opex').create({
                name: 'Зарплата',
                amount: 10000,

            });
            await Promise.all([
                app.service('expenses').create({
                    name: 'Зарплата',
                    amount: 20000,
                    accountId: account.id,
                    opexId: opex.id,
                    date: '2024-03-02'
                }),
                app.service('expenses').create({
                    name: 'Зарплата',
                    amount: 20000,
                    accountId: account.id,
                    opexId: opex.id,
                    date: '2024-06-03'
                })
            ]);

            const {result, error} = await app.service('rpc').create({
                method: 'OpexAggregateMeta',
                params: {
                    from: '2024-03-01',
                    to: '2024-06-04'
                }
            });
            assert.strictEqual(error, undefined, 'Error is not undefined');
            assert.strictEqual(result.planned, 10000, 'Planned expenses are not equal to 10000');
            assert.strictEqual(result.actual, 40000, 'Actual expenses are not equal to 40000');
            assert.strictEqual(result.difference, 300, 'The difference between actual and planned expenses is not equal to 300');
        });
    });
});



