import {Application as ExpressFeathers} from '@feathersjs/express';
import {ServiceSwaggerOptions} from 'feathers-swagger';


declare module 'feathers-sequelize' {
    interface Service {
        docs: ServiceSwaggerOptions;
    }
}


// A mapping of service names to types. Will be extended in service files.
export interface ServiceTypes {
}

// The application instance type that will be used everywhere else
export type Application = ExpressFeathers<ServiceTypes>;
