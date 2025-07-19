const TodoItem = ({ todo, users, onEdit, onDelete, isOverdue, formatDate, getUserName }) => {
  return (
    <div className={`todo-item ${isOverdue(todo) ? 'overdue' : ''}`}>
      <div className="todo-header">
        <div className="todo-info">
          <h3 className="todo-title">{todo.description}</h3>
          <div className="todo-meta">
            <span className="todo-order">Order: {todo.order}</span>
            <span className="todo-user">By: {getUserName(todo.createdByUserId)}</span>
            {isOverdue(todo) && (
              <span className="badge badge-overdue">Overdue</span>
            )}
          </div>
        </div>
        <div className="todo-actions">
          <button 
            className="btn btn-small btn-secondary"
            onClick={() => onEdit(todo)}
          >
            Edit
          </button>
          <button 
            className="btn btn-small btn-danger"
            onClick={() => onDelete(todo.id)}
          >
            Delete
          </button>
        </div>
      </div>
      
      <div className="todo-details">
        <div className="todo-dates">
          <p><strong>Created:</strong> {formatDate(todo.createdOn)}</p>
          <p><strong>Planned:</strong> {formatDate(todo.plannedDate)}</p>
          <p><strong>Due:</strong> {formatDate(todo.dueDate)}</p>
        </div>
      </div>
    </div>
  );
};

export default TodoItem; 