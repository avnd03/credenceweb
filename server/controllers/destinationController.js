const pool = require('../config/db');
const slugify = require('slugify');

exports.getDestinations = async (req, res, next) => {
  try {
    const { featured } = req.query;
    let query = 'SELECT d.*, (SELECT COUNT(*) FROM packages p WHERE p.destination_id = d.id AND p.is_active = TRUE) as package_count FROM destinations d WHERE d.is_active = TRUE';

    if (featured === 'true') {
      query += ' AND d.featured = TRUE';
    }

    query += ' ORDER BY d.name ASC';

    const [destinations] = await pool.query(query);
    res.json({ success: true, data: destinations });
  } catch (error) {
    next(error);
  }
};

exports.getDestinationBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const [destinations] = await pool.query(
      'SELECT * FROM destinations WHERE slug = ? AND is_active = TRUE',
      [slug]
    );

    if (destinations.length === 0) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    const [packages] = await pool.query(
      `SELECT p.*, d.name as destination_name FROM packages p
       LEFT JOIN destinations d ON p.destination_id = d.id
       WHERE p.destination_id = ? AND p.is_active = TRUE`,
      [destinations[0].id]
    );

    res.json({ success: true, data: { ...destinations[0], packages } });
  } catch (error) {
    next(error);
  }
};

exports.createDestination = async (req, res, next) => {
  try {
    const { name, country, description, featured } = req.body;
    const slug = slugify(name, { lower: true, strict: true });

    const [result] = await pool.query(
      'INSERT INTO destinations (name, slug, country, description, image, featured) VALUES (?, ?, ?, ?, ?, ?)',
      [name, slug, country, description, req.file ? `/uploads/${req.file.filename}` : null, featured || false]
    );

    res.status(201).json({ success: true, message: 'Destination created', data: { id: result.insertId } });
  } catch (error) {
    next(error);
  }
};

exports.updateDestination = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, country, description, featured, is_active } = req.body;
    const slug = slugify(name, { lower: true, strict: true });

    let query = 'UPDATE destinations SET name=?, slug=?, country=?, description=?, featured=?, is_active=?';
    let params = [name, slug, country, description, featured, is_active !== undefined ? is_active : true];

    if (req.file) {
      query += ', image=?';
      params.push(`/uploads/${req.file.filename}`);
    }

    query += ' WHERE id=?';
    params.push(id);

    await pool.query(query, params);
    res.json({ success: true, message: 'Destination updated' });
  } catch (error) {
    next(error);
  }
};

exports.deleteDestination = async (req, res, next) => {
  try {
    await pool.query('DELETE FROM destinations WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Destination deleted' });
  } catch (error) {
    next(error);
  }
};
