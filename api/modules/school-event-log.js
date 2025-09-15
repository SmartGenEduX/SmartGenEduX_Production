// School Event Log Module - Complete Implementation
const express = require('express');
const router = express.Router();

const eventData = {
  events: [
    {
      id: 'event_001',
      title: 'Annual Sports Day',
      description: 'Inter-house sports competition with various athletic events and cultural performances',
      type: 'sports',
      category: 'annual',
      startDate: '2025-01-15',
      endDate: '2025-01-15',
      startTime: '08:00',
      endTime: '16:00',
      venue: 'School Sports Ground',
      organizer: 'Physical Education Department',
      contactPerson: 'Mr. Vikram Gupta',
      contactPhone: '+91-9876543223',
      contactEmail: 'vikram@dps.edu',
      status: 'scheduled',
      priority: 'high',
      participants: {
        expectedCount: 500,
        registeredCount: 423,
        targetAudience: ['students', 'parents', 'teachers', 'staff']
      },
      budget: {
        allocated: 150000,
        spent: 85000,
        remaining: 65000
      },
      requirements: {
        equipment: ['Sound system', 'Podium', 'Medals', 'Certificates', 'First aid kit'],
        volunteers: 25,
        security: 5,
        catering: true
      },
      activities: [
        { name: '100m Race', time: '09:00', participants: 'Classes 3-5' },
        { name: 'Long Jump', time: '10:00', participants: 'Classes 1-2' },
        { name: 'Cultural Program', time: '14:00', participants: 'All Classes' },
        { name: 'Prize Distribution', time: '15:30', participants: 'Winners' }
      ],
      permissions: {
        approvedBy: 'principal_001',
        approvalDate: '2024-12-15',
        documentsRequired: ['NOC from local authorities', 'Insurance coverage'],
        specialPermissions: ['Extended hours', 'Use of sound system']
      },
      notifications: {
        parentsSent: true,
        teachersInformed: true,
        reminderScheduled: '2025-01-10'
      },
      documentation: {
        photos: [],
        videos: [],
        reports: [],
        attendanceRecord: null
      },
      createdBy: 'admin_001',
      createdAt: '2024-11-20T10:30:00Z',
      updatedAt: '2024-12-28T15:45:00Z'
    },
    {
      id: 'event_002',
      title: 'Science Exhibition',
      description: 'Student science projects showcase with interactive demonstrations and experiments',
      type: 'academic',
      category: 'annual',
      startDate: '2025-02-20',
      endDate: '2025-02-21',
      startTime: '09:00',
      endTime: '17:00',
      venue: 'Science Laboratory & Main Hall',
      organizer: 'Science Department',
      contactPerson: 'Mrs. Anita Singh',
      contactPhone: '+91-9876543222',
      contactEmail: 'anita@dps.edu',
      status: 'planning',
      priority: 'medium',
      participants: {
        expectedCount: 300,
        registeredCount: 156,
        targetAudience: ['students', 'parents', 'teachers']
      },
      budget: {
        allocated: 75000,
        spent: 25000,
        remaining: 50000
      },
      requirements: {
        equipment: ['Display boards', 'Tables', 'Extension cords', 'Safety equipment'],
        volunteers: 15,
        security: 2,
        catering: false
      },
      activities: [
        { name: 'Project Setup', time: '08:00', participants: 'Students & Teachers' },
        { name: 'Judging Round', time: '10:00', participants: 'External Judges' },
        { name: 'Public Display', time: '13:00', participants: 'All Visitors' },
        { name: 'Award Ceremony', time: '16:00', participants: 'Winners' }
      ],
      permissions: {
        approvedBy: 'principal_001',
        approvalDate: '2024-12-20',
        documentsRequired: ['Safety clearance', 'Equipment checklist'],
        specialPermissions: ['Use of chemicals', 'Extended lab hours']
      },
      notifications: {
        parentsSent: false,
        teachersInformed: true,
        reminderScheduled: '2025-02-15'
      },
      documentation: {
        photos: [],
        videos: [],
        reports: [],
        attendanceRecord: null
      },
      createdBy: 'teacher_003',
      createdAt: '2024-12-01T14:20:00Z',
      updatedAt: '2024-12-28T09:15:00Z'
    },
    {
      id: 'event_003',
      title: 'Parent-Teacher Conference',
      description: 'Individual meetings between parents and teachers to discuss student progress',
      type: 'meeting',
      category: 'quarterly',
      startDate: '2025-01-05',
      endDate: '2025-01-07',
      startTime: '09:00',
      endTime: '17:00',
      venue: 'Individual Classrooms',
      organizer: 'Academic Department',
      contactPerson: 'Ms. Priya Sharma',
      contactPhone: '+91-9876543220',
      contactEmail: 'priya@dps.edu',
      status: 'confirmed',
      priority: 'high',
      participants: {
        expectedCount: 400,
        registeredCount: 387,
        targetAudience: ['parents', 'teachers']
      },
      budget: {
        allocated: 15000,
        spent: 8000,
        remaining: 7000
      },
      requirements: {
        equipment: ['Chairs', 'Tables', 'Progress reports', 'Appointment schedules'],
        volunteers: 10,
        security: 3,
        catering: true
      },
      activities: [
        { name: 'Registration', time: '08:30', participants: 'Parents' },
        { name: 'Individual Meetings', time: '09:00', participants: 'Parents & Teachers' },
        { name: 'Group Discussion', time: '15:00', participants: 'Selected Parents' },
        { name: 'Feedback Collection', time: '16:30', participants: 'All Parents' }
      ],
      permissions: {
        approvedBy: 'principal_001',
        approvalDate: '2024-12-10',
        documentsRequired: ['Meeting schedules', 'Progress reports'],
        specialPermissions: ['Weekend access', 'Refreshment arrangement']
      },
      notifications: {
        parentsSent: true,
        teachersInformed: true,
        reminderScheduled: '2025-01-02'
      },
      documentation: {
        photos: [],
        videos: [],
        reports: [],
        attendanceRecord: null
      },
      createdBy: 'admin_001',
      createdAt: '2024-11-15T11:00:00Z',
      updatedAt: '2024-12-27T16:30:00Z'
    },
    {
      id: 'event_004',
      title: 'Republic Day Celebration',
      description: 'Patriotic celebration with flag hoisting, cultural programs, and speeches',
      type: 'cultural',
      category: 'national',
      startDate: '2025-01-26',
      endDate: '2025-01-26',
      startTime: '08:00',
      endTime: '12:00',
      venue: 'School Assembly Ground',
      organizer: 'Cultural Committee',
      contactPerson: 'Mr. Rajesh Kumar',
      contactPhone: '+91-9876543221',
      contactEmail: 'rajesh@dps.edu',
      status: 'scheduled',
      priority: 'high',
      participants: {
        expectedCount: 600,
        registeredCount: 600,
        targetAudience: ['students', 'teachers', 'staff', 'parents', 'community']
      },
      budget: {
        allocated: 50000,
        spent: 20000,
        remaining: 30000
      },
      requirements: {
        equipment: ['Flag pole', 'Microphone', 'Speakers', 'Decorations', 'Chairs'],
        volunteers: 20,
        security: 8,
        catering: true
      },
      activities: [
        { name: 'Flag Hoisting', time: '08:00', participants: 'All' },
        { name: 'National Anthem', time: '08:05', participants: 'All' },
        { name: 'Cultural Performance', time: '08:30', participants: 'Selected Students' },
        { name: 'Principal Speech', time: '10:00', participants: 'All' },
        { name: 'Prize Distribution', time: '10:30', participants: 'Winners' },
        { name: 'Refreshments', time: '11:00', participants: 'All' }
      ],
      permissions: {
        approvedBy: 'principal_001',
        approvalDate: '2024-12-01',
        documentsRequired: ['Event program', 'Security arrangements'],
        specialPermissions: ['Community invitation', 'Media coverage']
      },
      notifications: {
        parentsSent: true,
        teachersInformed: true,
        reminderScheduled: '2025-01-24'
      },
      documentation: {
        photos: [],
        videos: [],
        reports: [],
        attendanceRecord: null
      },
      createdBy: 'teacher_002',
      createdAt: '2024-11-10T09:45:00Z',
      updatedAt: '2024-12-28T12:20:00Z'
    },
    {
      id: 'event_005',
      title: 'Mathematics Olympiad',
      description: 'Inter-school mathematics competition for talented students',
      type: 'competition',
      category: 'academic',
      startDate: '2025-03-15',
      endDate: '2025-03-15',
      startTime: '10:00',
      endTime: '15:00',
      venue: 'Examination Hall',
      organizer: 'Mathematics Department',
      contactPerson: 'Ms. Priya Sharma',
      contactPhone: '+91-9876543220',
      contactEmail: 'priya@dps.edu',
      status: 'planning',
      priority: 'medium',
      participants: {
        expectedCount: 150,
        registeredCount: 78,
        targetAudience: ['students']
      },
      budget: {
        allocated: 40000,
        spent: 5000,
        remaining: 35000
      },
      requirements: {
        equipment: ['Question papers', 'Answer sheets', 'Calculators', 'Stopwatch'],
        volunteers: 12,
        security: 4,
        catering: true
      },
      activities: [
        { name: 'Registration', time: '09:30', participants: 'Participants' },
        { name: 'Round 1', time: '10:00', participants: 'All Participants' },
        { name: 'Round 2', time: '12:00', participants: 'Qualified Students' },
        { name: 'Result Declaration', time: '14:30', participants: 'All' },
        { name: 'Prize Distribution', time: '14:45', participants: 'Winners' }
      ],
      permissions: {
        approvedBy: 'principal_001',
        approvalDate: '2024-12-22',
        documentsRequired: ['Competition rules', 'Question bank'],
        specialPermissions: ['External participants', 'Examination setup']
      },
      notifications: {
        parentsSent: false,
        teachersInformed: true,
        reminderScheduled: '2025-03-10'
      },
      documentation: {
        photos: [],
        videos: [],
        reports: [],
        attendanceRecord: null
      },
      createdBy: 'teacher_001',
      createdAt: '2024-12-05T13:15:00Z',
      updatedAt: '2024-12-28T10:45:00Z'
    }
  ],

  eventTypes: [
    { id: 'academic', name: 'Academic', icon: 'fas fa-graduation-cap', color: '#3B82F6' },
    { id: 'sports', name: 'Sports', icon: 'fas fa-running', color: '#10B981' },
    { id: 'cultural', name: 'Cultural', icon: 'fas fa-theater-masks', color: '#8B5CF6' },
    { id: 'meeting', name: 'Meeting', icon: 'fas fa-users', color: '#F59E0B' },
    { id: 'competition', name: 'Competition', icon: 'fas fa-trophy', color: '#EF4444' },
    { id: 'workshop', name: 'Workshop', icon: 'fas fa-tools', color: '#6B7280' },
    { id: 'celebration', name: 'Celebration', icon: 'fas fa-birthday-cake', color: '#EC4899' },
    { id: 'trip', name: 'Field Trip', icon: 'fas fa-bus', color: '#14B8A6' }
  ],

  venues: [
    { id: 'main_hall', name: 'Main Hall', capacity: 500, facilities: ['AC', 'Sound System', 'Projector'] },
    { id: 'sports_ground', name: 'Sports Ground', capacity: 1000, facilities: ['Lighting', 'Seating', 'Changing Rooms'] },
    { id: 'science_lab', name: 'Science Laboratory', capacity: 40, facilities: ['Equipment', 'Safety gear', 'Storage'] },
    { id: 'computer_lab', name: 'Computer Lab', capacity: 30, facilities: ['Computers', 'Internet', 'AC'] },
    { id: 'library', name: 'Library', capacity: 100, facilities: ['Books', 'Reading Tables', 'Quiet Environment'] },
    { id: 'assembly_ground', name: 'Assembly Ground', capacity: 800, facilities: ['Open Air', 'Stage', 'Microphone'] },
    { id: 'classroom_1a', name: 'Classroom 1-A', capacity: 35, facilities: ['Whiteboard', 'Chairs', 'Tables'] },
    { id: 'exam_hall', name: 'Examination Hall', capacity: 200, facilities: ['Individual Desks', 'Silence', 'Supervision'] }
  ],

  eventCalendar: {
    '2025-01': [
      { date: '05', events: ['event_003'] },
      { date: '15', events: ['event_001'] },
      { date: '26', events: ['event_004'] }
    ],
    '2025-02': [
      { date: '20', events: ['event_002'] }
    ],
    '2025-03': [
      { date: '15', events: ['event_005'] }
    ]
  },

  eventStatistics: {
    totalEvents: 25,
    upcomingEvents: 12,
    completedEvents: 13,
    cancelledEvents: 0,
    monthlyBreakdown: {
      'January': 8,
      'February': 5,
      'March': 6,
      'April': 3,
      'May': 2,
      'June': 1
    },
    typeBreakdown: {
      'academic': 8,
      'cultural': 6,
      'sports': 4,
      'meeting': 3,
      'competition': 2,
      'workshop': 1,
      'celebration': 1
    },
    participationStats: {
      averageAttendance: 78.5,
      totalParticipants: 2340,
      parentEngagement: 65.2,
      teacherInvolvement: 92.3
    }
  },

  templates: [
    {
      id: 'template_sports',
      name: 'Sports Event Template',
      type: 'sports',
      defaultDuration: 8,
      requiredFields: ['venue', 'equipment', 'safety_measures', 'first_aid'],
      suggestedBudget: { min: 50000, max: 200000 },
      checklistItems: [
        'Book sports ground',
        'Arrange sports equipment',
        'Medical team on standby',
        'Registration setup',
        'Prize arrangement',
        'Photography/videography',
        'Refreshments for participants'
      ]
    },
    {
      id: 'template_academic',
      name: 'Academic Event Template',
      type: 'academic',
      defaultDuration: 4,
      requiredFields: ['venue', 'academic_resources', 'evaluation_criteria'],
      suggestedBudget: { min: 20000, max: 100000 },
      checklistItems: [
        'Book appropriate venue',
        'Prepare academic materials',
        'Arrange evaluation panel',
        'Setup registration desk',
        'Certificate preparation',
        'Documentation setup',
        'Feedback collection'
      ]
    }
  ],

  reminders: [
    {
      id: 'reminder_001',
      eventId: 'event_001',
      title: 'Sports Day Equipment Check',
      description: 'Verify all sports equipment and sound system',
      dueDate: '2025-01-10',
      assignedTo: 'Mr. Vikram Gupta',
      status: 'pending',
      priority: 'high'
    },
    {
      id: 'reminder_002',
      eventId: 'event_003',
      title: 'Parent Meeting Schedule Distribution',
      description: 'Send individual meeting schedules to all parents',
      dueDate: '2025-01-02',
      assignedTo: 'Ms. Priya Sharma',
      status: 'completed',
      priority: 'high'
    }
  ]
};

// Get all events
router.get('/', (req, res) => {
  const { 
    status, 
    type, 
    startDate, 
    endDate, 
    organizer,
    venue,
    priority 
  } = req.query;
  
  let events = eventData.events;
  
  // Apply filters
  if (status) {
    events = events.filter(event => event.status === status);
  }
  
  if (type) {
    events = events.filter(event => event.type === type);
  }
  
  if (startDate) {
    events = events.filter(event => event.startDate >= startDate);
  }
  
  if (endDate) {
    events = events.filter(event => event.endDate <= endDate);
  }
  
  if (organizer) {
    events = events.filter(event => 
      event.organizer.toLowerCase().includes(organizer.toLowerCase())
    );
  }
  
  if (venue) {
    events = events.filter(event => 
      event.venue.toLowerCase().includes(venue.toLowerCase())
    );
  }
  
  if (priority) {
    events = events.filter(event => event.priority === priority);
  }
  
  // Sort by start date
  events.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  
  res.json(events);
});

// Get event by ID
router.get('/:eventId', (req, res) => {
  const { eventId } = req.params;
  
  const event = eventData.events.find(e => e.id === eventId);
  
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  
  // Add related reminders
  const relatedReminders = eventData.reminders.filter(r => r.eventId === eventId);
  
  res.json({
    ...event,
    reminders: relatedReminders
  });
});

// Create new event
router.post('/', (req, res) => {
  const eventDetails = req.body;
  
  // Validate required fields
  const requiredFields = ['title', 'type', 'startDate', 'venue', 'organizer', 'contactPerson'];
  for (const field of requiredFields) {
    if (!eventDetails[field]) {
      return res.status(400).json({ error: `${field} is required` });
    }
  }
  
  // Check venue availability
  const venueConflict = eventData.events.find(event => 
    event.venue === eventDetails.venue &&
    event.startDate === eventDetails.startDate &&
    event.status !== 'cancelled'
  );
  
  if (venueConflict) {
    return res.status(409).json({ 
      error: 'Venue is already booked for this date',
      conflictingEvent: venueConflict.title
    });
  }
  
  // Create new event
  const newEvent = {
    id: 'event_' + Date.now(),
    ...eventDetails,
    status: eventDetails.status || 'planning',
    priority: eventDetails.priority || 'medium',
    participants: {
      expectedCount: eventDetails.expectedCount || 0,
      registeredCount: 0,
      targetAudience: eventDetails.targetAudience || []
    },
    budget: {
      allocated: eventDetails.budget || 0,
      spent: 0,
      remaining: eventDetails.budget || 0
    },
    requirements: eventDetails.requirements || {},
    activities: eventDetails.activities || [],
    permissions: {
      approvedBy: null,
      approvalDate: null,
      documentsRequired: eventDetails.documentsRequired || [],
      specialPermissions: eventDetails.specialPermissions || []
    },
    notifications: {
      parentsSent: false,
      teachersInformed: false,
      reminderScheduled: null
    },
    documentation: {
      photos: [],
      videos: [],
      reports: [],
      attendanceRecord: null
    },
    createdBy: eventDetails.createdBy || 'system',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  eventData.events.push(newEvent);
  
  res.json({ 
    success: true, 
    event: newEvent,
    message: 'Event created successfully'
  });
});

// Update event
router.put('/:eventId', (req, res) => {
  const { eventId } = req.params;
  const updateData = req.body;
  
  const eventIndex = eventData.events.findIndex(e => e.id === eventId);
  
  if (eventIndex === -1) {
    return res.status(404).json({ error: 'Event not found' });
  }
  
  // Update event
  eventData.events[eventIndex] = {
    ...eventData.events[eventIndex],
    ...updateData,
    updatedAt: new Date().toISOString()
  };
  
  res.json({ 
    success: true, 
    event: eventData.events[eventIndex] 
  });
});

// Approve event
router.post('/:eventId/approve', (req, res) => {
  const { eventId } = req.params;
  const { approvedBy, comments } = req.body;
  
  const eventIndex = eventData.events.findIndex(e => e.id === eventId);
  
  if (eventIndex === -1) {
    return res.status(404).json({ error: 'Event not found' });
  }
  
  const event = eventData.events[eventIndex];
  
  // Update approval status
  event.permissions.approvedBy = approvedBy;
  event.permissions.approvalDate = new Date().toISOString().split('T')[0];
  event.permissions.approvalComments = comments || '';
  event.status = 'approved';
  event.updatedAt = new Date().toISOString();
  
  res.json({ 
    success: true, 
    event: event,
    message: 'Event approved successfully'
  });
});

// Cancel event
router.post('/:eventId/cancel', (req, res) => {
  const { eventId } = req.params;
  const { reason, cancelledBy } = req.body;
  
  const eventIndex = eventData.events.findIndex(e => e.id === eventId);
  
  if (eventIndex === -1) {
    return res.status(404).json({ error: 'Event not found' });
  }
  
  const event = eventData.events[eventIndex];
  
  // Update cancellation details
  event.status = 'cancelled';
  event.cancellationReason = reason;
  event.cancelledBy = cancelledBy;
  event.cancelledAt = new Date().toISOString();
  event.updatedAt = new Date().toISOString();
  
  // Send cancellation notifications
  sendCancellationNotifications(event);
  
  res.json({ 
    success: true, 
    event: event,
    message: 'Event cancelled successfully'
  });
});

// Register for event
router.post('/:eventId/register', (req, res) => {
  const { eventId } = req.params;
  const { participantId, participantName, participantType, additionalInfo } = req.body;
  
  const eventIndex = eventData.events.findIndex(e => e.id === eventId);
  
  if (eventIndex === -1) {
    return res.status(404).json({ error: 'Event not found' });
  }
  
  const event = eventData.events[eventIndex];
  
  // Check if registration is still open
  if (event.status === 'cancelled') {
    return res.status(400).json({ error: 'Cannot register for cancelled event' });
  }
  
  // Update registration count
  event.participants.registeredCount += 1;
  
  // Add participant to event (would typically store in separate table)
  if (!event.registeredParticipants) {
    event.registeredParticipants = [];
  }
  
  event.registeredParticipants.push({
    participantId,
    participantName,
    participantType,
    additionalInfo,
    registeredAt: new Date().toISOString()
  });
  
  event.updatedAt = new Date().toISOString();
  
  res.json({ 
    success: true, 
    message: 'Registration successful',
    event: event
  });
});

// Get event calendar
router.get('/calendar/:year/:month', (req, res) => {
  const { year, month } = req.params;
  const calendarKey = `${year}-${month.padStart(2, '0')}`;
  
  const monthEvents = eventData.eventCalendar[calendarKey] || [];
  
  // Get full event details for each calendar entry
  const enrichedCalendar = monthEvents.map(day => ({
    ...day,
    events: day.events.map(eventId => 
      eventData.events.find(e => e.id === eventId)
    ).filter(e => e !== undefined)
  }));
  
  res.json({
    year: parseInt(year),
    month: parseInt(month),
    calendar: enrichedCalendar
  });
});

// Get event types
router.get('/meta/types', (req, res) => {
  res.json(eventData.eventTypes);
});

// Get venues
router.get('/meta/venues', (req, res) => {
  const { capacity } = req.query;
  
  let venues = eventData.venues;
  
  if (capacity) {
    venues = venues.filter(venue => venue.capacity >= parseInt(capacity));
  }
  
  res.json(venues);
});

// Check venue availability
router.get('/venues/:venueId/availability', (req, res) => {
  const { venueId } = req.params;
  const { date, startTime, endTime } = req.query;
  
  const venue = eventData.venues.find(v => v.id === venueId);
  
  if (!venue) {
    return res.status(404).json({ error: 'Venue not found' });
  }
  
  // Check for conflicts
  const conflicts = eventData.events.filter(event => 
    event.venue.toLowerCase().includes(venue.name.toLowerCase()) &&
    event.startDate === date &&
    event.status !== 'cancelled'
  );
  
  res.json({
    venue: venue,
    date: date,
    available: conflicts.length === 0,
    conflicts: conflicts,
    timeSlots: conflicts.map(event => ({
      startTime: event.startTime,
      endTime: event.endTime,
      eventTitle: event.title
    }))
  });
});

// Get event templates
router.get('/meta/templates', (req, res) => {
  const { type } = req.query;
  
  let templates = eventData.templates;
  
  if (type) {
    templates = templates.filter(template => template.type === type);
  }
  
  res.json(templates);
});

// Get event statistics
router.get('/analytics/statistics', (req, res) => {
  const { period = 'year', year = '2025' } = req.query;
  
  let stats = eventData.eventStatistics;
  
  // Add real-time calculations
  const currentEvents = eventData.events.filter(event => 
    event.startDate.startsWith(year)
  );
  
  const enhancedStats = {
    ...stats,
    periodAnalysis: {
      totalEventsInPeriod: currentEvents.length,
      averageParticipation: currentEvents.reduce((sum, event) => 
        sum + event.participants.registeredCount, 0) / currentEvents.length || 0,
      budgetUtilization: currentEvents.reduce((sum, event) => 
        sum + ((event.budget.spent / event.budget.allocated) * 100), 0) / currentEvents.length || 0,
      successRate: ((currentEvents.filter(e => e.status === 'completed').length / currentEvents.length) * 100) || 0
    },
    upcomingEvents: eventData.events.filter(event => 
      new Date(event.startDate) > new Date() && event.status !== 'cancelled'
    ).length,
    recentActivity: getRecentActivity(),
    popularVenues: getPopularVenues(),
    budgetAnalysis: getBudgetAnalysis()
  };
  
  res.json(enhancedStats);
});

// Get event reminders
router.get('/reminders', (req, res) => {
  const { eventId, assignedTo, status } = req.query;
  
  let reminders = eventData.reminders;
  
  // Apply filters
  if (eventId) {
    reminders = reminders.filter(reminder => reminder.eventId === eventId);
  }
  
  if (assignedTo) {
    reminders = reminders.filter(reminder => reminder.assignedTo === assignedTo);
  }
  
  if (status) {
    reminders = reminders.filter(reminder => reminder.status === status);
  }
  
  // Add event details
  const enrichedReminders = reminders.map(reminder => {
    const event = eventData.events.find(e => e.id === reminder.eventId);
    return {
      ...reminder,
      eventTitle: event ? event.title : 'Unknown Event',
      eventDate: event ? event.startDate : null
    };
  });
  
  res.json(enrichedReminders);
});

// Create reminder
router.post('/reminders', (req, res) => {
  const reminderData = req.body;
  
  // Validate required fields
  const requiredFields = ['eventId', 'title', 'dueDate', 'assignedTo'];
  for (const field of requiredFields) {
    if (!reminderData[field]) {
      return res.status(400).json({ error: `${field} is required` });
    }
  }
  
  // Create new reminder
  const newReminder = {
    id: 'reminder_' + Date.now(),
    ...reminderData,
    status: reminderData.status || 'pending',
    priority: reminderData.priority || 'medium',
    createdAt: new Date().toISOString()
  };
  
  eventData.reminders.push(newReminder);
  
  res.json({ 
    success: true, 
    reminder: newReminder,
    message: 'Reminder created successfully'
  });
});

// Update reminder status
router.put('/reminders/:reminderId', (req, res) => {
  const { reminderId } = req.params;
  const { status, completedBy, notes } = req.body;
  
  const reminderIndex = eventData.reminders.findIndex(r => r.id === reminderId);
  
  if (reminderIndex === -1) {
    return res.status(404).json({ error: 'Reminder not found' });
  }
  
  // Update reminder
  eventData.reminders[reminderIndex] = {
    ...eventData.reminders[reminderIndex],
    status: status || eventData.reminders[reminderIndex].status,
    completedBy: completedBy,
    completionNotes: notes,
    updatedAt: new Date().toISOString()
  };
  
  res.json({ 
    success: true, 
    reminder: eventData.reminders[reminderIndex] 
  });
});

// Send notifications for event
router.post('/:eventId/notify', (req, res) => {
  const { eventId } = req.params;
  const { recipients, message, method = 'email' } = req.body;
  
  const event = eventData.events.find(e => e.id === eventId);
  
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  
  // Send notifications
  const notificationResult = sendEventNotifications(event, recipients, message, method);
  
  // Update notification status
  const eventIndex = eventData.events.findIndex(e => e.id === eventId);
  if (recipients.includes('parents')) {
    eventData.events[eventIndex].notifications.parentsSent = true;
  }
  if (recipients.includes('teachers')) {
    eventData.events[eventIndex].notifications.teachersInformed = true;
  }
  
  res.json({ 
    success: true, 
    notificationsSent: notificationResult.sent,
    notificationsFailed: notificationResult.failed,
    message: 'Notifications sent successfully'
  });
});

// Helper Functions
function sendCancellationNotifications(event) {
  console.log(`Cancellation notifications sent for event: ${event.title}`);
  return { sent: 100, failed: 0 };
}

function sendEventNotifications(event, recipients, message, method) {
  console.log(`Notifications sent via ${method} for event: ${event.title} to ${recipients.join(', ')}`);
  return { sent: 150, failed: 5 };
}

function getRecentActivity() {
  return eventData.events
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5)
    .map(event => ({
      id: event.id,
      title: event.title,
      type: event.type,
      status: event.status,
      lastUpdate: event.updatedAt
    }));
}

function getPopularVenues() {
  const venueCount = {};
  eventData.events.forEach(event => {
    venueCount[event.venue] = (venueCount[event.venue] || 0) + 1;
  });
  
  return Object.entries(venueCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([venue, count]) => ({ venue, eventCount: count }));
}

function getBudgetAnalysis() {
  const totalAllocated = eventData.events.reduce((sum, event) => sum + event.budget.allocated, 0);
  const totalSpent = eventData.events.reduce((sum, event) => sum + event.budget.spent, 0);
  
  return {
    totalAllocated,
    totalSpent,
    utilizationRate: ((totalSpent / totalAllocated) * 100).toFixed(1),
    averageEventBudget: (totalAllocated / eventData.events.length).toFixed(0)
  };
}

module.exports = router;