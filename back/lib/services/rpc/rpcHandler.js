"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RpcHandler = void 0;
class RpcHandler {
    constructor(app) {
        this.app = app;
    }
    getRPCMethods() {
        const properties = Object.getOwnPropertyNames(RpcHandler.prototype);
        const methodNames = properties.filter(el => {
            return el[0] == el[0].toUpperCase() && typeof this[el] === 'function';
        });
        return methodNames.reduce((result, key) => {
            return { ...result, [key]: this[key] };
        }, {});
    }
}
exports.RpcHandler = RpcHandler;
