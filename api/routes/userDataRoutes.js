//routes/userDataRoutes.js

const express = require('express');
const router = express.Router();
const UserData = require('../models/UserData.js');
const User = require('../models/User.js');
const authMiddleware = require('../middleware/authMiddleware.js');

// Create UserData with associated Quiz Questions
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { 
      title,
      description,
      imageUrl,
      eventDomain,
      quizQuestions,
      timePerQuestion,
      minimumScore,
      organizerEmail,
      emailSubject,
      emailDescription,
      eventDateTime,
      eventLocation,
     } = req.body;
    const userID = req.user._id;

    const newUserData = new UserData({
      title,
      description,
      imageUrl,
      eventDomain,
      userID,
      quizQuestions,
      timePerQuestion,
      minimumScore,
      organizerEmail,
      emailSubject,
      emailDescription,
      eventDateTime,
      eventLocation,
    });

    await newUserData.save();
    res.status(200).json({ message: 'Data added successfully', data: newUserData });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Read UserData for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userID = req.user._id;
    const userData = await UserData.find({ userID });

    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
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

// Update UserData by ID
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { 
      title,
      description,
      imageUrl,
      eventDomain,
      quizQuestions,
      timePerQuestion,
      minimumScore,
      organizerEmail,
      emailSubject,
      emailDescription,
      eventDateTime,
      eventLocation,
     } = req.body;
    const { id } = req.params;

    const updatedUserData = await UserData.findByIdAndUpdate(
      id,
      { 
        title,
        description,
        imageUrl,
        eventDomain,
        quizQuestions,
        timePerQuestion,
        minimumScore,
        organizerEmail,
        emailSubject,
        emailDescription,
        eventDateTime,
        eventLocation,
       },
      { new: true }
    );

    res.status(200).json({ message: 'UserData updated successfully', userData: updatedUserData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete UserData by ID
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    await UserData.findByIdAndDelete(id);

    res.status(200).json({ message: 'UserData deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Read registered participants for a given event
router.get('/participants/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the UserData document for the event
    const userData = await UserData.findById(id);

    if (!userData) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Extract registered users and their details
    const registeredUsers = userData.registeredUsers.map(user => {
      return {
        fullName: user.details.fullName,
        githubURL: user.details.githubURL,
        linkedinURL: user.details.linkedinURL
      };
    });

    res.status(200).json(registeredUsers);
  } catch (error) {
    console.error('Error fetching participants:', error);
    res.status(500).json({ error: 'Server error' });
  }
});





module.exports = router;
