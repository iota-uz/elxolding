"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_model_1 = __importDefault(require("../../models/users.model"));
const users_class_1 = require("./users.class");
const users_hooks_1 = __importDefault(require("./users.hooks"));
function default_1(app) {
    const options = {
        Model: (0, users_model_1.default)(app),
        paginate: app.get('paginate'),
        whitelist: ['$options', '$regex', '$exists']
    };
    const users = new users_class_1.Users(options, app);
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
    service.hooks(users_hooks_1.default);
}
exports.default = default_1;
