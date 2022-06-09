const express = require('express')
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware')

const User = require('../controllers/user');

router.route('/').get(User.getAll).post(User.createUser);
router.route('/profile').get(authMiddleware, User.getUser)
router.route('/:id').patch(User.updateUser);
router.route('/login').post(User.loginUser);
router.route('/logout').post(authMiddleware, User.logoutUser);
router.route('/logout-sessions').post(authMiddleware, User.LogoutAllSessions);

module.exports = router;