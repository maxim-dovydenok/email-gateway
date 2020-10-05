module.exports = class AppError extends Error {
  constructor(name, code, message, isPossible) {
    super(message)

    Error.captureStackTrace(this);

    this.name = name
    this.message = message
    this.isPossible = isPossible
  }
}
