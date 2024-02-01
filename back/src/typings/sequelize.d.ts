import {DataTypes as SequelizeDataTypes} from 'sequelize';

declare module 'sequelize/types/data-types' {
    export function VECTOR(length: number): SequelizeDataTypes.DataTypeAbstract;
}
