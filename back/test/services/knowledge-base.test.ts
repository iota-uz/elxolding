import * as assert from 'assert';
import app from '../../src/app';

describe('\'knowledge-base\' service', () => {
    it('registered the service', () => {
        const service = app.service('knowledge-base');

        assert.ok(service, 'Registered the service');
    });
});
