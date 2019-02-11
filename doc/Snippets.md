> 编码/解码的参考片段

- 原始版本

```js
/**
 * @author zhi
 */

// 编码
const payload = {
  service: 'com.link.TestService',
  methodName: 'test',
  args: ['Hello, Link'],
};

const body = Buffer.from(JSON.stringify(payload));

const header = Buffer.alloc(10);
header[0] = 0;
header.writeInt32BE(1000, 1);
// 写入序列化方式，1 代表的是 JSON 序列化
header[5] = 1;
header.writeInt32BE(body.length, 6);

const packet = Buffer.concat([header, body], 10 + body.length);

console.log('===========================');
console.log(packet);
console.log('===========================');

// 解码
const type = packet[0];
const id = packet.readInt32BE(1);
const codec = packet[5];

const bodyLength = packet.readInt32BE(6);

console.log('===========================');
console.log(JSON.parse(packet.slice(10, 10 + bodyLength)));
console.log('===========================');
```

- 优化版本

```js
/**
 * @author zhi
 */

// 编码
const payload = {
  service: 'com.link.TestService',
  methodName: 'test',
  args: ['Hello, Link'],
};

const buffer = Buffer.alloc(1024 * 1024);

let offset = 0;

buffer[0] = 0;
buffer.writeInt32BE(1000, offset + 1);

// 写入序列化方式，1 代表的是 JSON 序列化
buffer[5] = 1;

offset = 10;

const length = buffer.write(JSON.stringify(payload), offset);
buffer.writeInt32BE(length, 6);

const packet = buffer;

console.log('===========================');
console.log(packet);
console.log('===========================');

// 解码
const type = packet[0];
const id = packet.readInt32BE(1);
const codec = packet[5];

const bodyLength = packet.readInt32BE(6);

console.log('===========================');
console.log(JSON.parse(packet.slice(10, 10 + bodyLength)));
console.log('===========================');
```
