import {authenticate} from '@feathersjs/authentication';
import * as local from '@feathersjs/authentication-local';
import {HooksObject} from '@feathersjs/feathers';
import {disallow} from 'feathers-hooks-common';

import {selectToQuery} from '../../hooks/selectToQuery';

const {hashPassword, protect} = local.hooks;

export default <HooksObject>{
    before: {
        all: [],
        find: [selectToQuery()],
        get: [selectToQuery()],
        create: [authenticate('jwt'), hashPassword('password')],
        update: [disallow('external')],
        patch: [authenticate('jwt'), hashPassword('password')],
        remove: [authenticate('jwt')]
    },
    after: {
        all: [protect('password')],
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
