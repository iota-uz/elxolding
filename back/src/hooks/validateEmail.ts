import {BadRequest} from '@feathersjs/errors';
import {HookContext} from '@feathersjs/feathers';

export default function validateEmail() {
    return (context: HookContext) => {
        const {data} = context;
        const emailPattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (data.email && !emailPattern.test(data.email)) {
            throw new BadRequest('Invalid email address format');
        }
    };
}
