import React, { useState, useEffect } from 'react';
import { todoApi, userApi, dataApi } from '../services/api';
import { formatDate, isOverdue } from '../utils/dateUtils';
import './Dashboard.css';

const Dashboard = ({ selectedUser }) => {
  const [stats, setStats] = useState({
    totalTodos: 0,
    totalUsers: 0,
    overdueTodos: 0,
    dataStatus: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentTodos, setRecentTodos] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    if (selectedUser) {
      loadDashboardData();
    }
  }, [selectedUser]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load all data in parallel
      const [todos, users, overdueTodos, dataStatus] = await Promise.all([
        todoApi.getAll(),
        userApi.getAll(),
        todoApi.getOverdue(),
        dataApi.getStatus()
      ]);

      // Filter todos for the selected user
      const userTodos = todos.filter(todo => todo.createdByUserId === selectedUser.id);
      const userOverdueTodos = userTodos.filter(todo => isOverdue(todo));

      // Get recent todos for the selected user (first 5 by order)
      const sortedTodos = userTodos.sort((a, b) => a.order - b.order);
      const recent = sortedTodos.slice(0, 5);

      // Get recent users (first 5 by ID)
      const sortedUsers = users.sort((a, b) => a.id - b.id).slice(0, 5);

      setStats({
        totalTodos: userTodos.length,
        totalUsers: users.length,
        overdueTodos: userOverdueTodos.length,
        dataStatus
      });
      
      setRecentTodos(recent);
      setRecentUsers(sortedUsers);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInitializeData = async () => {
    try {
      await dataApi.initialize();
      loadDashboardData();
      setError(null);
    } catch (err) {
      setError('Failed to initialize data: ' + err.message);
    }
  };

  const handleResetData = async () => {
    if (!window.confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
      return;
    }

    try {
      await dataApi.reset();
      loadDashboardData();
      setError(null);
    } catch (err) {
      setError('Failed to reset data: ' + err.message);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Dashboard for {selectedUser.name}</h2>
        <div className="dashboard-actions">
          <button className="btn btn-secondary" onClick={handleInitializeData}>
            Initialize Data
          </button>
          <button className="btn btn-danger" onClick={handleResetData}>
            Reset Data
          </button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>{stats.totalTodos}</h3>
            <p>My Todos</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>{stats.overdueTodos}</h3>
            <p>My Overdue Todos</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">💾</div>
          <div className="stat-content">
            <h3>{stats.dataStatus ? 'Active' : 'Inactive'}</h3>
            <p>Data Store</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <h3>My Recent Todos (by Order)</h3>
          <div className="recent-list">
            {recentTodos.map(todo => (
              <div key={todo.id} className="recent-item">
                <div className="recent-item-content">
                  <h4>{todo.description}</h4>
                  <p>Order: {todo.order} • Created: {formatDate(todo.createdOn)}</p>
                  {todo.dueDate && (
                    <p className="due-date">Due: {formatDate(todo.dueDate)}</p>
                  )}
                </div>
              </div>
            ))}
            {recentTodos.length === 0 && (
              <p className="no-data">No todos found for {selectedUser.name}</p>
            )}
          </div>
        </div>

        <div className="dashboard-section">
          <h3>Recent Users (by ID)</h3>
          <div className="recent-list">
            {recentUsers.map(user => (
              <div key={user.id} className="recent-item">
                <div className="recent-item-content">
                  <h4>{user.name}</h4>
                  <p>{user.email}</p>
                  <p>ID: {user.id}</p>
                </div>
              </div>
            ))}
            {recentUsers.length === 0 && (
              <p className="no-data">No users found</p>
            )}
          </div>
        </div>
      </div>

      <div className="data-info">
        <h3>Data Store Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <strong>Status:</strong> {stats.dataStatus ? 'Active' : 'Inactive'}
          </div>
          <div className="info-item">
            <strong>My Todos:</strong> {stats.totalTodos}
          </div>
          <div className="info-item">
            <strong>My Overdue Items:</strong> {stats.overdueTodos}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 