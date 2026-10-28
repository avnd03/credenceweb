const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"Credence Holidays" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Email send error:', error);
  }
};

const bookingConfirmationEmail = (booking) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
      <h1 style="color: white; margin: 0;">Credence Holidays</h1>
      <p style="color: #e0e0e0; margin-top: 5px;">Your Journey Begins Here</p>
    </div>
    <div style="padding: 30px; background: #f9f9f9;">
      <h2 style="color: #333;">Booking Confirmation</h2>
      <p>Dear ${booking.full_name},</p>
      <p>Thank you for choosing Credence Holidays! Your booking has been received.</p>
      <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #667eea;">Booking Details</h3>
        <p><strong>Booking Reference:</strong> ${booking.booking_ref}</p>
        <p><strong>Package:</strong> ${booking.package_title}</p>
        <p><strong>Travel Date:</strong> ${booking.travel_date}</p>
        <p><strong>Travelers:</strong> ${booking.num_adults} Adults, ${booking.num_children} Children</p>
        <p><strong>Total Amount:</strong> ₹${booking.total_price.toLocaleString()}</p>
        <p><strong>Status:</strong> ${booking.status}</p>
      </div>
      <p>Our team will contact you shortly to confirm your booking and discuss further details.</p>
      <p>For any queries, reach us at <a href="mailto:info@credenceholidays.com">info@credenceholidays.com</a> or call +91 98765 43210</p>
    </div>
    <div style="background: #333; padding: 20px; text-align: center; color: #999;">
      <p>&copy; 2024 Credence Holidays. All rights reserved.</p>
    </div>
  </div>
`;

module.exports = { sendEmail, bookingConfirmationEmail };
