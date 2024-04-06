import {DataTypes, QueryInterface} from 'sequelize';

module.exports = {
    async up(queryInterface: QueryInterface) {
        await queryInterface.dropTable('inventory');
        await queryInterface.createTable('inventory', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            status: {
                type: DataTypes.ENUM('successful', 'incomplete', 'failed'),
                allowNull: false
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE
            }
        });
        await queryInterface.createTable('inventory_results', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            positionId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'positions',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            inventoryId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'inventory',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            found: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            expected: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            difference: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE
            }
        });
    },
    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable('inventory_results');
        await queryInterface.dropTable('inventory');
    }
};
