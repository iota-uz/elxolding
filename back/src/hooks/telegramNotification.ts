import {HookContext} from '@feathersjs/feathers';

import {replacePattern} from '../utils';

export default function tgNotification(chatId: string, body: string) {
    return async (context: HookContext) => {
        // if (!context.params.provider) { // don't send notification for internal requests
        //     return;
        // }
        let parsedBody = replacePattern(body, /\$result\.[\w.]+/g, context.result);
        parsedBody = replacePattern(parsedBody, /\$params\.[\w.]+/g, context.params);

        if (!['production', 'test'].includes(process.env.NODE_ENV as string)) { // if running in staging or dev environment don't send notification
            return;
        }

        await context.app.service('scheduler').create({
            receiver: chatId,
            transport: 'bot',
            kwargs: parsedBody
        });
    };
}
