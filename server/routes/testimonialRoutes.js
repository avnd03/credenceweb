const express = require('express');
const router = express.Router();
const {
  getApprovedTestimonials, submitTestimonial,
  getAllTestimonials, approveTestimonial, deleteTestimonial
} = require('../controllers/testimonialController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.get('/', getApprovedTestimonials);
router.post('/', submitTestimonial);
router.get('/all', protect, admin, getAllTestimonials);
router.put('/:id', protect, admin, approveTestimonial);
router.delete('/:id', protect, admin, deleteTestimonial);

module.exports = router;
