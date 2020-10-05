const mailer = require('../../../libraries/mailer');

module.exports = async (req, res) => {
  const { body } = req;

  await mailer.sendEmail({
    from: body.from,
    to: body.to,
    subject: body.subject,
    text: body.text,
    html: body.html,
    headers: body.headers,
  });

  res.end();
};
