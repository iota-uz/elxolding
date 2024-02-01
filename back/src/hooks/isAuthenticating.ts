import {HookContext} from '@feathersjs/feathers';

export function isAuthenticating() {
    return (context: HookContext) => {
        if (!context.params.provider)
            return false;
        if (!context.params.headers)
            return false;

        return !!(context.params.headers.authorization
            && context.params.headers.authorization !== 'null'
            && context.params.headers.authorization !== '');
    };
}
