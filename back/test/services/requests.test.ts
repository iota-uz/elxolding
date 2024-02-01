import assert from 'assert';
import app from '../../src/app';

describe('\'requests\' service', () => {
  it('registered the service', () => {
    const service = app.service('requests');

    assert.ok(service, 'Registered the service');
  });
});
