import { useState } from 'react';

function WorkoutForm({ onSubmit, workouts }) {
  const [exercise, setExercise] = useState('');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [sets, setSets] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // Handle input change for the exercise field
  const handleExerciseChange = (e) => {
    const value = e.target.value;
    setExercise(value);

    // Filter and deduplicate workouts based on the current input
    if (value.length > 0) {
      const filteredSuggestions = Array.from(
        new Set(
          workouts
            .map((workout) => workout.exercise)
            .filter((ex) => ex.toLowerCase().startsWith(value.toLowerCase()))
        )
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  // Handle when a user clicks a suggestion
  const handleSuggestionClick = (suggestion) => {
    setExercise(suggestion);
    setSuggestions([]); // Hide suggestions after selecting one
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newWorkout = {
      exercise,
      weight,
      reps,
      sets,
    };
    onSubmit(newWorkout);
    setExercise('');
    setWeight('');
    setReps('');
    setSets('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1">Exercise</label>
        <input
          type="text"
          value={exercise}
          onChange={handleExerciseChange}
          className="w-full p-2 border rounded"
          placeholder="Enter exercise name"
        />
        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <ul className="bg-white border rounded shadow-md mt-2">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="p-2 cursor-pointer hover:bg-gray-200"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <label className="block mb-1">Weight (kgs)</label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter weight"
        />
      </div>

      <div>
        <label className="block mb-1">Reps</label>
        <input
          type="number"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter reps"
        />
      </div>

      <div>
        <label className="block mb-1">Sets</label>
        <input
          type="number"
          value={sets}
          onChange={(e) => setSets(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter sets"
        />
      </div>

      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
        Log Workout
      </button>
    </form>
  );
}

export default WorkoutForm;
