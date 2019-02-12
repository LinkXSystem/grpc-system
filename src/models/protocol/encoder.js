const { Writable } = require('stream');

class Encoder extends Writable {
  constructor(options) {
    super(options);
  }

  _write(chunk, encoding, callback) {}
}

module.exports = Encoder;
