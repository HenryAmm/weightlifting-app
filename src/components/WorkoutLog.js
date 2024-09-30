import { TrashIcon } from '@heroicons/react/24/solid';  // Updated import path for Heroicons v2
import axios from 'axios';

function WorkoutLog({ workouts, setWorkouts }) {

  const handleDeleteWorkout = async (workoutId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/deleteWorkout/${workoutId}`);
      setWorkouts(workouts.filter(workout => workout._id !== workoutId));  // Remove the workout from the local state
    } catch (error) {
      console.error('Error deleting workout:', error);
    }
  };
  


  return (
    <section className="bg-white p-4 rounded shadow-md mt-4">
      <h2 className="text-xl font-bold">Workout Log</h2>
      <ul className="mt-2">
        {workouts.length === 0 ? (
          <li>No workouts logged yet.</li>
        ) : (
          workouts.map((workout) => (
            <li key={workout._id} className="mb-2 flex justify-between items-center">
              <div>
                {workout.exercise} - {workout.weight} kgs x {workout.reps} reps for {workout.sets} sets
              </div>
              <button
                onClick={() => handleDeleteWorkout(workout._id)}  // Corrected function name
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
