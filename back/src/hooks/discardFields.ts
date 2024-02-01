import {HookContext} from '@feathersjs/feathers';
import {discard, every, iff, isNot, isProvider} from 'feathers-hooks-common';

import {isAdmin} from './isAdmin';

export function discardFields(...fields: string[]) {
    return (context: HookContext) => {
        return iff(every(isProvider('external'), isNot(isAdmin())), discard(...fields))(context);
    };
}
