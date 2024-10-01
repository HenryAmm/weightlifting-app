import WorkoutForm from '../components/WorkoutForm';

function HomePage({ workouts, onSubmit }) {
  const calculate1RM = (sets) => {
    if (sets.length === 0) return null;

    const totalSets = sets.length;
    const totalWeight = sets.reduce((sum, set) => sum + Number(set.weight), 0);
    const totalReps = sets.reduce((sum, set) => sum + Number(set.reps), 0);

    const averageWeight = totalWeight / totalSets;
    const averageReps = totalReps / totalSets;

    const estimated1RM = averageWeight * (1 + 3 / averageReps) * (1 - 0.02 * (totalSets - 1));
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
                <p>Estimated 1RM: {calculate1RM(workout.sets)} kgs</p>
                <ul>
                  {workout.sets.map((set, index) => (
                    <li key={index}>
                      Set {index + 1}: {set.weight} kgs x {set.reps} reps
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
