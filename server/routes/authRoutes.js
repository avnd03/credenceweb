const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, changePassword, getAllUsers } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.get('/users', protect, admin, getAllUsers);

module.exports = router;
