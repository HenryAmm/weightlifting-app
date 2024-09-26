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

// Define the workout schema
const workoutSchema = new mongoose.Schema({
  exercise: String,
  weight: Number,
  reps: Number,
  sets: Number,
  date: { type: Date, default: Date.now },
});

// Workout model
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

// Create or update a workout
app.post('/api/workouts', async (req, res) => {
  const { exercise, weight, reps, sets } = req.body;

  try {
    // Find an existing workout by exercise name and update it, or insert a new one if it doesn't exist
    const updatedWorkout = await Workout.findOneAndUpdate(
      { exercise: exercise },  // Find workout by exercise name
      { $set: { weight, reps, sets } },  // Update weight, reps, and sets
      { new: true, upsert: true }  // Create new workout if it doesn't exist
    );
    res.status(201).json(updatedWorkout);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a workout by ID
app.delete('/api/workouts/:id', async (req, res) => {
  try {
    const id = mongoose.Types.ObjectId(req.params.id);  // Convert ID to ObjectId
    const workout = await Workout.findByIdAndDelete(id);

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
