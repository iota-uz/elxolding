import {strictEqual} from 'node:assert';

import * as assert from 'assert';

import app from '../../src/app';


describe('\'customers\' service', function () {
    describe('Test customers && customers contact create && update', async function () {
        it('Test customers.create && customers.patch', async () => {

            const customer = await app.service('customers').create({
                name: 'НПФ Элепс',
                contacts: [
                    {
                        name: 'Андрей',
                        phone: '123456789',
                        email: 'asafasfasa@gmail.com',
                        comment: 'asfasf'
                    },
                    {
                        name: 'Андрей',
                        phone: '123456789',
                        email: 'asfafsa@gmail.com',
                        comment: 'asfasf'
                    }
                ]
            });

            const customerContactModel = app.get('sequelizeClient').models.customers_contact;
            const contacts = await customerContactModel.findAll({raw: true});
            assert.strictEqual(customer.name, 'НПФ Элепс', 'Expected name to be set');
            assert.strictEqual(contacts.length, 2, 'Expected 2 contacts to be created');

            await app.service('customers').patch(customer.id, {
                contacts: [
                    {
                        id: 1,
                        name: 'Жека',
                        phone: '123456789',
                        email: 'rustamov@gmail.com',
                        comment: 'comment'
                    },
                    {
                        id: 2,
                        name: 'Грегорий',
                        phone: '123456789',
                        email: 'rustamov@gmail.com',
                        comment: 'comment'
                    }
                ]
            });
            const updatedContacts = await customerContactModel.findAll({raw: true});
            strictEqual(updatedContacts[0].name, 'Жека', 'Expected name to be updated');
            strictEqual(updatedContacts[1].name, 'Грегорий', 'Expected name to be updated');
            strictEqual(customer.id, updatedContacts[0].customer_id, 'Expected customer_id to be set');
            strictEqual(customer.id, updatedContacts[1].customer_id, 'Expected customer_id to be set');
        });
    });
});
