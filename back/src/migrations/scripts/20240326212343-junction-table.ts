import {DataTypes, QueryInterface} from 'sequelize';

module.exports = {
    async up(queryInterface: QueryInterface) {
        await queryInterface.createTable('request_products', {
            request_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                references: {
                    model: 'requests',
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
    },
    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable('request_products');
    }
};
