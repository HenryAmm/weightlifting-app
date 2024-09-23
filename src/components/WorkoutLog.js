function WorkoutLog({ workouts }) {
    return (
      <section className="bg-white p-4 rounded shadow-md mt-4">
        <h2 className="text-xl font-bold">Workout Log</h2>
        <ul className="mt-2">
          {workouts.length === 0 ? (
            <li>No workouts logged yet.</li>
          ) : (
            workouts.map((workout, index) => (
              <li key={index} className="mb-2">
                {workout.exercise} - {workout.weight} lbs x {workout.reps} reps
              </li>
            ))
          )}
        </ul>
      </section>
    );
  }
  
  export default WorkoutLog;
  