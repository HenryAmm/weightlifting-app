import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import WorkoutLogPage from './pages/WorkoutLogPage';
import NotFound from './pages/NotFound';
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [workouts, setWorkouts] = useState([]);

  // Fetch workouts from the backend
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/workouts');
        setWorkouts(response.data);
      } catch (error) {
        console.error('Error fetching workouts:', error);
      }
    };

    fetchWorkouts();
  }, []);

  // Post new workout to the backend
  const handleWorkoutSubmit = async (newWorkout) => {
    try {
      const response = await axios.post('http://localhost:5001/api/workouts', newWorkout);
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
