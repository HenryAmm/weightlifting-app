import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import WorkoutLogPage from './pages/WorkoutLogPage';
import NotFound from './pages/NotFound';
import { useState } from 'react';

function App() {
  const [workouts, setWorkouts] = useState([]);

  const handleWorkoutSubmit = (newWorkout) => {
    setWorkouts([...workouts, newWorkout]);
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
