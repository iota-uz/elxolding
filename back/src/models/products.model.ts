// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import {DataTypes, Model, Sequelize} from 'sequelize';
import {HookReturn} from 'sequelize/types/hooks';

import {Application} from '../declarations';

export default function (app: Application): typeof Model {
    const sequelizeClient: Sequelize = app.get('sequelizeClient');
    const products = sequelizeClient.define('products', {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        barcode: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        status: {
            type: DataTypes.ENUM('in stock', 'in development', 'approved'),
            allowNull: false,
        },
        RFID: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        hooks: {
            beforeCount(options: any): HookReturn {
                options.raw = true;
            }
        }
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (products as any).associate = function (models: any): void {
        // Define associations here
        // See https://sequelize.org/master/manual/assocs.html
    };

    return products;
}
