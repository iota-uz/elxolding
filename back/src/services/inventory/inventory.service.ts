// Initializes the `inventory` service on path `/inventory`
import { ServiceAddons } from '@feathersjs/feathers';

import { Application } from '../../declarations';
import createModel from '../../models/inventory.model';
import { Inventory } from './inventory.class';
import hooks from './inventory.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'inventory': Inventory & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
    const options = {
        Model: createModel(app),
        paginate: app.get('paginate')
    };

    // Initialize our service with any options it requires
    app.use('/inventory', new Inventory(options, app));

    // Get our initialized service so that we can register hooks
    const service = app.service('inventory');

    service.hooks(hooks);
}
