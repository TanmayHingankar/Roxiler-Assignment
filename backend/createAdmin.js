const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const db = new sqlite3.Database('./database.db');

db.serialize(() => {
  db.run(`INSERT OR IGNORE INTO Users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)`,
    ['Admin User Name Here 1234567890', 'admin@example.com', bcrypt.hashSync('AdminPass1!', 10), 'Admin Address', 'admin'],
    function(err) {
      if (err) {
        console.error('Error creating admin:', err);
      } else {
        console.log('Admin user created or already exists');
      }
      db.close();
    });
});