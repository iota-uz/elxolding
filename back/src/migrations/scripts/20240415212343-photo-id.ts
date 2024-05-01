import {DataTypes, QueryInterface} from 'sequelize';

module.exports = {
    async up(queryInterface: QueryInterface) {
        await queryInterface.addColumn('positions', 'photo_id', {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'uploads',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        });
    },
    async down(queryInterface: QueryInterface) {
        await queryInterface.removeColumn('positions', 'photo_id');
    }
};
