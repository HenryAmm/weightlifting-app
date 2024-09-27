import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Footer from './components/Footer';
import WorkoutLog from './components/WorkoutLog';
import HomePage from './pages/HomePage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// API base URL changes based on environment
const API_URL = process.env.NODE_ENV === 'production'
  ? '/.netlify/functions'
  : 'http://localhost:5001/api';  // Local Node.js API in development

function App() {
  const [workouts, setWorkouts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (currentUser) {
      const fetchWorkouts = async () => {
        try {
          const response = await axios.get(`${API_URL}/workouts/${currentUser}`);
          setWorkouts(response.data);
        } catch (error) {
          console.error('Error fetching workouts:', error);
        }
      };

      fetchWorkouts();
    }
  }, [currentUser]);

  const handleWorkoutSubmit = async (newWorkout) => {
    try {
      const response = await axios.post(`${API_URL}/workouts`, { ...newWorkout, user: currentUser });
      setWorkouts(prevWorkouts => {
        const existingWorkoutIndex = prevWorkouts.findIndex(workout => workout.exercise === response.data.exercise);
        if (existingWorkoutIndex !== -1) {
          const updatedWorkouts = [...prevWorkouts];
          updatedWorkouts[existingWorkoutIndex] = response.data;
          return updatedWorkouts;
        } else {
          return [...prevWorkouts, response.data];
        }
      });
    } catch (error) {
      console.error('Error adding/updating workout:', error);
    }
  };

  return (
    <Router>
      <Header currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<HomePage workouts={workouts} onSubmit={handleWorkoutSubmit} />} />
          <Route path="/log" element={<WorkoutLog workouts={workouts} setWorkouts={setWorkouts} />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

console.log('Environment:', process.env.NODE_ENV);


export default App;
