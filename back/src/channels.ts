import '@feathersjs/transport-commons';

import {HookContext} from '@feathersjs/feathers';

import {Application} from './declarations';

export default function (app: Application): void {
    if (typeof app.channel !== 'function') {
        // If no real-time functionality has been configured just return
        return;
    }

    app.on('connection', (connection: any): void => {
        // On a new real-time connection, add it to the anonymous channel
        app.channel('anonymous').join(connection);
    });

    app.on('login', (authResult: any, {connection}: any): void => {
        // connection can be undefined if there is no
        // real-time connection, e.g. when logging in via REST
        if (connection) {
            app.channel('anonymous').leave(connection);
            app.channel('authenticated').join(connection);
            app.channel(`userId/${authResult.user.id}`).join(connection);
        }
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    app.publish((data: any, hook: HookContext) => {
        // Here you can add event publishers to channels set up in `channels.ts`
        // To publish only for a specific event use `app.publish(eventname, () => {})`
        // e.g. to publish all service events to all authenticated users use
        if (!hook.params.user) {
            return app.channel('authenticated');
        }
        return app.channel(`userId/${hook.params.user.id}`);
    });

    // Here you can also add service specific event publishers
    // e.g. the publish the `users` service `created` event to the `admins` channel
    // app.service('users').publish('created', () => app.channel('admins'));

    // With the userid and email organization from above you can easily select involved users
    // app.service('messages').publish(() => {
    //   return [
    //     app.channel(`userIds/${data.createdBy}`),
    //     app.channel(`emails/${data.recipientEmail}`)
    //   ];
    // });
}
