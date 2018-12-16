const utils = require('./utils');

describe('Utils', () => {
  it('should create a timestamp', done => {
    const timestamp = utils.createTimestamp();
    expect(timestamp).toBeInstanceOf(String);
    done();
  });
});
