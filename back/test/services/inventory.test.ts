import assert from 'assert';
import app from '../../src/app';

describe('\'inventory\' service', () => {
  it('registered the service', () => {
    const service = app.service('inventory');

    assert.ok(service, 'Registered the service');
  });
});
