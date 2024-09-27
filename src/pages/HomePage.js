import WorkoutForm from '../components/WorkoutForm';

function HomePage({ workouts, onSubmit }) {
  // Function to calculate the Estimated 1RM for each exercise
  const calculate1RM = (weight, reps, sets) => {
    const avgReps = reps;  // Assuming `reps` is the average reps in this case
    const numberOfSets = sets;

    // Formula for 1RM
    const estimated1RM = weight * (1 + 3 / avgReps) * (1 - 0.02 * (numberOfSets - 1));
    return estimated1RM.toFixed(0);  // Round to 2 decimal places
  };

  return (
    <div className="p-4">
      {/* Workout form to add new workouts */}
      <WorkoutForm onSubmit={onSubmit} />
      
      {/* Display exercises and their estimated 1RM */}
      <section className="mt-6">
        <h2 className="text-xl font-bold mb-4">Your Exercises (Estimated 1RM)</h2>
        <ul className="space-y-4">
          {workouts.length === 0 ? (
            <li>No workouts logged yet.</li>
          ) : (
            workouts.map((workout) => (
              <li key={workout._id} className="border p-4 rounded shadow">
                <h3 className="text-lg font-semibold">{workout.exercise}</h3>
                <p>Estimated 1RM: {calculate1RM(workout.weight, workout.reps, workout.sets)} kg</p>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}

export default HomePage;
