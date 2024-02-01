import {HookContext} from '@feathersjs/feathers';

export function softDelete(field: string = 'deleted', metaData: Record<string, any> = {}) {
    return async (context: HookContext) => {
        const {service, id, method} = context;
        if (!context.params.provider) {
            return;
        }

        if (method === 'find' || method === 'get') {
            context.params.query = {...context.params.query, [field]: false};
        }

        if (method === 'remove' && id !== undefined) {
            context.result = await service.patch(id, {[field]: true, ...metaData});
        }
    };
}
