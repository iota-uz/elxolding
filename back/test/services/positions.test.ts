import assert from 'assert';
import app from '../../src/app';

describe('\'positions\' service', () => {
  it('registered the service', () => {
    const service = app.service('positions');

    assert.ok(service, 'Registered the service');
  });
});
