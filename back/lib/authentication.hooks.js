"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAccess = void 0;
const errors_1 = require("@feathersjs/errors");
function fetchUser() {
    return async (context) => {
        const { data, app } = context;
        if (data.strategy !== 'local') {
            return;
        }
        data.user = await app.service('users').find({
            query: { email: data.email },
            paginate: false
        }).then((data) => data[0]);
    };
}
function adminAccess() {
    return (context) => {
        const { data } = context;
        if (data.strategy !== 'local') {
            return;
        }
        if (!data.user || !data.admin)
            return;
        if (!['admin'].includes(data.user.role))
            throw new errors_1.Forbidden('Access denied');
    };
}
exports.adminAccess = adminAccess;
exports.default = {
    before: {
        all: [],
        get: [],
        find: [],
        create: [
            fetchUser(),
            adminAccess(),
        ],
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
