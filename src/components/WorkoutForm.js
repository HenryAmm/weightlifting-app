import { useState, useEffect, useRef } from 'react';

function WorkoutForm({ onSubmit, workouts }) {
  const [exercise, setExercise] = useState('');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [sets, setSets] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null); // Ref for the input field

  // Filter workouts to get unique exercise suggestions
  useEffect(() => {
    if (exercise) {
      const filteredSuggestions = workouts
        .map((workout) => workout.exercise)
        .filter((ex) => ex.toLowerCase().includes(exercise.toLowerCase())) // Suggest matching exercises
        .filter((value, index, self) => self.indexOf(value) === index); // Deduplicate suggestions

      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [exercise, workouts]);

  const handleSuggestionClick = (suggestion) => {
    setExercise(suggestion); // Set the clicked suggestion to the input
    setSuggestions([]); // Immediately hide the suggestions after selecting
  };

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current !== event.target
      ) {
        setSuggestions([]); // Close suggestions if clicking outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ exercise, weight, reps, sets });
    setExercise('');
    setWeight('');
    setReps('');
    setSets('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative" ref={dropdownRef}>
        <label htmlFor="exercise" className="block font-medium">
          Exercise
        </label>
        <input
          id="exercise"
          ref={inputRef}
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
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSuggestionClick(suggestion);
                }}
                className="cursor-pointer p-2 hover:bg-indigo-100"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <label htmlFor="weight" className="block font-medium">
          Weight (kgs)
        </label>
        <input
          id="weight"
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="mt-1 text-black block w-full p-2 border border-gray-300 rounded"
        />
      </div>

      {/* Reps and Sets on one line */}
      <div className="flex space-x-4">
        <div className="w-1/2">
          <label htmlFor="reps" className="block font-medium">
            Reps
          </label>
          <input
            id="reps"
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="mt-1 text-black block w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="w-1/2">
          <label htmlFor="sets" className="block font-medium">
            Sets
          </label>
          <input
            id="sets"
            type="number"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
            className="mt-1 block text-black w-full p-2 border border-gray-300 rounded"
          />
        </div>
      </div>

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
