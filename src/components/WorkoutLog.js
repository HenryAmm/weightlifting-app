import { TrashIcon } from '@heroicons/react/24/solid';
import axios from 'axios';

function WorkoutLog({ workouts, setWorkouts }) {

  const handleDeleteWorkout = async (workoutId) => {
    // Determine the base API URL from the environment variables
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

    try {
      // Use the same URL structure for local and Netlify environments
      await axios.delete(`${baseUrl}/workouts/${workoutId}`);
      // Update the local state after deletion
      setWorkouts(workouts.filter(workout => workout._id !== workoutId));
    } catch (error) {
      console.error('Error deleting workout:', error);
    }
  };

  return (
    <section className="bg-indigo-950 p-4 rounded shadow-md mt-4">
      <h2 className="text-xl font-bold">Workout Log</h2>
      <ul className="mt-2">
        {workouts.length === 0 ? (
          <li>No workouts logged yet.</li>
        ) : (
          workouts.map((workout) => (
            <li key={workout._id} className="mb-2 flex justify-between items-center">
              <div>
                {workout.exercise} - {workout.weight} kg x {workout.reps} reps for {workout.sets} sets
              </div>
              <button
                onClick={() => handleDeleteWorkout(workout._id)}
                className="text-red-500 hover:text-red-700"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}

export default WorkoutLog;
