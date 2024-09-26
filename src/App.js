import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Footer from './components/Footer';
import WorkoutLog from './components/WorkoutLog';
import HomePage from './pages/HomePage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Dynamically set the API base URL using environment variables
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

function App() {
  const [workouts, setWorkouts] = useState([]);

  // Fetch workouts from the backend when the app loads
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await axios.get(`${API_URL}/workouts`);
        setWorkouts(response.data);
      } catch (error) {
        console.error('Error fetching workouts:', error);
      }
    };

    fetchWorkouts();
  }, []);

  // Handle adding or updating a workout
  const handleWorkoutSubmit = async (newWorkout) => {
    try {
      const response = await axios.post(`${API_URL}/workouts`, newWorkout);

      // Update the workout log in the state (add new or update existing workout)
      const updatedWorkout = response.data;
      setWorkouts((prevWorkouts) => {
        const existingWorkoutIndex = prevWorkouts.findIndex(workout => workout.exercise === updatedWorkout.exercise);

        if (existingWorkoutIndex !== -1) {
          // Update the existing workout in the state
          const updatedWorkouts = [...prevWorkouts];
          updatedWorkouts[existingWorkoutIndex] = updatedWorkout;
          return updatedWorkouts;
        } else {
          // Add new workout to the state
          return [...prevWorkouts, updatedWorkout];
        }
      });
    } catch (error) {
      console.error('Error adding/updating workout:', error);
    }
  };

  // Handle deleting a workout
  const handleDeleteWorkout = async (id) => {
    try {
      await axios.delete(`${API_URL}/workouts/${id}`);
      setWorkouts((prevWorkouts) => prevWorkouts.filter(workout => workout._id !== id));
    } catch (error) {
      console.error('Error deleting workout:', error);
    }
  };

  return (
    <Router>
      <Header />
      <div className="container mx-auto p-4">
        <Routes>
          <Route
            path="/"
            element={<HomePage onSubmit={handleWorkoutSubmit} />}
          />
          <Route
            path="/log"
            element={<WorkoutLog workouts={workouts} setWorkouts={setWorkouts} onDeleteWorkout={handleDeleteWorkout} />}
          />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
