const express = require('express');
const router = express.Router();
const { submitContact, getMessages, markAsRead } = require('../controllers/contactController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.post('/', submitContact);
router.get('/', protect, admin, getMessages);
router.put('/:id/read', protect, admin, markAsRead);

module.exports = router;
