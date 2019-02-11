const net = require('net');

const port = 2019;
const host = 'localhost';

const decode = buffer => {
  let proxy = {};

  try {
    let offset = 10;
    let length = buffer.readInt32BE(6);

    const payload = buffer.slice(offset, offset + length);

    console.warn(payload.toString());

    proxy = JSON.parse(payload);
  } catch (e) {
    console.log('=================================================');
    console.log(e);
    console.log('=================================================');
  }

  return proxy;
};

const server = net.createServer();

server.listen(port, host, () => {
  console.log('=================================================');
  console.log(`The Server is listening in ${port}`);
  console.log('=================================================');
});

server.on('connection', socket => {
  console.log('=================================================');
  console.log('Server is connected ......');
  console.log('=================================================');

  //   let cache = '';

  //   socket.on('data', data => {
  //     cache += data;

  //     console.log('=================================================');
  //     console.log(Date.now(), data, decode(data));
  //     console.log('=================================================');
  //   });

  //   socket.on('end', () => {
  //     console.log('=================================================');
  //     console.log(cache, decode(Buffer.from(cache)));
  //     console.log('=================================================');
  //     socket.write('Receiving ......');
  //   });

  socket.on('readable', () => {
    const header = socket.read();

    if (!header) return;

    console.log(decode(header));
    socket.write(Buffer.from('Send Command: The client must close !'));
  });
});

server.on('close', () => {
  console.log('=================================================');
  console.log('The server is closed !!!');
  console.log('=================================================');
});

server.on('error', error => {
  console.log('=================================================');
  console.log(error);
  console.log('=================================================');
});
