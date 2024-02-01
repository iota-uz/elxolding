"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
function default_1(app) {
    const sequelizeClient = app.get('sequelizeClient');
    const uploads = sequelizeClient.define('uploads', {
        filename: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        size: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false
        },
        mimetype: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
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
    uploads.associate = function (models) {
    };
    return uploads;
}
exports.default = default_1;
