const bcrypt = require('bcryptjs')

const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hashPassword(password)

  return hashedPassword
}

module.exports = hashPassword