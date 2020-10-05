const url = require('url');
const { promisify } = require('util');

const nodemailer = require('nodemailer');

const options = require('../options');
const logger = require('../logger');
const AppError = require('../error/AppError');

const MAILER_TRANSPORT_OPTION = 'MAILER_TRANSPORT';
const OPTIONS = {
  [MAILER_TRANSPORT_OPTION]: MAILER_TRANSPORT_OPTION,
};

const TEST_TRANSPORT = 'test:';
const SMTP_TRANSPORT = 'smtp:';

let transport;

module.exports = {
  initialize: async () => {
    const transportDsn = options.get(MAILER_TRANSPORT_OPTION);

    const urlParts = url.parse(transportDsn);

    if (urlParts.protocol === TEST_TRANSPORT) {
      const testAccount = await nodemailer.createTestAccount();

      transport = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      transport.test = true;
    }

    if (urlParts.protocol === SMTP_TRANSPORT) {
      transport = nodemailer.createTransport(transportDsn);
    }

    if (!transport) {
      throw new AppError('Mailer initialization failed: type not found');
    }

    transport.sendMail = promisify(transport.sendMail).bind(transport);
  },
  sendEmail: async (message) => {
    if (!transport) {
      throw new AppError('Mailer must be initialized before sending an email');
    }

    const info = await transport.sendMail(message);

    if (transport.test) {
      logger.info(`Message sent. Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    } else {
      logger.info(`Message sent. Subject: ${message.subject}`);
    }
  },
  options: OPTIONS,
};
