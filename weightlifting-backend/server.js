const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://henryamm:S9uiDgm6kXWf505N@cluster0.q8luy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Check connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a workout schema
const workoutSchema = new mongoose.Schema({
  exercise: String,
  weight: Number,
  reps: Number,
  date: { type: Date, default: Date.now },
});

const Workout = mongoose.model('Workout', workoutSchema);

// Routes

// Get all workouts
app.get('/api/workouts', async (req, res) => {
  try {
    const workouts = await Workout.find();
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new workout
app.post('/api/workouts', async (req, res) => {
  const workout = new Workout({
    exercise: req.body.exercise,
    weight: req.body.weight,
    reps: req.body.reps,
  });

  try {
    const newWorkout = await workout.save();
    res.status(201).json(newWorkout);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
