import {HookContext} from '@feathersjs/feathers';
import {fastJoin} from 'feathers-hooks-common';

export function populateUser(field = 'userId') {
    return (context: HookContext) => {
        const postResolvers = {
            joins: {
                user: () => async (item: any, context: HookContext) => {
                    if (!item[field]) {
                        return;
                    }
                    item.user = await context.app.service('users').get(item[field]);
                }
            }
        };
        return fastJoin(postResolvers, context.params.fastJoinQuery)(context);
    };
}

export function setUserId(field: string = 'userId') {
    return (context: HookContext) => {
        if (!context.params.provider || !context.params.user) {
            return;
        }
        const user = context.params.user;
        context.data[field] = user.id;
    };
}
