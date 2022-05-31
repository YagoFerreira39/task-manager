const User = require('../models/user');
const Task = require('../models/task');
const asyncWrapper = require('../middlewares/asyncWrapper');
const bcrypt = require('bcryptjs');

const UserController = {
  // Login
  loginUser: asyncWrapper(async (req, res) => {
    const { email, password } = req.body;

    function unableToLogin() {
      return res.status(400).json({ message: 'Email or password incorrect.', success: false });
    }

    const user = await User.findOne({ email: req.body.email });
    const token = await user.generateAuthToken()

    if(!user) {
      return unableToLogin()
    }
  
    const isMatch = await bcrypt.compare(password, user.password);
  
    if(!isMatch) {  
      return unableToLogin()
    }

    return res.status(200).json({ user, token, success: true });
  }),

  getAll: asyncWrapper(async (req, res) => {
    const users = await User.find({})

    res.status(200).json({ users })
  }),

  getUser: asyncWrapper(async (req, res) => {
    const user = await User.findOne({ _id: req.params.id});
    const user_tasks = await Task.find({ owner: user._id });

    if(user_tasks.length > 0) {
      user.tasks = user_tasks;
    }

    res.status(200).json({ user })
  }),

  createUser: asyncWrapper(async (req, res) => {    
    const user = await User.create(req.body);
    res.status(201).json({ user })
  }),

  updateUser: asyncWrapper(async (req, res) => {
    const { id: userId } = req.params
    const updates = Object.keys(req.body)

    const user = await User.findById(userId)

    updates.map(update => user[update] = req.body[update])

    await user.save();


    /*const updatedUser = await User.findOneAndUpdate({ _id: userId }, req.body, {
      new: true,
      runValidators: true
    });*/

    if(!user) {
      return res.status(500).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  })
}

module.exports = UserController;