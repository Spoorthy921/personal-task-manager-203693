const express = require('express');
const { body, param } = require('express-validator');
const tasksController = require('../controllers/tasks');
const { requireAuth } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validators');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Tasks
 *     description: Task CRUD for the authenticated user
 */

/**
 * @swagger
 * /tasks:
 *   get:
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     summary: List tasks for the current user
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Unauthorized
 */
router.get('/', requireAuth, tasksController.list.bind(tasksController));

/**
 * @swagger
 * /tasks:
 *   post:
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     summary: Create a task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Buy groceries
 *               description:
 *                 type: string
 *                 example: Milk, eggs, bread
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Created
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/',
  requireAuth,
  [body('title').isString().trim().notEmpty().withMessage('title is required'), validateRequest],
  tasksController.create.bind(tasksController)
);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     summary: Update a task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               completed: { type: boolean }
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 */
router.put(
  '/:id',
  requireAuth,
  [param('id').isString().notEmpty().withMessage('id is required'), validateRequest],
  tasksController.update.bind(tasksController)
);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 */
router.delete(
  '/:id',
  requireAuth,
  [param('id').isString().notEmpty().withMessage('id is required'), validateRequest],
  tasksController.remove.bind(tasksController)
);

/**
 * @swagger
 * /tasks/{id}/toggle:
 *   patch:
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     summary: Toggle a task's completion status
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 */
router.patch(
  '/:id/toggle',
  requireAuth,
  [param('id').isString().notEmpty().withMessage('id is required'), validateRequest],
  tasksController.toggleComplete.bind(tasksController)
);

module.exports = router;

