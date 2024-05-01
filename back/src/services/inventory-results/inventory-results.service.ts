// Initializes the `inventory` service on path `/inventory`
import {ServiceAddons} from '@feathersjs/feathers';

import {Application} from '../../declarations';
import createModel from '../../models/inventory-results.model';
import {Inventory} from './inventory-results.class';
import hooks from './inventory-results.hooks';

// Add this service to the service type index
declare module '../../declarations' {
    interface ServiceTypes {
        'inventory-results': Inventory & ServiceAddons<any>;
    }
}

export default function (app: Application): void {
    const options = {
        Model: createModel(app),
        paginate: app.get('paginate')
    };

    // Initialize our service with any options it requires
    app.use('/inventory-results', new Inventory(options, app));

    // Get our initialized service so that we can register hooks
    const service = app.service('inventory-results');

    service.hooks(hooks);
}
