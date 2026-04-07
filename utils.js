const crypto = require('crypto');
const validator = require('validator');

// For demo: store passwords as plain text
const hashPassword = async (password) => {
  return password; // No hashing in demo
};

// Compare password (plain text comparison for demo)
const comparePassword = (password, storedPassword) => {
  return password === storedPassword; // Simple string comparison for demo
};

// Generate session token
const generateSessionToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Generate password reset token
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Validate email
const isValidEmail = (email) => {
  return validator.isEmail(email);
};

// Validate SSN (basic format check)
const isValidSSN = (ssn) => {
  const ssnRegex = /^\d{3}-\d{2}-\d{4}$/;
  return ssnRegex.test(ssn);
};

// Validate PIN (4-6 digits)
const isValidPIN = (pin) => {
  const pinRegex = /^\d{4,6}$/;
  return pinRegex.test(pin);
};

// Validate ZIP code
const isValidZip = (zip) => {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zip);
};

// Validate date of birth (MM/DD/YYYY format)
const isValidDOB = (dob) => {
  const dobRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
  if (!dobRegex.test(dob)) return false;
  
  // Additional check: ensure it's a valid date and user is at least 18
  const [month, day, year] = dob.split('/');
  const birthDate = new Date(year, month - 1, day);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  
  return age >= 18;
};

// Validate username
const isValidUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username);
};

// Validate password strength
const isValidPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

module.exports = {
  hashPassword,
  comparePassword,
  generateSessionToken,
  generateResetToken,
  isValidEmail,
  isValidSSN,
  isValidPIN,
  isValidZip,
  isValidDOB,
  isValidUsername,
  isValidPassword
};
