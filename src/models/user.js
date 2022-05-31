const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const Schema = mongoose.Schema;

const User = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if(!validator.isEmail(value)) {
          throw new Error('Email is invalid')
        }
      }
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      validate(value) {
        if(value.toLowerCase().includes('password')) {
          throw new Error('Password cannot contain "password"')
        }
      }
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if(value < 0) {
          throw new Error('Age must be a positive number')
        }
      }
    },  
    tasks: [{    
      type: Schema.Types.ObjectId,
      ref: 'Task',
      default: []
    }]
  }, 
  { timestamps: true }
);

// Before User is created/updated
User.pre('save', async function(next) {
  const user = this;

  // Hash password
  if(user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

module.exports = mongoose.model('User', User);