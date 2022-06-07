const Task = require('../models/task');
const User = require('../models/user');

const mongoose = require('mongoose');

const TaskController = {
  getAll: async (req, res) => {
    const tasks = await Task.find({})

    res.status(200).json({ tasks })
  },

  createTask: async (req, res) => {
    try {
      const owner = req.user._id;

      const task = await Task.create({ ...req.body, owner: owner });

      const user_tasks = req.user.tasks;
      user_tasks.push(task)
      const user = await User.findByIdAndUpdate({_id: req.user._id }, { tasks: user_tasks })

      res.status(201).json({ task })
    } catch (error) {
      res.status(500).json({ error })
    }
  }
}

module.exports = TaskController;