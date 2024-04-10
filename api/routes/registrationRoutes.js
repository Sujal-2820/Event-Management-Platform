// routes/registrationRoutes.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const UserData = require('../models/UserData');
const authMiddleware = require('../middleware/authMiddleware');
const axios = require('axios');


// Register an attendee for an event
router.post('/:eventId', authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;

    // Check if the user has already registered for the event
    const user = await User.findById(userId);
    if (user.registeredEvents.includes(eventId)) {
      return res.status(400).json({ message: 'You have already registered for the event!' });
    }

    // If the eligibility status is 'User not eligible to attend the event',
    // check if the user's ObjectId is already in the restrictedUsers array
    const eligibilityStatus = req.body.eligibilityStatus;
    if (eligibilityStatus === 'You are not eligible to attend the event') {
      const userData = await UserData.findById(eventId);

      if (userData.restrictedUsers.includes(userId)) {
        return res.status(403).json({ message: 'You are not eligible to register for the event.' });
      }

      await UserData.findByIdAndUpdate(
        eventId,
        { $addToSet: { restrictedUsers: userId } },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );

      console.log('User not eligible, skipped adding to registeredUsers');
      return res.status(200).json({ message: 'You are not eligible to register' });
    }

    // Update User model with the registered event
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { registeredEvents: eventId } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );


    const { fullName, workEmail, githubURL, linkedinURL, reasonToJoin } = req.body;
    // Update UserData model with the registered user
    const updatedUserData = await UserData.findByIdAndUpdate(
      eventId,
      {
        $addToSet: {
          registeredUsers: {
            userId,
            details: {
              fullName,
              workEmail,
              githubURL,
              linkedinURL,
              reasonToJoin,
            },
          },
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    console.log('Updated User:', updatedUser);
    console.log('Updated UserData:', updatedUserData);

    // Fetch the user's email from the User model
    const USER = await User.findById(userId);
    const attendeeEmail = USER.email;

    // Get other necessary details from MongoDB
    const { organizerEmail, emailSubject, emailDescription, eventDateTime, eventLocation } = await UserData.findById(eventId);

    // Send mail confirmation
    await axios.post('https://event-management-platform.onrender.com/mailConfirmation', {
      attendeeEmail,
      organizerEmail,
      emailSubject,
      emailDescription,
      eventDateTime,
      eventLocation,
    });

    res.status(200).json({message: 'Registration Successful! A confirmation mail has been sent to you please check it.'})

    } catch (error) {
      console.error('Error processing registration request:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  }
);


// Cancel registration for an attendee
router.delete('/:eventId', authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;

    // Update User model to remove the registered event
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { registeredEvents: eventId } }, // Remove eventId from registeredEvents array
      { new: true }
    );

    // Update UserData model to remove the registered user
    const updatedUserData = await UserData.findByIdAndUpdate(
      eventId,
      { $pull: { registeredUsers: userId } }, // Remove userId from registeredUsers array
      { new: true }
    );

    // Log the updated user and user data for debugging
    console.log('Updated User:', updatedUser);
    console.log('Updated UserData:', updatedUserData);

    res.status(200).json({ message: 'Cancellation successful' });
  } catch (error) {
    console.error('Error processing cancellation request:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});


// Get registered events for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Find the user by ID and populate the registeredEvents field
    const user = await User.findById(userId).populate('registeredEvents');

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    // Extract registered events from the user data
    const registeredEvents = user.registeredEvents;

    // console.log('Registered events:', registeredEvents);

    // Send the registered events in the response
    res.status(200).json({ registeredEvents });
  } catch (error) {
    console.error('Error fetching registered events:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});


// Read UserData by ID for the authenticated user
router.get('/:id', authMiddleware, async (req, res) => {
    try {
      const userID = req.user._id;
      const { id } = req.params;
      const userData = await UserData.findOne({ _id: id, userID });
  
      if (!userData) {
        return res.status(404).json({ message: 'UserData not found' });
      }
  
      res.status(200).json(userData);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });
  

// Route to get _id of User
// router.get('/getUserId', authMiddleware, async(req, res) => {
//   try {
//     const userId = req.user._id;
//     res.status(200).json({ userId });
//   } catch (error) {
//     console.error('Error getting user ID:', error);
//     res.status(500).json({ error: 'Internal Server Error', details: error.message });
//   }
// }) 

module.exports = router;
