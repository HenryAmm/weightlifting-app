import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import WorkoutLogPage from './pages/WorkoutLogPage';
import NotFound from './pages/NotFound';
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  // Get the API URL from environment variables
  const API_URL = process.env.REACT_APP_API_URL;

  const [workouts, setWorkouts] = useState([]);

  // Fetch workouts from the backend
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/workouts`);
        setWorkouts(response.data);
      } catch (error) {
        console.error('Error fetching workouts:', error);
      }
    };

    fetchWorkouts();
  }, [API_URL]);

  // Submit new workout to the backend
  const handleWorkoutSubmit = async (newWorkout) => {
    try {
      const response = await axios.post(`${API_URL}/api/workouts`, newWorkout);
      setWorkouts([...workouts, response.data]);
    } catch (error) {
      console.error('Error adding workout:', error);
    }
  };

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage onSubmit={handleWorkoutSubmit} />} />
        <Route path="/log" element={<WorkoutLogPage workouts={workouts} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
