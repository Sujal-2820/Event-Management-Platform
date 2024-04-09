const express = require('express');
const router = express.Router();
const UserData = require('../models/UserData.js');
const User = require('../models/User');


router.get('/', async (req, res) => {
    try {
      const allData = await UserData.find();
  
      res.status(200).json(allData);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  
// Route to get a specific data entry by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const dataEntry = await UserData.findById(id);

    if (!dataEntry) {
      return res.status(404).json({ error: 'Data not found' });
    }

    res.status(200).json(dataEntry);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


  module.exports = router;