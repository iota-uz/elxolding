import {HookContext} from '@feathersjs/feathers';

export function selectToQuery() {
    return (context: HookContext) => {
        if (!context.params.query) {
            return;
        }
        if (!context.params.query.$select) {
            return;
        }
        const select = context.params.query.$select;
        if (!select.length) {
            return;
        }
        context.params.fastJoinQuery = {};
        for (const key of select) {
            context.params.fastJoinQuery[key] = true;
        }
    };
}
