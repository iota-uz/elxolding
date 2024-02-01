"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("pgvector/sequelize"));
const sequelize_2 = require("sequelize");
sequelize_1.default.registerType(sequelize_2.Sequelize);
function default_1(app) {
    const connectionString = app.get('postgres');
    const sequelize = new sequelize_2.Sequelize(connectionString, {
        dialect: 'postgres',
        logging: false,
        define: {
            underscored: true,
            freezeTableName: true
        }
    });
    const oldSetup = app.setup;
    app.set('sequelizeClient', sequelize);
    app.setup = function (...args) {
        const result = oldSetup.apply(this, args);
        // Set up data relationships
        const models = sequelize.models;
        Object.keys(models).forEach(name => {
            if ('associate' in models[name]) {
                models[name].associate(models);
            }
        });
        // Sync to the database
        // app.set('sequelizeSync', sequelize.sync());
        return result;
    };
}
exports.default = default_1;
