import app from '../app';

const env = process.env.NODE_ENV || 'development';
const dialect = 'postgres'; // Or your dialect name


export default  {
    [env]: {
        dialect,
        url: app.get(dialect),
        migrationStorageTableName: '_migrations'
    }
};
