// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { DataTypes, Model,Sequelize } from 'sequelize';
import { HookReturn } from 'sequelize/types/hooks';

import { Application } from '../declarations';

export default function (app: Application): typeof Model {
    const sequelizeClient: Sequelize = app.get('sequelizeClient');
    const requestProducts = sequelizeClient.define('request_products', {
        requestId: {
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
    (requestProducts as any).associate = function (models: any): void {
        requestProducts.belongsTo(models.requests);
    };

    return requestProducts;
}
