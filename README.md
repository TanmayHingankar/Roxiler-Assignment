# Roxiler Systems Store Ratings Application

A full-stack web application for managing store ratings with role-based access control.

## Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: SQLite
- **Frontend**: React.js with Ant Design
- **Authentication**: JWT

## Features

### Roles
- **Admin**: Manage users and stores, view statistics
- **User**: View stores, submit and update ratings
- **Owner**: View ratings for their stores

### Functionality
- User registration and login
- Store management (Admin)
- Rating submission (Users)
- Dashboard views for each role

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   npm start
   ```
   The server will run on http://localhost:5000

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
   The app will open at http://localhost:3000

## Database

The application uses SQLite database (`database.db`) which is created automatically on first run.

### Tables
- Users: Stores user information
- Stores: Registered stores
- Ratings: User ratings for stores

## API Endpoints

### Authentication
- POST `/api/auth/signup` - User registration
- POST `/api/auth/login` - User login
- PATCH `/api/auth/update-password` - Update password

### Admin
- GET `/api/admin/dashboard` - Dashboard statistics
- GET `/api/admin/stores` - List stores
- POST `/api/admin/stores` - Create store
- GET `/api/admin/users` - List users
- POST `/api/admin/users` - Create user
- GET `/api/admin/users/:id` - User details

### User
- GET `/api/user/stores` - List stores with ratings
- POST `/api/user/ratings` - Submit rating
- PATCH `/api/user/ratings/:storeId` - Update rating

### Owner
- GET `/api/owner/dashboard` - View ratings and raters

## Usage

1. Start both backend and frontend servers
2. Register a new user account
3. Login with your credentials
4. Access role-specific dashboard

## Validation Rules

- Name: 20-60 characters, alphanumeric + spaces
- Email: Valid email format
- Password: 8-16 characters, must contain uppercase and special character
- Address: Max 400 characters
- Rating: 1-5 stars

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Input validation and sanitization
- CORS enabled for frontend-backend communication

## Deployment

For production deployment:
- Set environment variables for JWT secret
- Use a production database
- Enable HTTPS
- Configure proper CORS origins