const { verifyAccessToken } = require('../utils/jwt');

// PUBLIC_INTERFACE
function requireAuth(req, res, next) {
  /**
   * Express middleware that requires a valid Bearer token.
   * Adds req.user = { id }.
   */
  try {
    const header = req.get('Authorization') || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({
        status: 'error',
        message: 'Missing or invalid Authorization header (expected: Bearer <token>)',
      });
    }

    const decoded = verifyAccessToken(token);
    if (!decoded || !decoded.sub) {
      return res.status(401).json({ status: 'error', message: 'Invalid token' });
    }

    req.user = { id: decoded.sub };
    return next();
  } catch (err) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }
}

module.exports = {
  requireAuth,
};

