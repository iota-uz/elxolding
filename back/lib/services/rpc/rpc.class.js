"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RpcService = void 0;
const errors_1 = require("@feathersjs/errors");
const rpcHandler_1 = require("./rpcHandler");
class RpcService {
    constructor(app) {
        this.app = app;
        this.handler = new rpcHandler_1.RpcHandler(app);
        this.methodsMap = this.handler.getRPCMethods();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async create(data, params) {
        if (Array.isArray(data)) {
            return Promise.all(data.map(current => this.create(current, params)));
        }
        const func = this.methodsMap[data.method];
        if (!func)
            throw new errors_1.GeneralError(`No method "${data.method}" found`);
        return { result: await func.call(this.handler, data.params, params) };
        // try {
        //     return {result: await func.call(this.handler, data.params, params)};
        // } catch (e: any) {
        //     if (e.toJSON && typeof e.toJSON === 'function') {
        //         return { error: e.toJSON() };
        //     }
        //     if (e instanceof Error) {
        //         return {error: {message: e.message, stacktrace: e.stack}};
        //     }
        //     return {error: {message: e.toString()}};
        // }
    }
}
exports.RpcService = RpcService;
