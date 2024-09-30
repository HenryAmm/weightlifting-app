import WorkoutForm from '../components/WorkoutForm';

function HomePage({ workouts, onSubmit }) {
  const calculate1RM = (weight, reps, sets) => {
    const avgReps = reps;
    const numberOfSets = sets;
    const estimated1RM = weight * (1 + 3 / avgReps) * (1 - 0.02 * (numberOfSets - 1));
    return estimated1RM.toFixed(0);
  };

  // Group workouts by exercise name and sort by date (most recent first)
  const groupedWorkouts = workouts.reduce((grouped, workout) => {
    if (!grouped[workout.exercise]) {
      grouped[workout.exercise] = [];
    }
    grouped[workout.exercise].push(workout);
    return grouped;
  }, {});

  // Sort each exercise's workouts by date (most recent first)
  Object.keys(groupedWorkouts).forEach((exercise) => {
    groupedWorkouts[exercise].sort((a, b) => new Date(b.date) - new Date(a.date));
  });

  return (
    <div className="p-4">
      <WorkoutForm onSubmit={onSubmit} workouts={workouts} />

      <section className="mt-6">
        <h2 className="text-xl font-bold mb-4">Your Exercises (Estimated 1RM over time)</h2>
        <ul className="space-y-4">
          {workouts.length === 0 ? (
            <li>No workouts logged yet.</li>
          ) : (
            Object.keys(groupedWorkouts).map((exercise) => (
              <li key={exercise} className="bg-indigo-950 p-4 rounded shadow">
                <h3 className="text-lg font-semibold">{exercise}</h3>
                <ul className="ml-4">
                  {groupedWorkouts[exercise].map((workout) => (
                    <li key={workout._id} className="mb-2">
                        {new Date(workout.date).toLocaleDateString()}: <span className="font-semibold">{calculate1RM(workout.weight, workout.reps, workout.sets)} kg
                      </span>
                      {' '}
                      <span className="text-gray-600 pl-2 text-sm">
                        ({workout.weight} kg x {workout.reps} reps x {workout.sets} sets)
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}

export default HomePage;
