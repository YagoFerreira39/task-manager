const Task = require('../models/task');
const mongoose = require('mongoose');

const TaskController = {
  getAll: async (req, res) => {
    const tasks = await Task.find({})

    res.status(200).json({ tasks })
  },

  createTask: async (req, res) => {
    try {
      const owner = req.body.owner_id;

      const task = await Task.create({ ...req.body, owner: owner });;
      res.status(201).json({ task })
    } catch (error) {
      res.status(500).json({ error })
    }
  }
}

module.exports = TaskController;