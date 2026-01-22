const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { signAccessToken } = require('../utils/jwt');

class AuthController {
  async register(req, res) {
    const { email, password } = req.body;

    const existing = await User.findOne({ email }).lean();
    if (existing) {
      return res.status(409).json({ status: 'error', message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash });

    const token = signAccessToken({ sub: user._id.toString() });
    return res.status(201).json({
      status: 'ok',
      user: { id: user._id.toString(), email: user.email },
      token,
    });
  }

  async login(req, res) {
    const { email, password } = req.body;

    // passwordHash is select:false, so we must explicitly include it
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Invalid email or password' });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ status: 'error', message: 'Invalid email or password' });
    }

    const token = signAccessToken({ sub: user._id.toString() });
    return res.status(200).json({
      status: 'ok',
      user: { id: user._id.toString(), email: user.email },
      token,
    });
  }
}

module.exports = new AuthController();

