const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth');
const { validateRequest } = require('../middleware/validators');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: User registration and login
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: mypassword
 *     responses:
 *       201:
 *         description: Created
 *       409:
 *         description: Email already registered
 */
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('email must be a valid email'),
    body('password').isString().isLength({ min: 6 }).withMessage('password must be at least 6 characters'),
    validateRequest,
  ],
  authController.register.bind(authController)
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login and receive a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Invalid credentials
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('email must be a valid email'),
    body('password').isString().notEmpty().withMessage('password is required'),
    validateRequest,
  ],
  authController.login.bind(authController)
);

module.exports = router;

