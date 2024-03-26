// Initializes the `requests` service on path `/requests`
import {ServiceAddons} from '@feathersjs/feathers';

import {Application} from '../../declarations';
import createAuxiliaryModels from '../../models/request_products.model';
import createModel from '../../models/requests.model';
import {Requests} from './requests.class';
import hooks from './requests.hooks';

// Add this service to the service type index
declare module '../../declarations' {
    interface ServiceTypes {
        'requests': Requests & ServiceAddons<any>;
    }
}

export default function (app: Application): void {
    createAuxiliaryModels(app);
    const options = {
        Model: createModel(app),
        paginate: app.get('paginate')
    };

    // Initialize our service with any options it requires
    app.use('/requests', new Requests(options, app));

    // Get our initialized service so that we can register hooks
    const service = app.service('requests');

    service.hooks(hooks);
}
