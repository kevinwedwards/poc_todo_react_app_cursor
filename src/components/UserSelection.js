import React, { useState, useEffect } from 'react';
import { userApi } from '../services/api';
import './UserSelection.css';

const UserSelection = ({ onUserSelect }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userApi.getAll();
      const sortedUsers = data.sort((a, b) => a.id - b.id);
      setUsers(sortedUsers);
      setError(null);
    } catch (err) {
      setError('Failed to load users: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (user) => {
    onUserSelect(user);
  };

  if (loading) {
    return (
      <div className="user-selection-container">
        <div className="loading">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-selection-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="user-selection-container">
        <div className="no-users">
          <h2>No Users Found</h2>
          <p>Please create some users first before accessing the todo app.</p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.href = '/users'}
          >
            Go to Users Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-selection-container">
      <div className="user-selection-content">
        <div className="selection-header">
          <h1>Welcome to Todo Management App</h1>
          <p>Please select a user to continue:</p>
        </div>

        <div className="users-grid">
          {users.map(user => (
            <div 
              key={user.id} 
              className="user-selection-card"
              onClick={() => handleUserSelect(user)}
            >
              <div className="user-avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <h3>{user.name}</h3>
                <p>{user.email}</p>
                <p className="user-id">ID: {user.id}</p>
              </div>
              <div className="select-indicator">
                <span>Click to select</span>
              </div>
            </div>
          ))}
        </div>

        <div className="selection-footer">
          <p>Need to create a new user?</p>
          <button 
            className="btn btn-secondary"
            onClick={() => window.location.href = '/users'}
          >
            Manage Users
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSelection; 