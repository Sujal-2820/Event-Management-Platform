//models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ['Organizer', 'Attendee'],
    required: true,
  },
  registeredEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'userdatas' }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
