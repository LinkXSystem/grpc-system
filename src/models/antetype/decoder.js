class Decoder {
  constructor(offset = 0) {
    this.offset = offset;
  }

  setOffset(offset) {
    this.offset = offset;
    return this;
  }

  decode(buffer) {
    const offset = this;

    let payload = null;

    try {
      const length = buffer.readInt32BE(offset);
      payload = JSON.parse(buffer.slice(offset, offset + length));
    } catch (error) {
      payload = error;
    }

    return payload;
  }
}

module.exports = Decoder;
