import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Header({ currentUser, setCurrentUser }) {
  const [users, setUsers] = useState([]);
  const [newUsername, setNewUsername] = useState('');

  useEffect(() => {
    // Fetch users from the database
    const fetchUsers = async () => {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/users`);
      setUsers(response.data);
    };
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    if (newUsername) {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/users`, { username: newUsername });
      setUsers([...users, response.data]);
      setCurrentUser(response.data._id);
      setNewUsername('');
    }
  };

  const handleDeleteUser = async () => {
    if (currentUser) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/users/${currentUser}`);
        setUsers(users.filter(user => user._id !== currentUser));  // Remove the user from the local list
        setCurrentUser(null);  // Clear the current user
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <header className="bg-blue-600 p-4 text-white flex justify-between items-center">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold">Weightlifting App</h1>
        <nav className="ml-6">
          <Link to="/" className="text-white mr-4 hover:underline">Home</Link>
          <Link to="/log" className="text-white hover:underline">Workout Log</Link>
        </nav>
      </div>
      <div className="flex items-center">
        <select
          value={currentUser || ''}
          onChange={(e) => setCurrentUser(e.target.value)}
          className="mr-4 p-2 bg-white text-black rounded"
        >
          <option value="" disabled>Select a user</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.username}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          placeholder="Add new user"
          className="p-2 rounded"
        />
        <button onClick={handleAddUser} className="ml-2 bg-green-500 text-white p-2 rounded">
          Add User
        </button>
        <button onClick={handleDeleteUser} className="ml-2 bg-red-500 text-white p-2 rounded">
          Delete User
        </button>
      </div>
    </header>
  );
}

export default Header;
