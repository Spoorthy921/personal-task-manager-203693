const { validationResult } = require('express-validator');

// PUBLIC_INTERFACE
function validateRequest(req, res, next) {
  /**
   * Express middleware that returns 400 with validation errors if any.
   */
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }
  return next();
}

module.exports = {
  validateRequest,
};

