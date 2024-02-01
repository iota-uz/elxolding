import {HookContext} from '@feathersjs/feathers';
import {omit} from 'lodash';
import {DateTime} from 'luxon';

import logger from '../logger';


export function logRequests() {
    return async (context: HookContext) => {
        const {params, service, id, method} = context;
        if (context.error && !context.result && process.env.NODE_ENV !== 'test') {
            logger.error(`Service: ${context.path}\n` + context.error.stack);
        }
        if (params.provider && context.type === 'before') {
            logger.info(`${DateTime.local().toFormat('yyyy/mm/dd HH:MM:ss')} ${context.method}:${context.path} | Provider: ${context.params.provider}`);
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

export function logRequestsDb() {
    return async (context: HookContext) => {
        const {path, method, params, app, data, result} = context;
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
        }, omit(params, 'provider', 'sequelize'));
    };
}
