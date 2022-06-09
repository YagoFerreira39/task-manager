const Task = require('../models/task');
const User = require('../models/user');
const asyncWrapper = require('../middlewares/asyncWrapper');

const mongoose = require('mongoose');

const TaskController = {
  getAll: asyncWrapper(async (req, res) => {
    const tasks = await Task.find({ owner: req.user._id })

    res.status(200).json({ tasks })
  }),

  createTask: async (req, res) => {
    try {
      const owner = req.user._id;

      const task = await Task.create({ ...req.body, owner: owner });

      res.status(201).json({ task })
    } catch (error) {
      res.status(500).json({ error })
    }
  }
}

module.exports = TaskController;