import {Server} from 'http';

import app from '../src/app';

async function sync() {
    const sequelizeClient = app.get('sequelizeClient');
    await sequelizeClient.sync({force: true});
}

async function drop() {
    const sequelizeClient = app.get('sequelizeClient');
    await sequelizeClient.drop({force: true});
}

let server: Server;
module.exports.mochaHooks = {
    async beforeEach() {
        this.timeout(10000);
        await drop();
        await sync();
    },

    beforeAll(done: () => void) {
        server = app.listen(app.get('port'));
        server.once('listening', () => done());
    },

    afterEach() {
        this.timeout(10000);
    },

    afterAll(done: () => void) {
        server.close(done);
    }
};
