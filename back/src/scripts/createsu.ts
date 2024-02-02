import * as inquirer from 'inquirer';

import app from '../app';
import logger from '../logger';

async function main() {
    logger.info('Initializing... Please wait');
    await new Promise(resolve => setTimeout(resolve, 500));
    const {phone} = await inquirer.prompt({type: 'input', name: 'phone'});
    const {password} = await inquirer.prompt({type: 'password', name: 'password'});
    const {firstName, lastName} = await inquirer.prompt([
        {type: 'input', name: 'firstName'},
        {type: 'input', name: 'lastName'}
    ]);
    await app.service('users').create({
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        password: password,
        role: 'admin'
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
