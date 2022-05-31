const express = require('express');
const connectDB = require('./mongodb/connect')
const users = require('./routes/users')
const tasks = require('./routes/tasks')
const notFound = require('./middlewares/not-found')
require('dotenv').config()

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

/** Routes */
app.use('/api/v1/users', users)
app.use('/api/v1/tasks', tasks)


app.use(notFound)

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(PORT, console.log(`Server is listening on PORT ${PORT}`))
  } catch (error) {

    console.log(error)
  }
}

start();