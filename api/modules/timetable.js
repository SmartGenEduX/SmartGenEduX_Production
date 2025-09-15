// Timetable Management Module - Complete Implementation
const express = require('express');
const router = express.Router();

const timetableData = {
  periods: [
    { id: 1, startTime: '08:00', endTime: '08:45', name: 'Period 1', type: 'academic' },
    { id: 2, startTime: '08:45', endTime: '09:30', name: 'Period 2', type: 'academic' },
    { id: 3, startTime: '09:30', endTime: '10:15', name: 'Period 3', type: 'academic' },
    { id: 4, startTime: '10:15', endTime: '10:30', name: 'Break', type: 'break' },
    { id: 5, startTime: '10:30', endTime: '11:15', name: 'Period 4', type: 'academic' },
    { id: 6, startTime: '11:15', endTime: '12:00', name: 'Period 5', type: 'academic' },
    { id: 7, startTime: '12:00', endTime: '12:45', name: 'Period 6', type: 'academic' },
    { id: 8, startTime: '12:45', endTime: '13:30', name: 'Lunch Break', type: 'break' },
    { id: 9, startTime: '13:30', endTime: '14:15', name: 'Period 7', type: 'academic' },
    { id: 10, startTime: '14:15', endTime: '15:00', name: 'Period 8', type: 'academic' }
  ],
  
  classes: [
    { id: 'class_1A', name: 'Class 1-A', grade: 1, section: 'A', capacity: 30, currentStrength: 28 },
    { id: 'class_1B', name: 'Class 1-B', grade: 1, section: 'B', capacity: 30, currentStrength: 25 },
    { id: 'class_2A', name: 'Class 2-A', grade: 2, section: 'A', capacity: 32, currentStrength: 30 },
    { id: 'class_3A', name: 'Class 3-A', grade: 3, section: 'A', capacity: 35, currentStrength: 33 },
    { id: 'class_4A', name: 'Class 4-A', grade: 4, section: 'A', capacity: 35, currentStrength: 32 },
    { id: 'class_5A', name: 'Class 5-A', grade: 5, section: 'A', capacity: 35, currentStrength: 34 }
  ],
  
  subjects: [
    { id: 'mathematics', name: 'Mathematics', code: 'MATH', department: 'Science' },
    { id: 'english', name: 'English Language', code: 'ENG', department: 'Language' },
    { id: 'hindi', name: 'Hindi', code: 'HIN', department: 'Language' },
    { id: 'science', name: 'Science', code: 'SCI', department: 'Science' },
    { id: 'social_studies', name: 'Social Studies', code: 'SS', department: 'Social Science' },
    { id: 'computer_science', name: 'Computer Science', code: 'CS', department: 'Technology' },
    { id: 'physical_education', name: 'Physical Education', code: 'PE', department: 'Sports' },
    { id: 'art_craft', name: 'Art & Craft', code: 'ART', department: 'Creative' },
    { id: 'music', name: 'Music', code: 'MUS', department: 'Creative' },
    { id: 'moral_education', name: 'Moral Education', code: 'ME', department: 'Values' }
  ],
  
  teachers: [
    { 
      id: 'teacher_001', 
      name: 'Ms. Priya Sharma', 
      subjects: ['mathematics', 'science'], 
      qualification: 'M.Sc Mathematics, B.Ed',
      experience: 8,
      maxPeriodsPerDay: 6,
      preferredTimes: ['morning']
    },
    { 
      id: 'teacher_002', 
      name: 'Mr. Rajesh Kumar', 
      subjects: ['english', 'hindi'], 
      qualification: 'M.A English, B.Ed',
      experience: 12,
      maxPeriodsPerDay: 7,
      preferredTimes: ['morning', 'afternoon']
    },
    { 
      id: 'teacher_003', 
      name: 'Mrs. Anita Singh', 
      subjects: ['social_studies', 'moral_education'], 
      qualification: 'M.A History, B.Ed',
      experience: 10,
      maxPeriodsPerDay: 6,
      preferredTimes: ['morning']
    },
    { 
      id: 'teacher_004', 
      name: 'Mr. Vikram Gupta', 
      subjects: ['computer_science', 'physical_education'], 
      qualification: 'MCA, Sports Diploma',
      experience: 5,
      maxPeriodsPerDay: 8,
      preferredTimes: ['morning', 'afternoon']
    }
  ],
  
  rooms: [
    { id: 'room_101', name: 'Room 101', type: 'classroom', capacity: 35, floor: 1 },
    { id: 'room_102', name: 'Room 102', type: 'classroom', capacity: 35, floor: 1 },
    { id: 'lab_science', name: 'Science Laboratory', type: 'laboratory', capacity: 25, floor: 2 },
    { id: 'lab_computer', name: 'Computer Lab', type: 'laboratory', capacity: 30, floor: 2 },
    { id: 'room_art', name: 'Art Room', type: 'special', capacity: 20, floor: 3 },
    { id: 'hall_assembly', name: 'Assembly Hall', type: 'hall', capacity: 200, floor: 1 },
    { id: 'playground', name: 'Playground', type: 'outdoor', capacity: 100, floor: 0 }
  ],
  
  schedule: [
    // Monday Schedule for Class 1-A
    { id: 1, day: 'Monday', class: 'class_1A', period: 1, subject: 'mathematics', teacher: 'teacher_001', room: 'room_101' },
    { id: 2, day: 'Monday', class: 'class_1A', period: 2, subject: 'english', teacher: 'teacher_002', room: 'room_101' },
    { id: 3, day: 'Monday', class: 'class_1A', period: 3, subject: 'hindi', teacher: 'teacher_002', room: 'room_101' },
    { id: 4, day: 'Monday', class: 'class_1A', period: 5, subject: 'science', teacher: 'teacher_001', room: 'lab_science' },
    { id: 5, day: 'Monday', class: 'class_1A', period: 6, subject: 'social_studies', teacher: 'teacher_003', room: 'room_101' },
    { id: 6, day: 'Monday', class: 'class_1A', period: 7, subject: 'art_craft', teacher: 'teacher_004', room: 'room_art' },
    { id: 7, day: 'Monday', class: 'class_1A', period: 9, subject: 'computer_science', teacher: 'teacher_004', room: 'lab_computer' },
    { id: 8, day: 'Monday', class: 'class_1A', period: 10, subject: 'physical_education', teacher: 'teacher_004', room: 'playground' },
    
    // Tuesday Schedule for Class 1-A
    { id: 9, day: 'Tuesday', class: 'class_1A', period: 1, subject: 'english', teacher: 'teacher_002', room: 'room_101' },
    { id: 10, day: 'Tuesday', class: 'class_1A', period: 2, subject: 'mathematics', teacher: 'teacher_001', room: 'room_101' },
    { id: 11, day: 'Tuesday', class: 'class_1A', period: 3, subject: 'science', teacher: 'teacher_001', room: 'lab_science' },
    { id: 12, day: 'Tuesday', class: 'class_1A', period: 5, subject: 'hindi', teacher: 'teacher_002', room: 'room_101' },
    { id: 13, day: 'Tuesday', class: 'class_1A', period: 6, subject: 'moral_education', teacher: 'teacher_003', room: 'room_101' },
    { id: 14, day: 'Tuesday', class: 'class_1A', period: 7, subject: 'computer_science', teacher: 'teacher_004', room: 'lab_computer' },
    { id: 15, day: 'Tuesday', class: 'class_1A', period: 9, subject: 'music', teacher: 'teacher_003', room: 'room_art' },
    { id: 16, day: 'Tuesday', class: 'class_1A', period: 10, subject: 'physical_education', teacher: 'teacher_004', room: 'playground' }
  ],
  
  conflicts: [],
  templates: [
    {
      id: 'template_primary',
      name: 'Primary Classes Template',
      description: 'Standard template for grades 1-5',
      subjectDistribution: {
        'mathematics': 6,
        'english': 5,
        'hindi': 4,
        'science': 4,
        'social_studies': 3,
        'computer_science': 2,
        'physical_education': 3,
        'art_craft': 2,
        'music': 1,
        'moral_education': 1
      }
    }
  ]
};

// Get all periods
router.get('/periods', (req, res) => {
  res.json(timetableData.periods);
});

// Get all classes
router.get('/classes', (req, res) => {
  res.json(timetableData.classes);
});

// Get all subjects
router.get('/subjects', (req, res) => {
  res.json(timetableData.subjects);
});

// Get all teachers
router.get('/teachers', (req, res) => {
  res.json(timetableData.teachers);
});

// Get all rooms
router.get('/rooms', (req, res) => {
  res.json(timetableData.rooms);
});

// Get schedule for a specific class
router.get('/schedule/:classId', (req, res) => {
  const { classId } = req.params;
  const classSchedule = timetableData.schedule.filter(s => s.class === classId);
  
  // Group by day
  const scheduleByDay = {};
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  days.forEach(day => {
    scheduleByDay[day] = classSchedule.filter(s => s.day === day);
  });
  
  res.json(scheduleByDay);
});

// Get teacher's schedule
router.get('/teacher-schedule/:teacherId', (req, res) => {
  const { teacherId } = req.params;
  const teacherSchedule = timetableData.schedule.filter(s => s.teacher === teacherId);
  
  // Group by day
  const scheduleByDay = {};
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  days.forEach(day => {
    scheduleByDay[day] = teacherSchedule.filter(s => s.day === day);
  });
  
  res.json(scheduleByDay);
});

// Create new schedule entry
router.post('/schedule', (req, res) => {
  const { day, classId, period, subject, teacher, room } = req.body;
  
  // Validate required fields
  if (!day || !classId || !period || !subject || !teacher || !room) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  // Check for conflicts
  const existingEntry = timetableData.schedule.find(s => 
    s.day === day && s.period === period && (s.class === classId || s.teacher === teacher || s.room === room)
  );
  
  if (existingEntry) {
    return res.status(409).json({ 
      error: 'Scheduling conflict detected',
      conflict: existingEntry 
    });
  }
  
  // Create new entry
  const newEntry = {
    id: Date.now(),
    day,
    class: classId,
    period: parseInt(period),
    subject,
    teacher,
    room
  };
  
  timetableData.schedule.push(newEntry);
  res.json({ success: true, entry: newEntry });
});

// Update schedule entry
router.put('/schedule/:id', (req, res) => {
  const { id } = req.params;
  const { day, classId, period, subject, teacher, room } = req.body;
  
  const entryIndex = timetableData.schedule.findIndex(s => s.id === parseInt(id));
  
  if (entryIndex === -1) {
    return res.status(404).json({ error: 'Schedule entry not found' });
  }
  
  // Update entry
  timetableData.schedule[entryIndex] = {
    ...timetableData.schedule[entryIndex],
    day: day || timetableData.schedule[entryIndex].day,
    class: classId || timetableData.schedule[entryIndex].class,
    period: period || timetableData.schedule[entryIndex].period,
    subject: subject || timetableData.schedule[entryIndex].subject,
    teacher: teacher || timetableData.schedule[entryIndex].teacher,
    room: room || timetableData.schedule[entryIndex].room
  };
  
  res.json({ success: true, entry: timetableData.schedule[entryIndex] });
});

// Delete schedule entry
router.delete('/schedule/:id', (req, res) => {
  const { id } = req.params;
  const entryIndex = timetableData.schedule.findIndex(s => s.id === parseInt(id));
  
  if (entryIndex === -1) {
    return res.status(404).json({ error: 'Schedule entry not found' });
  }
  
  timetableData.schedule.splice(entryIndex, 1);
  res.json({ success: true });
});

// Check for conflicts
router.get('/conflicts', (req, res) => {
  const conflicts = [];
  const schedule = timetableData.schedule;
  
  for (let i = 0; i < schedule.length; i++) {
    for (let j = i + 1; j < schedule.length; j++) {
      const entry1 = schedule[i];
      const entry2 = schedule[j];
      
      if (entry1.day === entry2.day && entry1.period === entry2.period) {
        if (entry1.teacher === entry2.teacher) {
          conflicts.push({
            type: 'Teacher Conflict',
            message: `Teacher ${entry1.teacher} has multiple classes at ${entry1.day} Period ${entry1.period}`,
            entries: [entry1, entry2]
          });
        }
        
        if (entry1.room === entry2.room) {
          conflicts.push({
            type: 'Room Conflict',
            message: `Room ${entry1.room} is booked for multiple classes at ${entry1.day} Period ${entry1.period}`,
            entries: [entry1, entry2]
          });
        }
        
        if (entry1.class === entry2.class) {
          conflicts.push({
            type: 'Class Conflict',
            message: `Class ${entry1.class} has multiple subjects at ${entry1.day} Period ${entry1.period}`,
            entries: [entry1, entry2]
          });
        }
      }
    }
  }
  
  res.json(conflicts);
});

// Get weekly overview
router.get('/weekly-overview', (req, res) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const overview = {};
  
  days.forEach(day => {
    overview[day] = {};
    timetableData.periods.forEach(period => {
      if (period.type === 'academic') {
        overview[day][period.id] = timetableData.schedule.filter(s => 
          s.day === day && s.period === period.id
        );
      }
    });
  });
  
  res.json(overview);
});

// Generate auto-timetable
router.post('/auto-generate', (req, res) => {
  const { classId, templateId } = req.body;
  
  const classInfo = timetableData.classes.find(c => c.id === classId);
  const template = timetableData.templates.find(t => t.id === templateId);
  
  if (!classInfo || !template) {
    return res.status(404).json({ error: 'Class or template not found' });
  }
  
  // Clear existing schedule for this class
  timetableData.schedule = timetableData.schedule.filter(s => s.class !== classId);
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const academicPeriods = timetableData.periods.filter(p => p.type === 'academic');
  
  const subjects = Object.keys(template.subjectDistribution);
  const weeklyDistribution = [];
  
  // Create weekly distribution based on template
  subjects.forEach(subject => {
    const count = template.subjectDistribution[subject];
    for (let i = 0; i < count; i++) {
      weeklyDistribution.push(subject);
    }
  });
  
  // Shuffle for random distribution
  for (let i = weeklyDistribution.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [weeklyDistribution[i], weeklyDistribution[j]] = [weeklyDistribution[j], weeklyDistribution[i]];
  }
  
  let distributionIndex = 0;
  
  // Assign subjects to time slots
  days.forEach(day => {
    academicPeriods.forEach(period => {
      if (distributionIndex < weeklyDistribution.length) {
        const subject = weeklyDistribution[distributionIndex];
        
        // Find available teacher for this subject
        const availableTeachers = timetableData.teachers.filter(t => 
          t.subjects.includes(subject)
        );
        
        if (availableTeachers.length > 0) {
          const teacher = availableTeachers[0];
          
          // Find appropriate room
          let room = 'room_101'; // default
          if (subject === 'science') room = 'lab_science';
          else if (subject === 'computer_science') room = 'lab_computer';
          else if (subject === 'physical_education') room = 'playground';
          else if (subject === 'art_craft' || subject === 'music') room = 'room_art';
          
          const newEntry = {
            id: Date.now() + distributionIndex,
            day,
            class: classId,
            period: period.id,
            subject,
            teacher: teacher.id,
            room
          };
          
          timetableData.schedule.push(newEntry);
          distributionIndex++;
        }
      }
    });
  });
  
  res.json({ 
    success: true, 
    message: `Auto-generated timetable for ${classInfo.name}`,
    entriesCreated: distributionIndex 
  });
});

// Export timetable
router.get('/export/:classId', (req, res) => {
  const { classId } = req.params;
  const { format = 'html' } = req.query;
  
  const classInfo = timetableData.classes.find(c => c.id === classId);
  const classSchedule = timetableData.schedule.filter(s => s.class === classId);
  
  if (!classInfo) {
    return res.status(404).json({ error: 'Class not found' });
  }
  
  if (format === 'html') {
    const html = generateHTMLTimetable(classInfo, classSchedule);
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } else if (format === 'json') {
    res.json({
      class: classInfo,
      schedule: classSchedule,
      periods: timetableData.periods,
      subjects: timetableData.subjects,
      teachers: timetableData.teachers,
      rooms: timetableData.rooms
    });
  }
});

function generateHTMLTimetable(classInfo, schedule) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const academicPeriods = timetableData.periods.filter(p => p.type === 'academic');
  
  let html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Timetable - ${classInfo.name}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .school-name { font-size: 24px; font-weight: bold; color: #333; }
          .class-name { font-size: 18px; margin: 10px 0; color: #666; }
          table { border-collapse: collapse; width: 100%; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
          th { background-color: #f2f2f2; font-weight: bold; }
          .break-period { background-color: #ffe6e6; }
          .subject { font-weight: bold; }
          .teacher { font-size: 12px; color: #666; }
          .room { font-size: 11px; color: #888; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="school-name">SmartGenEduX School</div>
          <div class="class-name">Class Timetable - ${classInfo.name}</div>
          <div>Academic Year: 2024-25</div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Time</th>
              ${days.map(day => `<th>${day}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
  `;
  
  timetableData.periods.forEach(period => {
    html += `<tr>`;
    html += `<td><strong>${period.name}</strong><br>${period.startTime} - ${period.endTime}</td>`;
    
    if (period.type === 'break') {
      html += `<td colspan="5" class="break-period"><strong>${period.name}</strong></td>`;
    } else {
      days.forEach(day => {
        const entry = schedule.find(s => s.day === day && s.period === period.id);
        
        if (entry) {
          const subject = timetableData.subjects.find(sub => sub.id === entry.subject);
          const teacher = timetableData.teachers.find(t => t.id === entry.teacher);
          const room = timetableData.rooms.find(r => r.id === entry.room);
          
          html += `
            <td>
              <div class="subject">${subject?.name || entry.subject}</div>
              <div class="teacher">${teacher?.name || entry.teacher}</div>
              <div class="room">${room?.name || entry.room}</div>
            </td>
          `;
        } else {
          html += `<td>-</td>`;
        }
      });
    }
    
    html += `</tr>`;
  });
  
  html += `
          </tbody>
        </table>
        
        <div style="margin-top: 30px; font-size: 12px; color: #666;">
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          <p>SmartGenEduX School Management System</p>
        </div>
      </body>
    </html>
  `;
  
  return html;
}

module.exports = router;