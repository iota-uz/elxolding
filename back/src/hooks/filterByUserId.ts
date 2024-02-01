import {HookContext} from '@feathersjs/feathers';

export default function filterByUserId(field: string) {
    return (context: HookContext) => {
        const {params} = context;

        if (!params.user || !params.provider)
            return;

        params.query = context.params.query || {};
        params.query[field] = params.user.id;
    };
}
