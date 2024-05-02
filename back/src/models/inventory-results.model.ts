// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import {DataTypes, Model, Sequelize} from 'sequelize';
import {HookReturn} from 'sequelize/types/hooks';

import {Application} from '../declarations';

export default function (app: Application): typeof Model {
    const sequelizeClient: Sequelize = app.get('sequelizeClient');
    const inventory_results = sequelizeClient.define('inventory_results', {
        inventoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        positionId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        found: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        expected: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        difference: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    }, {
        timestamps: true,
        hooks: {
            beforeCount(options: any): HookReturn {
                options.raw = true;
            }
        }
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (inventory_results as any).associate = function (models: any): void {
        inventory_results.belongsTo(models.inventory, {as: 'inventory'});
        inventory_results.belongsTo(models.positions, {as: 'position'});
        // Define associations here
        // See https://sequelize.org/master/manual/assocs.html
    };

    return inventory_results;
}
