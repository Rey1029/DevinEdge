const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_DIR = path.join(__dirname, 'data');

// Ensure DB directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

class JSONDatabase {
  constructor(filename, defaultData = []) {
    this.filePath = path.join(DB_DIR, filename);
    this.tempPath = this.filePath + '.tmp';
    this.defaultData = defaultData;
  }

  // Crash-proof read
  read() {
    try {
      if (!fs.existsSync(this.filePath)) {
        this.write(this.defaultData);
        return this.defaultData;
      }
      const raw = fs.readFileSync(this.filePath, 'utf8');
      if (!raw || raw.trim() === '') {
        return this.defaultData;
      }
      return JSON.parse(raw);
    } catch (error) {
      console.error(`Error reading database file ${this.filePath}:`, error.message);
      // Return default data to prevent crashing the server
      return this.defaultData;
    }
  }

  // Atomic crash-proof write
  write(data) {
    try {
      const serialized = JSON.stringify(data, null, 2);
      // Write to temp file first
      fs.writeFileSync(this.tempPath, serialized, 'utf8');
      // Atomic rename (replaces target file instantly)
      fs.renameSync(this.tempPath, this.filePath);
      return true;
    } catch (error) {
      console.error(`Error writing database file ${this.filePath}:`, error.message);
      try {
        if (fs.existsSync(this.tempPath)) {
          fs.unlinkSync(this.tempPath);
        }
      } catch (unlinkError) {
        // Ignore unlink error
      }
      return false;
    }
  }
}

// Instantiate database collections
const usersDb = new JSONDatabase('users.json', []);
const inquiriesDb = new JSONDatabase('inquiries.json', []);
const eventsDb = new JSONDatabase('events.json', []);

// Seed default Admin if it doesn't exist
const seedAdmin = async () => {
  try {
    const users = usersDb.read();
    const adminExists = users.some(u => u.role === 'admin');
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin', salt);
      users.push({
        id: 'admin-1',
        name: 'DevinEdge Admin',
        email: 'admin@devinedge.com',
        passwordHash: hashedPassword,
        googleId: null,
        role: 'admin',
        createdAt: new Date().toISOString()
      });
      usersDb.write(users);
      console.log('Seeded default admin account (admin@devinedge.com / admin)');
    }
  } catch (err) {
    console.error('Failed to seed default admin:', err.message);
  }
};

// Seed default Calendar Events if empty
const seedEvents = () => {
  try {
    const events = eventsDb.read();
    if (events.length === 0) {
      const today = new Date();
      const formatOffsetDate = (days) => {
        const d = new Date();
        d.setDate(today.getDate() + days);
        return d.toISOString().split('T')[0];
      };
      
      const defaultEvents = [
        {
          id: 'ev-1',
          title: 'Initial Discovery: Chrono AG',
          type: 'call',
          date: formatOffsetDate(2),
          clientId: 'client-mock-1',
          createdAt: new Date().toISOString()
        },
        {
          id: 'ev-2',
          title: 'WebGL Shaders Review: Apex Dashboard',
          type: 'deadline',
          date: formatOffsetDate(5),
          clientId: 'client-mock-2',
          createdAt: new Date().toISOString()
        },
        {
          id: 'ev-3',
          title: 'Launch Project: Aura Living Shop',
          type: 'milestone',
          date: formatOffsetDate(10),
          clientId: 'client-mock-3',
          createdAt: new Date().toISOString()
        }
      ];
      eventsDb.write(defaultEvents);
      console.log('Seeded default calendar events');
    }
  } catch (err) {
    console.error('Failed to seed events:', err.message);
  }
};

seedAdmin();
seedEvents();

module.exports = {
  usersDb,
  inquiriesDb,
  eventsDb
};
