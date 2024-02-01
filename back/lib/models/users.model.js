"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
function default_1(app) {
    const sequelizeClient = app.get('sequelizeClient');
    const users = sequelizeClient.define('users', {
        firstName: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true
        },
        middleName: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true
        },
        phone: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        role: {
            type: sequelize_1.DataTypes.ENUM('admin', 'user'),
            allowNull: false
        },
        password: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        lastAction: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true
        }
    }, {
        timestamps: true,
        hooks: {
            beforeCount(options) {
                options.raw = true;
            }
        }
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    users.associate = function (models) {
    };
    return users;
}
exports.default = default_1;
