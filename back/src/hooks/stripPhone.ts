import {HookContext} from '@feathersjs/feathers';

import {stripNonNumeric} from '../utils';

export default function stripPhone() {
    return (context: HookContext) => {
        if (context.data.phone) {
            context.data.phone = stripNonNumeric(context.data.phone);
        }
    };
}
