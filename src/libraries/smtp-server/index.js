const { promisify } = require('util');

const { SMTPServer } = require('smtp-server');

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

    this.server = new SMTPServer({
      onData: this.app,
      authOptional: true,
    });
    this.server.close = promisify(this.server.close).bind(this.server);

    this.server.listen(this.port);
    this.onListening();
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

  onListening() {
    logger.info(`SMTP Server is listening on ${this.port}`);
  }
}


