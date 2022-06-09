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
  })
}

module.exports = TaskController;