import {HooksObject} from '@feathersjs/feathers';

import {logRequests, logRequestsDb} from './hooks/logging';



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
        all: [logRequestsDb()],
        find: [
            // printHello()
        ],
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
