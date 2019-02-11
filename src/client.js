const net = require('net');

const port = 2019;
const host = 'localhost';

const encoding = payload => {
  const buffer = Buffer.alloc(1024);

  let offset = 0;
  buffer[0] = 1;
  offset = 10;

  const length = buffer.write(JSON.stringify(payload), offset);
  buffer.writeInt32BE(length, 6);

  return buffer;
};

const client = new net.Socket();

client.connect(port, host, () => {
  const payload = {
    service: 'com.link.TestService',
    methodName: 'test',
    args: ['Hello, Link'],
  };

  const buffer = encoding(payload);

  client.write(buffer);
});

client.on('data', data => {
  console.log(data);
  client.destroy();
});

client.on('error', error => {
  console.log('=================================================');
  console.log(error);
  console.log('=================================================');
});

client.on('close', () => {
  console.log('Connection is Closing .......');
});
