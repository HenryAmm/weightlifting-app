const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize the Express app
const app = express();
const PORT = 5001;

// Middleware
app.use(cors());  // Enable CORS for all origins
app.use(express.json());  // Parse incoming JSON requests

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://henryamm:S9uiDgm6kXWf505N@cluster0.q8luy.mongodb.net/weightlifting?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// MongoDB connection check
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB Atlas');
});

// Check the database name in use
console.log('Connected to database:', db);

// Define the User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },  // Each username must be unique
  createdAt: { type: Date, default: Date.now },
});

// User model
const User = mongoose.model('User', userSchema);

// Define the Workout schema, associating workouts with a user
const workoutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to the user
  exercise: String,
  weight: Number,
  reps: Number,
  sets: Number,
  date: { type: Date, default: Date.now },
});

// Workout model
const Workout = mongoose.model('Workout', workoutSchema);

// Routes

// Get all users from the database
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new user to the database
app.post('/api/users', async (req, res) => {
  const { username } = req.body;

  // Ensure the username doesn't already exist
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ username });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a user by ID
app.delete('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Optionally, delete the workouts associated with this user
    await Workout.deleteMany({ user: req.params.id });

    res.status(200).json({ message: 'User and associated workouts deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
});

// Get all workouts for a specific user
app.get('/api/workouts/:userId', async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.params.userId });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create or update a workout for a specific user
app.post('/api/workouts', async (req, res) => {
  const { user, exercise, weight, reps, sets } = req.body;

  try {
    const updatedWorkout = await Workout.findOneAndUpdate(
      { user, exercise },  // Find by user and exercise
      { $set: { weight, reps, sets } },  // Update weight, reps, and sets
      { new: true, upsert: true }  // Create if it doesn't exist
    );
    res.status(201).json(updatedWorkout);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a workout by ID
app.delete('/api/workouts/:id', async (req, res) => {
  try {
    const workout = await Workout.findByIdAndDelete(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    res.status(200).json({ message: 'Workout deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
