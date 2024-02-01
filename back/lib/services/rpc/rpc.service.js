"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rpc_class_1 = require("./rpc.class");
const rpc_hooks_1 = __importDefault(require("./rpc.hooks"));
function default_1(app) {
    const rpc = new rpc_class_1.RpcService(app);
    rpc.docs = {
        description: 'RPC (Remote Procedure Call) service. You can call any method defined in back/src/services/rpc/rpcHandler.ts',
        definition: {
            type: 'object',
            required: ['method', 'params'],
            properties: {
                method: {
                    type: 'string',
                    description: 'The rpc method',
                },
                params: {
                    type: 'object',
                    description: 'The rpc params',
                },
            },
        },
        definitions: {
            rpcResponse: {
                type: 'object',
                properties: {
                    result: {
                        type: 'object',
                    },
                    error: {
                        type: 'object',
                    },
                },
            },
        },
        refs: {
            createResponse: 'rpcResponse'
        }
    };
    app.use('/rpc', rpc);
    const service = app.service('rpc');
    service.hooks(rpc_hooks_1.default);
}
exports.default = default_1;
