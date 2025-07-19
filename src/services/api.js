const API_BASE_URL = '/api';

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    // Handle empty responses (like DELETE requests)
    if (response.status === 204) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the API server. Please ensure the server is running at http://localhost:5025');
    }
    throw error;
  }
};

// User API functions
export const userApi = {
  getAll: () => apiRequest('/Users'),
  getById: (id) => apiRequest(`/Users/${id}`),
  getByEmail: (email) => apiRequest(`/Users/email/${email}`),
  search: (searchTerm) => apiRequest(`/Users/search?searchTerm=${encodeURIComponent(searchTerm)}`),
  create: (userData) => apiRequest('/Users', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  update: (id, userData) => apiRequest(`/Users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
  delete: (id) => apiRequest(`/Users/${id}`, {
    method: 'DELETE',
  }),
};

// Todo API functions
export const todoApi = {
  getAll: () => apiRequest('/Todos'),
  getById: (id) => apiRequest(`/Todos/${id}`),
  getByUser: (userId) => apiRequest(`/Todos/user/${userId}`),
  getOverdue: () => apiRequest('/Todos/overdue'),
  getByDateRange: (startDate, endDate) => 
    apiRequest(`/Todos/daterange?startDate=${startDate}&endDate=${endDate}`),
  create: (todoData) => apiRequest('/Todos', {
    method: 'POST',
    body: JSON.stringify(todoData),
  }),
  update: (id, todoData) => apiRequest(`/Todos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(todoData),
  }),
  delete: (id) => apiRequest(`/Todos/${id}`, {
    method: 'DELETE',
  }),
};

// Data management API functions
export const dataApi = {
  getStatus: () => apiRequest('/Data/status'),
  getSummary: () => apiRequest('/Data/summary'),
  reset: () => apiRequest('/Data/reset', { method: 'POST' }),
  initialize: () => apiRequest('/Data/initialize', { method: 'POST' }),
}; 