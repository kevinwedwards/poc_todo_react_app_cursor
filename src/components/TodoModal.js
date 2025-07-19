import React, { useState } from 'react';

const TodoModal = ({ onClose, onSubmit, title, todo = null, users, selectedUser }) => {
  const [formData, setFormData] = useState({
    description: todo?.description || '',
    order: todo?.order || 1,
    createdByUserId: todo?.createdByUserId || selectedUser?.id || (users.length > 0 ? users[0].id : ''),
    plannedDate: todo?.plannedDate ? todo.plannedDate.split('T')[0] : '',
    dueDate: todo?.dueDate ? todo.dueDate.split('T')[0] : ''
  });

  const [validationErrors, setValidationErrors] = useState({});

  // Get the created date for validation, corrected for timezone
  const getCreatedDate = () => {
    if (todo?.createdOn) {
      const createdDate = new Date(todo.createdOn);
      return createdDate.toISOString().split('T')[0];
    }
    return new Date().toISOString().split('T')[0];
  };

  const createdDate = getCreatedDate();
  const minDate = createdDate;

  const validateDates = () => {
    const errors = {};
    
    if (formData.plannedDate && formData.dueDate) {
      const planned = new Date(formData.plannedDate + 'T12:00:00');
      const due = new Date(formData.dueDate + 'T12:00:00');
      const created = new Date(createdDate + 'T12:00:00');
      
      // Normalize dates to start of day for comparison
      planned.setHours(0, 0, 0, 0);
      due.setHours(0, 0, 0, 0);
      created.setHours(0, 0, 0, 0);
      
      if (planned > due) {
        errors.plannedDate = 'Planned date must be on or before due date';
      }
      
      if (planned < created) {
        errors.plannedDate = 'Planned date must be on or after created date';
      }
      
      if (due < created) {
        errors.dueDate = 'Due date must be on or after created date';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateDates()) {
      return;
    }
    
    const submitData = {
      ...formData,
      order: parseInt(formData.order),
      createdByUserId: parseInt(formData.createdByUserId),
      plannedDate: formData.plannedDate || null,
      dueDate: formData.dueDate || null
    };

    if (submitData.plannedDate) {
      const plannedDate = new Date(submitData.plannedDate + 'T12:00:00');
      submitData.plannedDate = plannedDate.toISOString();
    }
    if (submitData.dueDate) {
      const dueDate = new Date(submitData.dueDate + 'T12:00:00');
      submitData.dueDate = dueDate.toISOString();
    }

    onSubmit(submitData);
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
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
              maxLength={500}
              rows={3}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="order">Order</label>
            <input
              type="number"
              id="order"
              value={formData.order}
              onChange={(e) => setFormData({...formData, order: e.target.value})}
              required
              min="1"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="createdByUserId">Created By</label>
            <select
              id="createdByUserId"
              value={formData.createdByUserId}
              onChange={(e) => setFormData({...formData, createdByUserId: e.target.value})}
              required
            >
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} {user.id === selectedUser?.id ? '(You)' : ''}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="plannedDate">Planned Date</label>
            <input
              type="date"
              id="plannedDate"
              value={formData.plannedDate}
              onChange={(e) => setFormData({...formData, plannedDate: e.target.value})}
              min={minDate}
            />
            {validationErrors.plannedDate && (
              <span className="validation-error">{validationErrors.plannedDate}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>
            <input
              type="date"
              id="dueDate"
              value={formData.dueDate}
              onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
              min={minDate}
            />
            {validationErrors.dueDate && (
              <span className="validation-error">{validationErrors.dueDate}</span>
            )}
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {todo ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoModal; 