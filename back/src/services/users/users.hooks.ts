// import * as feathersAuthentication from '@feathersjs/authentication';
import * as local from '@feathersjs/authentication-local';
import {HooksObject} from '@feathersjs/feathers';
import {disallow} from 'feathers-hooks-common';

import {selectToQuery} from '../../hooks/selectToQuery';


// const {authenticate} = feathersAuthentication.hooks;
const {hashPassword, protect} = local.hooks;

export default <HooksObject>{
    before: {
        all: [
            // authenticate('jwt')
        ],
        find: [selectToQuery()],
        get: [selectToQuery()],
        create: [hashPassword('password')],
        update: [disallow('external')],
        patch: [hashPassword('password')],
        remove: []
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
