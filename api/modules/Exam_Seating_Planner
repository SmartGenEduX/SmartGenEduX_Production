const express = require('express');
const { Pool } = require('pg');
const router = express.Router();

// PostgreSQL connection pool setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// RBAC and context helpers
function getContext(req) {
  return {
    schoolId: req.user?.schoolId || 'default-school',
    userId: req.user?.id || 'default-user',
    userRole: req.user?.role || 'super_admin',
  };
}
function isManager(role) {
  return ['super_admin', 'admin', 'principal'].includes(role);
}

// API: Configure core data (classes, rooms, teachers)
router.post('/config', async (req, res) => {
  const ctx = getContext(req);
  if (!isManager(ctx.userRole)) return res.status(403).json({ error: 'Forbidden' });
  const { classes, rooms, teachers } = req.body;

  try {
    // Save classes
    await pool.query('DELETE FROM classes WHERE school_id = $1', [ctx.schoolId]);
    for (const c of classes) {
      await pool.query(`INSERT INTO classes (id, school_id, name, section, grade, strength, room) VALUES ($1,$2,$3,$4,$5,$6,$7)`, [
        c.id, ctx.schoolId, c.name, c.section, c.grade, c.strength, c.room
      ]);
    }

    // Save rooms
    await pool.query('DELETE FROM rooms WHERE school_id = $1', [ctx.schoolId]);
    for (const r of rooms) {
      await pool.query('INSERT INTO rooms (name, school_id, capacity) VALUES ($1,$2,$3)', [r.name, ctx.schoolId, r.capacity]);
    }

    // Save teachers
    await pool.query('DELETE FROM teachers WHERE school_id = $1', [ctx.schoolId]);
    for (const t of teachers) {
      await pool.query('INSERT INTO teachers (id, school_id, name, subject, status) VALUES ($1,$2,$3,$4,$5)', [
        t.id, ctx.schoolId, t.name, t.subject, t.status || 'ACTIVE'
      ]);
    }

    res.json({ success: true, message: 'Configuration updated' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// API: Generate Invigilation Duty Allocation
router.post('/invigilation/generate', async (req, res) => {
  const ctx = getContext(req);
  if (!isManager(ctx.userRole)) return res.status(403).json({ error: 'Forbidden' });
  const { examSchedule } = req.body; // array of exams with date, subject, grade, rooms

  try {
    // Fetch teacher list for school who are active
    const teacherResult = await pool.query('SELECT * FROM teachers WHERE school_id = $1 AND status = $2 ORDER BY id', [ctx.schoolId, 'ACTIVE']);
    const teachers = teacherResult.rows;

    // Example simple allocation: assign teachers in round robin to rooms per date
    const allocation = {};
    for (const exam of examSchedule) {
      const date = exam.date;
      const rooms = exam.rooms || [];

      allocation[date] = [];
      let teacherIndex = 0;
      for (const room of rooms) {
        // Assign next teacher
        if (!teachers[teacherIndex]) teacherIndex = 0;
        allocation[date].push({ teacher: teachers[teacherIndex].name, room });
        teacherIndex++;
      }
    }
    // Persist allocation or return for print
    res.json({ success: true, allocation });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// API: Distribute students to rooms based on classes and sections with stratified mixing
router.post('/student/distribute', async (req, res) => {
  const ctx = getContext(req);
  const { classData, rooms } = req.body; // classData array with sections and strengths, rooms list

  if (!isManager(ctx.userRole)) return res.status(403).json({ error: 'Forbidden' });

  try {
    // Simple stratified mixing logic
    // Shuffle students in each section
    const distributed = [];
    let remainingStudents = [];

    for (const cls of classData) {
      for (const section of cls.sections) {
        const students = [...section.students];
        // shuffle students
        for (let i = students.length -1; i>0; i--) {
          const j = Math.floor(Math.random() * (i+1));
          [students[i], students[j]] = [students[j], students[i]];
        }
        // split among available rooms
        let roomIndex = 0;
        const studentsPerRoom = Math.ceil(students.length / rooms.length);
        for (const room of rooms) {
          const assigned = students.splice(0, studentsPerRoom);
          distributed.push({ room: room.name, students: assigned, class: cls.name, section: section.name });
          roomIndex++;
        }
        // any remaining students
        remainingStudents = remainingStudents.concat(students);
      }
    }

    // Allocate remaining students to rooms evenly
    let idx = 0;
    for (const student of remainingStudents) {
      distributed[idx % distributed.length].students.push(student);
      idx++;
    }

    // Return distributed assignment
    res.json({ success: true, distribution: distributed });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
