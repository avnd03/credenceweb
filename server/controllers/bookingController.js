const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const { sendEmail, bookingConfirmationEmail } = require('../utils/email');

// Create booking
exports.createBooking = async (req, res, next) => {
  try {
    const {
      package_id, full_name, email, phone,
      travel_date, num_adults, num_children, special_requests,
    } = req.body;

    // Get package price
    const [pkg] = await pool.query(
      'SELECT id, title, price, discount_price FROM packages WHERE id = ? AND is_active = TRUE',
      [package_id]
    );

    if (pkg.length === 0) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }

    const pricePerPerson = pkg[0].discount_price || pkg[0].price;
    const childPrice = pricePerPerson * 0.5;
    const totalPrice = (pricePerPerson * num_adults) + (childPrice * (num_children || 0));

    const booking_ref = 'CH' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();

    const [result] = await pool.query(
      `INSERT INTO bookings (booking_ref, user_id, package_id, full_name, email, phone,
        travel_date, num_adults, num_children, special_requests, total_price)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        booking_ref, req.user ? req.user.id : null, package_id,
        full_name, email, phone, travel_date,
        num_adults, num_children || 0, special_requests || null, totalPrice,
      ]
    );

    // Send confirmation email
    const bookingData = {
      booking_ref,
      full_name,
      package_title: pkg[0].title,
      travel_date,
      num_adults,
      num_children: num_children || 0,
      total_price: totalPrice,
      status: 'Pending',
    };

    try {
      await sendEmail(email, 'Booking Confirmation - Credence Holidays', bookingConfirmationEmail(bookingData));
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        id: result.insertId,
        booking_ref,
        total_price: totalPrice,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get user's bookings
exports.getUserBookings = async (req, res, next) => {
  try {
    const [bookings] = await pool.query(
      `SELECT b.*, p.title as package_title, p.main_image, p.duration_days, p.duration_nights,
              d.name as destination_name
       FROM bookings b
       LEFT JOIN packages p ON b.package_id = p.id
       LEFT JOIN destinations d ON p.destination_id = d.id
       WHERE b.user_id = ?
       ORDER BY b.created_at DESC`,
      [req.user.id]
    );

    res.json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};

// Get booking by ref
exports.getBookingByRef = async (req, res, next) => {
  try {
    const { ref } = req.params;
    const [bookings] = await pool.query(
      `SELECT b.*, p.title as package_title, p.main_image, p.duration_days, p.duration_nights,
              d.name as destination_name
       FROM bookings b
       LEFT JOIN packages p ON b.package_id = p.id
       LEFT JOIN destinations d ON p.destination_id = d.id
       WHERE b.booking_ref = ?`,
      [ref]
    );

    if (bookings.length === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, data: bookings[0] });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all bookings
exports.getAllBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = '';
    let params = [];

    if (status) {
      whereClause = 'WHERE b.status = ?';
      params.push(status);
    }

    const [bookings] = await pool.query(
      `SELECT b.*, p.title as package_title, d.name as destination_name
       FROM bookings b
       LEFT JOIN packages p ON b.package_id = p.id
       LEFT JOIN destinations d ON p.destination_id = d.id
       ${whereClause}
       ORDER BY b.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    const [count] = await pool.query(
      `SELECT COUNT(*) as total FROM bookings b ${whereClause}`,
      params
    );

    res.json({
      success: true,
      data: bookings,
      pagination: {
        total: count[0].total,
        page: parseInt(page),
        pages: Math.ceil(count[0].total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Update booking status
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, payment_status } = req.body;

    let query = 'UPDATE bookings SET';
    let params = [];
    let updates = [];

    if (status) {
      updates.push(' status = ?');
      params.push(status);
    }
    if (payment_status) {
      updates.push(' payment_status = ?');
      params.push(payment_status);
    }

    query += updates.join(',') + ' WHERE id = ?';
    params.push(id);

    await pool.query(query, params);

    res.json({ success: true, message: 'Booking updated successfully' });
  } catch (error) {
    next(error);
  }
};
