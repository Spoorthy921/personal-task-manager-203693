const express = require('express');
const healthController = require('../controllers/health');

const authRoutes = require('./auth');
const taskRoutes = require('./tasks');

const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health endpoint
 *     responses:
 *       200:
 *         description: Service health check passed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Service is healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: development
 */
router.get('/', healthController.check.bind(healthController));

/**
 * @swagger
 * /healthz:
 *   get:
 *     summary: Liveness probe (health check)
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/healthz', healthController.check.bind(healthController));

router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);

module.exports = router;

