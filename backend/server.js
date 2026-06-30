require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.JWT_SECRET || 'your_super_secret_key';

// Middleware
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'u469762185_school_app',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Settings file fallback
const localSettingsFile = path.join(__dirname, 'system_settings.json');

// Settings Helper functions
const getSettings = async () => {
  try {
    const [rows] = await pool.query('SELECT * FROM settings LIMIT 1');
    if (rows.length > 0) {
      const row = rows[0];
      return {
        whatsappApiKey: row.whatsapp_api_key || row.whatsappApiKey || 'twi_live_98ab42c8d23e5904',
        jwtSecret: row.jwt_secret || row.jwtSecret || 'your_super_secret_key',
        schoolName: row.school_name || row.schoolName || 'Dyzen International School',
        academicYear: row.academic_year || row.academicYear || '2026-2027',
        reportCardsReleased: row.report_cards_released !== undefined ? !!row.report_cards_released : (row.reportCardsReleased !== undefined ? !!row.reportCardsReleased : false)
      };
    }
  } catch (e) {
    console.warn('Settings table not queried, using file fallback:', e.message);
  }

  if (fs.existsSync(localSettingsFile)) {
    try {
      return JSON.parse(fs.readFileSync(localSettingsFile, 'utf8'));
    } catch (e) {}
  }

  return {
    whatsappApiKey: 'twi_live_98ab42c8d23e5904',
    jwtSecret: 'your_super_secret_key',
    schoolName: 'Dyzen International School',
    academicYear: '2026-2027',
    reportCardsReleased: false
  };
};

const saveSettings = async (settings) => {
  try {
    const [rows] = await pool.query('SELECT id FROM settings LIMIT 1');
    if (rows.length > 0) {
      try {
        await pool.query(
          `UPDATE settings SET 
           whatsapp_api_key = ?, school_name = ?, academic_year = ?, report_cards_released = ?
           WHERE id = ?`,
          [settings.whatsappApiKey, settings.schoolName, settings.academicYear, settings.reportCardsReleased ? 1 : 0, rows[0].id]
        );
      } catch (dbErr) {
        await pool.query(
          `UPDATE settings SET 
           whatsappApiKey = ?, schoolName = ?, academicYear = ?, reportCardsReleased = ?
           WHERE id = ?`,
          [settings.whatsappApiKey, settings.schoolName, settings.academicYear, settings.reportCardsReleased ? 1 : 0, rows[0].id]
        );
      }
    } else {
      try {
        await pool.query(
          `INSERT INTO settings (whatsapp_api_key, school_name, academic_year, report_cards_released) VALUES (?, ?, ?, ?)`,
          [settings.whatsappApiKey, settings.schoolName, settings.academicYear, settings.reportCardsReleased ? 1 : 0]
        );
      } catch (dbErr) {
        await pool.query(
          `INSERT INTO settings (whatsappApiKey, schoolName, academicYear, reportCardsReleased) VALUES (?, ?, ?, ?)`,
          [settings.whatsappApiKey, settings.schoolName, settings.academicYear, settings.reportCardsReleased ? 1 : 0]
        );
      }
    }
  } catch (e) {
    console.warn('Could not save settings to DB, using file only:', e.message);
  }

  fs.writeFileSync(localSettingsFile, JSON.stringify(settings, null, 2), 'utf8');
};

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access Denied' });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid Token' });
    req.user = decoded;
    next();
  });
};

// Auto seed helper
const seedDefaultAdminIfNeeded = async () => {
  try {
    const [allUsers] = await pool.query('SELECT COUNT(*) AS count FROM users');
    if (allUsers[0].count === 0) {
      const defaultHash = await bcrypt.hash('password123', 10);
      await pool.query(
        `INSERT INTO users (username, password_hash, role, full_name, is_active, created_at)
         VALUES (?, ?, 'super_admin', 'Super Admin', 1, NOW())`,
        ['superadmin@school.edu', defaultHash]
      );
      console.log('Seeded default super admin user: superadmin@school.edu');
    }
  } catch (err) {
    console.warn('Auto seed check failed (might be normal if tables are not fully ready):', err.message);
  }
};

// Call auto seed
seedDefaultAdminIfNeeded();

// Login Endpoint
app.post('/api/login', async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ success: false, message: 'Email, password, and role are required' });
  }

  try {
    const [users] = await pool.query(
      `SELECT * FROM users WHERE username = ? AND is_active = 1`,
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials or role mismatch' });
    }

    const user = users[0];

    // Role check (Class admin role supports super_admin role too)
    const roleMatches = user.role === role || (role === 'admin' && user.role === 'super_admin');
    if (!roleMatches) {
      return res.status(401).json({ success: false, message: 'Invalid credentials or role mismatch' });
    }

    // Verify password with bcrypt + plain-text fallback
    let passwordMatch = false;
    try {
      passwordMatch = await bcrypt.compare(password, user.password_hash);
    } catch (e) {}

    if (!passwordMatch && user.password_hash === password) {
      passwordMatch = true;
    }

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials or role mismatch' });
    }

    let className = null;
    let section = null;

    if (user.role === 'student') {
      const [students] = await pool.query(
        `SELECT s.id, c.name AS className, sec.name AS section
         FROM students s
         LEFT JOIN classes c ON s.class_id = c.id
         LEFT JOIN sections sec ON s.section_id = sec.id
         WHERE s.student_uid = ? AND s.is_active = 1`,
        [user.username]
      );
      if (students.length > 0) {
        className = students[0].className;
        section = students[0].section;
      }
    } else if (user.role === 'admin') {
      const [adminClasses] = await pool.query(
        `SELECT c.name AS className, sec.name AS section
         FROM admin_classes ac
         JOIN classes c ON ac.class_id = c.id
         LEFT JOIN sections sec ON sec.class_id = c.id
         WHERE ac.admin_id = ?
         LIMIT 1`,
        [user.id]
      );
      if (adminClasses.length > 0) {
        className = adminClasses[0].className;
        section = adminClasses[0].section || 'A';
      }
    }

    const token = jwt.sign(
      { id: user.id, email: user.username, role: user.role, className, section },
      SECRET_KEY,
      { expiresIn: '2h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.full_name || user.username,
        email: user.username,
        role: user.role,
        className,
        section
      }
    });
  } catch (error) {
    console.error('Login API error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Example Protected Route
app.get('/api/dashboard', authenticateToken, (req, res) => {
  res.json({
    message: `Welcome to the ${req.user.role} dashboard!`,
    user: req.user
  });
});

// Add User Endpoint
app.post('/api/users/add', authenticateToken, async (req, res) => {
  if (req.user.role !== 'super_admin' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden. Admin access required.' });
  }

  const { name, email, password, role, className, section } = req.body;
  
  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Email, password, and role are required' });
  }

  if (req.user.role === 'admin') {
    if (role !== 'student') {
      return res.status(403).json({ message: 'Class Admins can only add students.' });
    }
    if (className !== req.user.className || section !== req.user.section) {
      return res.status(403).json({ message: `Class Admins can only add students to their assigned class: ${req.user.className}-${req.user.section}.` });
    }
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [existing] = await connection.query('SELECT id FROM users WHERE username = ?', [email]);
    if (existing.length > 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [userResult] = await connection.query(
      `INSERT INTO users (username, password_hash, role, full_name, is_active, created_by, created_at)
       VALUES (?, ?, ?, ?, 1, ?, NOW())`,
      [email, passwordHash, role, name, req.user.id]
    );
    const newUserId = userResult.insertId;

    if (role === 'student') {
      let classId = null;
      if (className) {
        const [classes] = await connection.query('SELECT id FROM classes WHERE name = ?', [className]);
        if (classes.length > 0) {
          classId = classes[0].id;
        } else {
          const [classRes] = await connection.query('INSERT INTO classes (name) VALUES (?)', [className]);
          classId = classRes.insertId;
        }
      }

      let sectionId = null;
      if (section && classId) {
        const [sections] = await connection.query('SELECT id FROM sections WHERE name = ? AND class_id = ?', [section, classId]);
        if (sections.length > 0) {
          sectionId = sections[0].id;
        } else {
          const [sectionRes] = await connection.query('INSERT INTO sections (name, class_id) VALUES (?, ?)', [section, classId]);
          sectionId = sectionRes.insertId;
        }
      }

      await connection.query(
        `INSERT INTO students (student_uid, name, class_id, section_id, parent_name, whatsapp_number, is_active, created_by, created_at)
         VALUES (?, ?, ?, ?, ?, ?, 1, ?, NOW())`,
        [email, name, classId, sectionId, req.body.parentName || 'Parent', req.body.whatsappNumber || '1234567890', req.user.id]
      );
    } else if (role === 'admin' && className) {
      const [classes] = await connection.query('SELECT id FROM classes WHERE name = ?', [className]);
      let classId = classes.length > 0 ? classes[0].id : null;
      if (!classId) {
        const [classRes] = await connection.query('INSERT INTO classes (name) VALUES (?)', [className]);
        classId = classRes.insertId;
      }
      await connection.query(
        'INSERT INTO admin_classes (admin_id, class_id) VALUES (?, ?)',
        [newUserId, classId]
      );
    }

    await connection.commit();
    res.status(201).json({
      success: true,
      message: 'User added successfully',
      user: {
        id: newUserId,
        name,
        email,
        role,
        className,
        section
      }
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error adding user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    connection.release();
  }
});

// Get Users Endpoint
app.get('/api/users', authenticateToken, async (req, res) => {
  if (req.user.role !== 'super_admin' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden.' });
  }

  try {
    if (req.user.role === 'admin') {
      const [rows] = await pool.query(
        `SELECT s.id, s.name, s.student_uid AS email, 'student' AS role, c.name AS className, sec.name AS section
         FROM students s
         JOIN classes c ON s.class_id = c.id
         JOIN sections sec ON s.section_id = sec.id
         WHERE c.name = ? AND sec.name = ? AND s.is_active = 1`,
        [req.user.className, req.user.section]
      );
      return res.json({ success: true, users: rows });
    }

    const roleFilter = req.query.role;
    let sql = `
      SELECT u.id, u.username AS email, u.role, u.full_name AS name,
             c.name AS className, sec.name AS section
      FROM users u
      LEFT JOIN students s ON u.username = s.student_uid AND s.is_active = 1
      LEFT JOIN classes c ON s.class_id = c.id
      LEFT JOIN sections sec ON s.section_id = sec.id
      WHERE u.is_active = 1
    `;
    const params = [];
    if (roleFilter) {
      sql += ' AND u.role = ?';
      params.push(roleFilter);
    }

    const [rows] = await pool.query(sql, params);
    res.json({ success: true, users: rows });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete User Endpoint
app.delete('/api/users/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'super_admin' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden.' });
  }

  const userId = parseInt(req.params.id);

  try {
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const targetUser = users[0];

    if (req.user.role === 'admin') {
      if (targetUser.role !== 'student') {
        return res.status(403).json({ message: 'Class Admins can only delete students.' });
      }

      const [studentData] = await pool.query(
        `SELECT c.name AS className, sec.name AS section
         FROM students s
         JOIN classes c ON s.class_id = c.id
         JOIN sections sec ON s.section_id = sec.id
         WHERE s.student_uid = ? AND s.is_active = 1`,
        [targetUser.username]
      );
      if (studentData.length === 0 || studentData[0].className !== req.user.className || studentData[0].section !== req.user.section) {
        return res.status(403).json({ message: 'Class Admins can only delete students from their own class.' });
      }
    } else if (req.user.role === 'super_admin') {
      if (targetUser.id === req.user.id) {
        return res.status(400).json({ message: 'Super Admin cannot delete their own account.' });
      }
    }

    await pool.query('UPDATE users SET is_active = 0 WHERE id = ?', [userId]);
    await pool.query('UPDATE students SET is_active = 0 WHERE student_uid = ?', [targetUser.username]);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// --- ATTENDANCE ENDPOINTS ---
app.get('/api/attendance', authenticateToken, async (req, res) => {
  let className = req.query.className;
  let section = req.query.section;

  if (req.user.role === 'admin') {
    className = req.user.className;
    section = req.user.section;
  }

  if (!className || !section) {
    return res.status(400).json({ success: false, message: 'Class name and section are required' });
  }

  try {
    const [rows] = await pool.query(
      `SELECT a.id, a.student_id, DATE_FORMAT(a.date, '%Y-%m-%d') AS date, a.status, a.is_locked,
              a.created_at AS submittedAt, c.name AS className, sec.name AS section
       FROM attendance a
       JOIN students s ON a.student_id = s.id
       JOIN classes c ON s.class_id = c.id
       JOIN sections sec ON s.section_id = sec.id
       WHERE c.name = ? AND sec.name = ? AND s.is_active = 1`,
      [className, section]
    );

    const grouped = {};
    rows.forEach(row => {
      if (!grouped[row.date]) {
        grouped[row.date] = {
          id: row.id,
          className: row.className,
          section: row.section,
          date: row.date,
          status: {},
          submittedAt: row.submittedAt
        };
      }
      grouped[row.date].status[row.student_id] = row.status;
    });

    res.json({ success: true, records: Object.values(grouped) });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

const handleAttendanceSubmit = async (req, res, isOverride = false) => {
  const { className, section, date, status } = req.body;

  if (req.user.role === 'admin' && !isOverride) {
    if (className !== req.user.className || section !== req.user.section) {
      return res.status(403).json({ message: 'You can only submit attendance for your assigned class.' });
    }
  }

  try {
    const [classes] = await pool.query('SELECT id FROM classes WHERE name = ?', [className]);
    if (classes.length === 0) return res.status(404).json({ message: 'Class not found' });
    const classId = classes[0].id;

    const [sections] = await pool.query('SELECT id FROM sections WHERE name = ? AND class_id = ?', [section, classId]);
    if (sections.length === 0) return res.status(404).json({ message: 'Section not found' });
    const sectionId = sections[0].id;

    if (req.user.role === 'admin' && !isOverride) {
      const [existing] = await pool.query(
        `SELECT a.created_at FROM attendance a
         JOIN students s ON a.student_id = s.id
         WHERE s.class_id = ? AND s.section_id = ? AND a.date = ?
         LIMIT 1`,
        [classId, sectionId, date]
      );
      if (existing.length > 0) {
        const hoursElapsed = (Date.now() - new Date(existing[0].created_at).getTime()) / (1000 * 60 * 60);
        if (hoursElapsed > 24) {
          return res.status(403).json({ message: 'Attendance sheet is locked. Edits older than 24 hours require Super Admin override.' });
        }
      }
    }

    for (const [studentId, statusVal] of Object.entries(status)) {
      const [existingRec] = await pool.query(
        'SELECT id FROM attendance WHERE student_id = ? AND date = ?',
        [studentId, date]
      );

      if (existingRec.length > 0) {
        await pool.query(
          `UPDATE attendance 
           SET status = ?, modified_by = ?, is_locked = ?, updated_at = NOW() 
           WHERE id = ?`,
          [statusVal, req.user.id, isOverride ? 1 : 0, existingRec[0].id]
        );
      } else {
        await pool.query(
          `INSERT INTO attendance (student_id, date, status, marked_by, is_locked, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
          [studentId, date, statusVal, req.user.id, isOverride ? 1 : 0]
        );
      }
    }

    res.json({ success: true, message: 'Attendance submitted successfully' });
  } catch (error) {
    console.error('Error submitting attendance:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

app.post('/api/attendance/submit', authenticateToken, (req, res) => handleAttendanceSubmit(req, res, false));
app.post('/api/attendance/override', authenticateToken, (req, res) => {
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Only Super Admin can override attendance locks.' });
  }
  handleAttendanceSubmit(req, res, true);
});

// --- HOMEWORK ENDPOINTS ---
app.get('/api/homework', authenticateToken, async (req, res) => {
  let className = req.user.className;
  let section = req.user.section;

  try {
    let sql = `
      SELECT h.id, c.name AS className, sub.name AS subject, sub.name AS title,
             h.description, DATE_FORMAT(h.due_date, '%Y-%m-%d') AS dueDate
      FROM homework h
      JOIN classes c ON h.class_id = c.id
      JOIN subjects sub ON h.subject_id = sub.id
    `;
    const params = [];

    if (req.user.role === 'admin') {
      sql += ' WHERE c.name = ?';
      params.push(className);
    }

    const [rows] = await pool.query(sql, params);
    const formatted = rows.map(r => ({
      ...r,
      section: req.user.role === 'admin' ? section : 'A'
    }));

    res.json({ success: true, homework: formatted });
  } catch (error) {
    console.error('Error fetching homework:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/api/homework/add', authenticateToken, async (req, res) => {
  const { className, section, subject, title, description, dueDate } = req.body;

  if (req.user.role === 'admin') {
    if (className !== req.user.className || section !== req.user.section) {
      return res.status(403).json({ message: 'Class Admins can only assign homework to their own class.' });
    }
  }

  try {
    const [classes] = await pool.query('SELECT id FROM classes WHERE name = ?', [className]);
    if (classes.length === 0) return res.status(404).json({ message: 'Class not found' });
    const classId = classes[0].id;

    const [subjects] = await pool.query('SELECT id FROM subjects WHERE name = ? AND class_id = ?', [subject, classId]);
    let subjectId = subjects.length > 0 ? subjects[0].id : null;
    if (!subjectId) {
      const [subjectRes] = await pool.query('INSERT INTO subjects (name, class_id) VALUES (?, ?)', [subject, classId]);
      subjectId = subjectRes.insertId;
    }

    const [hwRes] = await pool.query(
      `INSERT INTO homework (class_id, subject_id, description, due_date, created_by)
       VALUES (?, ?, ?, ?, ?)`,
      [classId, subjectId, description, dueDate, req.user.id]
    );

    const newHW = {
      id: hwRes.insertId,
      className,
      section,
      subject,
      title,
      description,
      dueDate
    };

    res.status(201).json({ success: true, message: 'Homework posted successfully', homework: newHW });
  } catch (error) {
    console.error('Error adding homework:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.delete('/api/homework/:id', authenticateToken, async (req, res) => {
  const hwId = parseInt(req.params.id);

  try {
    const [hwList] = await pool.query(
      'SELECT h.*, c.name AS className FROM homework h JOIN classes c ON h.class_id = c.id WHERE h.id = ?',
      [hwId]
    );
    if (hwList.length === 0) {
      return res.status(404).json({ message: 'Homework not found.' });
    }

    if (req.user.role === 'admin') {
      const hw = hwList[0];
      if (hw.className !== req.user.className) {
        return res.status(403).json({ message: 'You can only delete homework assigned to your own class.' });
      }
    }

    await pool.query('DELETE FROM homework WHERE id = ?', [hwId]);
    res.json({ success: true, message: 'Homework deleted successfully.' });
  } catch (error) {
    console.error('Error deleting homework:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// --- TESTS & MARKS ENDPOINTS ---
app.get('/api/tests', authenticateToken, async (req, res) => {
  let className = req.user.className;
  let section = req.user.section;

  try {
    let sql = `
      SELECT t.id, t.name, c.name AS className, sub.name AS subject,
             tm.student_id, tm.marks_obtained
      FROM tests t
      JOIN classes c ON t.class_id = c.id
      JOIN subjects sub ON t.subject_id = sub.id
      LEFT JOIN test_marks tm ON t.id = tm.test_id
    `;
    const params = [];

    if (req.user.role === 'admin') {
      sql += ' WHERE c.name = ?';
      params.push(className);
    }

    const [rows] = await pool.query(sql, params);

    const grouped = {};
    rows.forEach(row => {
      if (!grouped[row.id]) {
        grouped[row.id] = {
          id: row.id,
          className: row.className,
          section: req.user.role === 'admin' ? section : 'A',
          subject: row.subject,
          name: row.name,
          marks: {}
        };
      }
      if (row.student_id && row.marks_obtained !== null) {
        grouped[row.id].marks[row.student_id] = row.marks_obtained;
      }
    });

    res.json({ success: true, tests: Object.values(grouped) });
  } catch (error) {
    console.error('Error fetching tests:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/api/tests/add', authenticateToken, async (req, res) => {
  const { className, section, subject, name } = req.body;

  if (req.user.role === 'admin') {
    if (className !== req.user.className || section !== req.user.section) {
      return res.status(403).json({ message: 'Forbidden.' });
    }
  }

  try {
    const [classes] = await pool.query('SELECT id FROM classes WHERE name = ?', [className]);
    if (classes.length === 0) return res.status(404).json({ message: 'Class not found' });
    const classId = classes[0].id;

    const [subjects] = await pool.query('SELECT id FROM subjects WHERE name = ? AND class_id = ?', [subject, classId]);
    let subjectId = subjects.length > 0 ? subjects[0].id : null;
    if (!subjectId) {
      const [subjectRes] = await pool.query('INSERT INTO subjects (name, class_id) VALUES (?, ?)', [subject, classId]);
      subjectId = subjectRes.insertId;
    }

    const [testRes] = await pool.query(
      `INSERT INTO tests (name, date, class_id, subject_id, created_by, is_final)
       VALUES (?, NOW(), ?, ?, ?, 0)`,
      [name, classId, subjectId, req.user.id]
    );

    const newTest = {
      id: testRes.insertId,
      className,
      section,
      subject,
      name,
      marks: {}
    };

    res.status(201).json({ success: true, message: 'Test series created.', test: newTest });
  } catch (error) {
    console.error('Error adding test:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/api/tests/marks', authenticateToken, async (req, res) => {
  const { testId, marks } = req.body;

  try {
    const [tests] = await pool.query('SELECT * FROM tests WHERE id = ?', [testId]);
    if (tests.length === 0) return res.status(404).json({ message: 'Test not found.' });
    const test = tests[0];

    if (req.user.role === 'admin') {
      const [classInfo] = await pool.query('SELECT name FROM classes WHERE id = ?', [test.class_id]);
      if (classInfo.length === 0 || classInfo[0].name !== req.user.className) {
        return res.status(403).json({ message: 'Forbidden.' });
      }
    }

    for (const [studentId, marksVal] of Object.entries(marks)) {
      const [existing] = await pool.query(
        'SELECT id FROM test_marks WHERE test_id = ? AND student_id = ?',
        [testId, studentId]
      );

      if (existing.length > 0) {
        await pool.query(
          `UPDATE test_marks 
           SET marks_obtained = ?, entered_by = ?, entered_at = NOW() 
           WHERE id = ?`,
          [marksVal, req.user.id, existing[0].id]
        );
      } else {
        await pool.query(
          `INSERT INTO test_marks (test_id, student_id, subject_id, marks_obtained, max_marks, is_final, entered_by, entered_at)
           VALUES (?, ?, ?, ?, 100, 0, ?, NOW())`,
          [testId, studentId, test.subject_id, marksVal, req.user.id]
        );
      }
    }

    res.json({ success: true, message: 'Marks updated successfully.' });
  } catch (error) {
    console.error('Error updating test marks:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// --- BEHAVIOUR ENDPOINTS ---
app.get('/api/behaviour', authenticateToken, async (req, res) => {
  try {
    let sql = `
      SELECT b.id, b.student_id AS studentId, s.name AS studentName,
             c.name AS className, sec.name AS section, b.rating,
             b.remarks AS remark, DATE_FORMAT(b.date, '%Y-%m-%d') AS date
      FROM behaviour b
      JOIN students s ON b.student_id = s.id
      JOIN classes c ON s.class_id = c.id
      JOIN sections sec ON s.section_id = sec.id
      WHERE s.is_active = 1
    `;
    const params = [];

    if (req.user.role === 'admin') {
      sql += ' AND c.name = ? AND sec.name = ?';
      params.push(req.user.className, req.user.section);
    }

    const [rows] = await pool.query(sql, params);
    res.json({ success: true, logs: rows });
  } catch (error) {
    console.error('Error fetching behaviour logs:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/api/behaviour/log', authenticateToken, async (req, res) => {
  const { studentId, rating, remark } = req.body;
  
  try {
    const [studentList] = await pool.query(
      `SELECT s.*, c.name AS className, sec.name AS section 
       FROM students s 
       JOIN classes c ON s.class_id = c.id
       JOIN sections sec ON s.section_id = sec.id
       WHERE s.id = ? AND s.is_active = 1`,
      [studentId]
    );

    if (studentList.length === 0) {
      return res.status(404).json({ message: 'Student not found.' });
    }
    const student = studentList[0];

    if (req.user.role === 'admin') {
      if (student.className !== req.user.className || student.section !== req.user.section) {
        return res.status(403).json({ message: 'You can only log remarks for your own class students.' });
      }
    }

    const [result] = await pool.query(
      `INSERT INTO behaviour (student_id, rating, remarks, date, admin_id)
       VALUES (?, ?, ?, NOW(), ?)`,
      [studentId, parseInt(rating), remark, req.user.id]
    );

    const newLog = {
      id: result.insertId,
      studentId,
      studentName: student.name,
      className: student.className,
      section: student.section,
      rating: parseInt(rating),
      remark,
      date: new Date().toISOString().split('T')[0]
    };

    res.status(201).json({ success: true, message: 'Behavior remark logged successfully.', log: newLog });
  } catch (error) {
    console.error('Error logging behaviour remark:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// --- WHATSAPP SYSTEM ENDPOINTS ---
app.get('/api/whatsapp/logs', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT wl.id, u.full_name AS sender, wl.message_type AS scope, wl.message_body AS text,
              (SELECT COUNT(*) FROM students WHERE is_active = 1) AS recipients,
              wl.status, DATE_FORMAT(wl.sent_at, '%Y-%m-%d') AS date
       FROM whatsapp_logs wl
       LEFT JOIN users u ON wl.sent_by = u.id
       ORDER BY wl.sent_at DESC`
    );
    res.json({ success: true, logs: rows });
  } catch (error) {
    console.error('Error fetching whatsapp logs:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/api/whatsapp/broadcast', authenticateToken, async (req, res) => {
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Only Super Admin can send school-wide broadcasts.' });
  }

  const { text } = req.body;

  try {
    const [students] = await pool.query('SELECT id, whatsapp_number FROM students WHERE is_active = 1');

    for (const student of students) {
      if (student.whatsapp_number) {
        await pool.query(
          `INSERT INTO whatsapp_logs (student_id, message_type, message_body, whatsapp_number, status, sent_by, sent_at)
           VALUES (?, 'School Wide', ?, ?, 'sent', ?, NOW())`,
          [student.id, text, student.whatsapp_number, req.user.id]
        );
      }
    }

    const logItem = {
      id: Date.now(),
      sender: 'Super Admin',
      scope: 'School Wide',
      text,
      recipients: students.length,
      status: 'sent',
      date: new Date().toISOString().split('T')[0]
    };

    res.json({ success: true, message: `School-wide WhatsApp broadcast dispatched to ${students.length} contacts.`, log: logItem });
  } catch (error) {
    console.error('Error sending whatsapp broadcast:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/api/whatsapp/class-alert', authenticateToken, async (req, res) => {
  const { className, section, text } = req.body;

  if (req.user.role === 'admin') {
    if (className !== req.user.className || section !== req.user.section) {
      return res.status(403).json({ message: 'Forbidden.' });
    }
  }

  try {
    const [students] = await pool.query(
      `SELECT s.id, s.whatsapp_number 
       FROM students s
       JOIN classes c ON s.class_id = c.id
       JOIN sections sec ON s.section_id = sec.id
       WHERE c.name = ? AND sec.name = ? AND s.is_active = 1`,
      [className, section]
    );

    for (const student of students) {
      if (student.whatsapp_number) {
        await pool.query(
          `INSERT INTO whatsapp_logs (student_id, message_type, message_body, whatsapp_number, status, sent_by, sent_at)
           VALUES (?, ?, ?, ?, 'sent', ?, NOW())`,
          [student.id, `${className}-${section}`, text, student.whatsapp_number, req.user.id]
        );
      }
    }

    const senderName = req.user.role === 'super_admin' ? 'Super Admin' : `Class Admin (${className}-${section})`;
    const logItem = {
      id: Date.now(),
      sender: senderName,
      scope: `${className}-${section}`,
      text,
      recipients: students.length,
      status: 'sent',
      date: new Date().toISOString().split('T')[0]
    };

    res.json({ success: true, message: `Class WhatsApp notification sent to ${students.length} parent contacts of ${className}-${section}.`, log: logItem });
  } catch (error) {
    console.error('Error sending whatsapp class alert:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// --- SYSTEM SETTINGS, BACKUP & RESTORE ENDPOINTS ---
app.get('/api/system/settings', authenticateToken, async (req, res) => {
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Forbidden. Super Admin access required.' });
  }
  const settings = await getSettings();
  res.json({ success: true, settings });
});

app.post('/api/system/settings/update', authenticateToken, async (req, res) => {
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Forbidden.' });
  }
  const { whatsappApiKey, schoolName, academicYear } = req.body;
  const settings = await getSettings();
  
  settings.whatsappApiKey = whatsappApiKey || settings.whatsappApiKey;
  settings.schoolName = schoolName || settings.schoolName;
  settings.academicYear = academicYear || settings.academicYear;
  
  await saveSettings(settings);
  res.json({ success: true, message: 'System settings updated successfully.' });
});

app.post('/api/system/reports/release', authenticateToken, async (req, res) => {
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Forbidden.' });
  }
  const { release } = req.body;
  const settings = await getSettings();
  settings.reportCardsReleased = release;
  await saveSettings(settings);
  res.json({ success: true, message: `Report cards ${release ? 'released to parents' : 'draft locked'}.` });
});

const BACKUP_DIR = path.join(__dirname, 'backups');

app.post('/api/backup', authenticateToken, async (req, res) => {
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Forbidden.' });
  }

  try {
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR);
    }

    const tables = [
      'users', 'students', 'classes', 'sections', 'admin_classes',
      'subjects', 'attendance', 'homework', 'tests', 'test_marks',
      'behaviour', 'whatsapp_logs', 'settings'
    ];

    const backupData = {};
    for (const table of tables) {
      try {
        const [rows] = await pool.query(`SELECT * FROM \`${table}\``);
        backupData[table] = rows;
      } catch (err) {
        console.warn(`Could not backup table ${table}:`, err.message);
      }
    }

    const fileName = `backup_${Date.now()}.json`;
    const filePath = path.join(BACKUP_DIR, fileName);
    fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2), 'utf8');

    const settings = await getSettings();
    settings.lastBackup = new Date().toLocaleString();
    await saveSettings(settings);

    res.json({ success: true, message: `Backup snapshot successfully created at ${settings.lastBackup}.`, file: fileName });
  } catch (error) {
    console.error('Backup error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/api/restore', authenticateToken, async (req, res) => {
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Forbidden.' });
  }

  try {
    if (!fs.existsSync(BACKUP_DIR)) {
      return res.status(400).json({ message: 'No backups found.' });
    }

    const files = fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.json')).sort();
    if (files.length === 0) {
      return res.status(400).json({ message: 'No backup snapshots available.' });
    }

    const latestFile = files[files.length - 1];
    const filePath = path.join(BACKUP_DIR, latestFile);
    const backupData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      await connection.query('SET FOREIGN_KEY_CHECKS = 0');

      for (const [table, rows] of Object.entries(backupData)) {
        await connection.query(`TRUNCATE TABLE \`${table}\``);

        if (rows.length === 0) continue;

        const columns = Object.keys(rows[0]);
        const placeholders = columns.map(() => '?').join(', ');
        const sql = `INSERT INTO \`${table}\` (${columns.map(c => `\`${c}\``).join(', ')}) VALUES (${placeholders})`;

        for (const row of rows) {
          const values = columns.map(c => row[c]);
          await connection.query(sql, values);
        }
      }

      await connection.query('SET FOREIGN_KEY_CHECKS = 1');
      await connection.commit();
      res.json({ success: true, message: `Database successfully rolled back to snapshot: ${latestFile}` });
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Restore error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
// Serve React Frontend
const frontendPath = path.join(__dirname, "../dist");

app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(frontendPath, "index.html"));
  }
});
app.listen(PORT, () => {
  console.log(`Backend Server is running on http://localhost:${PORT}`);
});
