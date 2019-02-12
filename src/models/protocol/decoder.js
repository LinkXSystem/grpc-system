const { Readable } = require('stream');

class Decoder extends Readable {
  constructor(props) {
    super(props);
  }

  _read() {}
}

module.exports = Decoder;
