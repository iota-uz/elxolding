import * as authentication from '@feathersjs/authentication';
import {HookContext} from '@feathersjs/feathers';
// Don't remove this comment. It's needed to format import lines nicely.

const {authenticate} = authentication.hooks;

function populates() {
    return (context: HookContext) => {
        context.params.sequelize = {
            include: [
                {
                    model: context.app.get('sequelizeClient').models.positions,
                    as: 'position'
                }
            ],
            raw: false
        };
    };
}

export default {
    before: {
        all: [authenticate('jwt')],
        find: [populates()],
        get: [populates()],
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
