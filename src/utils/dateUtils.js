// Format date for display
export const formatDate = (dateString) => {
  if (!dateString) return 'Not set';
  return new Date(dateString).toLocaleDateString();
};

// Check if todo is overdue (day after due date)
export const isOverdue = (todo) => {
  if (!todo.dueDate) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dueDate = new Date(todo.dueDate);
  dueDate.setHours(0, 0, 0, 0);
  
  return today > dueDate;
};

// Normalize date to start of day for comparison
export const normalizeDate = (dateString) => {
  const date = new Date(dateString);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

// Get user name by ID
export const getUserName = (userId, users) => {
  const user = users.find(u => u.id === userId);
  return user ? user.name : 'Unknown User';
}; 