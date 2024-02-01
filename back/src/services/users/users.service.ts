import {ServiceAddons} from '@feathersjs/feathers';

import {Application} from '../../declarations';
import createModel from '../../models/users.model';
import {Users} from './users.class';
import hooks from './users.hooks';

// Add this service to the service type index
declare module '../../declarations' {
    interface ServiceTypes {
        'users': Users & ServiceAddons<any>;
    }
}

export default function (app: Application): void {
    const options = {
        Model: createModel(app),
        paginate: app.get('paginate'),
        whitelist: ['$options', '$regex', '$exists']
    };

    const users = new Users(options, app);
    users.docs = {
        description: 'Пользователи. Список пользователей',
        operations: {
            update: false
        },
        securities: [
            'all'
        ],
        definition: {
            type: 'object',
            required: [
                'firstName',
                'email',
                'roleId',
                'password'
            ],
            properties: {
                firstName: {
                    type: 'string'
                },
                lastName: {
                    type: 'string'
                },
                email: {
                    type: 'string'
                },
                roleId: {
                    type: 'number'
                },
                password: {
                    type: 'string'
                },
                lastAction: {
                    type: 'string',
                    format: 'date-time'
                }
            }
        },
        definitions: {
            usersList: {
                type: 'array',
                items: {
                    $ref: '#/components/schemas/usersResponse'
                }
            },
            usersResponse: {
                type: 'object',
                required: [
                    'id',
                    'firstName',
                    'email',
                    'roleId',
                    'password'
                ],
                properties: {
                    id: {
                        type: 'number'
                    },
                    firstName: {
                        type: 'string'
                    },
                    lastName: {
                        type: 'string'
                    },
                    email: {
                        type: 'string'
                    },
                    roleId: {
                        type: 'number'
                    },
                    password: {
                        type: 'string'
                    },
                    lastAction: {
                        type: 'string',
                        format: 'date-time'
                    },
                    createdAt: {
                        type: 'string',
                        format: 'date-time'
                    },
                    updatedAt: {
                        type: 'string',
                        format: 'date-time'
                    }
                }
            }
        },
        refs: {
            createResponse: 'usersResponse',
            getResponse: 'usersResponse',
            patchResponse: 'usersResponse',
            removeResponse: 'usersResponse'
        }
    };
    app.use('/users', users);
    const service = app.service('users');
    service.hooks(hooks);
}
