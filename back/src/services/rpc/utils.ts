import {NotAuthenticated} from '@feathersjs/errors';
import {Params} from '@feathersjs/feathers';

export interface OkResponse {
    result: Record<string, any>;
}

export interface ErrorResponse {
    error: {
        message: string
        stacktrace?: string
        code?: number
    };
}

export type RPCResponse = OkResponse | ErrorResponse;

export interface RPC {
    method: string;
    params: Record<string, any>;
}

export type RPCFunction = (data: RPC['params'], params?: Params) => Record<string, any>;

export function requireAuthentication(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    target[propertyKey] = async function (data: RPC['params'], params?: Params) {
        if (!params?.authenticated) {
            throw new NotAuthenticated('Not authenticated');
        }
        return descriptor.value.call(target, data, params);
    };
}
