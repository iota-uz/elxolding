// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { DataTypes, Model,Sequelize } from 'sequelize';
import { HookReturn } from 'sequelize/types/hooks';

import { Application } from '../declarations';

export default function (app: Application): typeof Model {
    const sequelizeClient: Sequelize = app.get('sequelizeClient');
    const orders = sequelizeClient.define('orders', {
        type: {
            type: DataTypes.ENUM('in', 'out'),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('pending', 'completed'),
            defaultValue: 'pending',
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
    (orders as any).associate = function (models: any): void {
        orders.belongsToMany(models.products, {through: 'order_products'});
    };

    return orders;
}
