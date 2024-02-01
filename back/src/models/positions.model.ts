// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import {DataTypes, Model,Sequelize} from 'sequelize';
import {HookReturn} from 'sequelize/types/hooks';

import {Application} from '../declarations';

export default function (app: Application): typeof Model {
    const sequelizeClient: Sequelize = app.get('sequelizeClient');
    const positions = sequelizeClient.define('positions', {
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
    }, {
        hooks: {
            beforeCount(options: any): HookReturn {
                options.raw = true;
            }
        }
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (positions as any).associate = function (models: any): void {
        // Define associations here
        // See https://sequelize.org/master/manual/assocs.html
    };

    return positions;
}
