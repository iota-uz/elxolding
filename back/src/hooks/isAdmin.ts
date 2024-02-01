import {HookContext} from '@feathersjs/feathers';

export function isAdmin() {
    return (context: HookContext) => {
        if (!context.params.provider) {
            return true;
        }
        const user = context.params.user;
        if (!user) {
            return false;
        }
        return user.role === 'admin';
    };
}
