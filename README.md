<img width="1920" height="1080" alt="Screenshot 2026-01-11 115118" src="https://github.com/user-attachments/assets/ae2db342-866b-4b92-ae3c-0e13e7d5f478" /><img width="1920" height="1080" alt="Screenshot 2026-01-11 114946" src="https://github.com/user-attachments/assets/e1511474-72ed-45d8-8ca6-382680acc463" /># Roxiler Systems Store Ratings Application

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
- Input validation and sanitization<img width="1920" height="1080" alt="Screenshot 2026-01-11 121032" src="https://github.com/user-attachments/assets/4be91c64-5cfc-469c-ab38-c24e020360c8" />
<img width="1920" height="1080" alt="Screenshot 2026-01-11 121032" src="https://github.com/user-attachments/assets/d097940f-3ef0-4ab9-a09b-41b69ba7cc5a" />

- CORS enabled for frontend-backend communication

## Deployment
<img width="1920" height="1080" alt="Screenshot 2026-01-11 121044" src="https://github.com/user-attachments/assets/aebdf2fd-3f54-4873-81ed-9ff6e37c5337" />

For production deployment:
- Set environment variables for JWT secret
- Use a production database
- Enable HTTPS
- Configure proper CORS origins

## ScreenShots <img width="1920" height="1080" alt="Screenshot 2026-01-11 121004" src="https://github.com/user-attachments/assets/ad4b8fb9-33e7-447c-903f-fc54193a4127" />

<img width="1920" height="1080" alt="Screenshot 2026-01-11 121032" src="https://github.com/user-attachments/assets/300c4258-86d7-44fd-b1fb-dfd23e8119d9" />

<img width="1920" height="1080" alt="Screenshot 2026-01-11 121044" src="http<img width="1920" height="1080" alt="Screenshot 2026-01-11 120628" src="https://github.com/user-attachments/assets/b035c988-1ac5-4a03-b8c2-6d14487bce83" />![Uploading <img width="1920" height="1080" alt="Screenshot 2026-01-11 114946" src="https://github.com/user-attachments/assets/ba2cb2ef-3d22-4b51-b1d3-530109f34901" />
<img width="1920" height="1080" alt="Screenshot 2026-01-11 114946" src="https://github.com/user-attachments/assets/aaa329a0-a73a-40ce-b007-88738869bb51" />
<img width="1920" height="1080" alt="Screenshot 2026-01-11 114946" src="https://github.com/user-attachments/assets/2ec35927-9e5a-4fb2-86b2-4d5e736fd50f" />
<img width="1920" height="1080" alt="Screenshot 2026-01-11 114946" src="https://github.com/user-attachments/assets/52af2095-2c9d-44d5-8ed5-37d067cab0cf" />
<img width="1920" height="1080" alt="Screenshot 2026-01-11 115118" src="https://github.com/user-attachments/assets/2f3b4bdc-0636-45ee-b6a9-25f7513586a8" />
Screenshot 2026-01-11 115118.png…]()

s://github.com/user-attachments/assets/4d9a868d-<img width="1920" height="1080" alt="Screenshot 2026-01-11 120857" src="https://github.com<img width="1920" height="1080" alt="Screenshot 2026-01-11 115118" src="https://github.com/user-attachments/assets/d26386aa-df9a-45c7-abc7-a2ff5afdc519" />
<img width="1920" height="1080" alt="Screenshot 2026-01-11<img width="1920" height="1080" alt="Screenshot 2026-01-11 115118" src="https://github.com/user-attachments/assets/50c997df-a259-4737-b508-0677dcc2a559" />
<img width="1920" height="1080" alt="Screenshot 2026-01-11 120628" src="https://github.com/user-attachments/assets/85a688b1-985e-43b3-9ed4-f7ad1495d00f" />
<img width="1920" height="1080" alt="Screenshot 2026-01-11 120628" src="https://github.com/user-attachments/assets/84f10c3d-9c06-40aa-a8fa-c0e2eb39047d" />
<img width="1920" height="1080" alt="Screenshot 2026-01-11 120857" src="https://github.com/user-attachments/assets/9b290070-ad25-4583-8b44-92c98247c238" />
<img width="1920" height="1080" alt="Screenshot 2026-01-11 120857" src="https://github.com/user-attachments/assets/3761e1db-55e0-401f-94f2-59d3b5425bf7" />
<img width="1920" height="1080" alt="Screenshot 2026-01-11 120857" src="https://github.com/user-attachments/assets/df7db114-f3fd-4dc9-a297-5791bb11f72d" />
<img width="1920" height="1080" alt="Screenshot 2026-01-11 121004" src="https://github.com/user-attachments/assets/d99448d3-cf7c-46f2-b9c3-36af3d8c9980" />
<img width="1920" height="1080" alt="Screenshot 2026-01-11 121004" src="https://github.com/user-attachments/assets/f24cb3eb-ce84-46f7-9f2b-d0cf187e0824" />
<img width="1920" height="1080" alt="Screenshot 2026-01-11 121004" src="https://github.com/user-attachments/assets/d8206f8b-68a1-49e8-88b1-41d6af6ed50a" />
<img width="1920" height="1080" alt="Screenshot 2026-01-11 121004" src="https://github.com/user-attachments/assets/4949c8eb-c761-4e9f-a9f6-37c1ff42c4f5" />
<img width="1920" height="1080" alt="Screenshot 2026-01-11 121032" src="https://github.com/user-attachments/assets/7e585aac-aa31-460f-8059-53e84a86fa01" />
<img width="1920" height="1080" alt="Screenshot 2026-01-11 121032" src="https://github.com/user-attachments/assets/3c98f2d2-6283-49fd-bd43-b88006bf7e83" />
<img width="1920" height="1080" alt="Screenshot 2026-01-11 121032" src="https://github.com/user-attachments/assets/f440d138-e89e-464d-b29f-4df263a3d2bd" />
<img width="1920" height="1080" alt="Screenshot 2026-01-11 121032" src="https://github.com/user-attachments/assets/7e590d1e-77dd-42f4-863a-61a9c9d8254d" />
![Uploading Screenshot 2026-01-11 121032.png…]()
<img width="1920" height="1080" alt="Screenshot 2026-01-11 121044" src="https://github.com/user-attachments/assets/b4cb8e40-5685-4162-8d76-2b49b9eab823" />
<img width="1920" height="1080" alt="Screenshot 2026-01-11 121044" src="https://github.com/user-attachments/assets/5b41074f-aa29-4df1-98a8-eb8950745c3b" />
<img width="1920" height="1080" alt="Screenshot 2026-01-11 121044" src="https://github.com/user-attachments/assets/aff3c1b4-0823-4940-a158-6c6df74abf33" />
<img width="1920" height="1080" alt="Screenshot 2026-01-11 121044" src="https://github.com/user-attachments/assets/ebe0df82-39a6-4e71-a885-0d6962aaf3bf" />
<img width="1920" height="1080" alt="Screenshot 2026-01-11 121044" src="https://github.com/user-attachments/assets/abc7d1d5-8946-40b4-9078-6a880cdeadf2" />
<img width="1920" height="1080" alt="Screenshot 2026-01-11 114946" src="https://github.com/user-attachments/assets/5cd7211f-30f5-4bcd-be9b-b210295d6edd" />
 115118" src="https://github.com/user-attachments/assets/dfe521aa-5a40-4ea4-8e46-356d85716edc" />
<img width="1920" height="1080" alt="Screenshot 2026-01-11 120628" src="https://github.com/user-attachments/assets/2b30d31e-b47e-4009-818f-256f8a83dfff" />
<img width="1920" height="1080" alt="Screenshot 2026-01-11 120628" src="https://github.com/user-attachments/assets/95af2aac-511d-49a8-b0ae-32c16f23df39" />
<img width="1920" height="1080" alt="Screenshot 2026-01-11 121044" src="https://github.com/user-attachments/assets/aee425a3-556f-47b4-9c90-315db04bd90f" />
/user-attachments/assets/c117c420-e158-4ab8-9afd-65b26290f135" />
<img width="1920" height="1080" alt="Screenshot 2026-01-11 12085<img width="1920" height="1080" alt="Screenshot 2026-01-11 120857" src="https://github.com/user-attachments/assets/d170fdcd-02e3-4d89-bf95-a7e2809b386f" />![Uploading Screenshot 20<img width="1920" height="1080" alt="Screenshot 2026-01-11 120857" src="https://github.com/user-attachments/assets/be121d22-c5cc-4256-b681-04cf33b5f822" />
26-01-11 114946.png…]()

7" src="https://github.com/user-attachments/assets/1b590c26-d8b3-4897-8c4e-4a768567c751" />
<img width="1920" height="1080" alt="Screenshot 2026-01-11 121004" src="https://github.com/user-attachments/asse<img width="1920" height="1080" alt="Screenshot 2026-01-11 114946" src="https://github.com/user-attachments/assets/b4480498-ecca-4cf1-83d8-1bc8b82b667e" />
<img width="1920" height="1080" alt="Screenshot 2026-01-11 115118" src="https://github.com/user-attachments/assets/ea461000-08e8-4ecf-a124-47fe1c09da60" />
<img width="1920" height="1080" alt="Screenshot 2026-01-11 115118" src="https://github.com/user-attachments/assets/16490455-d762-4afd-b43b-d161fba9db83" />
<img width="1920" height="1080" alt="Screenshot 2026-01-11 121004" src="https://github.com/user-attachments/assets/040fa584-7481-4551-8f99-d046ae598785" />
ts/b2168fbd-cd50-430a-9ee5-0c5c20405d9f" />
![Uploading Screenshot 2026-01-11 121032.png…]()
2e9a-412b-b6bf-c<img width="1920" height="1080" alt="Screenshot 2026-01-11 120628" src="https://github.com/user-attachments/assets/20d2f007-90a7-44c9-9383-8f84738578eb" />
7e9974f<img width="1920" height="1080" alt="Screenshot 2026-01-11 120628" src="https://github.com/user-attachments/assets/81e27039-8b76-494f-8c38-e618e6b52259" />
d594" />
