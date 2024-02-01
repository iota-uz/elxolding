import * as inquirer from 'inquirer';

import app from '../app';
import logger from '../logger';

async function main() {
    logger.info('Initializing... Please wait');
    await new Promise(resolve => setTimeout(resolve, 500));
    const settings = await app.service('settings').find();
    if (!settings || !settings.id) {
        await app.service('settings')._create({});
    }
    const {email} = await inquirer.prompt({type: 'input', name: 'email'});
    const {password} = await inquirer.prompt({type: 'password', name: 'password'});
    const {firstName, lastName} = await inquirer.prompt([
        {type: 'input', name: 'firstName'},
        {type: 'input', name: 'lastName'}
    ]);
    const {id: roleId} = await app.service('roles').create({
        name: 'SuperUser',
        description: 'Description'
    });
    await app.service('users').create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        roleId
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
