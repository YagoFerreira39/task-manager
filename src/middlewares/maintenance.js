const maintenanceMode = (req, res, next) => {
  res.status(503).json({ message: 'Server is currently down. Try again later.' })
}

module.exports = maintenanceMode