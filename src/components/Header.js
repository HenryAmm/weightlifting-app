import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { TrashIcon } from '@heroicons/react/24/solid';  // Importing the trash icon

function Header({ currentUser, setCurrentUser }) {
  const [users, setUsers] = useState([]);
  const [newUsername, setNewUsername] = useState('');
  const [showModal, setShowModal] = useState(false);  // For controlling the modal visibility

  useEffect(() => {
    // Fetch users from the database
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/users`);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    if (newUsername) {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/addUser`, {
          username: newUsername
        }, {
          headers: {
            'Content-Type': 'application/json'  // Ensure proper content type
          }
        });
        setUsers([...users, response.data]);
        setCurrentUser(response.data._id);
        setNewUsername('');
      } catch (error) {
        console.error('Error adding user:', error);
      }
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
  

  const handleSelectChange = (e) => {
    const value = e.target.value;
    if (value === 'add_new') {
      setShowModal(true);  // Open the modal when "Add new user" is selected
    } else {
      setCurrentUser(value);
    }
  };

  return (
    <header className="bg-indigo-950 p-4 text-white flex justify-between items-center">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold">Henchry</h1>
        <nav className="ml-6">
          <Link to="/" className="text-white mr-4 hover:underline">Home</Link>
          <Link to="/log" className="text-white hover:underline">Workout Log</Link>
        </nav>
      </div>
      <div className="flex items-center">
        <select
          value={currentUser || ''}
          onChange={handleSelectChange}
          className="mr-4 p-2 bg-white text-black rounded"
        >
          <option value="" disabled>Select a user</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.username}
            </option>
          ))}
          <option value="add_new">Add new user</option> {/* "Add new user" option */}
        </select>

        {/* Recycle bin icon for deleting the user */}
        {currentUser && (
          <button onClick={handleDeleteUser} className="ml-2 text-white hover:text-red-500">
            <TrashIcon className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Modal for adding a new user */}
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 text-center">
            <div className="bg-indigo-950 rounded-lg text-left shadow-xl p-6">
              <h2 className="text-xl font-bold mb-4">Add New User</h2>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Enter username"
                className="p-2 border rounded w-full text-black mb-4"
              />
              <div className="flex justify-end">
                <button
                  onClick={() => setShowModal(false)}  // Close the modal
                  className="mr-2 bg-gray-500 text-white p-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUser}  // Submit the new user
                  className="bg-green-500 text-white p-2 rounded"
                >
                  Add User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
