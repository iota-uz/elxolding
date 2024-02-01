"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configuration_1 = __importDefault(require("@feathersjs/configuration"));
const express_1 = __importDefault(require("@feathersjs/express"));
const feathers_1 = __importDefault(require("@feathersjs/feathers"));
const socketio_1 = __importDefault(require("@feathersjs/socketio"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const feathers_swagger_1 = __importDefault(require("feathers-swagger"));
const helmet_1 = __importDefault(require("helmet"));
const path_1 = __importDefault(require("path"));
const serve_favicon_1 = __importDefault(require("serve-favicon"));
const app_hooks_1 = __importDefault(require("./app.hooks"));
const authentication_1 = __importDefault(require("./authentication"));
const channels_1 = __importDefault(require("./channels"));
const logger_1 = __importDefault(require("./logger"));
const middleware_1 = __importDefault(require("./middleware"));
const tasksPlugin_1 = __importDefault(require("./plugins/tasksPlugin"));
const sequelize_1 = __importDefault(require("./sequelize"));
const services_1 = __importDefault(require("./services"));
const app = (0, express_1.default)((0, feathers_1.default)());
// Load app configuration
app.configure((0, configuration_1.default)());
// Enable security, CORS, compression, favicon and body parsing
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false
}));
app.use((0, cors_1.default)());
app.use((0, compression_1.default)());
app.use(express_1.default.json({ limit: '5mb' }));
app.use(express_1.default.urlencoded({ limit: '5mb', extended: true }));
app.use((0, serve_favicon_1.default)(path_1.default.join(app.get('public'), 'favicon.ico')));
app.use('/', express_1.default.static(app.get('public')));
app.use('/uploads', express_1.default.static(app.get('uploads')));
// Set up Plugins and providers
app.configure(express_1.default.rest());
app.use(function (req, res, next) {
    if (req.feathers) {
        req.feathers.ip = req.headers['x-real-ip'] || req.ip;
        req.feathers.userAgent = req.headers['user-agent'];
    }
    next();
});
app.configure((0, socketio_1.default)(function (io) {
    io.sockets.setMaxListeners(555);
    io.use(function (socket, next) {
        socket.feathers.headers = socket.request.headers;
        socket.feathers.ip = socket.request.headers['x-real-ip'] || socket.request.socket.remoteAddress || null;
        socket.feathers.userAgent = socket.request.headers['user-agent'];
        next();
    });
}));
app.configure(sequelize_1.default);
app.configure(middleware_1.default);
app.configure(authentication_1.default);
app.configure((0, feathers_swagger_1.default)({
    ui: feathers_swagger_1.default.swaggerUI({ docsPath: '/docs' }),
    openApiVersion: 3,
    specs: {
        info: {
            title: 'helios API docs',
            description: 'helios API docs',
            version: '1.0.0',
        },
        schemes: ['http', 'https'],
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
app.configure(services_1.default);
app.configure(channels_1.default);
app.configure((0, tasksPlugin_1.default)('tasks'));
app.use(express_1.default.notFound());
app.use(express_1.default.errorHandler({ logger: logger_1.default }));
app.hooks(app_hooks_1.default);
exports.default = app;
