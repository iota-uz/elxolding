// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import {DataTypes, Model, Sequelize} from 'sequelize';
import {HookReturn} from 'sequelize/types/hooks';

import {Application} from '../declarations';

export default function (app: Application): typeof Model {
    const sequelizeClient: Sequelize = app.get('sequelizeClient');
    const products = sequelizeClient.define('products', {
        positionId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('in_stock', 'in_development', 'approved'),
            allowNull: false,
        },
        rfid: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: true,
        hooks: {
            beforeCount(options: any): HookReturn {
                options.raw = true;
            }
        }
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (products as any).associate = function (models: any): void {
        products.belongsToMany(models.requests, {through: 'request_products'});
        products.belongsTo(models.positions, {as: 'position'});
    };

    return products;
}
