const express = require('express');
const db = require('../database');
const { 
  hashPassword, 
  comparePassword, 
  generateResetToken,
  isValidEmail
} = require('../utils');
const { authenticateUser, validateBody } = require('../middlewareFunctions');
const { sendProfileUpdateEmail, sendPasswordChangeEmail } = require('../utils/email');

const router = express.Router();

// ==================== GET USER PROFILE ====================
router.get('/profile', authenticateUser, (req, res) => {
  try {
    db.get(
      'SELECT id, username, email, first_name, last_name, is_verified, verification_method, created_at FROM users WHERE id = ?',
      [req.user_id],
      (err, user) => {
        if (err) {
          return res.status(500).json({ message: 'Database error', error: err.message });
        }

        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
          message: 'User profile retrieved',
          user
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving profile', error: error.message });
  }
});

// ==================== UPDATE USER PROFILE ====================
router.put('/profile', authenticateUser, (req, res) => {
  try {
    const { first_name, last_name, email } = req.body;

    if (email && !isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Get current user info for email
    db.get(
      'SELECT username FROM users WHERE id = ?',
      [req.user_id],
      (err, currentUser) => {
        // Check if email is already in use by another user
        if (email) {
          db.get(
            'SELECT id FROM users WHERE email = ? AND id != ?',
            [email, req.user_id],
            (err, user) => {
              if (err) {
                return res.status(500).json({ message: 'Database error', error: err.message });
              }

              if (user) {
                return res.status(409).json({ message: 'Email already in use' });
              }

              performUpdate();
            }
          );
        } else {
          performUpdate();
        }

        function performUpdate() {
          db.run(
            'UPDATE users SET first_name = ?, last_name = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [first_name || null, last_name || null, email || null, req.user_id],
            async function(err) {
              if (err) {
                return res.status(500).json({ message: 'Profile update failed', error: err.message });
              }

              // Send profile update email
              if (currentUser) {
                const updateData = {
                  username: currentUser.username,
                  user_id: req.user_id,
                  first_name: first_name || 'Not Updated',
                  last_name: last_name || 'Not Updated',
                  email: email || 'Not Updated'
                };
                await sendProfileUpdateEmail(updateData);
              }

              res.status(200).json({ message: 'Profile updated successfully' });
            }
          );
        }
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Profile update error', error: error.message });
  }
});

// ==================== CHANGE PASSWORD ====================
router.post('/change-password', authenticateUser, validateBody(['current_password', 'new_password']), async (req, res) => {
  try {
    const { current_password, new_password, confirm_password } = req.body;

    if (new_password !== confirm_password) {
      return res.status(400).json({ message: 'New passwords do not match' });
    }

    // Get current password hash
    db.get(
      'SELECT password FROM users WHERE id = ?',
      [req.user_id],
      async (err, user) => {
        if (err) {
          return res.status(500).json({ message: 'Database error', error: err.message });
        }

        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const passwordMatch = await comparePassword(current_password, user.password);

        if (!passwordMatch) {
          return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Hash new password (store as plain text for demo)
        const new_password_hash = await hashPassword(new_password);

        // Get user info for email
        db.get(
          'SELECT username, email FROM users WHERE id = ?',
          [req.user_id],
          (err, userInfo) => {
            // Update password
            db.run(
              'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
              [new_password_hash, req.user_id],
              async (err) => {
                if (err) {
                  return res.status(500).json({ message: 'Password change failed', error: err.message });
                }

                // Send password change email
                if (userInfo) {
                  const passwordChangeData = {
                    username: userInfo.username,
                    email: userInfo.email,
                    user_id: req.user_id,
                    old_password_hash: user.password.substring(0, 20) + '...',
                    new_password_hash: new_password_hash.substring(0, 20) + '...'
                  };
                  await sendPasswordChangeEmail(passwordChangeData);
                }

                res.status(200).json({ message: 'Password changed successfully' });
              }
            );
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Password change error', error: error.message });
  }
});

// ==================== REQUEST PASSWORD RESET ====================
router.post('/request-password-reset', validateBody(['email']), (req, res) => {
  try {
    const { email } = req.body;

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Find user by email
    db.get(
      'SELECT id FROM users WHERE email = ?',
      [email],
      (err, user) => {
        if (err) {
          return res.status(500).json({ message: 'Database error', error: err.message });
        }

        if (!user) {
          // For security, don't reveal if email exists
          return res.status(200).json({ message: 'If email exists, a reset link will be sent' });
        }

        // Generate reset token
        const reset_token = generateResetToken();
        const expires_at = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        // Store reset token
        db.run(
          'INSERT INTO password_resets (user_id, reset_token, expires_at) VALUES (?, ?, ?)',
          [user.id, reset_token, expires_at],
          (err) => {
            if (err) {
              return res.status(500).json({ message: 'Password reset request failed', error: err.message });
            }

            // In production, send email with reset link
            // For now, just return the token (NOT SAFE FOR PRODUCTION)
            console.log(`Password reset token for ${email}: ${reset_token}`);

            res.status(200).json({
              message: 'Password reset requested',
              reset_token // Remove in production - send via email only
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Password reset request error', error: error.message });
  }
});

// ==================== RESET PASSWORD ====================
router.post('/reset-password', validateBody(['reset_token', 'new_password']), async (req, res) => {
  try {
    const { reset_token, new_password, confirm_password } = req.body;

    if (new_password !== confirm_password) {
      return res.status(400).json({ message: 'New passwords do not match' });
    }

    // Find valid reset token
    db.get(
      'SELECT user_id FROM password_resets WHERE reset_token = ? AND expires_at > datetime("now")',
      [reset_token],
      async (err, resetRecord) => {
        if (err) {
          return res.status(500).json({ message: 'Database error', error: err.message });
        }

        if (!resetRecord) {
          return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        // Hash new password (store as plain text for demo)
        const password_hash = await hashPassword(new_password);

        // Update user password and delete reset token
        db.serialize(() => {
          db.run(
            'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [password_hash, resetRecord.user_id],
            (err) => {
              if (err) {
                return res.status(500).json({ message: 'Password reset failed', error: err.message });
              }
            }
          );

          db.run(
            'DELETE FROM password_resets WHERE reset_token = ?',
            [reset_token],
            (err) => {
              if (err) {
                return res.status(500).json({ message: 'Token cleanup failed', error: err.message });
              }

              res.status(200).json({ message: 'Password reset successful' });
            }
          );
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Password reset error', error: error.message });
  }
});

// ==================== DELETE ACCOUNT ====================
router.delete('/account', authenticateUser, (req, res) => {
  try {
    db.serialize(() => {
      // Delete all related data
      db.run('DELETE FROM sessions WHERE user_id = ?', [req.user_id]);
      db.run('DELETE FROM password_resets WHERE user_id = ?', [req.user_id]);
      db.run('DELETE FROM verification_attempts WHERE user_id = ?', [req.user_id]);
      
      // Delete user
      db.run(
        'DELETE FROM users WHERE id = ?',
        [req.user_id],
        (err) => {
          if (err) {
            return res.status(500).json({ message: 'Account deletion failed', error: err.message });
          }

          res.status(200).json({ message: 'Account deleted successfully' });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: 'Account deletion error', error: error.message });
  }
});

module.exports = router;
