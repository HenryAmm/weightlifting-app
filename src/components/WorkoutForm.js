import { useState } from 'react';

function WorkoutForm({ onSubmit }) {
  const [exercise, setExercise] = useState('');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ exercise, weight, reps });
    setExercise('');
    setWeight('');
    setReps('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-emerald-600 p-4 rounded shadow-md">
      <div className="mb-4">
        <label className="block mb-2">Exercise</label>
        <input
          type="text"
          value={exercise}
          onChange={(e) => setExercise(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="e.g., Bench Press"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Weight (kgs)</label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="e.g., 135"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Reps</label>
        <input
          type="number"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="e.g., 10"
          required
        />
      </div>
      <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded">
        Log Workout
      </button>
    </form>
  );
}

export default WorkoutForm;
