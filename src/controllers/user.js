const User = require('../models/user');
const Task = require('../models/task');
const asyncWrapper = require('../middlewares/asyncWrapper');
const bcrypt = require('bcryptjs');

const UserController = {
  // Login
  loginUser: asyncWrapper(async (req, res) => {
    const { email, password } = req.body;

    function unableToLogin() {
      if(user.status === false) {
        return res.status(400).send({ message: 'User may not have access.', success: false })
      }
      return res.status(400).json({ message: 'Email or password incorrect.', success: false });
    }

    const user = await User.findOne({ email: req.body.email });
    const token = await user.generateAuthToken()

    if(!user || !user.status) {
      return unableToLogin()
    }
  
    const isMatch = await bcrypt.compare(password, user.password);
  
    if(!isMatch) {
      return unableToLogin()
    }

    return res.status(200).json({ user: user.getPublicProfile(), token, success: true });
  }),

  // Logout user
  logoutUser: asyncWrapper(async (req, res) => {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token
    })

    await req.user.save();

    const hasOtherSessionsOpen = req.user.tokens.length > 0;

    res.status(200).send({ message: 'User logged out', success: true, hasOtherSessionsOpen })
  }),

  // Logout every user session
  LogoutAllSessions: asyncWrapper(async (req, res) => {
    req.user.tokens = [];

    await req.user.save();

    const hasOtherSessionsOpen = req.user.tokens.length > 0;

    res.status(200).json({ message: 'User is done with all sessions', success: true, hasOtherSessionsOpen })
  }),

  getAll: asyncWrapper(async (req, res) => {
    const users = await User.find({})
    
    let publicProfiles = []
    users.map(user => publicProfiles.push(user.getPublicProfile()))

    res.status(200).json({ publicProfiles })
  }),

  getUser: asyncWrapper(async (req, res) => {
    const user_tasks = await Task.find({ owner: req.user._id });

    res.status(200).json({ user: req.user.getPublicProfile(), tasks: user_tasks })
  }),

  createUser: asyncWrapper(async (req, res) => {    
    const user = await User.create(req.body);
    const token = await user.generateAuthToken();
    res.status(201).json({ user, token })
  }),

  updateUser: asyncWrapper(async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age', 'status']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if(!isValidOperation) {
      return res.status(400).json({ message: 'Invalid update!' })
    }

    const user = req.user;

    updates.map(update => user[update] = req.body[update])

    await user.save();

    if(!user.status) {
      user.tokens = [];
      await user.save();
      await Task.updateMany({ owner: user._id }, { status: false });
      return res.status(200).json({ message: 'User is no longer active. All Sessions are logged out.', success: true })
    }


    /*const updatedUser = await User.findOneAndUpdate({ _id: userId }, req.body, {
      new: true,
      runValidators: true
    });*/

    res.status(200).json({ user: user.getPublicProfile() });
  })
}

module.exports = UserController;