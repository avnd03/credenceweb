const pool = require('../config/db');
const slugify = require('slugify');

// Get all packages (public)
exports.getPackages = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      tour_type,
      destination,
      min_price,
      max_price,
      duration,
      sort = 'created_at',
      order = 'DESC',
      search,
      featured,
    } = req.query;

    const offset = (page - 1) * limit;
    let whereClause = 'WHERE p.is_active = TRUE';
    let params = [];

    if (tour_type) {
      whereClause += ' AND p.tour_type = ?';
      params.push(tour_type);
    }
    if (destination) {
      whereClause += ' AND d.slug = ?';
      params.push(destination);
    }
    if (min_price) {
      whereClause += ' AND COALESCE(p.discount_price, p.price) >= ?';
      params.push(parseFloat(min_price));
    }
    if (max_price) {
      whereClause += ' AND COALESCE(p.discount_price, p.price) <= ?';
      params.push(parseFloat(max_price));
    }
    if (duration) {
      const [minDays, maxDays] = duration.split('-');
      whereClause += ' AND p.duration_days >= ? AND p.duration_days <= ?';
      params.push(parseInt(minDays), parseInt(maxDays));
    }
    if (search) {
      whereClause += ' AND (p.title LIKE ? OR p.description LIKE ? OR d.name LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    if (featured === 'true') {
      whereClause += ' AND p.featured = TRUE';
    }

    const allowedSorts = ['price', 'created_at', 'duration_days', 'rating', 'title'];
    const sortField = allowedSorts.includes(sort) ? `p.${sort}` : 'p.created_at';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Get total count
    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM packages p LEFT JOIN destinations d ON p.destination_id = d.id ${whereClause}`,
      params
    );

    // Get packages
    const [packages] = await pool.query(
      `SELECT p.*, d.name as destination_name, d.slug as destination_slug, d.country
       FROM packages p
       LEFT JOIN destinations d ON p.destination_id = d.id
       ${whereClause}
       ORDER BY ${sortField} ${sortOrder}
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    res.json({
      success: true,
      data: packages,
      pagination: {
        total: countResult[0].total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(countResult[0].total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get single package by slug
exports.getPackageBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const [packages] = await pool.query(
      `SELECT p.*, d.name as destination_name, d.slug as destination_slug, d.country
       FROM packages p
       LEFT JOIN destinations d ON p.destination_id = d.id
       WHERE p.slug = ? AND p.is_active = TRUE`,
      [slug]
    );

    if (packages.length === 0) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }

    const packageData = packages[0];

    // Get itinerary
    const [itinerary] = await pool.query(
      'SELECT * FROM itineraries WHERE package_id = ? ORDER BY day_number',
      [packageData.id]
    );

    // Get images
    const [images] = await pool.query(
      'SELECT * FROM package_images WHERE package_id = ? ORDER BY sort_order',
      [packageData.id]
    );

    // Get related packages
    const [related] = await pool.query(
      `SELECT p.*, d.name as destination_name
       FROM packages p
       LEFT JOIN destinations d ON p.destination_id = d.id
       WHERE p.destination_id = ? AND p.id != ? AND p.is_active = TRUE
       LIMIT 3`,
      [packageData.destination_id, packageData.id]
    );

    res.json({
      success: true,
      data: {
        ...packageData,
        itinerary,
        images,
        related_packages: related,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Create package
exports.createPackage = async (req, res, next) => {
  try {
    const {
      title, destination_id, description, short_description,
      duration_days, duration_nights, max_people, min_age,
      price, discount_price, tour_type, difficulty,
      featured, best_season, inclusions, exclusions, itinerary,
    } = req.body;

    const slug = slugify(title, { lower: true, strict: true });

    const [result] = await pool.query(
      `INSERT INTO packages (title, slug, destination_id, description, short_description,
        duration_days, duration_nights, max_people, min_age, price, discount_price,
        tour_type, difficulty, featured, best_season, inclusions, exclusions, main_image)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title, slug, destination_id, description, short_description,
        duration_days, duration_nights, max_people || 20, min_age || 0,
        price, discount_price || null, tour_type, difficulty || 'easy',
        featured || false, best_season, inclusions, exclusions,
        req.file ? `/uploads/${req.file.filename}` : null,
      ]
    );

    // Insert itinerary if provided
    if (itinerary && Array.isArray(JSON.parse(itinerary))) {
      const itineraryData = JSON.parse(itinerary);
      for (const day of itineraryData) {
        await pool.query(
          'INSERT INTO itineraries (package_id, day_number, title, description, meals, accommodation) VALUES (?, ?, ?, ?, ?, ?)',
          [result.insertId, day.day_number, day.title, day.description, day.meals, day.accommodation]
        );
      }
    }

    res.status(201).json({
      success: true,
      message: 'Package created successfully',
      data: { id: result.insertId, slug },
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Update package
exports.updatePackage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title, destination_id, description, short_description,
      duration_days, duration_nights, max_people, min_age,
      price, discount_price, tour_type, difficulty,
      featured, best_season, inclusions, exclusions, is_active,
    } = req.body;

    const slug = slugify(title, { lower: true, strict: true });

    let query = `UPDATE packages SET title=?, slug=?, destination_id=?, description=?,
                  short_description=?, duration_days=?, duration_nights=?, max_people=?,
                  min_age=?, price=?, discount_price=?, tour_type=?, difficulty=?,
                  featured=?, best_season=?, inclusions=?, exclusions=?, is_active=?`;
    let params = [
      title, slug, destination_id, description, short_description,
      duration_days, duration_nights, max_people, min_age,
      price, discount_price, tour_type, difficulty,
      featured, best_season, inclusions, exclusions, is_active !== undefined ? is_active : true,
    ];

    if (req.file) {
      query += ', main_image=?';
      params.push(`/uploads/${req.file.filename}`);
    }

    query += ' WHERE id=?';
    params.push(id);

    await pool.query(query, params);

    res.json({ success: true, message: 'Package updated successfully' });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete package
exports.deletePackage = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM packages WHERE id = ?', [id]);
    res.json({ success: true, message: 'Package deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Get admin stats
exports.getStats = async (req, res, next) => {
  try {
    const [packages] = await pool.query('SELECT COUNT(*) as total FROM packages');
    const [bookings] = await pool.query('SELECT COUNT(*) as total FROM bookings');
    const [users] = await pool.query('SELECT COUNT(*) as total FROM users WHERE role = "user"');
    const [revenue] = await pool.query('SELECT COALESCE(SUM(total_price), 0) as total FROM bookings WHERE payment_status = "paid"');
    const [recentBookings] = await pool.query(
      `SELECT b.*, p.title as package_title
       FROM bookings b
       LEFT JOIN packages p ON b.package_id = p.id
       ORDER BY b.created_at DESC LIMIT 5`
    );

    res.json({
      success: true,
      data: {
        totalPackages: packages[0].total,
        totalBookings: bookings[0].total,
        totalUsers: users[0].total,
        totalRevenue: revenue[0].total,
        recentBookings,
      },
    });
  } catch (error) {
    next(error);
  }
};
