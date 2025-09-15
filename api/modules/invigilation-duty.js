// Invigilation Duty Allocation Module - Complete Implementation
const express = require('express');
const router = express.Router();

const invigilationData = {
  teachers: [
    {
      id: 'teacher_001',
      name: 'Ms. Priya Sharma',
      employeeId: 'EMP001',
      department: 'Mathematics',
      experience: 8,
      maxDutiesPerExam: 3,
      maxDutiesPerWeek: 8,
      currentDuties: 2,
      preferences: {
        timeSlots: ['morning', 'afternoon'],
        venues: ['classroom', 'hall'],
        avoidConsecutive: true
      },
      unavailability: [],
      performanceRating: 4.8,
      contactPhone: '+91-9876543220'
    },
    {
      id: 'teacher_002',
      name: 'Mr. Rajesh Kumar',
      employeeId: 'EMP002',
      department: 'English',
      experience: 12,
      maxDutiesPerExam: 4,
      maxDutiesPerWeek: 10,
      currentDuties: 1,
      preferences: {
        timeSlots: ['morning', 'afternoon', 'evening'],
        venues: ['classroom', 'hall', 'lab'],
        avoidConsecutive: false
      },
      unavailability: ['2024-12-30'],
      performanceRating: 4.6,
      contactPhone: '+91-9876543221'
    },
    {
      id: 'teacher_003',
      name: 'Mrs. Anita Singh',
      employeeId: 'EMP003',
      department: 'Social Studies',
      experience: 10,
      maxDutiesPerExam: 3,
      maxDutiesPerWeek: 7,
      currentDuties: 3,
      preferences: {
        timeSlots: ['morning'],
        venues: ['classroom'],
        avoidConsecutive: true
      },
      unavailability: [],
      performanceRating: 4.7,
      contactPhone: '+91-9876543222'
    },
    {
      id: 'teacher_004',
      name: 'Mr. Vikram Gupta',
      employeeId: 'EMP004',
      department: 'Computer Science',
      experience: 5,
      maxDutiesPerExam: 2,
      maxDutiesPerWeek: 6,
      currentDuties: 0,
      preferences: {
        timeSlots: ['morning', 'afternoon'],
        venues: ['lab', 'classroom'],
        avoidConsecutive: true
      },
      unavailability: [],
      performanceRating: 4.5,
      contactPhone: '+91-9876543223'
    }
  ],

  examSchedule: [
    {
      id: 'exam_001',
      examName: 'Mid-Term Examination - Mathematics',
      subject: 'Mathematics',
      date: '2024-12-30',
      startTime: '09:00',
      endTime: '12:00',
      duration: 180, // minutes
      classes: ['Class 1-A', 'Class 1-B', 'Class 2-A'],
      totalStudents: 85,
      venues: [
        {
          id: 'venue_001',
          name: 'Main Hall',
          capacity: 50,
          studentsAssigned: 50,
          invigilatorsRequired: 2,
          invigilatorsAssigned: ['teacher_001', 'teacher_002']
        },
        {
          id: 'venue_002',
          name: 'Room 101',
          capacity: 35,
          studentsAssigned: 35,
          invigilatorsRequired: 1,
          invigilatorsAssigned: ['teacher_003']
        }
      ],
      status: 'scheduled',
      examType: 'written',
      specialInstructions: 'Calculator not allowed. Extra answer sheets available.',
      chiefInvigilator: 'teacher_001'
    },
    {
      id: 'exam_002',
      examName: 'English Language Assessment',
      subject: 'English',
      date: '2024-12-31',
      startTime: '10:00',
      endTime: '12:30',
      duration: 150,
      classes: ['Class 2-A', 'Class 2-B', 'Class 3-A'],
      totalStudents: 92,
      venues: [
        {
          id: 'venue_003',
          name: 'Main Hall',
          capacity: 50,
          studentsAssigned: 50,
          invigilatorsRequired: 2,
          invigilatorsAssigned: []
        },
        {
          id: 'venue_004',
          name: 'Room 102',
          capacity: 42,
          studentsAssigned: 42,
          invigilatorsRequired: 2,
          invigilatorsAssigned: []
        }
      ],
      status: 'pending_allocation',
      examType: 'written',
      specialInstructions: 'Dictionary not allowed. Listening test equipment check required.',
      chiefInvigilator: null
    },
    {
      id: 'exam_003',
      examName: 'Science Practical Assessment',
      subject: 'Science',
      date: '2025-01-02',
      startTime: '14:00',
      endTime: '16:00',
      duration: 120,
      classes: ['Class 3-A', 'Class 4-A', 'Class 5-A'],
      totalStudents: 67,
      venues: [
        {
          id: 'venue_005',
          name: 'Science Laboratory',
          capacity: 25,
          studentsAssigned: 25,
          invigilatorsRequired: 2,
          invigilatorsAssigned: []
        },
        {
          id: 'venue_006',
          name: 'Physics Lab',
          capacity: 25,
          studentsAssigned: 25,
          invigilatorsAssigned: []
        },
        {
          id: 'venue_007',
          name: 'Chemistry Lab',
          capacity: 20,
          studentsAssigned: 17,
          invigilatorsRequired: 1,
          invigilatorsAssigned: []
        }
      ],
      status: 'draft',
      examType: 'practical',
      specialInstructions: 'Safety equipment mandatory. Lab technician assistance required.',
      chiefInvigilator: null
    }
  ],

  dutyAllocations: [
    {
      id: 'duty_001',
      examId: 'exam_001',
      teacherId: 'teacher_001',
      venueId: 'venue_001',
      role: 'chief_invigilator',
      startTime: '08:45',
      endTime: '12:15',
      status: 'confirmed',
      assignedAt: '2024-12-25T10:30:00Z',
      assignedBy: 'admin_001',
      confirmedAt: '2024-12-25T11:00:00Z',
      specialDuties: ['distribute_papers', 'collect_papers', 'maintain_silence'],
      compensation: 300,
      notes: 'Chief invigilator for main hall'
    },
    {
      id: 'duty_002',
      examId: 'exam_001',
      teacherId: 'teacher_002',
      venueId: 'venue_001',
      role: 'invigilator',
      startTime: '08:45',
      endTime: '12:15',
      status: 'confirmed',
      assignedAt: '2024-12-25T10:30:00Z',
      assignedBy: 'admin_001',
      confirmedAt: '2024-12-25T11:15:00Z',
      specialDuties: ['monitor_students', 'assist_chief'],
      compensation: 200,
      notes: 'Assistant invigilator for main hall'
    },
    {
      id: 'duty_003',
      examId: 'exam_001',
      teacherId: 'teacher_003',
      venueId: 'venue_002',
      role: 'invigilator',
      startTime: '08:45',
      endTime: '12:15',
      status: 'confirmed',
      assignedAt: '2024-12-25T10:30:00Z',
      assignedBy: 'admin_001',
      confirmedAt: '2024-12-25T12:00:00Z',
      specialDuties: ['monitor_students', 'distribute_papers', 'collect_papers'],
      compensation: 250,
      notes: 'Solo invigilator for Room 101'
    }
  ],

  dutyRoster: [
    {
      date: '2024-12-30',
      duties: [
        {
          examId: 'exam_001',
          examName: 'Mid-Term Examination - Mathematics',
          timeSlot: '09:00-12:00',
          venues: [
            {
              venueId: 'venue_001',
              venueName: 'Main Hall',
              invigilators: [
                { teacherId: 'teacher_001', teacherName: 'Ms. Priya Sharma', role: 'chief' },
                { teacherId: 'teacher_002', teacherName: 'Mr. Rajesh Kumar', role: 'assistant' }
              ]
            },
            {
              venueId: 'venue_002',
              venueName: 'Room 101',
              invigilators: [
                { teacherId: 'teacher_003', teacherName: 'Mrs. Anita Singh', role: 'solo' }
              ]
            }
          ]
        }
      ]
    },
    {
      date: '2024-12-31',
      duties: [
        {
          examId: 'exam_002',
          examName: 'English Language Assessment',
          timeSlot: '10:00-12:30',
          venues: [
            {
              venueId: 'venue_003',
              venueName: 'Main Hall',
              invigilators: []
            },
            {
              venueId: 'venue_004',
              venueName: 'Room 102',
              invigilators: []
            }
          ]
        }
      ]
    }
  ],

  allocationSettings: {
    autoAllocation: true,
    fairDistribution: true,
    respectPreferences: true,
    avoidConsecutiveDuties: true,
    compensationRates: {
      chief_invigilator: 300,
      invigilator: 200,
      practical_supervisor: 250,
      lab_assistant: 150
    },
    workloadLimits: {
      maxDutiesPerDay: 2,
      maxDutiesPerWeek: 8,
      maxConsecutiveDays: 3,
      minRestBetweenDuties: 60 // minutes
    },
    notificationSettings: {
      advanceNotice: 48, // hours
      reminderBeforeExam: 24, // hours
      methods: ['email', 'sms', 'app_notification']
    },
    substitutionPolicy: {
      allowLastMinute: true,
      emergencyPool: ['teacher_004'],
      autoFindSubstitute: true
    }
  },

  venues: [
    {
      id: 'venue_001',
      name: 'Main Hall',
      type: 'hall',
      capacity: 50,
      facilities: ['projector', 'microphone', 'cctv', 'air_conditioning'],
      location: 'Ground Floor',
      invigilatorsRequired: 2,
      suitableFor: ['written_exam', 'practical_exam'],
      accessibility: true
    },
    {
      id: 'venue_002',
      name: 'Room 101',
      type: 'classroom',
      capacity: 35,
      facilities: ['whiteboard', 'cctv', 'fan'],
      location: 'First Floor',
      invigilatorsRequired: 1,
      suitableFor: ['written_exam'],
      accessibility: false
    },
    {
      id: 'venue_003',
      name: 'Room 102',
      type: 'classroom',
      capacity: 42,
      facilities: ['smartboard', 'cctv', 'air_conditioning'],
      location: 'First Floor',
      invigilatorsRequired: 2,
      suitableFor: ['written_exam'],
      accessibility: true
    },
    {
      id: 'venue_004',
      name: 'Science Laboratory',
      type: 'laboratory',
      capacity: 25,
      facilities: ['lab_equipment', 'safety_gear', 'fume_hood', 'emergency_shower'],
      location: 'Second Floor',
      invigilatorsRequired: 2,
      suitableFor: ['practical_exam'],
      accessibility: false
    },
    {
      id: 'venue_005',
      name: 'Computer Lab',
      type: 'laboratory',
      capacity: 30,
      facilities: ['computers', 'internet', 'projector', 'air_conditioning'],
      location: 'Second Floor',
      invigilatorsRequired: 2,
      suitableFor: ['computer_exam', 'online_exam'],
      accessibility: true
    }
  ],

  reports: {
    dutyDistribution: {
      totalDuties: 15,
      teacherWorkload: [
        { teacherId: 'teacher_001', teacherName: 'Ms. Priya Sharma', dutiesAssigned: 5, compensation: 1200 },
        { teacherId: 'teacher_002', teacherName: 'Mr. Rajesh Kumar', dutiesAssigned: 4, compensation: 900 },
        { teacherId: 'teacher_003', teacherName: 'Mrs. Anita Singh', dutiesAssigned: 3, compensation: 750 },
        { teacherId: 'teacher_004', teacherName: 'Mr. Vikram Gupta', dutiesAssigned: 3, compensation: 600 }
      ]
    },
    examCoverage: {
      totalExams: 8,
      fullyStaffed: 6,
      partiallyStaffed: 1,
      unstaffed: 1,
      coverageRate: 87.5
    },
    performance: {
      onTimeArrival: 96.7,
      properConduct: 98.2,
      studentSatisfaction: 4.3,
      issuesReported: 2
    }
  }
};

// Get all teachers available for invigilation duty
router.get('/teachers', (req, res) => {
  const { available, date, timeSlot, venue } = req.query;
  
  let teachers = invigilationData.teachers;
  
  // Filter by availability
  if (available === 'true' && date) {
    teachers = teachers.filter(teacher => 
      !teacher.unavailability.includes(date) &&
      teacher.currentDuties < teacher.maxDutiesPerWeek
    );
  }
  
  // Filter by time preferences
  if (timeSlot) {
    teachers = teachers.filter(teacher => 
      teacher.preferences.timeSlots.includes(timeSlot)
    );
  }
  
  // Filter by venue preferences
  if (venue) {
    const venueInfo = invigilationData.venues.find(v => v.id === venue);
    if (venueInfo) {
      teachers = teachers.filter(teacher => 
        teacher.preferences.venues.includes(venueInfo.type)
      );
    }
  }
  
  // Add workload information
  const enrichedTeachers = teachers.map(teacher => {
    const workloadPercentage = (teacher.currentDuties / teacher.maxDutiesPerWeek) * 100;
    const upcomingDuties = invigilationData.dutyAllocations.filter(duty => 
      duty.teacherId === teacher.id && duty.status === 'confirmed'
    );
    
    return {
      ...teacher,
      workloadPercentage: workloadPercentage.toFixed(1),
      upcomingDuties: upcomingDuties.length,
      availability: teacher.currentDuties < teacher.maxDutiesPerWeek ? 'available' : 'overloaded'
    };
  });
  
  res.json(enrichedTeachers);
});

// Get exam schedule
router.get('/exams', (req, res) => {
  const { status, date, subject } = req.query;
  
  let exams = invigilationData.examSchedule;
  
  // Apply filters
  if (status) {
    exams = exams.filter(exam => exam.status === status);
  }
  
  if (date) {
    exams = exams.filter(exam => exam.date === date);
  }
  
  if (subject) {
    exams = exams.filter(exam => exam.subject === subject);
  }
  
  // Add allocation summary
  const enrichedExams = exams.map(exam => {
    const totalInvigilatorsRequired = exam.venues.reduce((sum, venue) => 
      sum + venue.invigilatorsRequired, 0
    );
    const totalInvigilatorsAssigned = exam.venues.reduce((sum, venue) => 
      sum + venue.invigilatorsAssigned.length, 0
    );
    
    return {
      ...exam,
      allocationSummary: {
        totalRequired: totalInvigilatorsRequired,
        totalAssigned: totalInvigilatorsAssigned,
        allocationRate: totalInvigilatorsRequired > 0 ? 
          ((totalInvigilatorsAssigned / totalInvigilatorsRequired) * 100).toFixed(1) : 0,
        status: totalInvigilatorsAssigned === totalInvigilatorsRequired ? 'fully_staffed' : 
                totalInvigilatorsAssigned > 0 ? 'partially_staffed' : 'unstaffed'
      }
    };
  });
  
  res.json(enrichedExams);
});

// Get exam by ID
router.get('/exams/:examId', (req, res) => {
  const { examId } = req.params;
  
  const exam = invigilationData.examSchedule.find(e => e.id === examId);
  
  if (!exam) {
    return res.status(404).json({ error: 'Exam not found' });
  }
  
  // Get duty allocations for this exam
  const duties = invigilationData.dutyAllocations.filter(duty => duty.examId === examId);
  
  // Enrich venues with teacher information
  const enrichedVenues = exam.venues.map(venue => {
    const venueInfo = invigilationData.venues.find(v => v.id === venue.id);
    const venueDuties = duties.filter(duty => duty.venueId === venue.id);
    
    const invigilators = venue.invigilatorsAssigned.map(teacherId => {
      const teacher = invigilationData.teachers.find(t => t.id === teacherId);
      const duty = venueDuties.find(d => d.teacherId === teacherId);
      
      return {
        teacherId: teacherId,
        teacherName: teacher ? teacher.name : 'Unknown',
        role: duty ? duty.role : 'invigilator',
        status: duty ? duty.status : 'pending'
      };
    });
    
    return {
      ...venue,
      venueInfo: venueInfo,
      invigilators: invigilators,
      allocationComplete: venue.invigilatorsAssigned.length >= venue.invigilatorsRequired
    };
  });
  
  res.json({
    ...exam,
    venues: enrichedVenues,
    duties: duties
  });
});

// Create new exam
router.post('/exams', (req, res) => {
  const examData = req.body;
  
  // Validate required fields
  const requiredFields = ['examName', 'subject', 'date', 'startTime', 'endTime', 'classes'];
  for (const field of requiredFields) {
    if (!examData[field]) {
      return res.status(400).json({ error: `${field} is required` });
    }
  }
  
  // Calculate duration
  const startTime = new Date(`2000-01-01T${examData.startTime}`);
  const endTime = new Date(`2000-01-01T${examData.endTime}`);
  const duration = (endTime - startTime) / (1000 * 60); // minutes
  
  // Create new exam
  const newExam = {
    id: 'exam_' + Date.now(),
    ...examData,
    duration: duration,
    totalStudents: examData.totalStudents || 0,
    venues: examData.venues || [],
    status: 'draft',
    examType: examData.examType || 'written',
    chiefInvigilator: null,
    createdAt: new Date().toISOString()
  };
  
  invigilationData.examSchedule.push(newExam);
  
  res.json({ 
    success: true, 
    exam: newExam,
    message: 'Exam created successfully'
  });
});

// Update exam
router.put('/exams/:examId', (req, res) => {
  const { examId } = req.params;
  const updateData = req.body;
  
  const examIndex = invigilationData.examSchedule.findIndex(e => e.id === examId);
  
  if (examIndex === -1) {
    return res.status(404).json({ error: 'Exam not found' });
  }
  
  // Update exam
  invigilationData.examSchedule[examIndex] = {
    ...invigilationData.examSchedule[examIndex],
    ...updateData,
    updatedAt: new Date().toISOString()
  };
  
  res.json({ 
    success: true, 
    exam: invigilationData.examSchedule[examIndex] 
  });
});

// Auto-allocate invigilators for an exam
router.post('/exams/:examId/auto-allocate', (req, res) => {
  const { examId } = req.params;
  const { preferences = {} } = req.body;
  
  const exam = invigilationData.examSchedule.find(e => e.id === examId);
  
  if (!exam) {
    return res.status(404).json({ error: 'Exam not found' });
  }
  
  const allocations = [];
  const errors = [];
  
  // Get time slot for preferences
  const timeSlot = getTimeSlot(exam.startTime);
  
  for (const venue of exam.venues) {
    const availableTeachers = findAvailableTeachers(
      exam.date, 
      timeSlot, 
      venue.id, 
      venue.invigilatorsRequired
    );
    
    if (availableTeachers.length < venue.invigilatorsRequired) {
      errors.push(`Not enough available teachers for ${venue.name}`);
      continue;
    }
    
    // Assign chief invigilator for main venue
    let chiefAssigned = false;
    
    for (let i = 0; i < venue.invigilatorsRequired; i++) {
      const teacher = availableTeachers[i];
      const role = (!chiefAssigned && venue.invigilatorsRequired > 1) ? 'chief_invigilator' : 'invigilator';
      
      if (role === 'chief_invigilator') {
        chiefAssigned = true;
        exam.chiefInvigilator = teacher.id;
      }
      
      // Create duty allocation
      const duty = {
        id: 'duty_' + Date.now() + '_' + i,
        examId: examId,
        teacherId: teacher.id,
        venueId: venue.id,
        role: role,
        startTime: adjustTime(exam.startTime, -15), // 15 minutes before exam
        endTime: adjustTime(exam.endTime, 15), // 15 minutes after exam
        status: 'assigned',
        assignedAt: new Date().toISOString(),
        assignedBy: 'auto_system',
        specialDuties: getDefaultDuties(role),
        compensation: invigilationData.allocationSettings.compensationRates[role],
        notes: `Auto-assigned for ${exam.examName}`
      };
      
      allocations.push(duty);
      venue.invigilatorsAssigned.push(teacher.id);
      
      // Update teacher's current duties
      teacher.currentDuties += 1;
    }
  }
  
  // Save allocations
  invigilationData.dutyAllocations.push(...allocations);
  
  // Update exam status
  if (errors.length === 0) {
    exam.status = 'scheduled';
  } else {
    exam.status = 'partially_scheduled';
  }
  
  res.json({
    success: true,
    allocationsCreated: allocations.length,
    allocations: allocations,
    errors: errors,
    message: `Auto-allocation completed. ${allocations.length} duties assigned.`
  });
});

// Manual allocation of invigilator
router.post('/allocate-duty', (req, res) => {
  const {
    examId,
    teacherId,
    venueId,
    role = 'invigilator',
    specialDuties = [],
    notes = ''
  } = req.body;
  
  // Validate required fields
  if (!examId || !teacherId || !venueId) {
    return res.status(400).json({ error: 'Exam ID, Teacher ID, and Venue ID are required' });
  }
  
  // Check if exam exists
  const exam = invigilationData.examSchedule.find(e => e.id === examId);
  if (!exam) {
    return res.status(404).json({ error: 'Exam not found' });
  }
  
  // Check if teacher exists and is available
  const teacher = invigilationData.teachers.find(t => t.id === teacherId);
  if (!teacher) {
    return res.status(404).json({ error: 'Teacher not found' });
  }
  
  // Check if teacher is available on exam date
  if (teacher.unavailability.includes(exam.date)) {
    return res.status(400).json({ error: 'Teacher is not available on this date' });
  }
  
  // Check workload limits
  if (teacher.currentDuties >= teacher.maxDutiesPerWeek) {
    return res.status(400).json({ error: 'Teacher has reached maximum duty limit' });
  }
  
  // Check for conflicts
  const conflictingDuty = invigilationData.dutyAllocations.find(duty => 
    duty.teacherId === teacherId && 
    duty.examId === examId // Same exam
  );
  
  if (conflictingDuty) {
    return res.status(409).json({ error: 'Teacher already assigned to this exam' });
  }
  
  // Create duty allocation
  const newDuty = {
    id: 'duty_' + Date.now(),
    examId,
    teacherId,
    venueId,
    role,
    startTime: adjustTime(exam.startTime, -15),
    endTime: adjustTime(exam.endTime, 15),
    status: 'assigned',
    assignedAt: new Date().toISOString(),
    assignedBy: 'manual',
    confirmedAt: null,
    specialDuties: specialDuties.length > 0 ? specialDuties : getDefaultDuties(role),
    compensation: invigilationData.allocationSettings.compensationRates[role] || 200,
    notes: notes
  };
  
  invigilationData.dutyAllocations.push(newDuty);
  
  // Update venue assignment
  const venue = exam.venues.find(v => v.id === venueId);
  if (venue && !venue.invigilatorsAssigned.includes(teacherId)) {
    venue.invigilatorsAssigned.push(teacherId);
  }
  
  // Update teacher's current duties
  teacher.currentDuties += 1;
  
  // Set as chief invigilator if first assignment and role is chief
  if (role === 'chief_invigilator') {
    exam.chiefInvigilator = teacherId;
  }
  
  // Send notification to teacher
  sendDutyNotification(teacher, exam, newDuty);
  
  res.json({ 
    success: true, 
    duty: newDuty,
    message: 'Duty allocated successfully'
  });
});

// Confirm duty assignment
router.post('/duties/:dutyId/confirm', (req, res) => {
  const { dutyId } = req.params;
  const { confirmedBy, notes } = req.body;
  
  const dutyIndex = invigilationData.dutyAllocations.findIndex(duty => duty.id === dutyId);
  
  if (dutyIndex === -1) {
    return res.status(404).json({ error: 'Duty not found' });
  }
  
  const duty = invigilationData.dutyAllocations[dutyIndex];
  
  // Update duty status
  duty.status = 'confirmed';
  duty.confirmedAt = new Date().toISOString();
  duty.confirmedBy = confirmedBy;
  duty.confirmationNotes = notes || '';
  
  res.json({ 
    success: true, 
    duty: duty,
    message: 'Duty confirmed successfully'
  });
});

// Request substitution
router.post('/duties/:dutyId/request-substitution', (req, res) => {
  const { dutyId } = req.params;
  const { reason, requestedBy } = req.body;
  
  const duty = invigilationData.dutyAllocations.find(d => d.id === dutyId);
  
  if (!duty) {
    return res.status(404).json({ error: 'Duty not found' });
  }
  
  const exam = invigilationData.examSchedule.find(e => e.id === duty.examId);
  
  // Find substitute teacher
  const timeSlot = getTimeSlot(exam.startTime);
  const availableSubstitutes = findAvailableTeachers(
    exam.date, 
    timeSlot, 
    duty.venueId, 
    1,
    [duty.teacherId] // exclude original teacher
  );
  
  if (availableSubstitutes.length === 0) {
    return res.status(400).json({ error: 'No substitute teachers available' });
  }
  
  const substitute = availableSubstitutes[0];
  
  // Update original duty
  duty.status = 'substituted';
  duty.substitutionReason = reason;
  duty.substitutionRequestedAt = new Date().toISOString();
  duty.substitutionRequestedBy = requestedBy;
  
  // Create new duty for substitute
  const substituteDuty = {
    ...duty,
    id: 'duty_sub_' + Date.now(),
    teacherId: substitute.id,
    status: 'assigned',
    assignedAt: new Date().toISOString(),
    assignedBy: 'substitution',
    originalDutyId: duty.id,
    notes: `Substitute duty for ${duty.teacherId} - Reason: ${reason}`
  };
  
  invigilationData.dutyAllocations.push(substituteDuty);
  
  // Update venue assignment
  const venue = exam.venues.find(v => v.id === duty.venueId);
  if (venue) {
    const index = venue.invigilatorsAssigned.indexOf(duty.teacherId);
    if (index > -1) {
      venue.invigilatorsAssigned[index] = substitute.id;
    }
  }
  
  // Update teacher workloads
  const originalTeacher = invigilationData.teachers.find(t => t.id === duty.teacherId);
  if (originalTeacher) {
    originalTeacher.currentDuties = Math.max(0, originalTeacher.currentDuties - 1);
  }
  
  substitute.currentDuties += 1;
  
  res.json({
    success: true,
    originalDuty: duty,
    substituteDuty: substituteDuty,
    substitute: substitute,
    message: `Substitute ${substitute.name} assigned successfully`
  });
});

// Get duty roster
router.get('/roster', (req, res) => {
  const { startDate, endDate, teacherId } = req.query;
  
  let roster = invigilationData.dutyRoster;
  
  // Filter by date range
  if (startDate && endDate) {
    roster = roster.filter(day => day.date >= startDate && day.date <= endDate);
  }
  
  // Filter by teacher
  if (teacherId) {
    roster = roster.map(day => ({
      ...day,
      duties: day.duties.map(duty => ({
        ...duty,
        venues: duty.venues.map(venue => ({
          ...venue,
          invigilators: venue.invigilators.filter(inv => inv.teacherId === teacherId)
        })).filter(venue => venue.invigilators.length > 0)
      })).filter(duty => duty.venues.length > 0)
    })).filter(day => day.duties.length > 0);
  }
  
  res.json(roster);
});

// Get duty allocations
router.get('/duties', (req, res) => {
  const { examId, teacherId, status, venueId } = req.query;
  
  let duties = invigilationData.dutyAllocations;
  
  // Apply filters
  if (examId) {
    duties = duties.filter(duty => duty.examId === examId);
  }
  
  if (teacherId) {
    duties = duties.filter(duty => duty.teacherId === teacherId);
  }
  
  if (status) {
    duties = duties.filter(duty => duty.status === status);
  }
  
  if (venueId) {
    duties = duties.filter(duty => duty.venueId === venueId);
  }
  
  // Enrich with exam and teacher information
  const enrichedDuties = duties.map(duty => {
    const exam = invigilationData.examSchedule.find(e => e.id === duty.examId);
    const teacher = invigilationData.teachers.find(t => t.id === duty.teacherId);
    const venue = invigilationData.venues.find(v => v.id === duty.venueId);
    
    return {
      ...duty,
      examName: exam ? exam.examName : 'Unknown',
      examDate: exam ? exam.date : null,
      teacherName: teacher ? teacher.name : 'Unknown',
      venueName: venue ? venue.name : 'Unknown'
    };
  });
  
  res.json(enrichedDuties);
});

// Get venues
router.get('/venues', (req, res) => {
  const { type, capacity } = req.query;
  
  let venues = invigilationData.venues;
  
  // Filter by type
  if (type) {
    venues = venues.filter(venue => venue.type === type);
  }
  
  // Filter by minimum capacity
  if (capacity) {
    venues = venues.filter(venue => venue.capacity >= parseInt(capacity));
  }
  
  res.json(venues);
});

// Get allocation statistics
router.get('/statistics', (req, res) => {
  const stats = {
    overview: {
      totalExams: invigilationData.examSchedule.length,
      totalDuties: invigilationData.dutyAllocations.length,
      totalTeachers: invigilationData.teachers.length,
      totalVenues: invigilationData.venues.length
    },
    examStatus: getExamStatusDistribution(),
    dutyStatus: getDutyStatusDistribution(),
    teacherWorkload: getTeacherWorkloadStats(),
    venueUtilization: getVenueUtilizationStats(),
    compensation: getCompensationStats(),
    performance: invigilationData.reports.performance
  };
  
  res.json(stats);
});

// Helper Functions
function findAvailableTeachers(date, timeSlot, venueId, count, excludeTeachers = []) {
  const venue = invigilationData.venues.find(v => v.id === venueId);
  
  const availableTeachers = invigilationData.teachers.filter(teacher => {
    // Exclude specified teachers
    if (excludeTeachers.includes(teacher.id)) return false;
    
    // Check availability on date
    if (teacher.unavailability.includes(date)) return false;
    
    // Check workload limits
    if (teacher.currentDuties >= teacher.maxDutiesPerWeek) return false;
    
    // Check time slot preferences
    if (!teacher.preferences.timeSlots.includes(timeSlot)) return false;
    
    // Check venue type preferences
    if (venue && !teacher.preferences.venues.includes(venue.type)) return false;
    
    return true;
  });
  
  // Sort by workload (ascending) and performance (descending)
  availableTeachers.sort((a, b) => {
    const workloadDiff = a.currentDuties - b.currentDuties;
    if (workloadDiff !== 0) return workloadDiff;
    return b.performanceRating - a.performanceRating;
  });
  
  return availableTeachers.slice(0, count);
}

function getTimeSlot(timeString) {
  const hour = parseInt(timeString.split(':')[0]);
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

function adjustTime(timeString, minutesToAdd) {
  const [hours, minutes] = timeString.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + minutesToAdd;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMinutes = totalMinutes % 60;
  return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
}

function getDefaultDuties(role) {
  const duties = {
    'chief_invigilator': ['distribute_papers', 'collect_papers', 'maintain_silence', 'coordinate_venue'],
    'invigilator': ['monitor_students', 'maintain_silence', 'assist_students'],
    'practical_supervisor': ['setup_equipment', 'monitor_practical', 'ensure_safety'],
    'lab_assistant': ['assist_students', 'manage_equipment', 'maintain_safety']
  };
  
  return duties[role] || duties['invigilator'];
}

function sendDutyNotification(teacher, exam, duty) {
  // Simulate sending notification
  console.log(`Duty notification sent to ${teacher.name} for ${exam.examName} on ${exam.date}`);
  return true;
}

function getExamStatusDistribution() {
  const distribution = {};
  invigilationData.examSchedule.forEach(exam => {
    distribution[exam.status] = (distribution[exam.status] || 0) + 1;
  });
  return distribution;
}

function getDutyStatusDistribution() {
  const distribution = {};
  invigilationData.dutyAllocations.forEach(duty => {
    distribution[duty.status] = (distribution[duty.status] || 0) + 1;
  });
  return distribution;
}

function getTeacherWorkloadStats() {
  return invigilationData.teachers.map(teacher => {
    const duties = invigilationData.dutyAllocations.filter(d => d.teacherId === teacher.id);
    const totalCompensation = duties.reduce((sum, duty) => sum + (duty.compensation || 0), 0);
    
    return {
      teacherId: teacher.id,
      teacherName: teacher.name,
      currentDuties: teacher.currentDuties,
      maxDuties: teacher.maxDutiesPerWeek,
      utilizationRate: ((teacher.currentDuties / teacher.maxDutiesPerWeek) * 100).toFixed(1),
      totalCompensation: totalCompensation
    };
  });
}

function getVenueUtilizationStats() {
  const utilization = {};
  
  invigilationData.examSchedule.forEach(exam => {
    exam.venues.forEach(venue => {
      if (!utilization[venue.id]) {
        const venueInfo = invigilationData.venues.find(v => v.id === venue.id);
        utilization[venue.id] = {
          venueName: venueInfo ? venueInfo.name : venue.id,
          timesUsed: 0,
          totalCapacity: venueInfo ? venueInfo.capacity : 0,
          totalStudentsAccommodated: 0
        };
      }
      utilization[venue.id].timesUsed += 1;
      utilization[venue.id].totalStudentsAccommodated += venue.studentsAssigned || 0;
    });
  });
  
  return Object.values(utilization);
}

function getCompensationStats() {
  const totalCompensation = invigilationData.dutyAllocations.reduce((sum, duty) => 
    sum + (duty.compensation || 0), 0
  );
  
  const compensationByRole = {};
  invigilationData.dutyAllocations.forEach(duty => {
    if (!compensationByRole[duty.role]) {
      compensationByRole[duty.role] = { count: 0, total: 0 };
    }
    compensationByRole[duty.role].count += 1;
    compensationByRole[duty.role].total += duty.compensation || 0;
  });
  
  return {
    totalCompensation: totalCompensation,
    averageCompensation: invigilationData.dutyAllocations.length > 0 ? 
      (totalCompensation / invigilationData.dutyAllocations.length).toFixed(2) : 0,
    compensationByRole: compensationByRole
  };
}

module.exports = router;