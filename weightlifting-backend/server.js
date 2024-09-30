const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize the app
const app = express();
const PORT = process.env.PORT || 5001;

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://henryamm:S9uiDgm6kXWf505N@cluster0.q8luy.mongodb.net/weightlifting?retryWrites=true&w=majority';

// Middleware
const allowedOrigins = [
  'http://localhost:3000',    // Local development
  'https://henchry.netlify.app'  // Your Netlify deployment
];

app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
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

// Define User schema
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
    const workouts = await Workout.find({ user: mongoose.Types.ObjectId(userId) });
    if (!workouts.length) {
      return res.status(404).json({ message: "No workouts found for this user" });
    }
    res.status(200).json(workouts);
  } catch (err) {
    console.error('Error fetching workouts:', err);
    res.status(500).json({ message: 'Error fetching workouts', error: err });
  }
});

// Delete a workout
app.delete('/api/workouts/:id', async (req, res) => {
  const { id } = req.params;  // Extract workout ID from the URL

  try {
    console.log('Deleting workout with ID:', id);
    const deletedWorkout = await Workout.findByIdAndDelete(mongoose.Types.ObjectId(id));
    if (!deletedWorkout) {
      return res.status(404).json({ message: "Workout not found" });
    }
    res.status(200).json({ message: "Workout deleted successfully" });
  } catch (err) {
    console.error('Error deleting workout:', err);
    res.status(500).json({ message: 'Error deleting workout', error: err });
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

// Delete a user by ID
app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    console.log('Deleting user with ID:', id);
    const deletedUser = await User.findByIdAndDelete(mongoose.Types.ObjectId(id));  // Convert to ObjectId
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Error deleting user', error: err });
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
