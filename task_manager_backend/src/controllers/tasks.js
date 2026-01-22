const Task = require('../models/Task');

class TasksController {
  async list(req, res) {
    const userId = req.user.id;
    const tasks = await Task.find({ userId }).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ status: 'ok', tasks });
  }

  async create(req, res) {
    const userId = req.user.id;
    const { title, description = '', dueDate = null } = req.body;

    const task = await Task.create({
      userId,
      title,
      description,
      dueDate,
      completed: false,
    });

    return res.status(201).json({ status: 'ok', task });
  }

  async update(req, res) {
    const userId = req.user.id;
    const { id } = req.params;
    const { title, description, dueDate, completed } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: id, userId },
      {
        ...(title !== undefined ? { title } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(dueDate !== undefined ? { dueDate } : {}),
        ...(completed !== undefined ? { completed } : {}),
      },
      { new: true }
    ).lean();

    if (!task) {
      return res.status(404).json({ status: 'error', message: 'Task not found' });
    }

    return res.status(200).json({ status: 'ok', task });
  }

  async remove(req, res) {
    const userId = req.user.id;
    const { id } = req.params;

    const deleted = await Task.findOneAndDelete({ _id: id, userId }).lean();
    if (!deleted) {
      return res.status(404).json({ status: 'error', message: 'Task not found' });
    }

    return res.status(200).json({ status: 'ok' });
  }

  async toggleComplete(req, res) {
    const userId = req.user.id;
    const { id } = req.params;

    const task = await Task.findOne({ _id: id, userId });
    if (!task) {
      return res.status(404).json({ status: 'error', message: 'Task not found' });
    }

    task.completed = !task.completed;
    await task.save();

    return res.status(200).json({ status: 'ok', task: task.toObject() });
  }
}

module.exports = new TasksController();

