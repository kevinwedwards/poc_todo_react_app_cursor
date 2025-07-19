//import React from 'react';

const TodoFilters = ({ filter, setFilter, selectedUserId, setSelectedUserId, users, selectedUser }) => {
  return (
    <div className="filters-section">
      <div className="filter-controls">
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="user">All My Todos</option>
          <option value="overdue">My Overdue Todos</option>
        </select>
        
        <div className="current-user-info">
          <span className="user-avatar-small">
            {selectedUser.name.charAt(0).toUpperCase()}
          </span>
          <span className="user-name">{selectedUser.name}</span>
        </div>
      </div>
    </div>
  );
};

export default TodoFilters; 