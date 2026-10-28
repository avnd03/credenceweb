const pool = require('../config/db');
const { sendEmail } = require('../utils/email');

exports.submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    await pool.query(
      'INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone || null, subject, message]
    );

    // Send notification to admin
    try {
      await sendEmail(
        'info@credenceholidays.com',
        `New Contact: ${subject}`,
        `<p><strong>From:</strong> ${name} (${email})</p>
         <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
         <p><strong>Message:</strong></p><p>${message}</p>`
      );
    } catch (e) {
      console.error('Admin notification email failed');
    }

    res.status(201).json({ success: true, message: 'Message sent successfully. We will get back to you soon!' });
  } catch (error) {
    next(error);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const [messages] = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    await pool.query('UPDATE contact_messages SET is_read = TRUE WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Marked as read' });
  } catch (error) {
    next(error);
  }
};
