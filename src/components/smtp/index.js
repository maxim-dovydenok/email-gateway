const { simpleParser } = require('mailparser');

const mailer = require('../../libraries/mailer');

module.exports = async (stream, session, callback) => {
  const parsed = await simpleParser(stream);

  const message = {
    from: parsed.from.value,
    to: parsed.to.value,
    subject: parsed.subject,
    headers: parsed.headers,
  };

  if (parsed.html) {
    message.html = parsed.html;
  } else {
    message.text = parsed.text;
  }

  await mailer.sendEmail(message);

  callback();
};
