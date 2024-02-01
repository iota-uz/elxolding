import * as assert from 'assert';

import app from '../../src/app';

describe('\'dialogues\' service', () => {
    it('registered the service', () => {
        const service = app.service('dialogues');

        assert.ok(service, 'Registered the service');
    });
});
