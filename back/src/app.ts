import configuration from '@feathersjs/configuration';
import express from '@feathersjs/express';
import feathers, {HookContext as FeathersHookContext} from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio';
import compress from 'compression';
import cors from 'cors';
import swagger from 'feathers-swagger';
import helmet from 'helmet';
import path from 'path';
import favicon from 'serve-favicon';

import appHooks from './app.hooks';
import authentication from './authentication';
import channels from './channels';
import {Application} from './declarations';
import logger from './logger';
import middleware from './middleware';
import tasksPlugin from './plugins/tasksPlugin';
import sequelize from './sequelize';
import services from './services';

const app: Application = express(feathers());
export type HookContext<T = any> = { app: Application } & FeathersHookContext<T>;

// Load app configuration
app.configure(configuration());
// Enable security, CORS, compression, favicon and body parsing
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false
}));
app.use(cors());
app.use(compress());
app.use(express.json({limit: '5mb'}));
app.use(express.urlencoded({limit: '5mb', extended: true}));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));

app.use('/', express.static(app.get('public')));
app.use('/uploads', express.static(app.get('uploads')));

// Set up Plugins and providers
app.configure(express.rest());
app.use(function (req, res, next) {
    if (req.feathers) {
        req.feathers.ip = req.headers['x-real-ip'] || req.ip;
        req.feathers.userAgent = req.headers['user-agent'];
    }
    next();
});

app.configure(socketio(function (io) {
    io.sockets.setMaxListeners(555);
    io.use(function (socket, next) {
        (socket as any).feathers.headers = socket.request.headers;
        (socket as any).feathers.ip = socket.request.headers['x-real-ip'] || socket.request.socket.remoteAddress || null;
        (socket as any).feathers.userAgent = socket.request.headers['user-agent'];
        next();
    });
}));

app.configure(sequelize);
app.configure(middleware);
app.configure(authentication);
app.configure(swagger({
    ui: swagger.swaggerUI({docsPath: '/docs'}),
    openApiVersion: 3,
    specs: {
        info: {
            title: 'helios API docs',
            description: 'helios API docs',
            version: '1.0.0',
        },
        schemes: ['http', 'https'], // Optionally set the protocol schema used (sometimes required when host on https)
        securityDefinitions: {
            bearer: {
                type: 'apiKey',
                name: 'authorization',
                in: 'header'
            }
        },
        security: [
            {
                bearer: []
            }
        ]
    },
    ignore: {
        paths: ['sms', 'bot']
    }
}));

app.configure(services);
app.configure(channels);
app.configure(tasksPlugin('tasks'));

app.use(express.notFound());
app.use(express.errorHandler({logger} as any));

app.hooks(appHooks);

export default app;
