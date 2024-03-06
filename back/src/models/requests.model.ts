// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { DataTypes, Model,Sequelize } from 'sequelize';
import { HookReturn } from 'sequelize/types/hooks';

import { Application } from '../declarations';

export default function (app: Application): typeof Model {
    const sequelizeClient: Sequelize = app.get('sequelizeClient');
    const requests = sequelizeClient.define('requests', {
        type: {
            type: DataTypes.ENUM('in', 'out'),
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
    (requests as any).associate = function (models: any): void {
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
    };

    return requests;
}
