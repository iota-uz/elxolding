import {HooksObject} from '@feathersjs/feathers';

import {logRequests} from './hooks/logging';


export default <HooksObject>{
    before: {
        all: [logRequests()],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    },
    after: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    },
    error: {
        all: [logRequests()],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    }
};
