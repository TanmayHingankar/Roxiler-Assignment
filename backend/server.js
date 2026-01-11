const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = 'your-secret-key'; // In production, use environment variable

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database setup
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      address TEXT,
      role TEXT NOT NULL CHECK (role IN ('admin', 'user', 'owner'))
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Stores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      address TEXT,
      owner_id INTEGER,
      FOREIGN KEY (owner_id) REFERENCES Users(id) ON DELETE CASCADE
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Ratings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      store_id INTEGER NOT NULL,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
      FOREIGN KEY (store_id) REFERENCES Stores(id) ON DELETE CASCADE,
      UNIQUE(user_id, store_id)
    )`);

    // Indexes
    db.run(`CREATE INDEX IF NOT EXISTS idx_users_email ON Users(email)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_stores_name ON Stores(name)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_ratings_store_id ON Ratings(store_id)`);
  });
}

// Validation schemas
const userSchema = Joi.object({
  name: Joi.string().min(20).max(60).pattern(/^[a-zA-Z0-9 ]+$/).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(16).pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*]).+$/).required(),
  address: Joi.string().max(400).allow(''),
  role: Joi.string().valid('admin', 'user', 'owner').required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const storeSchema = Joi.object({
  name: Joi.string().min(20).max(60).required(),
  email: Joi.string().email().required(),
  address: Joi.string().max(400).allow(''),
  owner_id: Joi.number().integer().optional()
});

const ratingSchema = Joi.object({
  store_id: Joi.number().integer().required(),
  rating: Joi.number().integer().min(1).max(5).required()
});

// Auth middleware
function authMiddleware(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
}

function roleMiddleware(roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

// Routes

// Auth routes
app.post('/api/auth/signup', async (req, res) => {
  const { error } = userSchema.validate({ ...req.body, role: 'user' });
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { name, email, password, address } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(`INSERT INTO Users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, address, 'user'], function(err) {
        if (err) {
          if (err.code === 'SQLITE_CONSTRAINT') {
            return res.status(400).json({ error: 'Email already exists' });
          }
          return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ message: 'User created successfully' });
      });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { email, password } = req.body;

  db.get(`SELECT * FROM Users WHERE email = ?`, [email], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  });
});

// Admin routes
app.post('/api/admin/users', authMiddleware, roleMiddleware(['admin']), (req, res) => {
  const { error } = userSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { name, email, password, address, role } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ error: 'Server error' });

    db.run(`INSERT INTO Users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, address, role], function(err) {
        if (err) {
          if (err.code === 'SQLITE_CONSTRAINT') {
            return res.status(400).json({ error: 'Email already exists' });
          }
          return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ message: 'User created successfully', id: this.lastID });
      });
  });
});

app.get('/api/admin/dashboard', authMiddleware, roleMiddleware(['admin']), (req, res) => {
  const queries = [
    'SELECT COUNT(*) as count FROM Users',
    'SELECT COUNT(*) as count FROM Stores',
    'SELECT COUNT(*) as count FROM Ratings'
  ];

  Promise.all(queries.map(q => new Promise((resolve, reject) => {
    db.get(q, (err, row) => err ? reject(err) : resolve(row.count));
  }))).then(([users, stores, ratings]) => {
    res.json({ users, stores, ratings });
  }).catch(err => res.status(500).json({ error: 'Database error' }));
});

app.get('/api/admin/stores', authMiddleware, roleMiddleware(['admin']), (req, res) => {
  const { name, email, sort } = req.query;
  let query = `SELECT s.*, AVG(r.rating) as avg_rating FROM Stores s LEFT JOIN Ratings r ON s.id = r.store_id`;
  let params = [];
  let conditions = [];

  if (name) {
    conditions.push('s.name LIKE ?');
    params.push(`%${name}%`);
  }
  if (email) {
    conditions.push('s.email = ?');
    params.push(email);
  }

  if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
  query += ' GROUP BY s.id';

  if (sort) {
    const [field, order] = sort.split(':');
    if (['name', 'email', 'avg_rating'].includes(field) && ['asc', 'desc'].includes(order)) {
      query += ` ORDER BY ${field} ${order}`;
    }
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

app.post('/api/admin/stores', authMiddleware, roleMiddleware(['admin']), (req, res) => {
  const { error } = storeSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { name, email, address, owner_id } = req.body;

  db.run(`INSERT INTO Stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)`,
    [name, email, address, owner_id], function(err) {
      if (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
          return res.status(400).json({ error: 'Email already exists' });
        }
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ message: 'Store created successfully', id: this.lastID });
    });
});

app.get('/api/admin/users', authMiddleware, roleMiddleware(['admin']), (req, res) => {
  const { name, email, role, sort } = req.query;
  let query = 'SELECT id, name, email, address, role FROM Users';
  let params = [];
  let conditions = [];

  if (name) {
    conditions.push('name LIKE ?');
    params.push(`%${name}%`);
  }
  if (email) {
    conditions.push('email = ?');
    params.push(email);
  }
  if (role) {
    conditions.push('role = ?');
    params.push(role);
  }

  if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');

  if (sort) {
    const [field, order] = sort.split(':');
    if (['name', 'email', 'role'].includes(field) && ['asc', 'desc'].includes(order)) {
      query += ` ORDER BY ${field} ${order}`;
    }
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

app.get('/api/admin/users/:id', authMiddleware, roleMiddleware(['admin']), (req, res) => {
  const { id } = req.params;

  db.get('SELECT id, name, email, address, role FROM Users WHERE id = ?', [id], (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.role === 'owner') {
      db.get(`SELECT AVG(r.rating) as avg_rating FROM Stores s LEFT JOIN Ratings r ON s.id = r.store_id WHERE s.owner_id = ?`, [id], (err, row) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        user.avg_rating = row.avg_rating || 0;
        res.json(user);
      });
    } else {
      res.json(user);
    }
  });
});

// User routes
app.get('/api/user/stores', authMiddleware, roleMiddleware(['user']), (req, res) => {
  const { name, address } = req.query;
  let query = `SELECT s.id, s.name, s.address, AVG(r.rating) as avg_rating,
               ur.rating as user_rating
               FROM Stores s
               LEFT JOIN Ratings r ON s.id = r.store_id
               LEFT JOIN Ratings ur ON s.id = ur.store_id AND ur.user_id = ?
               WHERE 1=1`;
  let params = [req.user.id];

  if (name) {
    query += ' AND s.name LIKE ?';
    params.push(`%${name}%`);
  }
  if (address) {
    query += ' AND s.address LIKE ?';
    params.push(`%${address}%`);
  }

  query += ' GROUP BY s.id';

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

app.post('/api/user/ratings', authMiddleware, roleMiddleware(['user']), (req, res) => {
  const { error } = ratingSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { store_id, rating } = req.body;
  const user_id = req.user.id;

  db.run(`INSERT OR REPLACE INTO Ratings (user_id, store_id, rating) VALUES (?, ?, ?)`,
    [user_id, store_id, rating], function(err) {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.status(201).json({ message: 'Rating submitted successfully' });
    });
});

app.patch('/api/user/ratings/:storeId', authMiddleware, roleMiddleware(['user']), (req, res) => {
  const { storeId } = req.params;
  const { rating } = req.body;
  const user_id = req.user.id;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Invalid rating' });
  }

  db.run(`UPDATE Ratings SET rating = ? WHERE user_id = ? AND store_id = ?`,
    [rating, user_id, storeId], function(err) {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (this.changes === 0) return res.status(404).json({ error: 'Rating not found' });
      res.json({ message: 'Rating updated successfully' });
    });
});

// Owner routes
app.get('/api/owner/dashboard', authMiddleware, roleMiddleware(['owner']), (req, res) => {
  const owner_id = req.user.id;

  // Get stores owned by this owner
  db.all('SELECT id, name FROM Stores WHERE owner_id = ?', [owner_id], (err, stores) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (stores.length === 0) return res.json({ avg_rating: 0, raters: [] });

    const storeIds = stores.map(s => s.id);
    const placeholders = storeIds.map(() => '?').join(',');

    const query = `SELECT u.name, u.email, r.rating, r.created_at
                   FROM Ratings r
                   JOIN Users u ON r.user_id = u.id
                   WHERE r.store_id IN (${placeholders})
                   ORDER BY r.created_at DESC`;

    db.all(query, storeIds, (err, raters) => {
      if (err) return res.status(500).json({ error: 'Database error' });

      const avg_rating = raters.length ? raters.reduce((sum, r) => sum + r.rating, 0) / raters.length : 0;
      res.json({ avg_rating: Math.round(avg_rating * 10) / 10, raters });
    });
  });
});

// Auth update password
app.patch('/api/auth/update-password', authMiddleware, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Old and new password required' });
  }

  // Validate new password
  const passwordSchema = Joi.string().min(8).max(16).pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*]).+$/);
  const { error } = passwordSchema.validate(newPassword);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const userId = req.user.id;

  db.get('SELECT password FROM Users WHERE id = ?', [userId], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const validOldPassword = await bcrypt.compare(oldPassword, user.password);
    if (!validOldPassword) return res.status(400).json({ error: 'Invalid old password' });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    db.run('UPDATE Users SET password = ? WHERE id = ?', [hashedNewPassword, userId], (err) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ message: 'Password updated successfully' });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});