import {HooksObject} from '@feathersjs/feathers';

export default <HooksObject>{
    before: {
        all: [],
        get: [],
        find: [],
        create: [],
        patch: [],
        update: [],
        remove: []
    },
    after: {
        all: [],
        get: [],
        find: [],
        create: [],
        patch: [],
        update: [],
        remove: []
    },
    error: {
        all: [],
        get: [],
        find: [],
        create: [],
        patch: [],
        update: [],
        remove: []
    }
};
