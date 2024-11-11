// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import {DataTypes, Model, Sequelize} from 'sequelize';
import {HookReturn} from 'sequelize/types/hooks';

import {Application} from '../declarations';

export default function (app: Application): typeof Model {
    const sequelizeClient: Sequelize = app.get('sequelizeClient');
    const positions = sequelizeClient.define('positions', {
        photoId: {
            type: DataTypes.INTEGER,
            allowNull: true
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
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
        hooks: {
            beforeCount(options: any): HookReturn {
                options.raw = true;
            }
        }
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (positions as any).associate = function (models: any): void {
        positions.hasMany(models.products, {as: 'products', foreignKey: 'positionId'});
        positions.belongsTo(models.uploads, {as: 'photo', foreignKey: 'photoId'});
    };

    return positions;
}
