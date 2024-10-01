import WorkoutLog from '../components/WorkoutLog';

function WorkoutLogPage({ workouts }) {
  return (
    <div className="p-4">
      <section>
        <h2 className="text-xl font-bold mb-4">Workout Log</h2>
        {workouts.length === 0 ? (
          <p>No workouts logged yet.</p>
        ) : (
          <ul>
            {workouts.map((workout) => (
              <li key={workout._id} className="mb-4 border p-4 rounded shadow">
                <h3 className="font-semibold">{workout.exercise}</h3>
                <ul>
                  {workout.sets.map((set, index) => (
                    <li key={index} className="mt-2">
                      Set {index + 1}: {set.weight} kgs x {set.reps} reps
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default WorkoutLogPage;
