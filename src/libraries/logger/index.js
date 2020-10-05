module.exports = {
  info: (message, extra) => extra ? console.log(message, extra) : console.log(message),
  warn: (message, extra) => extra ? console.warn(message, extra) : console.warn(message),
  error: (message, extra) => extra ? console.error(message, extra) : console.error(message),
}
