import WorkoutForm from '../components/WorkoutForm';
import RoutineSuggestions from '../components/RoutineSuggestions';

function HomePage({ onSubmit }) {
  return (
    <div className="p-4">
      <WorkoutForm onSubmit={onSubmit} />
      <RoutineSuggestions />
    </div>
  );
}

export default HomePage;
