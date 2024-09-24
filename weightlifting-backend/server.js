const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5001;  // Use Heroku's dynamic port or 5001 for local development

// Middleware to parse JSON
app.use(express.json());

// CORS settings - allow localhost and Netlify origin
app.use(cors({
  origin: ['http://localhost:3000', 'https://henchry.netlify.app'],  // Allow localhost for dev and Netlify for production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow necessary HTTP methods
  credentials: true  // Allow credentials if needed (e.g., for cookies, authentication)
}));

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://henryamm:S9uiDgm6kXWf505N@cluster0.q8luy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
    process.exit(1);  // Exit with failure if MongoDB connection fails
  });

// Define Workout Schema
const workoutSchema = new mongoose.Schema({
  exercise: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  reps: {
    type: Number,
    required: true,
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
});

const Workout = mongoose.model('Workout', workoutSchema);

// Routes

// GET: Retrieve all workouts
app.get('/api/workouts', async (req, res) => {
  try {
    const workouts = await Workout.find();
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: Add a new workout
app.post('/api/workouts', async (req, res) => {
  const { exercise, weight, reps } = req.body;
  
  // Validate request data
  if (!exercise || !weight || !reps) {
    return res.status(400).json({ message: 'Please include exercise, weight, and reps.' });
  }

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

// Root route for health check
app.get('/', (req, res) => {
  res.send('Weightlifting API is running');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
