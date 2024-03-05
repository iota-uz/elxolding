import {HookContext} from '@feathersjs/feathers';
import {DateTime} from 'luxon';

import logger from '../logger';


export function logRequests() {
    return async (context: HookContext) => {
        const {params} = context;
        if (context.error && !context.result && process.env.NODE_ENV !== 'test') {
            logger.error(`Service: ${context.path}\n` + context.error.stack);
        }
        if (params.provider && context.type === 'before') {
            logger.info(`${DateTime.local().toFormat('yyyy/mm/dd HH:MM:ss')} ${context.method}:${context.path} | Provider: ${context.params.provider}`);
        }
    };
}
