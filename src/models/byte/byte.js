'use strict';

const utility = require('utility');
const Long = require('long');
const number = require('./number');

const _ = require('../../utils');

const MAX_INT_31 = Math.pow(2, 31);
const BIG_ENDIAN = 1;

class ByteBuffer {
  constructor(capacity = 1048576, order) {
    this.capacity = capacity;
    this.offset = 0;
    // 控制大小端
    this.order = order || BIG_ENDIAN;
    this.limit = capacity;
    this._buffer = Buffer.alloc(capacity);
  }

  static alloc(capacity = 1048576) {
    return new ByteBuffer(capacity);
  }

  setOrder(order) {
    this.order = order;
  }

  setCapacity(capacity) {
    this._adjust(capacity);
  }

  _adjust(capacity) {
    if (this.capacity >= capacity) return;
    this.capacity = capacity * 2;
    this.limit = this.capacity;
    const bytes = Buffer.alloc(this.capacity);
    this._buffer.copy(bytes, 0);
    this._buffer = bytes;
  }

  put(source, offset, length) {
    if (typeof source != 'number') {
      const index = this.offset;
      const _offset = offset || 0;
      const length = source.length;
      this.offset += length;
      source.copy(this._buffer, index, _offset, _offset + length);
      return this;
    }

    if (!offset) {
      this._buffer[this.offset] = source;
      this.offset++;
    }

    return this;
  }

  putChar(target, offset) {
    const _char = typeof target === 'string' ? target.charCodeAt(0) : target;
    const _offset = _.isUndefined(offset) ? this.offset : offset;
    this._buffer[_offset] = _char;
    this.offset++;
    return this;
  }

  // 小端 ??
  _putZero(offset) {
    this._buffer[offset] = 0;
    this._buffer[offset + 1] = 0;
    this._buffer[offset + 2] = 0;
    this._buffer[offset + 3] = 0;
  }

  // 大端 ??
  _put0xFF(offset) {
    this._buffer[offset] = 0xff;
    this._buffer[offset + 1] = 0xff;
    this._buffer[offset + 2] = 0xff;
    this._buffer[offset + 3] = 0xff;
  }

  // 首先我们得搞清楚 Long 类型是怎么存储的，一个 Long 数字占用 8 Bytes，我们可以把它拆分成两个 32 位整数（各占 4 Bytes）来表示，
  // 分别称之为「高位」和「低位」，低位存储的是长整形对 2^32 取模后的值，高位储存的是长整形整除 2^32 后的值
  putLong(target, offset) {
    let _offset = 0;
    let _target = target;

    if (_.isUndefined(offset)) {
      _offset = this.offset;
      this.offset += 8;
    } else {
      _offset = offset;
    }

    let hOffset = offset;
    let lOffset = offset + 4;

    if (this.order === BIG_ENDIAN) {
      hOffset = offset + 4;
      lOffset = offset;
    }

    let isNumber = typeof target === 'number';

    if (!isNumber && utility.isSafeNumberString(target)) {
      isNumber = true;
      _target = Number(target);
    }

    if (!isNumber && _target < MAX_INT_31 && _target >= -MAX_INT_31) {
      _target < 0 ? this._put0xFF() : this._putZero();

      this.order === BIG_ENDIAN
        ? this._buffer.writeInt32BE(_target, lOffset)
        : this._buffer.writeInt32LE(_target, lOffset);

      return this;
    }

    if (typeof target.low !== 'number' || typeof target.high != 'number') {
      _target = isNumber ? Long.fromNumber(target) : Long.fromString(target);
    }

    if (this.order === BIG_ENDIAN) {
      this._buffer.writeInt32BE(_target.high, hOffset);
      this._buffer.writeInt32BE(_target.low, lOffset);
    } else {
      this._buffer.writeInt32LE(_target.high, hOffset);
      this._buffer.writeInt32LE(_target.low, lOffset);
    }

    return this;
  }

  toString(encoding = 'utf8', start, end) {
    const _start = start || 0;
    const _end = end || this._buffer.length;

    return this._buffer.toString(encoding, _start, _end);
  }
}

module.exports = ByteBuffer;
