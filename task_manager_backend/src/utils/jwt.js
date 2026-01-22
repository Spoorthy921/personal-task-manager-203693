const jwt = require('jsonwebtoken');

// PUBLIC_INTERFACE
function signAccessToken(payload, options = {}) {
  /**
   * Signs a JWT access token.
   *
   * Required env vars:
   * - JWT_SECRET: secret for signing/verifying JWT
   * Optional env vars:
   * - JWT_EXPIRES_IN: e.g. "7d"
   */
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('Missing required environment variable: JWT_SECRET');
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(payload, secret, { expiresIn, ...options });
}

// PUBLIC_INTERFACE
function verifyAccessToken(token) {
  /** Verifies and decodes a JWT access token. */
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('Missing required environment variable: JWT_SECRET');
  }
  return jwt.verify(token, secret);
}

module.exports = {
  signAccessToken,
  verifyAccessToken,
};

