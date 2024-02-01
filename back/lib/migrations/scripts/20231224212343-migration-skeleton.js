"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    async up(queryInterface) {
        await queryInterface.createTable('users', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
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
            last_action: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true
            },
            created_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.Sequelize.fn('now')
            },
            updated_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.Sequelize.fn('now')
            }
        });
        await queryInterface.createTable('uploads', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
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
            },
            created_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.Sequelize.fn('now')
            },
            updated_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.Sequelize.fn('now')
            }
        });
    },
    async down(queryInterface) {
        await queryInterface.dropTable('users');
        await queryInterface.dropTable('uploads');
    }
};
