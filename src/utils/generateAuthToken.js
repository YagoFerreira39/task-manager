const jwt = require('jsonwebtoken')

async function generateAuthToken() {
  const token = jwt.sign({ _id: user._id.toString() }, process.env.AUTH_TOKEN_SECRET);
  return token;
}

module.exports = generateAuthToken;