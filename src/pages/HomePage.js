import WorkoutForm from '../components/WorkoutForm';

function HomePage({ workouts, onSubmit }) {
  const calculate1RM = (weight, reps, sets) => {
    const avgReps = reps;
    const numberOfSets = sets;
    const estimated1RM = weight * (1 + 3 / avgReps) * (1 - 0.02 * (numberOfSets - 1));
    return estimated1RM.toFixed(2);
  };

  return (
    <div className="p-4">
      <WorkoutForm onSubmit={onSubmit} />
      <section className="mt-6">
        <h2 className="text-xl font-bold mb-4">Your Exercises (Estimated 1RM)</h2>
        <ul className="space-y-4">
          {workouts.length === 0 ? (
            <li>No workouts logged yet.</li>
          ) : (
            workouts.map((workout) => (
              <li key={workout._id} className="border p-4 rounded shadow">
                <h3 className="text-lg font-semibold">{workout.exercise}</h3>
                <p>Estimated 1RM: {calculate1RM(workout.weight, workout.reps, workout.sets)} lbs</p>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}

export default HomePage;
