# EMPOWER Backend - Quick Start Guide

## 5-Minute Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Create `.env` file
```bash
cp .env.example .env
```

### 3. Start the Server
```bash
npm run dev
```

You should see:
```
EMPOWER Backend running on http://localhost:3000
```

---

## Test It Immediately

Use any API client (Postman, cURL, etc.)

### Register a User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123!",
    "first_name": "Test",
    "last_name": "User"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "TestPass123!"
  }'
```

Response will include a token like:
```json
{
  "message": "Login successful",
  "token": "abc123...",
  "user_id": 1
}
```

### Verify Account
```bash
curl -X POST http://localhost:3000/api/auth/verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer abc123..." \
  -d '{
    "method": "no-pin",
    "ssn": "123-45-6789",
    "zip_code": "12345",
    "date_of_birth": "01/15/1990"
  }'
```

---

## Connect Frontend

See `frontend-integration.js` for ready-to-use JavaScript functions to connect your HTML forms to the backend.

**Quick example:**
```html
<!-- index.html -->
<button class="btn-signin" onclick="loginUser()">Sign In</button>

<!-- Add this script -->
<script src="frontend-integration.js"></script>
```

---

## Features Included

✅ User Registration
✅ Login/Logout  
✅ Account Verification (3 methods)
✅ Password Reset
✅ Profile Management
✅ Session Management
✅ Password Hashing (bcryptjs)
✅ Input Validation
✅ SQLite Database

---

## Project Structure

```
EMPOWER/
├── server.js              # Main server
├── database.js            # Database setup
├── routes/
│   ├── auth.js           # Auth endpoints
│   └── users.js          # User endpoints
├── middleware.js          # Auth middleware
├── utils.js               # Validation & crypto
├── frontend-integration.js # JS functions for HTML
├── package.json
├── .env.example
├── README.md             # Full documentation
└── empower.db            # Database (auto-created)
```

---

## Next Steps

1. **Connect Frontend** - Use functions in `frontend-integration.js`
2. **Test All Endpoints** - See README.md for full API docs
3. **Customize** - Modify routes and add your own features
4. **Production** - See README.md "Production Recommendations"

---

## Common Issues

**Port 3000 in use?**
```bash
PORT=3001 npm run dev
```

**Need to reset database?**
```bash
rm empower.db
npm run dev
```

**Token not working?**
- Make sure it's in the `Authorization: Bearer <token>` header
- Tokens expire after 24 hours

---

Enjoy! 🚀
