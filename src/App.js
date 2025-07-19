import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import UserList from './components/UserList';
import TodoList from './components/TodoList';
import UserSelection from './components/UserSelection';
import './styles/App.css';

const Navigation = ({ selectedUser, onUserChange }) => {
  const location = useLocation();
  
  return (
    <nav className="nav">
      <div className="nav-left">
        <h1>Todo Management App</h1>
        {selectedUser && (
          <div className="selected-user">
            <span className="user-avatar-small">
              {selectedUser.name.charAt(0).toUpperCase()}
            </span>
            <span className="user-name">{selectedUser.name}</span>
            <button 
              className="btn btn-small btn-secondary"
              onClick={onUserChange}
            >
              Change User
            </button>
          </div>
        )}
      </div>
      <div className="nav-links">
        <Link 
          to="/" 
          className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
        >
          Dashboard
        </Link>
        <Link 
          to="/users" 
          className={`nav-link ${location.pathname === '/users' ? 'active' : ''}`}
        >
          Users
        </Link>
        <Link 
          to="/todos" 
          className={`nav-link ${location.pathname === '/todos' ? 'active' : ''}`}
        >
          Todos
        </Link>
      </div>
    </nav>
  );
};

function App() {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    // Store selected user in localStorage for persistence
    localStorage.setItem('selectedUser', JSON.stringify(user));
  };

  const handleUserChange = () => {
    setSelectedUser(null);
    localStorage.removeItem('selectedUser');
  };

  // Check for stored user on app load
  React.useEffect(() => {
    const storedUser = localStorage.getItem('selectedUser');
    if (storedUser) {
      try {
        setSelectedUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('selectedUser');
      }
    }
  }, []);

  // Show user selection if no user is selected
  if (!selectedUser) {
    return (
      <Router>
        <UserSelection onUserSelect={handleUserSelect} />
      </Router>
    );
  }

  return (
    <Router>
      <div className="app">
        <Navigation selectedUser={selectedUser} onUserChange={handleUserChange} />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard selectedUser={selectedUser} />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/todos" element={<TodoList selectedUser={selectedUser} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
