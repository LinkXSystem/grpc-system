class Encoder {
  constructor(capacity = 1048576, offset = 10, position = 6) {
    this.capacity = capacity;
    this.offset = offset;
    this.position = position;
  }

  setPosition(position) {
    this.position = position;
    return this;
  }

  setOffset(offset) {
    this.offset = offset;
    return this;
  }

  setCapacity(capacity) {
    this.capacity = capacity;
    return this;
  }

  encode(payload) {
    const { capacity, offset, position } = this;

    const buffer = Buffer.alloc(capacity);

    const length = buffer.write(JSON.stringify(payload), offset);
    buffer.writeInt32BE(length, position);

    return buffer;
  }
}

module.exports = Decoder;
