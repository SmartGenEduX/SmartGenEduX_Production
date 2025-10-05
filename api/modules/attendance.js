// Attendance Management Module - Complete Implementation
const express = require('express');
const router = express.Router();

const attendanceData = {
  students: [
    {
      id: 'student_001',
      name: 'Aarav Sharma',
      rollNumber: '1A01',
      class: 'Class 1-A',
      section: 'A',
      grade: 1,
      parentPhone: '+91-9876543210',
      parentEmail: 'aarav.parent@email.com',
      biometricId: 'BIO001',
      rfidCard: 'RFID001'
    },
    {
      id: 'student_002',
      name: 'Priya Patel',
      rollNumber: '1A02',
      class: 'Class 1-A',
      section: 'A',
      grade: 1,
      parentPhone: '+91-9876543211',
      parentEmail: 'priya.parent@email.com',
      biometricId: 'BIO002',
      rfidCard: 'RFID002'
    },
    {
      id: 'student_003',
      name: 'Arjun Singh',
      rollNumber: '2A01',
      class: 'Class 2-A',
      section: 'A',
      grade: 2,
      parentPhone: '+91-9876543212',
      parentEmail: 'arjun.parent@email.com',
      biometricId: 'BIO003',
      rfidCard: 'RFID003'
    },
    {
      id: 'student_004',
      name: 'Ananya Gupta',
      rollNumber: '2A02',
      class: 'Class 2-A',
      section: 'A',
      grade: 2,
      parentPhone: '+91-9876543213',
      parentEmail: 'ananya.parent@email.com',
      biometricId: 'BIO004',
      rfidCard: 'RFID004'
    },
    {
      id: 'student_005',
      name: 'Kabir Joshi',
      rollNumber: '3A01',
      class: 'Class 3-A',
      section: 'A',
      grade: 3,
      parentPhone: '+91-9876543214',
      parentEmail: 'kabir.parent@email.com',
      biometricId: 'BIO005',
      rfidCard: 'RFID005'
    }
  ],

  teachers: [
    {
      id: 'teacher_001',
      name: 'Ms. Priya Sharma',
      employeeId: 'EMP001',
      subjects: ['Mathematics', 'Science'],
      classes: ['Class 1-A', 'Class 2-A'],
      phone: '+91-9876543220',
      email: 'priya@dps.edu',
      biometricId: 'TEAC001',
      rfidCard: 'TRFID001'
    },
    {
      id: 'teacher_002',
      name: 'Mr. Rajesh Kumar',
      employeeId: 'EMP002',
      subjects: ['English', 'Hindi'],
      classes: ['Class 1-A', 'Class 2-A', 'Class 3-A'],
      phone: '+91-9876543221',
      email: 'rajesh@dps.edu',
      biometricId: 'TEAC002',
      rfidCard: 'TRFID002'
    },
    {
      id: 'teacher_003',
      name: 'Mrs. Anita Singh',
      employeeId: 'EMP003',
      subjects: ['Social Studies', 'Moral Education'],
      classes: ['Class 2-A', 'Class 3-A'],
      phone: '+91-9876543222',
      email: 'anita@dps.edu',
      biometricId: 'TEAC003',
      rfidCard: 'TRFID003'
    }
  ],

  attendanceRecords: [
    // Today's attendance records
    {
      id: 'att_001',
      studentId: 'student_001',
      date: '2024-12-29',
      status: 'present',
      timeIn: '08:15:00',
      timeOut: null,
      method: 'biometric',
      recordedBy: 'system',
      notes: 'On time arrival'
    },
    {
      id: 'att_002',
      studentId: 'student_002',
      date: '2024-12-29',
      status: 'present',
      timeIn: '08:12:00',
      timeOut: null,
      method: 'rfid',
      recordedBy: 'system',
      notes: 'Early arrival'
    },
    {
      id: 'att_003',
      studentId: 'student_003',
      date: '2024-12-29',
      status: 'late',
      timeIn: '08:35:00',
      timeOut: null,
      method: 'manual',
      recordedBy: 'teacher_001',
      notes: 'Late due to traffic, parent informed'
    },
    {
      id: 'att_004',
      studentId: 'student_004',
      date: '2024-12-29',
      status: 'absent',
      timeIn: null,
      timeOut: null,
      method: 'system',
      recordedBy: 'system',
      notes: 'Sick leave - parent called'
    },
    {
      id: 'att_005',
      studentId: 'student_005',
      date: '2024-12-29',
      status: 'present',
      timeIn: '08:08:00',
      timeOut: null,
      method: 'biometric',
      recordedBy: 'system',
      notes: 'Perfect attendance this month'
    },

    // Yesterday's records
    {
      id: 'att_006',
      studentId: 'student_001',
      date: '2024-12-28',
      status: 'present',
      timeIn: '08:10:00',
      timeOut: '15:00:00',
      method: 'biometric',
      recordedBy: 'system',
      notes: 'Full day attendance'
    },
    {
      id: 'att_007',
      studentId: 'student_002',
      date: '2024-12-28',
      status: 'present',
      timeIn: '08:20:00',
      timeOut: '15:00:00',
      method: 'rfid',
      recordedBy: 'system',
      notes: 'Regular attendance'
    },
    {
      id: 'att_008',
      studentId: 'student_003',
      date: '2024-12-28',
      status: 'present',
      timeIn: '08:15:00',
      timeOut: '15:00:00',
      method: 'biometric',
      recordedBy: 'system',
      notes: 'Good attendance'
    },
    {
      id: 'att_009',
      studentId: 'student_004',
      date: '2024-12-28',
      status: 'present',
      timeIn: '08:18:00',
      timeOut: '15:00:00',
      method: 'biometric',
      recordedBy: 'system',
      notes: 'Present'
    },
    {
      id: 'att_010',
      studentId: 'student_005',
      date: '2024-12-28',
      status: 'absent',
      timeIn: null,
      timeOut: null,
      method: 'system',
      recordedBy: 'system',
      notes: 'Family function - prior permission'
    }
  ],

  teacherAttendance: [
    {
      id: 'teach_att_001',
      teacherId: 'teacher_001',
      date: '2024-12-29',
      status: 'present',
      timeIn: '07:45:00',
      timeOut: null,
      method: 'biometric',
      notes: 'Early arrival for preparation'
    },
    {
      id: 'teach_att_002',
      teacherId: 'teacher_002',
      date: '2024-12-29',
      status: 'present',
      timeIn: '07:50:00',
      timeOut: null,
      method: 'biometric',
      notes: 'On time'
    },
    {
      id: 'teach_att_003',
      teacherId: 'teacher_003',
      date: '2024-12-29',
      status: 'present',
      timeIn: '07:55:00',
      timeOut: null,
      method: 'rfid',
      notes: 'Present'
    }
  ],

  leaveApplications: [
    {
      id: 'leave_001',
      studentId: 'student_004',
      type: 'sick_leave',
      startDate: '2024-12-29',
      endDate: '2024-12-29',
      reason: 'Fever and cold',
      status: 'approved',
      appliedBy: 'parent',
      approvedBy: 'teacher_001',
      documents: ['medical_certificate.pdf'],
      createdAt: '2024-12-28T20:30:00'
    },
    {
      id: 'leave_002',
      studentId: 'student_005',
      type: 'personal_leave',
      startDate: '2024-12-28',
      endDate: '2024-12-28',
      reason: 'Family wedding ceremony',
      status: 'approved',
      appliedBy: 'parent',
      approvedBy: 'teacher_002',
      documents: [],
      createdAt: '2024-12-27T18:45:00'
    }
  ],

  attendanceSettings: {
    schoolStartTime: '08:00:00',
    schoolEndTime: '15:00:00',
    lateThreshold: 15, // minutes
    attendanceGracePeriod: 30, // minutes
    autoMarkAbsent: true,
    autoMarkAbsentTime: '09:00:00',
    parentNotifications: {
      enabled: true,
      methods: ['sms', 'email', 'whatsapp'],
      templates: {
        absent: 'Your child {studentName} is marked absent today. Please contact school if this is incorrect.',
        late: 'Your child {studentName} arrived late at {timeIn}. School starts at 8:00 AM.',
        present: 'Your child {studentName} has arrived safely at school at {timeIn}.'
      }
    },
    biometricSettings: {
      enabled: true,
      threshold: 0.8,
      retryAttempts: 3,
      backupMethod: 'rfid'
    }
  },

  attendanceStats: {
    today: {
      totalStudents: 5,
      present: 4,
      absent: 1,
      late: 1,
      attendanceRate: 80.0
    },
    thisWeek: {
      totalStudents: 5,
      averageAttendance: 94.2,
      perfectAttendance: 3,
      chronicAbsentees: 0
    },
    thisMonth: {
      totalStudents: 5,
      averageAttendance: 92.8,
      perfectAttendance: 2,
      chronicAbsentees: 1
    }
  }
};

// Get attendance summary for today
router.get('/summary/today', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const todayRecords = attendanceData.attendanceRecords.filter(record => record.date === today);
  
  const summary = {
    date: today,
    totalStudents: attendanceData.students.length,
    present: todayRecords.filter(r => r.status === 'present').length,
    absent: todayRecords.filter(r => r.status === 'absent').length,
    late: todayRecords.filter(r => r.status === 'late').length,
    attendanceRate: ((todayRecords.filter(r => r.status === 'present' || r.status === 'late').length / attendanceData.students.length) * 100).toFixed(1)
  };
  
  res.json(summary);
});

// Get detailed attendance for a specific date
router.get('/date/:date', (req, res) => {
  const { date } = req.params;
  const { classId, section } = req.query;
  
  let students = attendanceData.students;
  
  // Filter by class if specified
  if (classId) {
    students = students.filter(s => s.class === classId);
  }
  
  // Filter by section if specified
  if (section) {
    students = students.filter(s => s.section === section);
  }
  
  const attendanceRecords = attendanceData.attendanceRecords.filter(record => record.date === date);
  
  const detailedAttendance = students.map(student => {
    const record = attendanceRecords.find(r => r.studentId === student.id);
    
    return {
      student: student,
      attendance: record || {
        studentId: student.id,
        date: date,
        status: 'not_marked',
        timeIn: null,
        timeOut: null,
        method: null,
        recordedBy: null,
        notes: 'Attendance not marked'
      }
    };
  });
  
  res.json(detailedAttendance);
});

// Mark attendance for a student
router.post('/mark', (req, res) => {
  const { studentId, date, status, timeIn, timeOut, method, recordedBy, notes } = req.body;
  
  // Validate required fields
  if (!studentId || !date || !status) {
    return res.status(400).json({ error: 'Student ID, date, and status are required' });
  }
  
  // Check if student exists
  const student = attendanceData.students.find(s => s.id === studentId);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }
  
  // Check if attendance already marked for this date
  const existingRecord = attendanceData.attendanceRecords.find(
    r => r.studentId === studentId && r.date === date
  );
  
  if (existingRecord) {
    return res.status(409).json({ error: 'Attendance already marked for this date' });
  }
  
  // Create new attendance record
  const newRecord = {
    id: 'att_' + Date.now(),
    studentId,
    date,
    status,
    timeIn: timeIn || null,
    timeOut: timeOut || null,
    method: method || 'manual',
    recordedBy: recordedBy || 'system',
    notes: notes || '',
    createdAt: new Date().toISOString()
  };
  
  attendanceData.attendanceRecords.push(newRecord);
  
  // Send parent notification if enabled
  if (attendanceData.attendanceSettings.parentNotifications.enabled) {
    sendParentNotification(student, newRecord);
  }
  
  res.json({ success: true, record: newRecord });
});

// Update attendance record
router.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { status, timeIn, timeOut, notes } = req.body;
  
  const recordIndex = attendanceData.attendanceRecords.findIndex(r => r.id === id);
  
  if (recordIndex === -1) {
    return res.status(404).json({ error: 'Attendance record not found' });
  }
  
  // Update record
  attendanceData.attendanceRecords[recordIndex] = {
    ...attendanceData.attendanceRecords[recordIndex],
    status: status || attendanceData.attendanceRecords[recordIndex].status,
    timeIn: timeIn || attendanceData.attendanceRecords[recordIndex].timeIn,
    timeOut: timeOut || attendanceData.attendanceRecords[recordIndex].timeOut,
    notes: notes || attendanceData.attendanceRecords[recordIndex].notes,
    updatedAt: new Date().toISOString()
  };
  
  res.json({ success: true, record: attendanceData.attendanceRecords[recordIndex] });
});

// Bulk mark attendance
router.post('/bulk-mark', (req, res) => {
  const { date, attendanceList } = req.body;
  
  if (!date || !Array.isArray(attendanceList)) {
    return res.status(400).json({ error: 'Date and attendance list are required' });
  }
  
  const results = [];
  const errors = [];
  
  attendanceList.forEach(attendance => {
    const { studentId, status, timeIn, method, notes } = attendance;
    
    // Check if student exists
    const student = attendanceData.students.find(s => s.id === studentId);
    if (!student) {
      errors.push({ studentId, error: 'Student not found' });
      return;
    }
    
    // Check if already marked
    const existingRecord = attendanceData.attendanceRecords.find(
      r => r.studentId === studentId && r.date === date
    );
    
    if (existingRecord) {
      errors.push({ studentId, error: 'Already marked' });
      return;
    }
    
    // Create record
    const newRecord = {
      id: 'att_' + Date.now() + '_' + studentId,
      studentId,
      date,
      status,
      timeIn: timeIn || null,
      timeOut: null,
      method: method || 'bulk',
      recordedBy: 'teacher',
      notes: notes || '',
      createdAt: new Date().toISOString()
    };
    
    attendanceData.attendanceRecords.push(newRecord);
    results.push(newRecord);
  });
  
  res.json({ success: true, marked: results.length, errors: errors });
});

// Get attendance statistics
router.get('/stats', (req, res) => {
  const { period = 'today', classId, studentId } = req.query;
  
  let stats = {};
  
  if (period === 'today') {
    stats = calculateTodayStats(classId, studentId);
  } else if (period === 'week') {
    stats = calculateWeekStats(classId, studentId);
  } else if (period === 'month') {
    stats = calculateMonthStats(classId, studentId);
  }
  
  res.json(stats);
});

// Get student attendance history
router.get('/student/:studentId/history', (req, res) => {
  const { studentId } = req.params;
  const { startDate, endDate, limit = 30 } = req.query;
  
  const student = attendanceData.students.find(s => s.id === studentId);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }
  
  let records = attendanceData.attendanceRecords.filter(r => r.studentId === studentId);
  
  // Filter by date range if specified
  if (startDate && endDate) {
    records = records.filter(r => r.date >= startDate && r.date <= endDate);
  }
  
  // Sort by date (newest first) and limit results
  records = records.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, parseInt(limit));
  
  // Calculate stats for this student
  const totalDays = records.length;
  const presentDays = records.filter(r => r.status === 'present' || r.status === 'late').length;
  const attendancePercentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : 0;
  
  res.json({
    student: student,
    attendancePercentage: parseFloat(attendancePercentage),
    totalDays: totalDays,
    presentDays: presentDays,
    absentDays: totalDays - presentDays,
    records: records
  });
});

// Get leave applications
router.get('/leaves', (req, res) => {
  const { status, studentId, startDate, endDate } = req.query;
  
  let leaves = attendanceData.leaveApplications;
  
  // Filter by status
  if (status) {
    leaves = leaves.filter(leave => leave.status === status);
  }
  
  // Filter by student
  if (studentId) {
    leaves = leaves.filter(leave => leave.studentId === studentId);
  }
  
  // Filter by date range
  if (startDate && endDate) {
    leaves = leaves.filter(leave => 
      leave.startDate >= startDate && leave.endDate <= endDate
    );
  }
  
  // Populate student information
  const leavesWithStudents = leaves.map(leave => {
    const student = attendanceData.students.find(s => s.id === leave.studentId);
    return {
      ...leave,
      student: student
    };
  });
  
  res.json(leavesWithStudents);
});

// Apply for leave
router.post('/leave/apply', (req, res) => {
  const { studentId, type, startDate, endDate, reason, appliedBy } = req.body;
  
  // Validate required fields
  if (!studentId || !type || !startDate || !endDate || !reason) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  // Check if student exists
  const student = attendanceData.students.find(s => s.id === studentId);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }
  
  const newLeave = {
    id: 'leave_' + Date.now(),
    studentId,
    type,
    startDate,
    endDate,
    reason,
    status: 'pending',
    appliedBy: appliedBy || 'parent',
    approvedBy: null,
    documents: [],
    createdAt: new Date().toISOString()
  };
  
  attendanceData.leaveApplications.push(newLeave);
  
  res.json({ success: true, leave: newLeave });
});

// Approve/Reject leave
router.put('/leave/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, approvedBy, remarks } = req.body;
  
  const leaveIndex = attendanceData.leaveApplications.findIndex(l => l.id === id);
  
  if (leaveIndex === -1) {
    return res.status(404).json({ error: 'Leave application not found' });
  }
  
  attendanceData.leaveApplications[leaveIndex] = {
    ...attendanceData.leaveApplications[leaveIndex],
    status,
    approvedBy: approvedBy || null,
    remarks: remarks || '',
    updatedAt: new Date().toISOString()
  };
  
  res.json({ success: true, leave: attendanceData.leaveApplications[leaveIndex] });
});

// Teacher attendance routes
router.get('/teachers/today', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const todayRecords = attendanceData.teacherAttendance.filter(record => record.date === today);
  
  const teachersWithAttendance = attendanceData.teachers.map(teacher => {
    const attendance = todayRecords.find(r => r.teacherId === teacher.id);
    return {
      teacher: teacher,
      attendance: attendance || {
        teacherId: teacher.id,
        date: today,
        status: 'not_marked',
        timeIn: null,
        timeOut: null,
        method: null,
        notes: 'Not marked'
      }
    };
  });
  
  res.json(teachersWithAttendance);
});

// Mark teacher attendance
router.post('/teachers/mark', (req, res) => {
  const { teacherId, date, status, timeIn, timeOut, method, notes } = req.body;
  
  // Validate required fields
  if (!teacherId || !date || !status) {
    return res.status(400).json({ error: 'Teacher ID, date, and status are required' });
  }
  
  // Check if teacher exists
  const teacher = attendanceData.teachers.find(t => t.id === teacherId);
  if (!teacher) {
    return res.status(404).json({ error: 'Teacher not found' });
  }
  
  // Check if attendance already marked
  const existingRecord = attendanceData.teacherAttendance.find(
    r => r.teacherId === teacherId && r.date === date
  );
  
  if (existingRecord) {
    return res.status(409).json({ error: 'Attendance already marked for this date' });
  }
  
  const newRecord = {
    id: 'teach_att_' + Date.now(),
    teacherId,
    date,
    status,
    timeIn: timeIn || null,
    timeOut: timeOut || null,
    method: method || 'manual',
    notes: notes || '',
    createdAt: new Date().toISOString()
  };
  
  attendanceData.teacherAttendance.push(newRecord);
  
  res.json({ success: true, record: newRecord });
});

// Get attendance reports
router.get('/reports/class/:classId', (req, res) => {
  const { classId } = req.params;
  const { startDate, endDate } = req.query;
  
  // Get students in this class
  const classStudents = attendanceData.students.filter(s => s.class === classId);
  
  // Get attendance records for date range
  let records = attendanceData.attendanceRecords;
  if (startDate && endDate) {
    records = records.filter(r => r.date >= startDate && r.date <= endDate);
  }
  
  // Generate report for each student
  const report = classStudents.map(student => {
    const studentRecords = records.filter(r => r.studentId === student.id);
    const totalDays = studentRecords.length;
    const presentDays = studentRecords.filter(r => r.status === 'present' || r.status === 'late').length;
    const attendancePercentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : 0;
    
    return {
      student: student,
      totalDays: totalDays,
      presentDays: presentDays,
      absentDays: totalDays - presentDays,
      lateDays: studentRecords.filter(r => r.status === 'late').length,
      attendancePercentage: parseFloat(attendancePercentage)
    };
  });
  
  res.json({
    class: classId,
    dateRange: { startDate, endDate },
    totalStudents: classStudents.length,
    report: report
  });
});

// Helper functions
function sendParentNotification(student, record) {
  // Simulate sending notification
  console.log(`Notification sent to ${student.parentPhone}: ${student.name} marked ${record.status} at ${record.timeIn || 'not recorded'}`);
}

function calculateTodayStats(classId, studentId) {
  const today = new Date().toISOString().split('T')[0];
  let records = attendanceData.attendanceRecords.filter(r => r.date === today);
  
  if (classId) {
    const classStudents = attendanceData.students.filter(s => s.class === classId);
    const classStudentIds = classStudents.map(s => s.id);
    records = records.filter(r => classStudentIds.includes(r.studentId));
  }
  
  if (studentId) {
    records = records.filter(r => r.studentId === studentId);
  }
  
  return {
    date: today,
    total: records.length,
    present: records.filter(r => r.status === 'present').length,
    absent: records.filter(r => r.status === 'absent').length,
    late: records.filter(r => r.status === 'late').length,
    attendanceRate: records.length > 0 ? ((records.filter(r => r.status === 'present' || r.status === 'late').length / records.length) * 100).toFixed(1) : 0
  };
}

function calculateWeekStats(classId, studentId) {
  // Calculate last 7 days stats
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  let records = attendanceData.attendanceRecords.filter(r => dates.includes(r.date));
  
  if (classId) {
    const classStudents = attendanceData.students.filter(s => s.class === classId);
    const classStudentIds = classStudents.map(s => s.id);
    records = records.filter(r => classStudentIds.includes(r.studentId));
  }
  
  if (studentId) {
    records = records.filter(r => r.studentId === studentId);
  }
  
  return {
    period: 'week',
    dates: dates,
    total: records.length,
    present: records.filter(r => r.status === 'present').length,
    absent: records.filter(r => r.status === 'absent').length,
    late: records.filter(r => r.status === 'late').length,
    attendanceRate: records.length > 0 ? ((records.filter(r => r.status === 'present' || r.status === 'late').length / records.length) * 100).toFixed(1) : 0
  };
}

function calculateMonthStats(classId, studentId) {
  // Calculate current month stats
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
  
  let records = attendanceData.attendanceRecords.filter(r => r.date >= startOfMonth && r.date <= endOfMonth);
  
  if (classId) {
    const classStudents = attendanceData.students.filter(s => s.class === classId);
    const classStudentIds = classStudents.map(s => s.id);
    records = records.filter(r => classStudentIds.includes(r.studentId));
  }
  
  if (studentId) {
    records = records.filter(r => r.studentId === studentId);
  }
  
  return {
    period: 'month',
    startDate: startOfMonth,
    endDate: endOfMonth,
    total: records.length,
    present: records.filter(r => r.status === 'present').length,
    absent: records.filter(r => r.status === 'absent').length,
    late: records.filter(r => r.status === 'late').length,
    attendanceRate: records.length > 0 ? ((records.filter(r => r.status === 'present' || r.status === 'late').length / records.length) * 100).toFixed(1) : 0
  };
}

module.exports = router;
const fetch = require('node-fetch');
const ARATTAI_SEND_URL = process.env.NEXTPUBLICAPIURL + '/arattai-alert/send';

async function sendAttendanceAlert(parentPhone, studentName, date, schoolName) {
  const payload = {
    templateId: 'template_attendance_alert', // Use actual attendance alert template ID
    recipientNumber: parentPhone,
    variables: {
      parent_name: 'Parent',
      student_name: studentName,
      date: date,
      school_name: schoolName
    }
  };

  try {
    const response = await fetch(ARATTAI_SEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const resJson = await response.json();
    return resJson;
  } catch (error) {
    console.error('Error sending Arattai attendance alert:', error);
    return null;
  }
}

// Call sendAttendanceAlert after marking student absent

module.exports = { sendAttendanceAlert };
