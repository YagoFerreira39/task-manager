const jwt = require("jsonwebtoken")
const User = require("../models/user")

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.AUTH_TOKEN_SECRET);
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

    if(!user) {
      throw new Error()
    }

    if(user.status === false) {
      return res.status(400).send({ message: 'User may not have access.' })
    }

    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' })
  }
}

module.exports = authMiddleware