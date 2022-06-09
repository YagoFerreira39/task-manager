const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const validator = require('validator')

const Task = new Schema(
  {
    title: {
      type: String,
      required: [true, 'All tasks must have a title'],
      trim: true
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'All tasks must have a description'],
    },
    completed: {
      type: Boolean,
      default: false
    },
    status: {
      type: Boolean,
      default: true
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      trim: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', Task);