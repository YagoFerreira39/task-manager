const asyncWrapper = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next)
    } catch (error) {      
      res.status(500).json({ error, msg: "Something went wrong, huh?!" });
    }
  }
}

module.exports = asyncWrapper;