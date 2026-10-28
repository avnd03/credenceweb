const express = require('express');
const router = express.Router();
const {
  getDestinations, getDestinationBySlug,
  createDestination, updateDestination, deleteDestination
} = require('../controllers/destinationController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const upload = require('../middleware/upload');

router.get('/', getDestinations);
router.get('/:slug', getDestinationBySlug);
router.post('/', protect, admin, upload.single('image'), createDestination);
router.put('/:id', protect, admin, upload.single('image'), updateDestination);
router.delete('/:id', protect, admin, deleteDestination);

module.exports = router;
