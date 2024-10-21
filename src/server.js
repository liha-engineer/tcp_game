import net from 'net';
import initServer from './init/index.js';
import { config } from './config/config.js';
import { onConnection } from './evnets/onConnection.js';

const server = net.createServer(onConnection);

initServer()
  .then(() => {
    server.listen(config.server.port, config.server.host, () => {
      console.log(`Server listening on port ${config.server.port}:${config.server.host}`);
      console.log(server.address());
    });
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
