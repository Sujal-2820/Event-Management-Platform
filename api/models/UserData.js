// models/UserData.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  questionText: { type: String },
  options: [
    { text: { type: String } },
    { text: { type: String } },
    { text: { type: String } },
    { text: { type: String } },
  ],
  correctOption: { type: String },
});



const userDataSchema = new Schema({
  title: {
    type: String,
    required: true,
  }, 
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: [String],
  },
  eventDomain: {
    type: [String],
  },
  
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },

  quizQuestions: [questionSchema],

  timePerQuestion:{
    type: Number,
  },

  minimumScore:{
    type: Number,
  },

  registeredUsers:[{ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    details: {
      fullName: { type: String },
      workEmail: { type: String },
      githubURL: { type: String },
      linkedinURL: { type: String },
      reasonToJoin: { type: String },
    }
  }],

  restrictedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  organizerEmail: {  
    type: String,
    required: true,
  },

  emailSubject: {  
    type: String,
    required: true,
  },

  emailDescription: {  
    type: String,
    required: true,
  },

  eventDateTime: {  
    type: Date,
    required: true,
  },
  
  eventLocation: {  
    type: String,
    required: true,
  },

});

const UserData = mongoose.model('UserData', userDataSchema);

module.exports = UserData;
