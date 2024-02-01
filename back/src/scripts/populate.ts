import {faker} from '@faker-js/faker';
import * as inquirer from 'inquirer';

import app from '../app';
import logger from '../logger';
import {randomChoice} from '../utils';

// const globalStorage: Record<string, any[]> = {};

async function createTechnologies() {
    const {count} = await inquirer.prompt({
        type: 'number',
        name: 'count',
        message: 'How many technologies do you want to create?'
    });
    const promises = [];
    for (let i = 0; i < count; i++) {
        promises.push(app.service('technologies').create({
            status: randomChoice([
                'inProgress',
                'completed'
            ])
        }));
    }
    await Promise.all(promises);
}

async function createDetails() {
    const {count} = await inquirer.prompt({
        type: 'number',
        name: 'count',
        message: 'How many details do you want to create?'
    });
    const promises = [];
    for (let i = 0; i < count; i++) {
        promises.push(app.service('details').create({
            name: faker.string.alpha({ length: {min: 10, max: 254} }),
            barcode: faker.string.alpha({ length: {min: 10, max: 254} }),
            notes: faker.lorem.paragraph(3)
        }));
    }
    await Promise.all(promises);
}

async function createPlans() {
    const {count} = await inquirer.prompt({
        type: 'number',
        name: 'count',
        message: 'How many plans do you want to create?'
    });
    const promises = [];
    for (let i = 0; i < count; i++) {
        promises.push(app.service('plans').create({
            startDate: faker.date.recent(),
            endDate: faker.date.recent()
        }));
    }
    await Promise.all(promises);
}

async function createOrders() {
    const {count} = await inquirer.prompt({
        type: 'number',
        name: 'count',
        message: 'How many orders do you want to create?'
    });
    const promises = [];
    for (let i = 0; i < count; i++) {
        promises.push(app.service('orders').create({
            receivedAt: faker.date.recent(),
            dueDate: faker.date.recent(),
            accountingNumber: faker.string.alpha({ length: {min: 10, max: 254} }),
            notes: faker.lorem.paragraph(3)
        }));
    }
    await Promise.all(promises);
}

async function createSupplies() {
    const {count} = await inquirer.prompt({
        type: 'number',
        name: 'count',
        message: 'How many supplies do you want to create?'
    });
    const promises = [];
    for (let i = 0; i < count; i++) {
        promises.push(app.service('supplies').create({}));
    }
    await Promise.all(promises);
}

async function createAssortments() {
    const {count} = await inquirer.prompt({
        type: 'number',
        name: 'count',
        message: 'How many assortments do you want to create?'
    });
    const promises = [];
    for (let i = 0; i < count; i++) {
        promises.push(app.service('assortments').create({
            name: faker.string.alpha({ length: {min: 10, max: 254} })
        }));
    }
    await Promise.all(promises);
}

async function createCustomers() {
    const {count} = await inquirer.prompt({
        type: 'number',
        name: 'count',
        message: 'How many customers do you want to create?'
    });
    const promises = [];
    for (let i = 0; i < count; i++) {
        promises.push(app.service('customers').create({
            name: faker.string.alpha({ length: {min: 10, max: 254} }),
            shortName: faker.string.alpha({ length: {min: 10, max: 254} }),
            legalType: randomChoice([
                'llc',
                'ip',
                'spllc',
                'nco',
                'person'
            ]),
            address: faker.string.alpha({ length: {min: 10, max: 254} }),
            notes: faker.lorem.paragraph(3)
        }));
    }
    await Promise.all(promises);
}

async function createCategories() {
    const {count} = await inquirer.prompt({
        type: 'number',
        name: 'count',
        message: 'How many categories do you want to create?'
    });
    const promises = [];
    for (let i = 0; i < count; i++) {
        promises.push(app.service('categories').create({
            name: faker.string.alpha({ length: {min: 10, max: 254} })
        }));
    }
    await Promise.all(promises);
}

async function createProcesses() {
    const {count} = await inquirer.prompt({
        type: 'number',
        name: 'count',
        message: 'How many processes do you want to create?'
    });
    const promises = [];
    for (let i = 0; i < count; i++) {
        promises.push(app.service('processes').create({
            name: faker.string.alpha({ length: {min: 10, max: 254} }),
            plannedStartDate: faker.date.recent(),
            plannedEndDate: faker.date.recent()
        }));
    }
    await Promise.all(promises);
}

async function createStaff() {
    const {count} = await inquirer.prompt({
        type: 'number',
        name: 'count',
        message: 'How many staff do you want to create?'
    });
    const promises = [];
    for (let i = 0; i < count; i++) {
        promises.push(app.service('staff').create({
            lastName: faker.person.lastName(),
            firstName: faker.person.firstName(),
            middleName: faker.person.middleName(),
            position: randomChoice([
                'director',
                'technologist',
                'operator'
            ]),
            notes: faker.lorem.paragraph(3)
        }));
    }
    await Promise.all(promises);
}

async function createActions() {
    const {count} = await inquirer.prompt({
        type: 'number',
        name: 'count',
        message: 'How many actions do you want to create?'
    });
    const promises = [];
    for (let i = 0; i < count; i++) {
        promises.push(app.service('actions').create({
            name: faker.string.alpha({ length: {min: 10, max: 254} }),
            type: randomChoice([
                'milling',
                'turning',
                'drilling',
                'grinding',
                'welding',
                'assembly',
                'cutting',
                'painting',
                'other'
            ])
        }));
    }
    await Promise.all(promises);
}

async function createTools() {
    const {count} = await inquirer.prompt({
        type: 'number',
        name: 'count',
        message: 'How many tools do you want to create?'
    });
    const promises = [];
    for (let i = 0; i < count; i++) {
        promises.push(app.service('tools').create({
            name: faker.string.alpha({ length: {min: 10, max: 254} }),
            barcode: faker.string.alpha({ length: {min: 10, max: 254} }),
            type: randomChoice([
                'drill',
                'mill',
                'body',
                'plate',
                'welding',
                'measuring',
                'other'
            ])
        }));
    }
    await Promise.all(promises);
}

async function createOpex() {
    const {count} = await inquirer.prompt({
        type: 'number',
        name: 'count',
        message: 'How many opex do you want to create?'
    });
    const promises = [];
    for (let i = 0; i < count; i++) {
        promises.push(app.service('opex').create({
            name: faker.string.alpha({ length: {min: 10, max: 254} })
        }));
    }
    await Promise.all(promises);
}

async function createExpenses() {
    const {count} = await inquirer.prompt({
        type: 'number',
        name: 'count',
        message: 'How many expenses do you want to create?'
    });
    const promises = [];
    for (let i = 0; i < count; i++) {
        promises.push(app.service('expenses').create({
            conversionDate: faker.date.recent(),
            date: faker.date.recent()
        }));
    }
    await Promise.all(promises);
}

async function createAccounts() {
    const {count} = await inquirer.prompt({
        type: 'number',
        name: 'count',
        message: 'How many accounts do you want to create?'
    });
    const promises = [];
    for (let i = 0; i < count; i++) {
        promises.push(app.service('accounts').create({
            name: faker.string.alpha({ length: {min: 10, max: 254} }),
            currency: randomChoice([
                'usd',
                'rub',
                'eur'
            ])
        }));
    }
    await Promise.all(promises);
}

async function createMachinery() {
    const {count} = await inquirer.prompt({
        type: 'number',
        name: 'count',
        message: 'How many machinery do you want to create?'
    });
    const promises = [];
    for (let i = 0; i < count; i++) {
        promises.push(app.service('machinery').create({
            name: faker.string.alpha({ length: {min: 10, max: 254} }),
            type: randomChoice([
                'milling',
                'turning',
                'drilling',
                'other'
            ]),
            commissioningDate: faker.date.recent(),
            decommissioningDate: faker.date.recent()
        }));
    }
    await Promise.all(promises);
}

async function createSubdivisions() {
    const {count} = await inquirer.prompt({
        type: 'number',
        name: 'count',
        message: 'How many subdivisions do you want to create?'
    });
    const promises = [];
    for (let i = 0; i < count; i++) {
        promises.push(app.service('subdivisions').create({
            name: faker.string.alpha({ length: {min: 10, max: 254} })
        }));
    }
    await Promise.all(promises);
}

async function createSectors() {
    const {count} = await inquirer.prompt({
        type: 'number',
        name: 'count',
        message: 'How many sectors do you want to create?'
    });
    const promises = [];
    for (let i = 0; i < count; i++) {
        promises.push(app.service('sectors').create({
            shortName: faker.string.alpha({ length: {min: 10, max: 254} }),
            name: faker.string.alpha({ length: {min: 10, max: 254} })
        }));
    }
    await Promise.all(promises);
}

async function createRoles() {
    const {count} = await inquirer.prompt({
        type: 'number',
        name: 'count',
        message: 'How many roles do you want to create?'
    });
    const promises = [];
    for (let i = 0; i < count; i++) {
        promises.push(app.service('roles').create({
            name: faker.string.alpha({ length: {min: 10, max: 254} }),
            description: faker.lorem.paragraph(3)
        }));
    }
    await Promise.all(promises);
}

async function createPermissions() {
    const {count} = await inquirer.prompt({
        type: 'number',
        name: 'count',
        message: 'How many permissions do you want to create?'
    });
    const promises = [];
    for (let i = 0; i < count; i++) {
        promises.push(app.service('permissions').create({
            label: faker.string.alpha({ length: {min: 10, max: 254} }),
            description: faker.string.alpha({ length: {min: 10, max: 254} }),
            resource: faker.string.alpha({ length: {min: 10, max: 254} }),
            action: randomChoice([
                'create',
                'read',
                'update',
                'delete'
            ])
        }));
    }
    await Promise.all(promises);
}

async function createMaterials() {
    const {count} = await inquirer.prompt({
        type: 'number',
        name: 'count',
        message: 'How many materials do you want to create?'
    });
    const promises = [];
    for (let i = 0; i < count; i++) {
        promises.push(app.service('materials').create({
            name: faker.string.alpha({ length: {min: 10, max: 254} }),
            notes: faker.lorem.paragraph(3)
        }));
    }
    await Promise.all(promises);
}

async function createMaterialcategories() {
    const {count} = await inquirer.prompt({
        type: 'number',
        name: 'count',
        message: 'How many materialcategories do you want to create?'
    });
    const promises = [];
    for (let i = 0; i < count; i++) {
        promises.push(app.service('material-categories').create({
            name: faker.string.alpha({ length: {min: 10, max: 254} })
        }));
    }
    await Promise.all(promises);
}


async function main() {
    logger.info('Initializing... Please wait');
    await new Promise(resolve => setTimeout(resolve, 500));
    await createTechnologies();
    await createDetails();
    await createPlans();
    await createOrders();
    await createSupplies();
    await createAssortments();
    await createCustomers();
    await createCategories();
    await createProcesses();
    await createStaff();
    await createActions();
    await createTools();
    await createOpex();
    await createExpenses();
    await createAccounts();
    await createMachinery();
    await createSubdivisions();
    await createSectors();
    await createRoles();
    await createPermissions();
    await createMaterials();
    await createMaterialcategories();
}

main().then(() => {
    logger.info('Successfully populated database');
    process.exit(0);
}).catch((err) => {
    logger.error(err);
    process.exit(1);
});
