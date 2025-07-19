import React, { useState, useEffect } from 'react';
import { todoApi, userApi } from '../services/api';
import TodoItem from './TodoItem';
import TodoFilters from './TodoFilters';
import TodoModal from './TodoModal';
import { formatDate, isOverdue, getUserName } from '../utils/dateUtils';
import './TodoList.css';

const TodoList = ({ selectedUser }) => {
  const [todos, setTodos] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [filter, setFilter] = useState('user');
  const [selectedUserId, setSelectedUserId] = useState('');

  useEffect(() => {
    if (selectedUser) {
      setSelectedUserId(selectedUser.id.toString());
      loadData();
    }
  }, [selectedUser]);

  useEffect(() => {
    if (!loading && selectedUser) {
      loadFilteredTodos();
    }
  }, [filter, selectedUserId, selectedUser]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [todosData, usersData] = await Promise.all([
        todoApi.getAll(),
        userApi.getAll()
      ]);
      // Sort todos by order field
      const sortedTodos = todosData.sort((a, b) => a.order - b.order);
      setTodos(sortedTodos);
      setUsers(usersData);
      setError(null);
    } catch (err) {
      setError('Failed to load data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadFilteredTodos = async () => {
    try {
      setLoading(true);
      let data;
      
      switch (filter) {
        case 'overdue':
          // Get overdue todos for the selected user
          const allTodos = await todoApi.getAll();
          const overdueTodos = allTodos.filter(todo => 
            todo.createdByUserId === selectedUser.id && isOverdue(todo)
          );
          data = overdueTodos;
          break;
        case 'user':
          // Get todos for the selected user
          data = await todoApi.getByUser(selectedUser.id);
          break;
        default:
          // Get all todos for the selected user
          const allUserTodos = await todoApi.getAll();
          data = allUserTodos.filter(todo => todo.createdByUserId === selectedUser.id);
      }
      
      // Sort todos by order field
      const sortedData = data.sort((a, b) => a.order - b.order);
      setTodos(sortedData);
      setError(null);
    } catch (err) {
      setError('Failed to load todos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (todoId) => {
    if (!window.confirm('Are you sure you want to delete this todo?')) {
      return;
    }

    try {
      await todoApi.delete(todoId);
      setTodos(todos.filter(todo => todo.id !== todoId));
      setError(null);
    } catch (err) {
      setError('Failed to delete todo: ' + err.message);
    }
  };

  const handleCreate = async (todoData) => {
    try {
      // Ensure the todo is created for the selected user
      const todoDataWithUser = {
        ...todoData,
        createdByUserId: selectedUser.id
      };
      const newTodo = await todoApi.create(todoDataWithUser);
      // Add new todo and sort by order
      const updatedTodos = [...todos, newTodo].sort((a, b) => a.order - b.order);
      setTodos(updatedTodos);
      setShowCreateModal(false);
      setError(null);
    } catch (err) {
      setError('Failed to create todo: ' + err.message);
    }
  };

  const handleUpdate = async (todoId, todoData) => {
    try {
      // Ensure the todo remains assigned to the selected user
      const todoDataWithUser = {
        ...todoData,
        createdByUserId: selectedUser.id
      };
      const updatedTodo = await todoApi.update(todoId, todoDataWithUser);
      // Update todo and sort by order
      const updatedTodos = todos.map(todo => todo.id === todoId ? updatedTodo : todo)
        .sort((a, b) => a.order - b.order);
      setTodos(updatedTodos);
      setEditingTodo(null);
      setError(null);
    } catch (err) {
      setError('Failed to update todo: ' + err.message);
    }
  };

  if (loading) {
    return <div className="loading">Loading todos...</div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Todo Items for {selectedUser.name}</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          Add Todo
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <TodoFilters 
        filter={filter}
        setFilter={setFilter}
        selectedUserId={selectedUserId}
        setSelectedUserId={setSelectedUserId}
        users={users}
        selectedUser={selectedUser}
      />

      <div className="todos-list">
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            users={users}
            onEdit={setEditingTodo}
            onDelete={handleDelete}
            isOverdue={isOverdue}
            formatDate={formatDate}
            getUserName={(userId) => getUserName(userId, users)}
          />
        ))}
      </div>

      {todos.length === 0 && !loading && (
        <div className="text-center">
          <p>No todos found for {selectedUser.name}.</p>
        </div>
      )}

      {showCreateModal && (
        <TodoModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreate}
          title="Create New Todo"
          users={users}
          selectedUser={selectedUser}
        />
      )}

      {editingTodo && (
        <TodoModal
          onClose={() => setEditingTodo(null)}
          onSubmit={(todoData) => handleUpdate(editingTodo.id, todoData)}
          title="Edit Todo"
          todo={editingTodo}
          users={users}
          selectedUser={selectedUser}
        />
      )}
    </div>
  );
};

export default TodoList; 