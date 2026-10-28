const express = require('express');
const router = express.Router();
const { subscribe, getSubscribers, unsubscribe } = require('../controllers/newsletterController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.post('/', subscribe);
router.get('/', protect, admin, getSubscribers);
router.post('/unsubscribe', unsubscribe);

module.exports = router;
