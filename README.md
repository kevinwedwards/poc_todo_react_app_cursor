# Todo Management App

A modern React application for managing users and todo items, built with a beautiful UI and connected to a REST API.

## Features

- **Dashboard**: Overview with statistics and recent items
- **User Management**: Create, read, update, and delete users
- **Todo Management**: Create, read, update, and delete todo items
- **Advanced Filtering**: Filter todos by overdue status or by user
- **Search Functionality**: Search users by name
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Beautiful gradient design with smooth animations

## API Integration

The app connects to a REST API at `http://localhost:5025` with the following endpoints:

### Users
- `GET /api/Users` - Get all users
- `POST /api/Users` - Create a new user
- `PUT /api/Users/{id}` - Update a user
- `DELETE /api/Users/{id}` - Delete a user
- `GET /api/Users/search?searchTerm={term}` - Search users

### Todos
- `GET /api/Todos` - Get all todos
- `POST /api/Todos` - Create a new todo
- `PUT /api/Todos/{id}` - Update a todo
- `DELETE /api/Todos/{id}` - Delete a todo
- `GET /api/Todos/overdue` - Get overdue todos
- `GET /api/Todos/user/{userId}` - Get todos by user

### Data Management
- `GET /api/Data/status` - Get data store status
- `POST /api/Data/reset` - Reset data store
- `POST /api/Data/initialize` - Initialize sample data

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Development Server**
   ```bash
   npm start
   ```

3. **Ensure API is Running**
   Make sure your API server is running at `http://localhost:5025`

## Usage

### Dashboard
- View system statistics (total todos, users, overdue items)
- See recent todos and users
- Initialize or reset the data store

### Users Page
- View all users in a card layout
- Search users by name
- Create new users with name and email
- Edit existing user information
- Delete users

### Todos Page
- View all todo items with filtering options
- Filter by: All todos, Overdue todos, or By specific user
- Create new todos with description, order, assigned user, and dates
- Edit existing todo information
- Delete todos
- Visual indicators for overdue items

## Project Structure

```
src/
├── components/
│   ├── Dashboard.js          # Dashboard overview component
│   ├── Dashboard.css         # Dashboard styles
│   ├── UserList.js           # User management component
│   ├── UserList.css          # User list styles
│   ├── TodoList.js           # Todo management component
│   └── TodoList.css          # Todo list styles
├── services/
│   └── api.js               # API service functions
├── styles/
│   └── App.css              # Global styles and utilities
├── App.js                   # Main app component with routing
└── index.js                 # App entry point
```

## Dependencies

- **React**: UI library
- **React Router DOM**: Client-side routing
- **React Scripts**: Build tools and development server

## API Data Models

### User
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Todo
```json
{
  "id": 1,
  "description": "Complete project documentation",
  "order": 1,
  "createdByUserId": 1,
  "createdOn": "2024-01-15T10:30:00Z",
  "plannedDate": "2024-01-20T00:00:00Z",
  "dueDate": "2024-01-25T00:00:00Z"
}
```

## Development

The app uses modern React patterns including:
- Functional components with hooks
- Async/await for API calls
- CSS modules for styling
- Responsive design principles
- Error handling and loading states

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

1. **API Connection Issues**: Ensure the API server is running at `http://localhost:5025`
2. **CORS Issues**: The API should allow requests from `http://localhost:3000`
3. **Missing Dependencies**: Run `npm install` to install all required packages

## License

This project is for demonstration purposes.
