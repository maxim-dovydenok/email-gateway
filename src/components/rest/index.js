const express = require('express');

const sendEmailHandler = require('./handlers/sendEmail');

const router = express.Router();
router.post('/emails', sendEmailHandler);

const app = express();
app.use(express.json({ limit: '10mb' }));

app.use('/', router);

module.exports = app;
