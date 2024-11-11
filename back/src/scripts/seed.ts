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
    process.exit(0);
}

main().then(() => {
    logger.info('Successfully created a user');
    process.exit(0);
}).catch((err) => {
    logger.error(err);
    process.exit(1);
});
