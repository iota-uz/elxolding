import app from '../app';
import logger from '../logger';

async function main() {
    const users = <any[]>await app.service('users').find({paginate: false});
    if (users.length > 0) {
        logger.info('User already exists');
        process.exit(0);
    }
    const firstName = 'Диер';
    const lastName = 'Хайдаров';
    const password = 'admin1234';
    await app.service('users').create({
        firstName: firstName,
        lastName: lastName,
        password: password,
        role: 'superuser'
    });
    const positions = await Promise.all([
        app.service('positions').create({
            title: 'Позиция 1',
            barcode: '0000000000001',
            unit: 'm3'
        }),
        app.service('positions').create({
            title: 'Позиция 2',
            barcode: '0000000000002',
            unit: 'm3'
        }),
        app.service('positions').create({
            title: 'Позиция 3',
            barcode: '0000000000003',
            unit: 'm3'
        }),
        app.service('positions').create({
            title: 'Позиция 4',
            barcode: '0000000000004',
            unit: 'm3'
        }),
        app.service('positions').create({
            title: 'Позиция 5',
            barcode: '0000000000005',
            unit: 'm3'
        }),
        app.service('positions').create({
            title: 'Позиция 6',
            barcode: '0000000000006',
            unit: 'm3'
        }),
        app.service('positions').create({
            title: 'Позиция 7',
            barcode: '0000000000007',
            unit: 'm3'
        }),
    ]);
    await Promise.all([
        app.service('products').create({
            positionId: positions[0].id,
            status: 'in_stock',
            rfid: '0000000000000001'
        }),
        app.service('products').create({
            positionId: positions[1].id,
            status: 'in_stock',
            rfid: '0000000000000002'
        }),
        app.service('products').create({
            positionId: positions[2].id,
            status: 'in_stock',
            rfid: '0000000000000003'
        }),
        app.service('products').create({
            positionId: positions[3].id,
            status: 'in_stock',
            rfid: '0000000000000004'
        }),
        app.service('products').create({
            positionId: positions[4].id,
            status: 'in_stock',
            rfid: '0000000000000005'
        }),
        app.service('products').create({
            positionId: positions[5].id,
            status: 'in_stock',
            rfid: '0000000000000006'
        }),
        app.service('products').create({
            positionId: positions[6].id,
            status: 'in_stock',
            rfid: '0000000000000007'
        }),
    ]);
    process.exit(0);
}

main().then(() => {
    logger.info('Successfully created a user');
    process.exit(0);
}).catch((err) => {
    logger.error(err);
    process.exit(1);
});
