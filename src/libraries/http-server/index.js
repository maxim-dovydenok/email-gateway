const http = require('http');
const { promisify } = require('util');

const AppError = require('../error/AppError');
const logger = require('../logger');

module.exports = class Server {
  constructor(port, app) {
    this.port = port;
    this.app = app;
  }

  static async stopServers(servers) {
    await Promise.all(servers.map((server) => server.stop()));
  }

  listen() {
    this.stopping = false;

    this.server = http.createServer(this.app);
    this.server.close = promisify(this.server.close).bind(this.server);

    this.server.on('error', this.onError.bind(this));
    this.server.on('listening', this.onListening.bind(this));

    this.server.listen(this.port);
  }

  async stop() {
    if (this.stopping) {
      logger.error('Force stopping...');

      process.exit(1);
    }

    logger.warn('Stopping');
    this.stopping = true;

    if (this.server) {
      await this.server.close();
    }
  }

  onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    switch (error.code) {
      case 'EACCES':
        logger.error(`Port ${this.port} requires elevated privileges`);

        throw new AppError('server_not_started', 'Port requires privileges');
      case 'EADDRINUSE':
        logger.error(`Port ${this.port} already in use`);

        throw new AppError('server_not_started', 'Port is used');
      default:
        throw error;
    }
  }

  onListening() {
    logger.info(`HTTP Server is listening on ${this.port}`);
  }
}


