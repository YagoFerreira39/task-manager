const express = require('express')
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware')

const Task = require('../controllers/task');

router.route('/').get(Task.getAll).post(authMiddleware, Task.createTask);

module.exports = router;