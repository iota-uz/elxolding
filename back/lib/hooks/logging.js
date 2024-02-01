"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logRequestsDb = exports.logRequests = void 0;
const lodash_1 = require("lodash");
const luxon_1 = require("luxon");
const logger_1 = __importDefault(require("../logger"));
function logRequests() {
    return async (context) => {
        const { params, service, id, method } = context;
        if (context.error && !context.result && process.env.NODE_ENV !== 'test') {
            logger_1.default.error(`Service: ${context.path}\n` + context.error.stack);
        }
        if (params.provider && context.type === 'before') {
            logger_1.default.info(`${luxon_1.DateTime.local().toFormat('yyyy/mm/dd HH:MM:ss')} ${context.method}:${context.path} | Provider: ${context.params.provider}`);
        }
        if (context.error) {
            return;
        }
        if (['create', 'find', 'get', 'remove'].includes(method)) {
            return;
        }
        if (!id || !params.provider) {
            return;
        }
        params.before = await service.get(id, params);
    };
}
exports.logRequests = logRequests;
function logRequestsDb() {
    return async (context) => {
        const { path, method, params, app, data, result } = context;
        if (!params.provider)
            return;
        if (!path || ['requests', 'authentication'].includes(path))
            return;
        await app.service('requests').create({
            path,
            method,
            ip: params.ip,
            userAgent: params.userAgent,
            userId: params.user ? params.user.id : undefined,
            before: context.params.before || data,
            after: ['create', 'patch', 'update', 'remove'].includes(method) ? result : null
        }, (0, lodash_1.omit)(params, 'provider', 'sequelize'));
    };
}
exports.logRequestsDb = logRequestsDb;
