"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuthentication = void 0;
const errors_1 = require("@feathersjs/errors");
function requireAuthentication(target, propertyKey, descriptor) {
    target[propertyKey] = async function (data, params) {
        if (!(params === null || params === void 0 ? void 0 : params.authenticated)) {
            throw new errors_1.NotAuthenticated('Not authenticated');
        }
        return descriptor.value.call(target, data, params);
    };
}
exports.requireAuthentication = requireAuthentication;
