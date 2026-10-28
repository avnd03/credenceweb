const pool = require('../config/db');

exports.subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;

    const [existing] = await pool.query('SELECT id FROM newsletter_subscribers WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already subscribed' });
    }

    await pool.query('INSERT INTO newsletter_subscribers (email) VALUES (?)', [email]);
    res.status(201).json({ success: true, message: 'Successfully subscribed to newsletter!' });
  } catch (error) {
    next(error);
  }
};

exports.getSubscribers = async (req, res, next) => {
  try {
    const [subscribers] = await pool.query('SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC');
    res.json({ success: true, data: subscribers });
  } catch (error) {
    next(error);
  }
};

exports.unsubscribe = async (req, res, next) => {
  try {
    const { email } = req.body;
    await pool.query('UPDATE newsletter_subscribers SET is_active = FALSE WHERE email = ?', [email]);
    res.json({ success: true, message: 'Unsubscribed successfully' });
  } catch (error) {
    next(error);
  }
};
