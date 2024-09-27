const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize the app
const app = express();
const PORT = process.env.PORT || 5001;

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://henryamm:S9uiDgm6kXWf505N@cluster0.q8luy.mongodb.net/weightlifting?retryWrites=true&w=majority';

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Define Workout schema
const WorkoutSchema = new mongoose.Schema({
  exercise: String,
  weight: Number,
  reps: Number,
  sets: Number,
  user: mongoose.Schema.Types.ObjectId,  // Store user as ObjectId
  date: { type: Date, default: Date.now }
});

const Workout = mongoose.model('Workout', WorkoutSchema);

// Define User schema (if necessary for handling users)
const UserSchema = new mongoose.Schema({
  username: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

// Home route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Fetch workouts for a specific user
app.get('/api/getWorkouts', async (req, res) => {
  const { userId } = req.query;
  console.log('Fetching workouts for userId:', userId);

  try {
    const workouts = await Workout.find({ user: mongoose.Types.ObjectId(userId) });  // Convert userId to ObjectId
    if (!workouts.length) {
      return res.status(404).json({ message: "No workouts found for this user" });
    }
    res.status(200).json(workouts);
  } catch (err) {
    console.error('Error fetching workouts:', err);
    res.status(500).json({ message: 'Error fetching workouts', error: err });
  }
});

// Add a new workout
app.post('/api/addWorkout', async (req, res) => {
  const { exercise, weight, reps, sets, user } = req.body;

  const newWorkout = new Workout({
    exercise,
    weight: Number(weight),
    reps: Number(reps),
    sets: Number(sets),
    user: mongoose.Types.ObjectId(user)  // Convert userId to ObjectId when adding
  });

  try {
    await newWorkout.save();
    res.status(201).json(newWorkout);
  } catch (err) {
    console.error('Error adding workout:', err);
    res.status(500).json({ message: 'Error adding workout', error: err });
  }
});

// Delete a workout by its ID (ensure ObjectId is handled correctly)
app.delete('/api/deleteWorkout', async (req, res) => {
  const { workoutId } = req.body;  // Expect workoutId in the request body

  try {
    const deletedWorkout = await Workout.findByIdAndDelete(mongoose.Types.ObjectId(workoutId));  // Convert workoutId to ObjectId
    if (!deletedWorkout) {
      return res.status(404).json({ message: "Workout not found" });
    }
    res.status(200).json({ message: "Workout deleted successfully" });
  } catch (err) {
    console.error('Error deleting workout:', err);
    res.status(500).json({ message: 'Error deleting workout', error: err });
  }
});

// Fetch all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    if (!users.length) {
      return res.status(200).json([]);  // Return an empty array if no users are found
    }
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Error fetching users', error: err });
  }
});


// Add a new user
app.post('/api/addUser', async (req, res) => {
  const { username } = req.body;

  const newUser = new User({ username });

  try {
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    console.error('Error adding user:', err);
    res.status(500).json({ message: 'Error adding user', error: err });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
