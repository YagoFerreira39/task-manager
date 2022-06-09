const Task = require('../models/task');
const User = require('../models/user');
const asyncWrapper = require('../middlewares/asyncWrapper');

const mongoose = require('mongoose');

const TaskController = {
  getAll: asyncWrapper(async (req, res) => {
    const tasks = await Task.find({ owner: req.user._id })

    res.status(200).json({ tasks })
  }),

  getTask: asyncWrapper(async (req, res) => {
    const _id = req.params.id
    const task = await Task.findOne({ _id, owner: req.user._id })

    return res.status(200).json({ task, success: true })
  }),

  createTask: asyncWrapper(async (req, res) => {
      const owner = req.user._id;

      const task = await Task.create({ ...req.body, owner: owner });

      res.status(201).json({ task })
  }),

  updateTask: asyncWrapper(async (req, res) => {    
    const _id = req.params.id
    const task = await Task.findOne({ _id, owner: req.user._id })

    // Check fields to update
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'description', 'completed']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if(!isValidOperation) {
      return res.status(400).json({ message: 'Invalid update!' })
    }

    // Update task
    updates.map(update => task[update] = req.body[update])

    await task.save();

    return res.status(200).json({ task, success: true })
  }),

  // Remove task
  removeTask: asyncWrapper(async (req, res) => {
    const _id = req.params.id
    const task = await Task.deleteOne({ _id, owner: req.user._id })
    
    return res.status(200).json({ success: true, task })
  })
}

module.exports = TaskController;