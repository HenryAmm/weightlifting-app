import { useState, useEffect, useRef } from 'react';

function WorkoutForm({ onSubmit, workouts }) {
  const [exercise, setExercise] = useState('');
  const [sets, setSets] = useState([{ weight: '', reps: '' }]);
  const [suggestions, setSuggestions] = useState([]);
  const suggestionsRef = useRef(null); // For handling clicks outside suggestions

  // Filter workouts to get unique exercise suggestions
  useEffect(() => {
    if (exercise && workouts) {
      const filteredSuggestions = workouts
        .map((workout) => workout.exercise)
        .filter((ex) => ex.toLowerCase().includes(exercise.toLowerCase()))
        .filter((value, index, self) => self.indexOf(value) === index);

      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [exercise, workouts]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSuggestionClick = (suggestion) => {
    setExercise(suggestion);
    setSuggestions([]); // Hide suggestions after selecting
  };

  const handleSetChange = (index, field, value) => {
    const updatedSets = [...sets];
    updatedSets[index][field] = value;
    setSets(updatedSets);
  };

  const handleAddSet = () => {
    setSets([...sets, { weight: '', reps: '' }]);
  };

  const handleRemoveSet = (index) => {
    const updatedSets = sets.filter((_, i) => i !== index);
    setSets(updatedSets);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ exercise, sets });
    setExercise('');
    setSets([{ weight: '', reps: '' }]); // Reset form
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Exercise Input */}
      <div className="relative" ref={suggestionsRef}>
        <label htmlFor="exercise" className="block font-medium">Exercise</label>
        <input
          id="exercise"
          type="text"
          value={exercise}
          onChange={(e) => setExercise(e.target.value)}
          className="mt-1 text-black block w-full p-2 border border-gray-300 rounded"
        />
        {/* Dropdown suggestions */}
        {suggestions.length > 0 && (
          <ul className="absolute bg-indigo-200 border border-gray-300 mt-1 w-full text-black max-h-40 overflow-y-auto z-10 rounded shadow-lg">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="cursor-pointer p-2 hover:bg-indigo-100"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Sets Inputs */}
      <div>
        <h3 className="font-medium">Sets</h3>
        {sets.map((set, index) => (
          <div key={index} className="flex space-x-4 items-center">
            <div className="w-1/2">
              <label htmlFor={`weight-${index}`} className="block font-medium">Weight (kgs)</label>
              <input
                id={`weight-${index}`}
                type="number"
                value={set.weight}
                onChange={(e) => handleSetChange(index, 'weight', e.target.value)}
                className="mt-1 text-black block w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="w-1/2">
              <label htmlFor={`reps-${index}`} className="block font-medium">Reps</label>
              <input
                id={`reps-${index}`}
                type="number"
                value={set.reps}
                onChange={(e) => handleSetChange(index, 'reps', e.target.value)}
                className="mt-1 block text-black w-full p-2 border border-gray-300 rounded"
              />
            </div>

            {sets.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveSet(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            )}
          </div>
        ))}

        {/* Add More Sets Button */}
        <button
          type="button"
          onClick={handleAddSet}
          className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400"
        >
          + Add More Sets
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="mt-4 bg-indigo-500 w-full text-white p-2 text-lg rounded hover:bg-indigo-400"
      >
        Log Workout
      </button>
    </form>
  );
}

export default WorkoutForm;
