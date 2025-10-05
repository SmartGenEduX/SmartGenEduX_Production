// Student Behavior Tracker Module - Complete Implementation
const express = require('express');
const router = express.Router();

const behaviorData = {
  students: [
    {
      id: 'student_001',
      name: 'Aarav Sharma',
      rollNumber: '1A01',
      class: 'Class 1-A',
      section: 'A',
      grade: 1,
      parentPhone: '+91-9876543210',
      parentEmail: 'rakesh.sharma@email.com',
      currentPoints: 85,
      totalIncidents: 12,
      positiveIncidents: 8,
      negativeIncidents: 4,
      behaviorTrend: 'improving',
      lastIncidentDate: '2024-12-25'
    },
    {
      id: 'student_002',
      name: 'Priya Patel',
      rollNumber: '1A02',
      class: 'Class 1-A',
      section: 'A',
      grade: 1,
      parentPhone: '+91-9876543211',
      parentEmail: 'amit.patel@email.com',
      currentPoints: 95,
      totalIncidents: 15,
      positiveIncidents: 12,
      negativeIncidents: 3,
      behaviorTrend: 'excellent',
      lastIncidentDate: '2024-12-28'
    },
    {
      id: 'student_003',
      name: 'Arjun Singh',
      rollNumber: '2A01',
      class: 'Class 2-A',
      section: 'A',
      grade: 2,
      parentPhone: '+91-9876543212',
      parentEmail: 'sunita.singh@email.com',
      currentPoints: 65,
      totalIncidents: 18,
      positiveIncidents: 7,
      negativeIncidents: 11,
      behaviorTrend: 'concerning',
      lastIncidentDate: '2024-12-29'
    }
  ],

  behaviorLogs: [
    {
      id: 'log_001',
      studentId: 'student_001',
      type: 'positive',
      category: 'academic_excellence',
      title: 'Outstanding Performance in Mathematics',
      description: 'Scored 100% in weekly math test and helped classmates understand concepts',
      points: 10,
      recordedBy: 'teacher_001',
      recordedDate: '2024-12-28',
      severity: 'high',
      parentNotified: true,
      followUpRequired: false,
      tags: ['academic', 'helpful', 'leadership']
    },
    {
      id: 'log_002',
      studentId: 'student_001',
      type: 'negative',
      category: 'classroom_disruption',
      title: 'Talking During Class',
      description: 'Continuously talking to classmates during English lesson despite warnings',
      points: -5,
      recordedBy: 'teacher_002',
      recordedDate: '2024-12-25',
      severity: 'low',
      parentNotified: false,
      followUpRequired: false,
      tags: ['discipline', 'attention']
    },
    {
      id: 'log_003',
      studentId: 'student_002',
      type: 'positive',
      category: 'character_development',
      title: 'Helping Injured Classmate',
      description: 'Immediately helped classmate who fell during playtime and informed teacher',
      points: 15,
      recordedBy: 'teacher_003',
      recordedDate: '2024-12-28',
      severity: 'high',
      parentNotified: true,
      followUpRequired: false,
      tags: ['empathy', 'responsibility', 'leadership']
    },
    {
      id: 'log_004',
      studentId: 'student_003',
      type: 'negative',
      category: 'aggressive_behavior',
      title: 'Physical Altercation',
      description: 'Got into a fight with another student during lunch break',
      points: -20,
      recordedBy: 'teacher_001',
      recordedDate: '2024-12-29',
      severity: 'high',
      parentNotified: true,
      followUpRequired: true,
      tags: ['aggression', 'conflict', 'anger_management'],
      followUpActions: ['parent_meeting', 'counseling_session']
    },
    {
      id: 'log_005',
      studentId: 'student_002',
      type: 'positive',
      category: 'academic_excellence',
      title: 'Perfect Attendance for Month',
      description: 'Maintained perfect attendance for the month of December',
      points: 5,
      recordedBy: 'system',
      recordedDate: '2024-12-29',
      severity: 'medium',
      parentNotified: false,
      followUpRequired: false,
      tags: ['attendance', 'commitment']
    }
  ],

  behaviorCategories: [
    {
      id: 'academic_excellence',
      name: 'Academic Excellence',
      type: 'positive',
      defaultPoints: 10,
      color: '#27ae60',
      icon: '🎓',
      description: 'Outstanding academic performance and achievements'
    },
    {
      id: 'character_development',
      name: 'Character Development',
      type: 'positive',
      defaultPoints: 15,
      color: '#3498db',
      icon: '⭐',
      description: 'Displays good character traits and values'
    },
    {
      id: 'leadership',
      name: 'Leadership',
      type: 'positive',
      defaultPoints: 12,
      color: '#9b59b6',
      icon: '👑',
      description: 'Shows leadership qualities and initiative'
    },
    {
      id: 'classroom_disruption',
      name: 'Classroom Disruption',
      type: 'negative',
      defaultPoints: -5,
      color: '#e67e22',
      icon: '⚠️',
      description: 'Disruptive behavior affecting classroom environment'
    },
    {
      id: 'aggressive_behavior',
      name: 'Aggressive Behavior',
      type: 'negative',
      defaultPoints: -20,
      color: '#e74c3c',
      icon: '🚫',
      description: 'Physical or verbal aggression towards others'
    },
    {
      id: 'attendance_issues',
      name: 'Attendance Issues',
      type: 'negative',
      defaultPoints: -3,
      color: '#f39c12',
      icon: '📅',
      description: 'Frequent absences or tardiness'
    }
  ],

  pointsSystem: {
    scale: {
      'excellent': { min: 90, max: 100, color: '#27ae60', description: 'Excellent Behavior' },
      'good': { min: 75, max: 89, color: '#3498db', description: 'Good Behavior' },
      'satisfactory': { min: 60, max: 74, color: '#f39c12', description: 'Satisfactory Behavior' },
      'needs_improvement': { min: 40, max: 59, color: '#e67e22', description: 'Needs Improvement' },
      'concerning': { min: 0, max: 39, color: '#e74c3c', description: 'Concerning Behavior' }
    },
    startingPoints: 75,
    maxPoints: 100,
    minPoints: 0,
    resetFrequency: 'monthly' // monthly, quarterly, annually
  },

  interventions: [
    {
      id: 'intervention_001',
      studentId: 'student_003',
      type: 'counseling_session',
      title: 'Anger Management Counseling',
      description: 'Individual counseling session to address anger management issues',
      scheduledDate: '2024-12-30',
      status: 'scheduled',
      assignedTo: 'counselor_001',
      expectedOutcome: 'Improved self-control and conflict resolution skills',
      parentInvolved: true
    },
    {
      id: 'intervention_002',
      studentId: 'student_003',
      type: 'parent_meeting',
      title: 'Parent-Teacher Conference',
      description: 'Meeting with parents to discuss behavioral concerns and action plan',
      scheduledDate: '2024-12-31',
      status: 'scheduled',
      assignedTo: 'teacher_001',
      expectedOutcome: 'Collaborative action plan between home and school',
      parentInvolved: true
    }
  ],

  behaviorReports: {
    weekly: {
      totalIncidents: 25,
      positiveIncidents: 15,
      negativeIncidents: 10,
      topIssues: ['classroom_disruption', 'attendance_issues', 'aggressive_behavior'],
      topPerformers: ['student_002', 'student_001'],
      needsAttention: ['student_003']
    },
    monthly: {
      totalIncidents: 112,
      positiveIncidents: 68,
      negativeIncidents: 44,
      improvementRate: 15.2,
      parentNotifications: 23,
      interventionsScheduled: 8
    }
  },

  rewardSystem: [
    {
      id: 'reward_001',
      name: 'Star Student Certificate',
      pointsRequired: 95,
      type: 'certificate',
      description: 'Certificate for maintaining excellent behavior',
      validityPeriod: 'monthly'
    },
    {
      id: 'reward_002',
      name: 'Extra Recess Time',
      pointsRequired: 85,
      type: 'privilege',
      description: '10 extra minutes of recess time',
      validityPeriod: 'weekly'
    },
    {
      id: 'reward_003',
      name: 'Homework Pass',
      pointsRequired: 80,
      type: 'privilege',
      description: 'Skip one homework assignment',
      validityPeriod: 'one_time'
    },
    {
      id: 'reward_004',
      name: 'Class Helper Badge',
      pointsRequired: 90,
      type: 'responsibility',
      description: 'Special responsibility as class helper for the week',
      validityPeriod: 'weekly'
    }
  ]
};

// Get behavior summary for all students
router.get('/summary', (req, res) => {
  const { classId, grade } = req.query;
  
  let students = behaviorData.students;
  
  // Filter by class if specified
  if (classId) {
    students = students.filter(s => s.class === classId);
  }
  
  // Filter by grade if specified
  if (grade) {
    students = students.filter(s => s.grade === parseInt(grade));
  }
  
  const summary = students.map(student => {
    const recentLogs = behaviorData.behaviorLogs
      .filter(log => log.studentId === student.id)
      .sort((a, b) => new Date(b.recordedDate) - new Date(a.recordedDate))
      .slice(0, 5);
    
    return {
      ...student,
      recentLogs: recentLogs,
      behaviorLevel: getBehaviorLevel(student.currentPoints)
    };
  });
  
  res.json(summary);
});

// Get detailed behavior record for a specific student
router.get('/student/:studentId', (req, res) => {
  const { studentId } = req.params;
  const { startDate, endDate, limit = 50 } = req.query;
  
  const student = behaviorData.students.find(s => s.id === studentId);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }
  
  let logs = behaviorData.behaviorLogs.filter(log => log.studentId === studentId);
  
  // Filter by date range if specified
  if (startDate && endDate) {
    logs = logs.filter(log => log.recordedDate >= startDate && log.recordedDate <= endDate);
  }
  
  // Sort by date (newest first) and limit results
  logs = logs.sort((a, b) => new Date(b.recordedDate) - new Date(a.recordedDate))
               .slice(0, parseInt(limit));
  
  // Get interventions for this student
  const interventions = behaviorData.interventions.filter(i => i.studentId === studentId);
  
  // Calculate statistics
  const stats = {
    totalLogs: logs.length,
    positiveLogs: logs.filter(l => l.type === 'positive').length,
    negativeLogs: logs.filter(l => l.type === 'negative').length,
    averagePoints: logs.length > 0 ? (logs.reduce((sum, l) => sum + l.points, 0) / logs.length).toFixed(1) : 0,
    behaviorLevel: getBehaviorLevel(student.currentPoints),
    trendAnalysis: analyzeBehaviorTrend(logs)
  };
  
  res.json({
    student: student,
    logs: logs,
    interventions: interventions,
    statistics: stats,
    availableRewards: getAvailableRewards(student.currentPoints)
  });
});

// Log new behavior incident
router.post('/log', (req, res) => {
  const {
    studentId,
    type,
    category,
    title,
    description,
    points,
    recordedBy,
    severity = 'medium',
    parentNotified = false,
    followUpRequired = false,
    tags = []
  } = req.body;
  
  // Validate required fields
  if (!studentId || !type || !category || !title || !description) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // Check if student exists
  const student = behaviorData.students.find(s => s.id === studentId);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }
  
  // Get category details
  const categoryInfo = behaviorData.behaviorCategories.find(c => c.id === category);
  const logPoints = points !== undefined ? points : (categoryInfo ? categoryInfo.defaultPoints : 0);
  
  // Create new behavior log
  const newLog = {
    id: 'log_' + Date.now(),
    studentId,
    type,
    category,
    title,
    description,
    points: logPoints,
    recordedBy: recordedBy || 'system',
    recordedDate: new Date().toISOString().split('T')[0],
    severity,
    parentNotified,
    followUpRequired,
    tags: Array.isArray(tags) ? tags : [],
    createdAt: new Date().toISOString()
  };
  
  behaviorData.behaviorLogs.push(newLog);
  
  // Update student's points and statistics
  student.currentPoints = Math.max(0, Math.min(100, student.currentPoints + logPoints));
  student.totalIncidents += 1;
  
  if (type === 'positive') {
    student.positiveIncidents += 1;
  } else {
    student.negativeIncidents += 1;
  }
  
  student.lastIncidentDate = newLog.recordedDate;
  student.behaviorTrend = calculateBehaviorTrend(studentId);
  
  // Trigger automatic interventions if needed
  const interventions = checkAutoInterventions(student, newLog);
  
  // Send parent notification if required
  if (parentNotified || severity === 'high') {
    sendParentNotification(student, newLog);
  }
  
  res.json({
    success: true,
    log: newLog,
    updatedPoints: student.currentPoints,
    behaviorLevel: getBehaviorLevel(student.currentPoints),
    triggeredInterventions: interventions
  });
});

// Update behavior log
router.put('/log/:logId', (req, res) => {
  const { logId } = req.params;
  const updateData = req.body;
  
  const logIndex = behaviorData.behaviorLogs.findIndex(log => log.id === logId);
  
  if (logIndex === -1) {
    return res.status(404).json({ error: 'Behavior log not found' });
  }
  
  const originalLog = behaviorData.behaviorLogs[logIndex];
  const pointsDifference = (updateData.points || originalLog.points) - originalLog.points;
  
  // Update log
  behaviorData.behaviorLogs[logIndex] = {
    ...originalLog,
    ...updateData,
    updatedAt: new Date().toISOString()
  };
  
  // Update student points if points changed
  if (pointsDifference !== 0) {
    const student = behaviorData.students.find(s => s.id === originalLog.studentId);
    if (student) {
      student.currentPoints = Math.max(0, Math.min(100, student.currentPoints + pointsDifference));
      student.behaviorTrend = calculateBehaviorTrend(student.id);
    }
  }
  
  res.json({ success: true, log: behaviorData.behaviorLogs[logIndex] });
});

// Delete behavior log
router.delete('/log/:logId', (req, res) => {
  const { logId } = req.params;
  
  const logIndex = behaviorData.behaviorLogs.findIndex(log => log.id === logId);
  
  if (logIndex === -1) {
    return res.status(404).json({ error: 'Behavior log not found' });
  }
  
  const deletedLog = behaviorData.behaviorLogs[logIndex];
  behaviorData.behaviorLogs.splice(logIndex, 1);
  
  // Update student statistics
  const student = behaviorData.students.find(s => s.id === deletedLog.studentId);
  if (student) {
    student.currentPoints = Math.max(0, Math.min(100, student.currentPoints - deletedLog.points));
    student.totalIncidents = Math.max(0, student.totalIncidents - 1);
    
    if (deletedLog.type === 'positive') {
      student.positiveIncidents = Math.max(0, student.positiveIncidents - 1);
    } else {
      student.negativeIncidents = Math.max(0, student.negativeIncidents - 1);
    }
    
    student.behaviorTrend = calculateBehaviorTrend(student.id);
  }
  
  res.json({ success: true });
});

// Get behavior categories
router.get('/categories', (req, res) => {
  res.json(behaviorData.behaviorCategories);
});

// Get behavior analytics
router.get('/analytics', (req, res) => {
  const { period = 'week', classId, grade } = req.query;
  
  let students = behaviorData.students;
  let logs = behaviorData.behaviorLogs;
  
  // Filter by class/grade
  if (classId || grade) {
    const filteredStudentIds = students
      .filter(s => (!classId || s.class === classId) && (!grade || s.grade === parseInt(grade)))
      .map(s => s.id);
    
    logs = logs.filter(log => filteredStudentIds.includes(log.studentId));
    students = students.filter(s => filteredStudentIds.includes(s.id));
  }
  
  // Calculate date range based on period
  const now = new Date();
  let startDate;
  
  switch (period) {
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case 'quarter':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }
  
  const periodLogs = logs.filter(log => new Date(log.recordedDate) >= startDate);
  
  // Calculate analytics
  const analytics = {
    period: period,
    dateRange: {
      start: startDate.toISOString().split('T')[0],
      end: now.toISOString().split('T')[0]
    },
    overview: {
      totalStudents: students.length,
      totalIncidents: periodLogs.length,
      positiveIncidents: periodLogs.filter(l => l.type === 'positive').length,
      negativeIncidents: periodLogs.filter(l => l.type === 'negative').length,
      averagePoints: students.length > 0 ? (students.reduce((sum, s) => sum + s.currentPoints, 0) / students.length).toFixed(1) : 0
    },
    categoryBreakdown: getCategoryBreakdown(periodLogs),
    behaviorLevels: getBehaviorLevelDistribution(students),
    topPerformers: getTopPerformers(students, 5),
    studentsNeedingAttention: getStudentsNeedingAttention(students, 5),
    trends: {
      dailyIncidents: getDailyIncidentTrends(periodLogs, startDate, now),
      improvementRate: calculateImprovementRate(students, periodLogs)
    }
  };
  
  res.json(analytics);
});

// Create intervention
router.post('/intervention', (req, res) => {
  const {
    studentId,
    type,
    title,
    description,
    scheduledDate,
    assignedTo,
    expectedOutcome,
    parentInvolved = false
  } = req.body;
  
  // Validate required fields
  if (!studentId || !type || !title || !description || !scheduledDate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // Check if student exists
  const student = behaviorData.students.find(s => s.id === studentId);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }
  
  const newIntervention = {
    id: 'intervention_' + Date.now(),
    studentId,
    type,
    title,
    description,
    scheduledDate,
    status: 'scheduled',
    assignedTo: assignedTo || 'system',
    expectedOutcome: expectedOutcome || '',
    parentInvolved,
    createdAt: new Date().toISOString()
  };
  
  behaviorData.interventions.push(newIntervention);
  
  res.json({ success: true, intervention: newIntervention });
});

// Get interventions
router.get('/interventions', (req, res) => {
  const { studentId, status, assignedTo } = req.query;
  
  let interventions = behaviorData.interventions;
  
  // Filter by parameters
  if (studentId) {
    interventions = interventions.filter(i => i.studentId === studentId);
  }
  
  if (status) {
    interventions = interventions.filter(i => i.status === status);
  }
  
  if (assignedTo) {
    interventions = interventions.filter(i => i.assignedTo === assignedTo);
  }
  
  // Add student information
  const interventionsWithStudents = interventions.map(intervention => {
    const student = behaviorData.students.find(s => s.id === intervention.studentId);
    return {
      ...intervention,
      student: student
    };
  });
  
  res.json(interventionsWithStudents);
});

// Update intervention status
router.put('/intervention/:interventionId', (req, res) => {
  const { interventionId } = req.params;
  const { status, notes, outcome } = req.body;
  
  const interventionIndex = behaviorData.interventions.findIndex(i => i.id === interventionId);
  
  if (interventionIndex === -1) {
    return res.status(404).json({ error: 'Intervention not found' });
  }
  
  behaviorData.interventions[interventionIndex] = {
    ...behaviorData.interventions[interventionIndex],
    status: status || behaviorData.interventions[interventionIndex].status,
    notes: notes || behaviorData.interventions[interventionIndex].notes,
    outcome: outcome || behaviorData.interventions[interventionIndex].outcome,
    updatedAt: new Date().toISOString()
  };
  
  res.json({ success: true, intervention: behaviorData.interventions[interventionIndex] });
});

// Get rewards system
router.get('/rewards', (req, res) => {
  const { studentId } = req.query;
  
  if (studentId) {
    const student = behaviorData.students.find(s => s.id === studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    const availableRewards = getAvailableRewards(student.currentPoints);
    res.json({
      currentPoints: student.currentPoints,
      behaviorLevel: getBehaviorLevel(student.currentPoints),
      availableRewards: availableRewards,
      allRewards: behaviorData.rewardSystem
    });
  } else {
    res.json(behaviorData.rewardSystem);
  }
});

// Redeem reward
router.post('/reward/redeem', (req, res) => {
  const { studentId, rewardId } = req.body;
  
  if (!studentId || !rewardId) {
    return res.status(400).json({ error: 'Student ID and Reward ID are required' });
  }
  
  const student = behaviorData.students.find(s => s.id === studentId);
  const reward = behaviorData.rewardSystem.find(r => r.id === rewardId);
  
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }
  
  if (!reward) {
    return res.status(404).json({ error: 'Reward not found' });
  }
  
  if (student.currentPoints < reward.pointsRequired) {
    return res.status(400).json({ error: 'Insufficient points for this reward' });
  }
  
  // Deduct points (optional, based on school policy)
  // student.currentPoints -= reward.pointsRequired;
  
  // Log the reward redemption
  const rewardLog = {
    id: 'reward_' + Date.now(),
    studentId: studentId,
    rewardId: rewardId,
    rewardName: reward.name,
    pointsRedeemed: reward.pointsRequired,
    redeemedAt: new Date().toISOString(),
    status: 'redeemed'
  };
  
  res.json({
    success: true,
    message: `Reward "${reward.name}" redeemed successfully!`,
    redemption: rewardLog,
    remainingPoints: student.currentPoints
  });
});

// Helper Functions
function getBehaviorLevel(points) {
  const scale = behaviorData.pointsSystem.scale;
  
  for (const [level, range] of Object.entries(scale)) {
    if (points >= range.min && points <= range.max) {
      return {
        level: level,
        ...range
      };
    }
  }
  
  return {
    level: 'concerning',
    ...scale.concerning
  };
}

function calculateBehaviorTrend(studentId) {
  const logs = behaviorData.behaviorLogs
    .filter(log => log.studentId === studentId)
    .sort((a, b) => new Date(a.recordedDate) - new Date(b.recordedDate))
    .slice(-10); // Last 10 incidents
  
  if (logs.length < 3) return 'insufficient_data';
  
  const recentLogs = logs.slice(-5);
  const olderLogs = logs.slice(0, -5);
  
  const recentAverage = recentLogs.reduce((sum, log) => sum + log.points, 0) / recentLogs.length;
  const olderAverage = olderLogs.length > 0 ? olderLogs.reduce((sum, log) => sum + log.points, 0) / olderLogs.length : 0;
  
  if (recentAverage > olderAverage + 2) return 'improving';
  if (recentAverage < olderAverage - 2) return 'declining';
  return 'stable';
}

function analyzeBehaviorTrend(logs) {
  if (logs.length < 5) return 'Insufficient data for trend analysis';
  
  const recentLogs = logs.slice(0, 5); // Most recent 5 logs
  const positiveCount = recentLogs.filter(l => l.type === 'positive').length;
  const negativeCount = recentLogs.filter(l => l.type === 'negative').length;
  
  if (positiveCount > negativeCount * 2) return 'Strong positive trend';
  if (positiveCount > negativeCount) return 'Positive trend';
  if (negativeCount > positiveCount) return 'Needs attention';
  return 'Mixed behavior pattern';
}

function checkAutoInterventions(student, log) {
  const interventions = [];
  
  // High severity negative incident
  if (log.type === 'negative' && log.severity === 'high') {
    interventions.push({
      type: 'immediate_review',
      reason: 'High severity incident requires immediate attention'
    });
  }
  
  // Multiple negative incidents in short period
  const recentNegativeCount = behaviorData.behaviorLogs
    .filter(l => l.studentId === student.id && l.type === 'negative')
    .filter(l => {
      const logDate = new Date(l.recordedDate);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return logDate >= weekAgo;
    }).length;
  
  if (recentNegativeCount >= 3) {
    interventions.push({
      type: 'counseling_referral',
      reason: 'Multiple negative incidents in past week'
    });
  }
  
  // Low behavior points
  if (student.currentPoints < 50) {
    interventions.push({
      type: 'parent_conference',
      reason: 'Behavior points below acceptable threshold'
    });
  }
  
  return interventions;
}

function sendParentNotification(student, log) {
  // Simulate sending notification
  console.log(`Parent notification sent to ${student.parentPhone}: ${log.title} - ${log.description}`);
  return true;
}

function getAvailableRewards(points) {
  return behaviorData.rewardSystem.filter(reward => points >= reward.pointsRequired);
}

function getCategoryBreakdown(logs) {
  const breakdown = {};
  
  logs.forEach(log => {
    if (!breakdown[log.category]) {
      breakdown[log.category] = { count: 0, points: 0 };
    }
    breakdown[log.category].count += 1;
    breakdown[log.category].points += log.points;
  });
  
  return breakdown;
}

function getBehaviorLevelDistribution(students) {
  const distribution = {};
  
  students.forEach(student => {
    const level = getBehaviorLevel(student.currentPoints).level;
    distribution[level] = (distribution[level] || 0) + 1;
  });
  
  return distribution;
}

function getTopPerformers(students, limit) {
  return students
    .sort((a, b) => b.currentPoints - a.currentPoints)
    .slice(0, limit)
    .map(student => ({
      ...student,
      behaviorLevel: getBehaviorLevel(student.currentPoints)
    }));
}

function getStudentsNeedingAttention(students, limit) {
  return students
    .filter(student => student.currentPoints < 70 || student.behaviorTrend === 'declining')
    .sort((a, b) => a.currentPoints - b.currentPoints)
    .slice(0, limit)
    .map(student => ({
      ...student,
      behaviorLevel: getBehaviorLevel(student.currentPoints)
    }));
}

function getDailyIncidentTrends(logs, startDate, endDate) {
  const trends = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayLogs = logs.filter(log => log.recordedDate === dateStr);
    
    trends.push({
      date: dateStr,
      total: dayLogs.length,
      positive: dayLogs.filter(l => l.type === 'positive').length,
      negative: dayLogs.filter(l => l.type === 'negative').length
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return trends;
}

function calculateImprovementRate(students, logs) {
  // Calculate percentage of students showing improvement
  const improvingStudents = students.filter(s => s.behaviorTrend === 'improving').length;
  return students.length > 0 ? ((improvingStudents / students.length) * 100).toFixed(1) : 0;
}

module.exports = router;
const fetch = require('node-fetch');
const ARATTAI_SEND_URL = process.env.NEXTPUBLICAPIURL + '/arattai-alert/send';

async function sendBehaviourAlert(parentPhone, studentName, teacherName, schoolName) {
  const payload = {
    templateId: 'template_behaviour_alert', // Use actual behaviour alert template ID
    recipientNumber: parentPhone,
    variables: {
      parent_name: 'Parent',
      student_name: studentName,
      teacher_name: teacherName,
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
    console.error('Error sending Arattai behaviour alert:', error);
    return null;
  }
}

// Call sendBehaviourAlert on behaviour incident logged

module.exports = { sendBehaviourAlert };
