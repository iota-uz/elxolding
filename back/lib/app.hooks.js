"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logging_1 = require("./hooks/logging");
exports.default = {
    before: {
        all: [(0, logging_1.logRequests)()],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    },
    after: {
        all: [(0, logging_1.logRequestsDb)()],
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
        all: [(0, logging_1.logRequests)()],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    }
};
