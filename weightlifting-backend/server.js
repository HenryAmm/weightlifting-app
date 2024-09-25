const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');  // For serving the React build

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware to parse JSON
app.use(express.json());

// CORS settings - allow localhost and Netlify origin
app.use(cors({
  origin: ['http://localhost:3000', 'https://henchry.netlify.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://henryamm:S9uiDgm6kXWf505N@cluster0.q8luy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Error connecting to MongoDB', err);
    process.exit(1);
  });

// Workout Schema
const workoutSchema = new mongoose.Schema({
  exercise: String,
  weight: Number,
  reps: Number,
  date: { type: Date, default: Date.now },
});
const Workout = mongoose.model('Workout', workoutSchema);

// API routes
app.get('/api/workouts', async (req, res) => {
  try {
    const workouts = await Workout.find();
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/workouts', async (req, res) => {
  const { exercise, weight, reps } = req.body;
  const workout = new Workout({
    exercise,
    weight,
    reps,
  });

  try {
    const newWorkout = await workout.save();
    res.status(201).json(newWorkout);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'build')));

// Catch-all route: Sends the React app for any route not handled by the API
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
