import {DataTypes, Model, Sequelize} from 'sequelize';
import {HookReturn} from 'sequelize/types/hooks';

import {Application} from '../declarations';

export default function (app: Application): typeof Model {
    const sequelizeClient: Sequelize = app.get('sequelizeClient');
    const users = sequelizeClient.define('users', {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        middleName: {
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
        lastAction: {
            type: DataTypes.DATE,
            allowNull: true
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
    (users as any).associate = function (models: any): void {
    };
    return users;
}

