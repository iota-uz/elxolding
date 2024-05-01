// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import {DataTypes, Model, Sequelize} from 'sequelize';
import {HookReturn} from 'sequelize/types/hooks';

import {Application} from '../declarations';

export default function (app: Application): typeof Model {
    const sequelizeClient: Sequelize = app.get('sequelizeClient');
    const orderProducts = sequelizeClient.define('order_products', {
        orderId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false,
        hooks: {
            beforeCount(options: any): HookReturn {
                options.raw = true;
            }
        }
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (orderProducts as any).associate = function (models: any): void {
        orderProducts.belongsTo(models.orders);
    };

    return orderProducts;
}
