const express = require('express');
const router = express.Router();
const {
  createBooking, getUserBookings, getBookingByRef,
  getAllBookings, updateBookingStatus
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.post('/', createBooking);
router.get('/my-bookings', protect, getUserBookings);
router.get('/ref/:ref', getBookingByRef);
router.get('/', protect, admin, getAllBookings);
router.put('/:id', protect, admin, updateBookingStatus);

module.exports = router;
