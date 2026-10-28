const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

// Register
exports.register = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password, phone } = req.body;

    // Check if user exists
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const [result] = await pool.query(
      'INSERT INTO users (first_name, last_name, email, password, phone) VALUES (?, ?, ?, ?, ?)',
      [first_name, last_name, email, hashedPassword, phone || null]
    );

    const token = generateToken(result.insertId);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        id: result.insertId,
        first_name,
        last_name,
        email,
        role: 'user',
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const user = rows[0];

    if (!user.is_active) {
      return res.status(403).json({ success: false, message: 'Account has been deactivated' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get Profile
exports.getProfile = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, first_name, last_name, email, phone, avatar, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
};

// Update Profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { first_name, last_name, phone } = req.body;

    await pool.query(
      'UPDATE users SET first_name = ?, last_name = ?, phone = ? WHERE id = ?',
      [first_name, last_name, phone, req.user.id]
    );

    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    next(error);
  }
};

// Change Password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const [rows] = await pool.query('SELECT password FROM users WHERE id = ?', [req.user.id]);
    const isMatch = await bcrypt.compare(currentPassword, rows[0].password);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.user.id]);

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, first_name, last_name, email, phone, role, is_active, created_at FROM users ORDER BY created_at DESC'
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
};
