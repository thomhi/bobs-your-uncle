const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      min: 2
    },
    password: {
      type: String,
      required: true,
      min: 8
    }
});

module.exports = mongoose.model('User', userSchema, 'users');