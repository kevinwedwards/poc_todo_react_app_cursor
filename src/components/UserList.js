import React, { useState, useEffect } from 'react';
import { userApi } from '../services/api';
import './UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userApi.getAll();
      // Sort users by ID for consistent ordering
      const sortedUsers = data.sort((a, b) => a.id - b.id);
      setUsers(sortedUsers);
      setError(null);
    } catch (err) {
      setError('Failed to load users: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadUsers();
      return;
    }

    try {
      setLoading(true);
      const data = await userApi.search(searchTerm);
      // Sort search results by ID for consistent ordering
      const sortedUsers = data.sort((a, b) => a.id - b.id);
      setUsers(sortedUsers);
      setError(null);
    } catch (err) {
      setError('Failed to search users: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await userApi.delete(userId);
      setUsers(users.filter(user => user.id !== userId));
      setError(null);
    } catch (err) {
      setError('Failed to delete user: ' + err.message);
    }
  };

  const handleCreate = async (userData) => {
    try {
      const newUser = await userApi.create(userData);
      // Add new user and sort by ID
      const updatedUsers = [...users, newUser].sort((a, b) => a.id - b.id);
      setUsers(updatedUsers);
      setShowCreateModal(false);
      setError(null);
    } catch (err) {
      setError('Failed to create user: ' + err.message);
    }
  };

  const handleUpdate = async (userId, userData) => {
    try {
      const updatedUser = await userApi.update(userId, userData);
      // Update user and sort by ID
      const updatedUsers = users.map(user => user.id === userId ? updatedUser : user)
        .sort((a, b) => a.id - b.id);
      setUsers(updatedUsers);
      setEditingUser(null);
      setError(null);
    } catch (err) {
      setError('Failed to update user: ' + err.message);
    }
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Users</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          Add User
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="search-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search users by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="btn btn-secondary" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      <div className="users-grid">
        {users.map(user => (
          <div key={user.id} className="user-card">
            <div className="user-header">
              <h3>{user.name}</h3>
              <div className="user-actions">
                <button 
                  className="btn btn-small btn-secondary"
                  onClick={() => setEditingUser(user)}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-small btn-danger"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="user-details">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>ID:</strong> {user.id}</p>
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && !loading && (
        <div className="text-center">
          <p>No users found.</p>
        </div>
      )}

      {showCreateModal && (
        <UserModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreate}
          title="Create New User"
        />
      )}

      {editingUser && (
        <UserModal
          onClose={() => setEditingUser(null)}
          onSubmit={(userData) => handleUpdate(editingUser.id, userData)}
          title="Edit User"
          user={editingUser}
        />
      )}
    </div>
  );
};

const UserModal = ({ onClose, onSubmit, title, user = null }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              maxLength={100}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              maxLength={150}
            />
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {user ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserList; 