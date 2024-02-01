import * as authentication from '@feathersjs/authentication';
import {HookContext, HooksObject} from '@feathersjs/feathers';
import {disallow, fastJoin, ResolverMap} from 'feathers-hooks-common';
// Don't remove this comment. It's needed to format import lines nicely.

const {authenticate} = authentication.hooks;

function populateUrl() {
    const postResolvers: ResolverMap<any> = {
        joins: {
            url: () => async (item: any, context: HookContext) => {
                item.url = context.app.get('images_url') + `${item.filename}`;
            }
        }
    };
    return fastJoin(postResolvers);
}

export default <HooksObject>{
    before: {
        all: [authenticate('jwt')],
        find: [],
        get: [],
        create: [],
        update: [disallow('external')],
        patch: [disallow('external')],
        remove: []
    },

    after: {
        all: [populateUrl()],
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
