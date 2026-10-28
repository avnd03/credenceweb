const pool = require('../config/db');

exports.getApprovedTestimonials = async (req, res, next) => {
  try {
    const [testimonials] = await pool.query(
      `SELECT t.*, p.title as package_title
       FROM testimonials t
       LEFT JOIN packages p ON t.package_id = p.id
       WHERE t.is_approved = TRUE
       ORDER BY t.created_at DESC`
    );
    res.json({ success: true, data: testimonials });
  } catch (error) {
    next(error);
  }
};

exports.submitTestimonial = async (req, res, next) => {
  try {
    const { name, location, rating, review, package_id } = req.body;

    await pool.query(
      'INSERT INTO testimonials (user_id, name, location, rating, review, package_id) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user ? req.user.id : null, name, location, rating, review, package_id || null]
    );

    res.status(201).json({ success: true, message: 'Thank you! Your review has been submitted for approval.' });
  } catch (error) {
    next(error);
  }
};

exports.getAllTestimonials = async (req, res, next) => {
  try {
    const [testimonials] = await pool.query('SELECT * FROM testimonials ORDER BY created_at DESC');
    res.json({ success: true, data: testimonials });
  } catch (error) {
    next(error);
  }
};

exports.approveTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_approved, featured } = req.body;

    await pool.query(
      'UPDATE testimonials SET is_approved = ?, featured = ? WHERE id = ?',
      [is_approved, featured || false, id]
    );

    res.json({ success: true, message: 'Testimonial updated' });
  } catch (error) {
    next(error);
  }
};

exports.deleteTestimonial = async (req, res, next) => {
  try {
    await pool.query('DELETE FROM testimonials WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Testimonial deleted' });
  } catch (error) {
    next(error);
  }
};
