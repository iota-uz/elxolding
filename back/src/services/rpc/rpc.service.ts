import {ServiceAddons} from '@feathersjs/feathers';

import {Application} from '../../declarations';
import {RpcService} from './rpc.class';
import hooks from './rpc.hooks';

// Add this service to the service type index
declare module '../../declarations' {
    interface ServiceTypes {
        'rpc': RpcService & ServiceAddons<any>;
    }
}

export default function (app: Application): void {
    const rpc = new RpcService(app);
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
    service.hooks(hooks);
}
