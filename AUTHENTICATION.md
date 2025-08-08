# Authentication System

The Real Estate Investment Tool now includes a comprehensive authentication system with user registration, login, and session management.

## Features

### Backend Authentication
- **Secure password hashing** using bcrypt
- **JWT token-based authentication** with access and refresh tokens
- **Account security** with login attempt limits and account locking
- **User profile management** with update capabilities
- **Password strength validation** and secure password changes
- **Demo account** for easy testing

### Frontend Authentication
- **React Authentication Context** for state management
- **Protected routes** that require authentication
- **Auto token refresh** to maintain sessions
- **Login/Register forms** with validation
- **User profile integration** in the layout
- **Responsive design** for all screen sizes

## Demo Account

For testing purposes, a demo account is automatically created:
- **Username**: `demo`
- **Password**: `Demo123!`
- **Email**: `demo@realestate.com`

## API Endpoints

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user info
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password

### Protected Endpoints
All existing API endpoints now require authentication:
- Dashboard statistics
- Property research
- Deal management
- Developer network
- Offer calculator

## Security Features

### Password Requirements
- Minimum 8 characters
- Must contain uppercase letter
- Must contain lowercase letter
- Must contain number
- Must contain special character

### Account Protection
- Failed login attempts are tracked
- Account locked for 30 minutes after 5 failed attempts
- JWT tokens expire after 24 hours (access) and 30 days (refresh)
- Automatic token refresh for seamless user experience

### Data Security
- Passwords are hashed using bcrypt with salt
- JWT tokens are signed with secret keys
- CORS configured for frontend security
- User sessions are tracked and managed

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP
);
```

### User Sessions Table
```sql
CREATE TABLE user_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    session_token TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    ip_address TEXT,
    user_agent TEXT,
    FOREIGN KEY (user_id) REFERENCES users (id)
);
```

## Setup Instructions

### Backend Setup
1. Install required packages:
   ```bash
   pip install flask-jwt-extended bcrypt
   ```

2. The user authentication system is automatically initialized when the Flask app starts

3. A demo user is created on first run

### Frontend Setup
1. The authentication context is already integrated into the React app

2. Protected routes automatically redirect to login if not authenticated

3. Login/Register pages are available at `/login` and `/register`

## Usage Flow

### New User Registration
1. User visits `/register`
2. Fills out registration form with validation
3. Account is created and user is automatically logged in
4. JWT tokens are stored in localStorage
5. User is redirected to dashboard

### User Login
1. User visits `/login`
2. Enters username/email and password
3. Backend validates credentials
4. JWT tokens are returned and stored
5. User is redirected to dashboard

### Session Management
1. Access tokens are automatically included in API requests
2. When access token expires, refresh token is used automatically
3. If refresh fails, user is redirected to login
4. Users can logout to clear all tokens

### Password Security
1. Registration form shows password strength indicator
2. Password must meet complexity requirements
3. Failed login attempts are tracked and reported
4. Account locking prevents brute force attacks

## Development Notes

- JWT tokens are stored in localStorage for persistence
- All API calls automatically include authentication headers
- Token refresh happens transparently in the background
- Error handling provides user-friendly messages
- Demo account allows immediate testing without registration

## Production Considerations

Before deploying to production:

1. **Change Secret Keys**: Update JWT and Flask secret keys in `web/app.py`
2. **Environment Variables**: Move secrets to environment variables
3. **HTTPS**: Ensure all authentication happens over HTTPS
4. **Database Security**: Use proper database permissions
5. **Rate Limiting**: Add rate limiting to prevent abuse
6. **Monitoring**: Log authentication events for security monitoring
