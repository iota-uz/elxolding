import * as authentication from '@feathersjs/authentication';
import {HookContext} from '@feathersjs/feathers';
// Don't remove this comment. It's needed to format import lines nicely.

const {authenticate} = authentication.hooks;

function populatePosition() {
    return (context: HookContext) => {
        const {app, params} = context;
        const sequelize = app.get('sequelizeClient');
        const {positions} = sequelize.models;
        params.sequelize = {
            raw: false,
            include: [
                {
                    model: positions,
                    as: 'position',
                    attributes: ['id', 'title', 'barcode', 'unit']
                }
            ]
        };
    };
}

export default {
    before: {
        all: [authenticate('jwt')],
        find: [populatePosition()],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    },

    after: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    },

    error: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    }
};
