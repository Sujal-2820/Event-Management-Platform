// index.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Register the schema for "userdatas" model
const userDataSchema = require('./models/UserData').schema;
mongoose.model('userdatas', userDataSchema);

// Define Routes
const authRoutes = require('./routes/authRoutes');
const dataRoutes = require('./routes/userDataRoutes');
const publicRoute = require('./routes/publicRoute');
const registrationRoutes = require('./routes/registrationRoutes');
const verifyRoute = require('./routes/mailVerify');
const mailConfirmationRoute = require('./routes/mailConfirmation');

app.use('/auth', authRoutes);
app.use('/auth/dashboard/data', dataRoutes);
app.use('/public', publicRoute);
app.use('/registration', registrationRoutes);
app.use('/mailVerify', verifyRoute);
app.use('/mailConfirmation', mailConfirmationRoute);




// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});