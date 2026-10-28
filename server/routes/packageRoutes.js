const express = require('express');
const router = express.Router();
const {
  getPackages, getPackageBySlug, createPackage,
  updatePackage, deletePackage, getStats
} = require('../controllers/packageController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const upload = require('../middleware/upload');

router.get('/', getPackages);
router.get('/stats', protect, admin, getStats);
router.get('/:slug', getPackageBySlug);
router.post('/', protect, admin, upload.single('main_image'), createPackage);
router.put('/:id', protect, admin, upload.single('main_image'), updatePackage);
router.delete('/:id', protect, admin, deletePackage);

module.exports = router;
