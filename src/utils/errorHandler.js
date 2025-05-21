/**
 * Throw this anywhere in controllers or services:
 *   throw new CustomError('Invalid credentials', 401);
 */
class CustomError extends Error {
  /**
   * @param {string}  message     – Human readable error
   * @param {number=} statusCode  – HTTP status (defaults to 400)
   * @param {object=} details     – Any extra info you want to expose
   */
  constructor(message, statusCode = 400, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = 'CustomError';
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = CustomError;
