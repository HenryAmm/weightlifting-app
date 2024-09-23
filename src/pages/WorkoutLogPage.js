import WorkoutLog from '../components/WorkoutLog';

function WorkoutLogPage({ workouts }) {
  return (
    <div className="p-4">
      <WorkoutLog workouts={workouts} />
    </div>
  );
}

export default WorkoutLogPage;
