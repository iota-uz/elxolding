import {Forbidden} from '@feathersjs/errors';
import {HookContext, HooksObject} from '@feathersjs/feathers';

function fetchUser() {
    return async (context: HookContext) => {
        const {data, app} = context;
        if (data.strategy !== 'local') {
            return;
        }
        data.user = await app.service('users').find({
            query: {email: data.email},
            paginate: false
        }).then((data: any) => data[0]);
    };
}

export function adminAccess() {
    return (context: HookContext) => {
        const {data} = context;
        if (data.strategy !== 'local') {
            return;
        }
        if (!data.user || !data.admin)
            return;

        if (!['admin'].includes(data.user.role))
            throw new Forbidden('Access denied');
    };
}

export default <HooksObject>{
    before: {
        all: [],
        get: [],
        find: [],
        create: [
            fetchUser(),
            adminAccess(),
        ],
        patch: [],
        update: [],
        remove: []
    },
    after: {
        all: [],
        get: [],
        find: [],
        create: [],
        patch: [],
        update: [],
        remove: []
    },
    error: {
        all: [],
        get: [],
        find: [],
        create: [],
        patch: [],
        update: [],
        remove: []
    }
};
