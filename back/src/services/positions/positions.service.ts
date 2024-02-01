// Initializes the `positions` service on path `/positions`
import { ServiceAddons } from '@feathersjs/feathers';

import { Application } from '../../declarations';
import createModel from '../../models/positions.model';
import { Positions } from './positions.class';
import hooks from './positions.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'positions': Positions & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
    const options = {
        Model: createModel(app),
        paginate: app.get('paginate')
    };

    // Initialize our service with any options it requires
    app.use('/positions', new Positions(options, app));

    // Get our initialized service so that we can register hooks
    const service = app.service('positions');

    service.hooks(hooks);
}
