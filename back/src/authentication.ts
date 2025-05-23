import {AuthenticationService, JWTStrategy} from '@feathersjs/authentication';
import {LocalStrategy} from '@feathersjs/authentication-local';
import {expressOauth} from '@feathersjs/authentication-oauth';
import {ServiceAddons} from '@feathersjs/feathers';

import hooks from './authentication.hooks';
import {Application} from './declarations';

declare module './declarations' {
    interface ServiceTypes {
        'authentication': AuthenticationService & ServiceAddons<any>;
    }
}

export default function (app: Application): void {
    const authentication = new AuthenticationService(app);

    authentication.register('jwt', new JWTStrategy());
    authentication.register('local', new LocalStrategy());

    app.use('/authentication', authentication);
    app.service('authentication').hooks(hooks);
    app.configure(expressOauth());
}
