"""
User authentication and management module for Real Estate Investment Tool.
Handles user registration, login, and session management.
"""

import sqlite3
import bcrypt
import re
from datetime import datetime, timedelta
from pathlib import Path
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class UserManager:
    """Manages user authentication and registration for the application."""
    
    def __init__(self, db_path='data/users.db'):
        """
        Initialize UserManager with database connection.
        
        Args:
            db_path (str): Path to the SQLite database file
        """
        self.db_path = Path(db_path)
        self.db_path.parent.mkdir(exist_ok=True)
        self._init_database()
    
    def _init_database(self):
        """Initialize the users database with required tables."""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                # Create users table
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS users (
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
                    )
                ''')
                
                # Create user sessions table for tracking active sessions
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS user_sessions (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id INTEGER NOT NULL,
                        session_token TEXT UNIQUE NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        expires_at TIMESTAMP NOT NULL,
                        is_active BOOLEAN DEFAULT TRUE,
                        ip_address TEXT,
                        user_agent TEXT,
                        FOREIGN KEY (user_id) REFERENCES users (id)
                    )
                ''')
                
                conn.commit()
                logger.info("User database initialized successfully")
                
        except Exception as e:
            logger.error(f"Error initializing user database: {str(e)}")
            raise
    
    def validate_email(self, email):
        """
        Validate email format.
        
        Args:
            email (str): Email address to validate
            
        Returns:
            bool: True if email is valid, False otherwise
        """
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    def validate_password(self, password):
        """
        Validate password strength.
        
        Args:
            password (str): Password to validate
            
        Returns:
            tuple: (is_valid, error_message)
        """
        if len(password) < 8:
            return False, "Password must be at least 8 characters long"
        
        if not re.search(r'[A-Z]', password):
            return False, "Password must contain at least one uppercase letter"
        
        if not re.search(r'[a-z]', password):
            return False, "Password must contain at least one lowercase letter"
        
        if not re.search(r'\d', password):
            return False, "Password must contain at least one number"
        
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            return False, "Password must contain at least one special character"
        
        return True, ""
    
    def hash_password(self, password):
        """
        Hash a password using bcrypt.
        
        Args:
            password (str): Plain text password
            
        Returns:
            str: Hashed password
        """
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    
    def verify_password(self, password, hashed_password):
        """
        Verify a password against its hash.
        
        Args:
            password (str): Plain text password
            hashed_password (str): Hashed password
            
        Returns:
            bool: True if password matches, False otherwise
        """
        return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))
    
    def register_user(self, username, email, password, first_name="", last_name=""):
        """
        Register a new user.
        
        Args:
            username (str): Unique username
            email (str): User's email address
            password (str): Plain text password
            first_name (str): User's first name
            last_name (str): User's last name
            
        Returns:
            dict: Result with success status and user info or error message
        """
        try:
            # Validate input
            if not username or len(username) < 3:
                return {"success": False, "error": "Username must be at least 3 characters long"}
            
            if not self.validate_email(email):
                return {"success": False, "error": "Invalid email format"}
            
            is_valid_password, password_error = self.validate_password(password)
            if not is_valid_password:
                return {"success": False, "error": password_error}
            
            # Hash password
            password_hash = self.hash_password(password)
            
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                # Check if username or email already exists
                cursor.execute('SELECT id FROM users WHERE username = ? OR email = ?', (username, email))
                if cursor.fetchone():
                    return {"success": False, "error": "Username or email already exists"}
                
                # Insert new user
                cursor.execute('''
                    INSERT INTO users (username, email, password_hash, first_name, last_name)
                    VALUES (?, ?, ?, ?, ?)
                ''', (username, email, password_hash, first_name, last_name))
                
                user_id = cursor.lastrowid
                conn.commit()
                
                logger.info(f"User registered successfully: {username} (ID: {user_id})")
                return {
                    "success": True,
                    "user": {
                        "id": user_id,
                        "username": username,
                        "email": email,
                        "first_name": first_name,
                        "last_name": last_name
                    }
                }
                
        except sqlite3.IntegrityError as e:
            logger.error(f"Database integrity error during registration: {str(e)}")
            return {"success": False, "error": "Username or email already exists"}
        except Exception as e:
            logger.error(f"Error during user registration: {str(e)}")
            return {"success": False, "error": "Registration failed. Please try again."}
    
    def authenticate_user(self, username_or_email, password):
        """
        Authenticate a user with username/email and password.
        
        Args:
            username_or_email (str): Username or email address
            password (str): Plain text password
            
        Returns:
            dict: Result with success status and user info or error message
        """
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                # Check if account is locked
                cursor.execute('''
                    SELECT id, username, email, password_hash, first_name, last_name,
                           is_active, login_attempts, locked_until
                    FROM users 
                    WHERE (username = ? OR email = ?) AND is_active = TRUE
                ''', (username_or_email, username_or_email))
                
                user = cursor.fetchone()
                if not user:
                    return {"success": False, "error": "Invalid credentials"}
                
                user_id, username, email, password_hash, first_name, last_name, is_active, login_attempts, locked_until = user
                
                # Check if account is locked
                if locked_until:
                    locked_until_dt = datetime.fromisoformat(locked_until)
                    if datetime.now() < locked_until_dt:
                        return {"success": False, "error": f"Account locked until {locked_until_dt.strftime('%Y-%m-%d %H:%M:%S')}"}
                    else:
                        # Unlock account
                        cursor.execute('UPDATE users SET locked_until = NULL, login_attempts = 0 WHERE id = ?', (user_id,))
                        login_attempts = 0
                
                # Verify password
                if not self.verify_password(password, password_hash):
                    # Increment login attempts
                    login_attempts += 1
                    
                    if login_attempts >= 5:
                        # Lock account for 30 minutes
                        locked_until = datetime.now() + timedelta(minutes=30)
                        cursor.execute('''
                            UPDATE users SET login_attempts = ?, locked_until = ? WHERE id = ?
                        ''', (login_attempts, locked_until.isoformat(), user_id))
                        conn.commit()
                        return {"success": False, "error": "Account locked due to too many failed attempts"}
                    else:
                        cursor.execute('UPDATE users SET login_attempts = ? WHERE id = ?', (login_attempts, user_id))
                        conn.commit()
                        return {"success": False, "error": "Invalid credentials"}
                
                # Successful login - reset attempts and update last login
                cursor.execute('''
                    UPDATE users SET login_attempts = 0, locked_until = NULL, last_login = CURRENT_TIMESTAMP 
                    WHERE id = ?
                ''', (user_id,))
                conn.commit()
                
                logger.info(f"User authenticated successfully: {username}")
                return {
                    "success": True,
                    "user": {
                        "id": user_id,
                        "username": username,
                        "email": email,
                        "first_name": first_name,
                        "last_name": last_name
                    }
                }
                
        except Exception as e:
            logger.error(f"Error during user authentication: {str(e)}")
            return {"success": False, "error": "Authentication failed. Please try again."}
    
    def get_user_by_id(self, user_id):
        """
        Get user information by ID.
        
        Args:
            user_id (int): User ID
            
        Returns:
            dict: User information or None if not found
        """
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    SELECT id, username, email, first_name, last_name, created_at, last_login
                    FROM users WHERE id = ? AND is_active = TRUE
                ''', (user_id,))
                
                user = cursor.fetchone()
                if user:
                    return {
                        "id": user[0],
                        "username": user[1],
                        "email": user[2],
                        "first_name": user[3],
                        "last_name": user[4],
                        "created_at": user[5],
                        "last_login": user[6]
                    }
                return None
                
        except Exception as e:
            logger.error(f"Error getting user by ID: {str(e)}")
            return None
    
    def update_user_profile(self, user_id, first_name=None, last_name=None, email=None):
        """
        Update user profile information.
        
        Args:
            user_id (int): User ID
            first_name (str): New first name (optional)
            last_name (str): New last name (optional) 
            email (str): New email (optional)
            
        Returns:
            dict: Result with success status
        """
        try:
            updates = []
            params = []
            
            if first_name is not None:
                updates.append("first_name = ?")
                params.append(first_name)
            
            if last_name is not None:
                updates.append("last_name = ?")
                params.append(last_name)
            
            if email is not None:
                if not self.validate_email(email):
                    return {"success": False, "error": "Invalid email format"}
                updates.append("email = ?")
                params.append(email)
            
            if not updates:
                return {"success": False, "error": "No updates provided"}
            
            params.append(user_id)
            
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                # Check if new email already exists (if updating email)
                if email:
                    cursor.execute('SELECT id FROM users WHERE email = ? AND id != ?', (email, user_id))
                    if cursor.fetchone():
                        return {"success": False, "error": "Email already exists"}
                
                query = f"UPDATE users SET {', '.join(updates)} WHERE id = ?"
                cursor.execute(query, params)
                conn.commit()
                
                if cursor.rowcount > 0:
                    logger.info(f"User profile updated: {user_id}")
                    return {"success": True, "message": "Profile updated successfully"}
                else:
                    return {"success": False, "error": "User not found"}
                    
        except sqlite3.IntegrityError as e:
            return {"success": False, "error": "Email already exists"}
        except Exception as e:
            logger.error(f"Error updating user profile: {str(e)}")
            return {"success": False, "error": "Update failed. Please try again."}
    
    def change_password(self, user_id, current_password, new_password):
        """
        Change user password.
        
        Args:
            user_id (int): User ID
            current_password (str): Current password
            new_password (str): New password
            
        Returns:
            dict: Result with success status
        """
        try:
            # Validate new password
            is_valid_password, password_error = self.validate_password(new_password)
            if not is_valid_password:
                return {"success": False, "error": password_error}
            
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                # Get current password hash
                cursor.execute('SELECT password_hash FROM users WHERE id = ?', (user_id,))
                result = cursor.fetchone()
                if not result:
                    return {"success": False, "error": "User not found"}
                
                current_hash = result[0]
                
                # Verify current password
                if not self.verify_password(current_password, current_hash):
                    return {"success": False, "error": "Current password is incorrect"}
                
                # Hash new password and update
                new_hash = self.hash_password(new_password)
                cursor.execute('UPDATE users SET password_hash = ? WHERE id = ?', (new_hash, user_id))
                conn.commit()
                
                logger.info(f"Password changed for user: {user_id}")
                return {"success": True, "message": "Password changed successfully"}
                
        except Exception as e:
            logger.error(f"Error changing password: {str(e)}")
            return {"success": False, "error": "Password change failed. Please try again."}

    def create_demo_user(self):
        """Create a demo user for testing purposes."""
        try:
            demo_result = self.register_user(
                username="demo",
                email="demo@realestate.com",
                password="Demo123!",
                first_name="Demo",
                last_name="User"
            )
            
            if demo_result["success"]:
                logger.info("Demo user created successfully")
                return True
            else:
                logger.info(f"Demo user creation result: {demo_result['error']}")
                return False
                
        except Exception as e:
            logger.error(f"Error creating demo user: {str(e)}")
            return False
