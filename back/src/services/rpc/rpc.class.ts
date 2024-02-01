import {GeneralError} from '@feathersjs/errors';
import {Params} from '@feathersjs/feathers';
import {ServiceSwaggerOptions} from 'feathers-swagger';

import {Application} from '../../declarations';
import {RpcHandler} from './rpcHandler';
import {RPC, RPCFunction, RPCResponse} from './utils';

export class RpcService {
    app: Application;
    handler: RpcHandler;
    methodsMap: Record<string, RPCFunction>;
    docs?: ServiceSwaggerOptions;

    constructor(app: Application) {
        this.app = app;
        this.handler = new RpcHandler(app);
        this.methodsMap = this.handler.getRPCMethods();
    }

    create(data: RPC, params?: Params): Promise<RPCResponse>;
    create(data: RPC[], params?: Params): Promise<RPCResponse[]>;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async create(data: RPC | RPC[], params?: Params): Promise<RPCResponse | RPCResponse[]> {
        if (Array.isArray(data)) {
            return Promise.all(data.map(current => this.create(current, params)));
        }
        const func = this.methodsMap[data.method];
        if (!func)
            throw new GeneralError(`No method "${data.method}" found`);
        return {result: await func.call(this.handler, data.params, params)};
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
