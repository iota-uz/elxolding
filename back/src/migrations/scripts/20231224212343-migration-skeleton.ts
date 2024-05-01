import {DataTypes, QueryInterface, Sequelize} from 'sequelize';

module.exports = {
    async up(queryInterface: QueryInterface) {
        await queryInterface.createTable('users', {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            first_name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            last_name: {
                type: DataTypes.STRING,
                allowNull: true
            },
            middle_name: {
                type: DataTypes.STRING,
                allowNull: true
            },
            role: {
                type: DataTypes.ENUM('superuser', 'user', 'polygraphy', 'tci', 'warehouse_manager'),
                allowNull: false
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            last_action: {
                type: DataTypes.DATE,
                allowNull: true
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('now')
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('now')
            }
        });
        await queryInterface.createTable('uploads', {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            filename: {
                type: DataTypes.STRING,
                allowNull: false
            },
            size: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            mimetype: {
                type: DataTypes.STRING,
                allowNull: false
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('now')
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('now')
            }
        });
        await queryInterface.createTable('orders', {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            type: {
                type: DataTypes.ENUM('in', 'out'),
                allowNull: false
            },
            status: {
                type: DataTypes.ENUM('pending', 'completed'),
                allowNull: false
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('now')
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('now')
            },
        });
        await queryInterface.createTable('positions', {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false
            },
            barcode: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            unit: {
                type: DataTypes.ENUM('cm', 'dm', 'l', 'm3'),
                allowNull: false
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('now')
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('now')
            }
        });
        await queryInterface.createTable('products', {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            position_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'positions',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            status: {
                type: DataTypes.ENUM('in_stock', 'in_development', 'approved'),
                allowNull: false,
            },
            rfid: {
                type: DataTypes.STRING,
                allowNull: false
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('now')
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('now')
            }
        });
        await queryInterface.createTable('order_products', {
            order_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                references: {
                    model: 'orders',
                    key: 'id'
                }
            },
            product_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                references: {
                    model: 'products',
                    key: 'id'
                }
            }
        });
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
            created_at: {
                allowNull: false,
                type: DataTypes.DATE
            },
            updated_at: {
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
            position_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'positions',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            inventory_id: {
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
            created_at: {
                allowNull: false,
                type: DataTypes.DATE
            },
            updated_at: {
                allowNull: false,
                type: DataTypes.DATE
            }
        });

        await queryInterface.addIndex('products', ['rfid'], {
            unique: true
        });
        await queryInterface.addIndex('products', ['status']);
        await queryInterface.addIndex('products', ['position_id']);
        await queryInterface.addIndex('order_products', ['order_id']);
        await queryInterface.addIndex('order_products', ['product_id']);
        await queryInterface.addIndex('inventory_results', ['position_id']);
        await queryInterface.addIndex('inventory_results', ['inventory_id']);
    },
    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable('inventory_results');
        await queryInterface.dropTable('inventory');
        await queryInterface.dropTable('order_products');
        await queryInterface.dropTable('products');
        await queryInterface.dropTable('positions');
        await queryInterface.dropTable('orders');
        await queryInterface.dropTable('uploads');
        await queryInterface.dropTable('users');

    }
};
