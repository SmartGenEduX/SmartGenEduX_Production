// Substitution Log Module - Complete Implementation
const express = require('express');
const router = express.Router();

const substitutionData = {
  teachers: [
    {
      id: 'teacher_001',
      name: 'Ms. Priya Sharma',
      employeeId: 'EMP001',
      subjects: ['Mathematics', 'Science'],
      classes: ['Class 1-A', 'Class 2-A'],
      maxSubstitutionsPerWeek: 5,
      preferredSubjects: ['Mathematics', 'Science'],
      availabilityStatus: 'available',
      currentSubstitutions: 2,
      qualifications: ['M.Sc Mathematics', 'B.Ed'],
      contactPhone: '+91-9876543220'
    },
    {
      id: 'teacher_002',
      name: 'Mr. Rajesh Kumar',
      employeeId: 'EMP002',
      subjects: ['English', 'Hindi'],
      classes: ['Class 1-A', 'Class 2-A', 'Class 3-A'],
      maxSubstitutionsPerWeek: 6,
      preferredSubjects: ['English', 'Hindi', 'Social Studies'],
      availabilityStatus: 'available',
      currentSubstitutions: 1,
      qualifications: ['M.A English', 'B.Ed'],
      contactPhone: '+91-9876543221'
    },
    {
      id: 'teacher_003',
      name: 'Mrs. Anita Singh',
      employeeId: 'EMP003',
      subjects: ['Social Studies', 'Moral Education'],
      classes: ['Class 2-A', 'Class 3-A'],
      maxSubstitutionsPerWeek: 4,
      preferredSubjects: ['Social Studies', 'Moral Education', 'Hindi'],
      availabilityStatus: 'on_leave',
      currentSubstitutions: 0,
      qualifications: ['M.A History', 'B.Ed'],
      contactPhone: '+91-9876543222'
    },
    {
      id: 'teacher_004',
      name: 'Mr. Vikram Gupta',
      employeeId: 'EMP004',
      subjects: ['Computer Science', 'Physical Education'],
      classes: ['Class 1-A', 'Class 2-A', 'Class 3-A'],
      maxSubstitutionsPerWeek: 7,
      preferredSubjects: ['Computer Science', 'Physical Education', 'Mathematics'],
      availabilityStatus: 'available',
      currentSubstitutions: 3,
      qualifications: ['MCA', 'Sports Diploma'],
      contactPhone: '+91-9876543223'
    }
  ],

  substitutions: [
    {
      id: 'sub_001',
      originalTeacherId: 'teacher_003',
      substituteTeacherId: 'teacher_001',
      classId: 'class_2A',
      subject: 'Social Studies',
      date: '2024-12-29',
      period: 5,
      startTime: '10:30',
      endTime: '11:15',
      reason: 'Medical leave',
      status: 'confirmed',
      requestedBy: 'admin_001',
      confirmedBy: 'teacher_001',
      requestedAt: '2024-12-28T15:30:00Z',
      confirmedAt: '2024-12-28T16:15:00Z',
      notificationsSent: true,
      room: 'Room 201',
      lessonPlan: 'Chapter 5: Our Environment - Basic concepts',
      specialInstructions: 'Use PowerPoint presentation from shared folder',
      attendanceMarked: false,
      feedback: null
    },
    {
      id: 'sub_002',
      originalTeacherId: 'teacher_002',
      substituteTeacherId: 'teacher_004',
      classId: 'class_1A',
      subject: 'English',
      date: '2024-12-30',
      period: 2,
      startTime: '08:45',
      endTime: '09:30',
      reason: 'Personal emergency',
      status: 'pending',
      requestedBy: 'teacher_002',
      confirmedBy: null,
      requestedAt: '2024-12-29T08:00:00Z',
      confirmedAt: null,
      notificationsSent: false,
      room: 'Room 101',
      lessonPlan: 'Reading comprehension - Page 45-48',
      specialInstructions: 'Please ensure students complete worksheet',
      attendanceMarked: false,
      feedback: null
    },
    {
      id: 'sub_003',
      originalTeacherId: 'teacher_001',
      substituteTeacherId: 'teacher_002',
      classId: 'class_1A',
      subject: 'Mathematics',
      date: '2024-12-27',
      period: 1,
      startTime: '08:00',
      endTime: '08:45',
      reason: 'Training workshop',
      status: 'completed',
      requestedBy: 'admin_001',
      confirmedBy: 'teacher_002',
      requestedAt: '2024-12-25T10:00:00Z',
      confirmedAt: '2024-12-25T11:30:00Z',
      notificationsSent: true,
      room: 'Room 101',
      lessonPlan: 'Addition and subtraction - Practice exercises',
      specialInstructions: 'Use manipulatives for better understanding',
      attendanceMarked: true,
      feedback: 'Class went well. Students were cooperative and completed all exercises.'
    },
    {
      id: 'sub_004',
      originalTeacherId: 'teacher_004',
      substituteTeacherId: 'teacher_001',
      classId: 'class_3A',
      subject: 'Computer Science',
      date: '2024-12-26',
      period: 7,
      startTime: '12:00',
      endTime: '12:45',
      reason: 'Equipment maintenance',
      status: 'completed',
      requestedBy: 'admin_001',
      confirmedBy: 'teacher_001',
      requestedAt: '2024-12-25T14:00:00Z',
      confirmedAt: '2024-12-25T14:30:00Z',
      notificationsSent: true,
      room: 'Computer Lab',
      lessonPlan: 'Introduction to MS Paint - Basic drawing tools',
      specialInstructions: 'Computers are working fine now. Lab technician will assist.',
      attendanceMarked: true,
      feedback: 'Good session. Students enjoyed learning Paint tools.'
    }
  ],

  leaveApplications: [
    {
      id: 'leave_001',
      teacherId: 'teacher_003',
      type: 'medical_leave',
      startDate: '2024-12-29',
      endDate: '2024-12-31',
      reason: 'Doctor appointment and recovery',
      status: 'approved',
      appliedDate: '2024-12-27',
      approvedBy: 'admin_001',
      approvedDate: '2024-12-27',
      documents: ['medical_certificate.pdf'],
      substitute_required: true,
      classes_affected: ['Class 2-A', 'Class 3-A'],
      subjects_affected: ['Social Studies', 'Moral Education']
    },
    {
      id: 'leave_002',
      teacherId: 'teacher_002',
      type: 'emergency_leave',
      startDate: '2024-12-30',
      endDate: '2024-12-30',
      reason: 'Family emergency',
      status: 'approved',
      appliedDate: '2024-12-29',
      approvedBy: 'admin_001',
      approvedDate: '2024-12-29',
      documents: [],
      substitute_required: true,
      classes_affected: ['Class 1-A', 'Class 2-A'],
      subjects_affected: ['English', 'Hindi']
    }
  ],

  availabilityMatrix: {
    'teacher_001': {
      'Monday': [1, 2, 3, 5, 6, 7, 9, 10],
      'Tuesday': [1, 2, 3, 5, 6, 7, 9, 10],
      'Wednesday': [1, 2, 3, 5, 6, 7, 9, 10],
      'Thursday': [1, 2, 3, 5, 6, 7, 9, 10],
      'Friday': [1, 2, 3, 5, 6, 7, 9, 10]
    },
    'teacher_002': {
      'Monday': [1, 2, 3, 5, 6, 7, 9, 10],
      'Tuesday': [1, 2, 3, 5, 6, 7, 9, 10],
      'Wednesday': [1, 2, 3, 5, 6, 7, 9, 10],
      'Thursday': [1, 2, 3, 5, 6, 7, 9, 10],
      'Friday': [1, 2, 3, 5, 6, 7, 9, 10]
    },
    'teacher_004': {
      'Monday': [1, 2, 3, 5, 6, 7, 9, 10],
      'Tuesday': [1, 2, 3, 5, 6, 7, 9, 10],
      'Wednesday': [1, 2, 3, 5, 6, 7, 9, 10],
      'Thursday': [1, 2, 3, 5, 6, 7, 9, 10],
      'Friday': [1, 2, 3, 5, 6, 7, 9, 10]
    }
  },

  substitutionSettings: {
    autoAssignment: true,
    notificationMethods: ['email', 'sms', 'app'],
    advanceNoticeRequired: 24, // hours
    maxSubstitutionsPerTeacher: 8,
    preferenceWeightage: {
      subject_match: 40,
      availability: 30,
      workload: 20,
      preference: 10
    },
    emergencyContacts: [
      { name: 'Principal', phone: '+91-9876543200', email: 'principal@dps.edu' },
      { name: 'Vice Principal', phone: '+91-9876543201', email: 'vp@dps.edu' }
    ]
  }
};

// Get all substitutions
router.get('/', (req, res) => {
  const { date, status, teacherId, classId } = req.query;
  
  let substitutions = substitutionData.substitutions;
  
  // Filter by date
  if (date) {
    substitutions = substitutions.filter(sub => sub.date === date);
  }
  
  // Filter by status
  if (status) {
    substitutions = substitutions.filter(sub => sub.status === status);
  }
  
  // Filter by teacher
  if (teacherId) {
    substitutions = substitutions.filter(sub => 
      sub.originalTeacherId === teacherId || sub.substituteTeacherId === teacherId
    );
  }
  
  // Filter by class
  if (classId) {
    substitutions = substitutions.filter(sub => sub.classId === classId);
  }
  
  // Add teacher and class information
  const enrichedSubstitutions = substitutions.map(sub => {
    const originalTeacher = substitutionData.teachers.find(t => t.id === sub.originalTeacherId);
    const substituteTeacher = substitutionData.teachers.find(t => t.id === sub.substituteTeacherId);
    
    return {
      ...sub,
      originalTeacher: originalTeacher ? originalTeacher.name : 'Unknown',
      substituteTeacher: substituteTeacher ? substituteTeacher.name : 'TBD',
      dayOfWeek: new Date(sub.date).toLocaleDateString('en-US', { weekday: 'long' })
    };
  });
  
  res.json(enrichedSubstitutions);
});

// Get substitution by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  const substitution = substitutionData.substitutions.find(sub => sub.id === id);
  
  if (!substitution) {
    return res.status(404).json({ error: 'Substitution not found' });
  }
  
  // Add teacher information
  const originalTeacher = substitutionData.teachers.find(t => t.id === substitution.originalTeacherId);
  const substituteTeacher = substitutionData.teachers.find(t => t.id === substitution.substituteTeacherId);
  
  const enrichedSubstitution = {
    ...substitution,
    originalTeacher: originalTeacher,
    substituteTeacher: substituteTeacher,
    dayOfWeek: new Date(substitution.date).toLocaleDateString('en-US', { weekday: 'long' })
  };
  
  res.json(enrichedSubstitution);
});

// Create new substitution request
router.post('/', (req, res) => {
  const {
    originalTeacherId,
    classId,
    subject,
    date,
    period,
    startTime,
    endTime,
    reason,
    requestedBy,
    room,
    lessonPlan,
    specialInstructions,
    substituteTeacherId
  } = req.body;
  
  // Validate required fields
  if (!originalTeacherId || !classId || !subject || !date || !period || !reason) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // Check if original teacher exists
  const originalTeacher = substitutionData.teachers.find(t => t.id === originalTeacherId);
  if (!originalTeacher) {
    return res.status(404).json({ error: 'Original teacher not found' });
  }
  
  // Check for conflicts
  const conflict = substitutionData.substitutions.find(sub => 
    sub.date === date && sub.period === period && 
    (sub.classId === classId || sub.substituteTeacherId === substituteTeacherId)
  );
  
  if (conflict) {
    return res.status(409).json({ 
      error: 'Scheduling conflict detected',
      conflict: conflict 
    });
  }
  
  // Auto-assign substitute if not provided
  let assignedSubstitute = substituteTeacherId;
  if (!assignedSubstitute && substitutionData.substitutionSettings.autoAssignment) {
    assignedSubstitute = findBestSubstitute(subject, date, period, originalTeacherId);
  }
  
  // Create new substitution
  const newSubstitution = {
    id: 'sub_' + Date.now(),
    originalTeacherId,
    substituteTeacherId: assignedSubstitute,
    classId,
    subject,
    date,
    period: parseInt(period),
    startTime,
    endTime,
    reason,
    status: assignedSubstitute ? 'pending' : 'unassigned',
    requestedBy: requestedBy || 'system',
    confirmedBy: null,
    requestedAt: new Date().toISOString(),
    confirmedAt: null,
    notificationsSent: false,
    room: room || 'TBD',
    lessonPlan: lessonPlan || '',
    specialInstructions: specialInstructions || '',
    attendanceMarked: false,
    feedback: null
  };
  
  substitutionData.substitutions.push(newSubstitution);
  
  // Send notifications if substitute assigned
  if (assignedSubstitute) {
    sendSubstitutionNotifications(newSubstitution);
    newSubstitution.notificationsSent = true;
  }
  
  res.json({ 
    success: true, 
    substitution: newSubstitution,
    autoAssigned: !!assignedSubstitute
  });
});

// Update substitution
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  
  const substitutionIndex = substitutionData.substitutions.findIndex(sub => sub.id === id);
  
  if (substitutionIndex === -1) {
    return res.status(404).json({ error: 'Substitution not found' });
  }
  
  // Update substitution
  substitutionData.substitutions[substitutionIndex] = {
    ...substitutionData.substitutions[substitutionIndex],
    ...updateData,
    updatedAt: new Date().toISOString()
  };
  
  res.json({ 
    success: true, 
    substitution: substitutionData.substitutions[substitutionIndex] 
  });
});

// Confirm substitution
router.post('/:id/confirm', (req, res) => {
  const { id } = req.params;
  const { confirmedBy, notes } = req.body;
  
  const substitutionIndex = substitutionData.substitutions.findIndex(sub => sub.id === id);
  
  if (substitutionIndex === -1) {
    return res.status(404).json({ error: 'Substitution not found' });
  }
  
  const substitution = substitutionData.substitutions[substitutionIndex];
  
  if (substitution.status !== 'pending') {
    return res.status(400).json({ error: 'Substitution is not in pending status' });
  }
  
  // Update substitution status
  substitution.status = 'confirmed';
  substitution.confirmedBy = confirmedBy;
  substitution.confirmedAt = new Date().toISOString();
  substitution.notes = notes || '';
  
  // Update teacher's current substitutions count
  const substituteTeacher = substitutionData.teachers.find(t => t.id === substitution.substituteTeacherId);
  if (substituteTeacher) {
    substituteTeacher.currentSubstitutions += 1;
  }
  
  // Send confirmation notifications
  sendConfirmationNotifications(substitution);
  
  res.json({ success: true, substitution: substitution });
});

// Reject substitution
router.post('/:id/reject', (req, res) => {
  const { id } = req.params;
  const { rejectedBy, reason } = req.body;
  
  const substitutionIndex = substitutionData.substitutions.findIndex(sub => sub.id === id);
  
  if (substitutionIndex === -1) {
    return res.status(404).json({ error: 'Substitution not found' });
  }
  
  const substitution = substitutionData.substitutions[substitutionIndex];
  
  // Update substitution status
  substitution.status = 'rejected';
  substitution.rejectedBy = rejectedBy;
  substitution.rejectionReason = reason;
  substitution.rejectedAt = new Date().toISOString();
  
  // Try to find alternative substitute
  const alternativeSubstitute = findBestSubstitute(
    substitution.subject, 
    substitution.date, 
    substitution.period, 
    substitution.originalTeacherId,
    [substitution.substituteTeacherId] // exclude rejected teacher
  );
  
  if (alternativeSubstitute) {
    substitution.substituteTeacherId = alternativeSubstitute;
    substitution.status = 'pending';
    sendSubstitutionNotifications(substitution);
  }
  
  res.json({ 
    success: true, 
    substitution: substitution,
    alternativeFound: !!alternativeSubstitute
  });
});

// Get available substitutes
router.get('/available/:date/:period', (req, res) => {
  const { date, period } = req.params;
  const { subject, excludeTeachers = [] } = req.query;
  
  const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
  const periodNum = parseInt(period);
  const excludeList = Array.isArray(excludeTeachers) ? excludeTeachers : [excludeTeachers];
  
  const availableTeachers = substitutionData.teachers.filter(teacher => {
    // Exclude specified teachers
    if (excludeList.includes(teacher.id)) return false;
    
    // Check availability status
    if (teacher.availabilityStatus !== 'available') return false;
    
    // Check if teacher is available in this period
    const availability = substitutionData.availabilityMatrix[teacher.id];
    if (!availability || !availability[dayOfWeek] || !availability[dayOfWeek].includes(periodNum)) {
      return false;
    }
    
    // Check if teacher is already assigned for this period
    const conflictingSubstitution = substitutionData.substitutions.find(sub => 
      sub.date === date && sub.period === periodNum && 
      sub.substituteTeacherId === teacher.id && sub.status === 'confirmed'
    );
    
    if (conflictingSubstitution) return false;
    
    // Check workload limit
    if (teacher.currentSubstitutions >= teacher.maxSubstitutionsPerWeek) return false;
    
    return true;
  });
  
  // Score teachers based on subject match and preferences
  const scoredTeachers = availableTeachers.map(teacher => {
    let score = 0;
    
    // Subject match
    if (subject && teacher.subjects.includes(subject)) score += 40;
    if (subject && teacher.preferredSubjects.includes(subject)) score += 10;
    
    // Workload factor (lower is better)
    score += (teacher.maxSubstitutionsPerWeek - teacher.currentSubstitutions) * 5;
    
    return {
      ...teacher,
      score: score,
      subjectMatch: subject ? teacher.subjects.includes(subject) : false,
      preferenceMatch: subject ? teacher.preferredSubjects.includes(subject) : false
    };
  });
  
  // Sort by score (highest first)
  scoredTeachers.sort((a, b) => b.score - a.score);
  
  res.json(scoredTeachers);
});

// Get teacher availability
router.get('/teacher/:teacherId/availability', (req, res) => {
  const { teacherId } = req.params;
  const { startDate, endDate } = req.query;
  
  const teacher = substitutionData.teachers.find(t => t.id === teacherId);
  if (!teacher) {
    return res.status(404).json({ error: 'Teacher not found' });
  }
  
  const availability = substitutionData.availabilityMatrix[teacherId];
  
  // Get existing substitutions for the date range
  let substitutions = substitutionData.substitutions.filter(sub => 
    sub.substituteTeacherId === teacherId && sub.status === 'confirmed'
  );
  
  if (startDate && endDate) {
    substitutions = substitutions.filter(sub => 
      sub.date >= startDate && sub.date <= endDate
    );
  }
  
  res.json({
    teacher: teacher,
    weeklyAvailability: availability,
    currentSubstitutions: teacher.currentSubstitutions,
    maxSubstitutions: teacher.maxSubstitutionsPerWeek,
    upcomingSubstitutions: substitutions,
    availabilityStatus: teacher.availabilityStatus
  });
});

// Get substitution statistics
router.get('/stats/overview', (req, res) => {
  const { startDate, endDate } = req.query;
  
  let substitutions = substitutionData.substitutions;
  
  // Filter by date range if provided
  if (startDate && endDate) {
    substitutions = substitutions.filter(sub => 
      sub.date >= startDate && sub.date <= endDate
    );
  }
  
  const stats = {
    total: substitutions.length,
    confirmed: substitutions.filter(s => s.status === 'confirmed').length,
    pending: substitutions.filter(s => s.status === 'pending').length,
    rejected: substitutions.filter(s => s.status === 'rejected').length,
    completed: substitutions.filter(s => s.status === 'completed').length,
    
    // Reasons breakdown
    reasons: getReasonBreakdown(substitutions),
    
    // Most active substitute teachers
    topSubstitutes: getTopSubstitutes(substitutions),
    
    // Subject distribution
    subjectDistribution: getSubjectDistribution(substitutions),
    
    // Response time statistics
    averageResponseTime: calculateAverageResponseTime(substitutions),
    
    // Teacher workload
    teacherWorkload: getTeacherWorkload()
  };
  
  res.json(stats);
});

// Mark substitution as completed with feedback
router.post('/:id/complete', (req, res) => {
  const { id } = req.params;
  const { feedback, attendanceMarked, studentsBehavior, lessonsCompleted } = req.body;
  
  const substitutionIndex = substitutionData.substitutions.findIndex(sub => sub.id === id);
  
  if (substitutionIndex === -1) {
    return res.status(404).json({ error: 'Substitution not found' });
  }
  
  const substitution = substitutionData.substitutions[substitutionIndex];
  
  // Update substitution with completion details
  substitution.status = 'completed';
  substitution.feedback = feedback;
  substitution.attendanceMarked = attendanceMarked || false;
  substitution.studentsBehavior = studentsBehavior || 'good';
  substitution.lessonsCompleted = lessonsCompleted || true;
  substitution.completedAt = new Date().toISOString();
  
  res.json({ success: true, substitution: substitution });
});

// Helper Functions
function findBestSubstitute(subject, date, period, originalTeacherId, excludeTeachers = []) {
  const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
  const periodNum = parseInt(period);
  
  const availableTeachers = substitutionData.teachers.filter(teacher => {
    // Exclude original teacher and specified exclusions
    if (teacher.id === originalTeacherId || excludeTeachers.includes(teacher.id)) return false;
    
    // Check availability status
    if (teacher.availabilityStatus !== 'available') return false;
    
    // Check period availability
    const availability = substitutionData.availabilityMatrix[teacher.id];
    if (!availability || !availability[dayOfWeek] || !availability[dayOfWeek].includes(periodNum)) {
      return false;
    }
    
    // Check for conflicts
    const conflict = substitutionData.substitutions.find(sub => 
      sub.date === date && sub.period === periodNum && 
      sub.substituteTeacherId === teacher.id && sub.status === 'confirmed'
    );
    
    if (conflict) return false;
    
    // Check workload
    if (teacher.currentSubstitutions >= teacher.maxSubstitutionsPerWeek) return false;
    
    return true;
  });
  
  if (availableTeachers.length === 0) return null;
  
  // Score and select best substitute
  let bestTeacher = availableTeachers[0];
  let bestScore = 0;
  
  availableTeachers.forEach(teacher => {
    let score = 0;
    
    // Subject match
    if (teacher.subjects.includes(subject)) score += 40;
    if (teacher.preferredSubjects.includes(subject)) score += 10;
    
    // Workload factor
    score += (teacher.maxSubstitutionsPerWeek - teacher.currentSubstitutions) * 5;
    
    if (score > bestScore) {
      bestScore = score;
      bestTeacher = teacher;
    }
  });
  
  return bestTeacher.id;
}

function sendSubstitutionNotifications(substitution) {
  // Simulate sending notifications
  console.log(`Substitution notification sent for ${substitution.id}`);
  return true;
}

function sendConfirmationNotifications(substitution) {
  // Simulate sending confirmation notifications
  console.log(`Confirmation notification sent for ${substitution.id}`);
  return true;
}

function getReasonBreakdown(substitutions) {
  const reasons = {};
  substitutions.forEach(sub => {
    reasons[sub.reason] = (reasons[sub.reason] || 0) + 1;
  });
  return reasons;
}

function getTopSubstitutes(substitutions) {
  const teacherCounts = {};
  substitutions.forEach(sub => {
    if (sub.substituteTeacherId) {
      teacherCounts[sub.substituteTeacherId] = (teacherCounts[sub.substituteTeacherId] || 0) + 1;
    }
  });
  
  return Object.entries(teacherCounts)
    .map(([teacherId, count]) => {
      const teacher = substitutionData.teachers.find(t => t.id === teacherId);
      return {
        teacherId,
        teacherName: teacher ? teacher.name : 'Unknown',
        substitutionCount: count
      };
    })
    .sort((a, b) => b.substitutionCount - a.substitutionCount)
    .slice(0, 5);
}

function getSubjectDistribution(substitutions) {
  const subjects = {};
  substitutions.forEach(sub => {
    subjects[sub.subject] = (subjects[sub.subject] || 0) + 1;
  });
  return subjects;
}

function calculateAverageResponseTime(substitutions) {
  const confirmedSubs = substitutions.filter(sub => sub.confirmedAt && sub.requestedAt);
  
  if (confirmedSubs.length === 0) return 0;
  
  const totalTime = confirmedSubs.reduce((sum, sub) => {
    const requested = new Date(sub.requestedAt);
    const confirmed = new Date(sub.confirmedAt);
    return sum + (confirmed - requested);
  }, 0);
  
  return Math.round(totalTime / confirmedSubs.length / (1000 * 60 * 60)); // hours
}

function getTeacherWorkload() {
  return substitutionData.teachers.map(teacher => ({
    teacherId: teacher.id,
    teacherName: teacher.name,
    currentSubstitutions: teacher.currentSubstitutions,
    maxSubstitutions: teacher.maxSubstitutionsPerWeek,
    utilizationRate: ((teacher.currentSubstitutions / teacher.maxSubstitutionsPerWeek) * 100).toFixed(1)
  }));
}

module.exports = router;