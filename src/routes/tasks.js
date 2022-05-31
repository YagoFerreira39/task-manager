const express = require('express')
const router = express.Router();

const Task = require('../controllers/task');

router.route('/').get(Task.getAll).post(Task.createTask);

module.exports = router;