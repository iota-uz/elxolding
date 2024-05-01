import app from '../app';
import logger from '../logger';

async function main() {
    const users = <any[]>await app.service('users').find({paginate: false});
    if (users.length > 0) {
        logger.info('User already exists');
        process.exit(0);
    }
    await app.service('users').create({
        firstName: 'Диер',
        lastName: 'Хайдаров',
        password: 'admin1234',
        role: 'superuser'
    });

    const positions = await Promise.all(Array.from({length: 50_000}).map((_, i) => app.service('positions').create({
        title: `Позиция ${i + 1}`,
        barcode: `000000000000${i + 1}`,
        unit: 'm3'
    })));
    await Promise.all(Array.from({length: 50_000}).map((_, i) => app.service('products').create({
        positionId: positions[i].id,
        status: 'in_stock',
        rfid: `000000000000${i + 1}`
    })));
    process.exit(0);
}

main().then(() => {
    logger.info('Successfully created a user');
    process.exit(0);
}).catch((err) => {
    logger.error(err);
    process.exit(1);
});
