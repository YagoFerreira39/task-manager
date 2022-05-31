const express = require('express')
const router = express.Router();

const User = require('../controllers/user');

router.route('/').get(User.getAll).post(User.createUser);
router.route('/:id').get(User.getUser).patch(User.updateUser);
router.route('/login').post(User.loginUser);

module.exports = router;