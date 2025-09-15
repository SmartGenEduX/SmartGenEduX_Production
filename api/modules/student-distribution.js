// Student Distribution Module - Complete Implementation
const express = require('express');
const router = express.Router();

const distributionData = {
  schools: [
    {
      id: 'school_001',
      name: 'Delhi Public School',
      totalCapacity: 1500,
      currentEnrollment: 1247,
      classes: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'],
      sections: ['A', 'B', 'C'],
      distributionPolicy: 'balanced_academic',
      maxClassSize: 35,
      minClassSize: 25
    }
  ],

  classStructure: [
    {
      id: 'class_1A',
      className: 'Class 1',
      section: 'A',
      grade: 1,
      capacity: 30,
      currentStrength: 28,
      classTeacher: 'teacher_001',
      room: 'Room 101',
      subjects: ['Mathematics', 'English', 'Hindi', 'Drawing', 'Games'],
      academicLevel: 'mixed',
      specialFocus: null
    },
    {
      id: 'class_1B',
      className: 'Class 1',
      section: 'B',
      grade: 1,
      capacity: 30,
      currentStrength: 25,
      classTeacher: 'teacher_002',
      room: 'Room 102',
      subjects: ['Mathematics', 'English', 'Hindi', 'Drawing', 'Games'],
      academicLevel: 'mixed',
      specialFocus: null
    },
    {
      id: 'class_2A',
      className: 'Class 2',
      section: 'A',
      grade: 2,
      capacity: 32,
      currentStrength: 30,
      classTeacher: 'teacher_003',
      room: 'Room 201',
      subjects: ['Mathematics', 'English', 'Hindi', 'Science', 'Social Studies'],
      academicLevel: 'advanced',
      specialFocus: 'science'
    },
    {
      id: 'class_2B',
      className: 'Class 2',
      section: 'B',
      grade: 2,
      capacity: 32,
      currentStrength: 29,
      classTeacher: 'teacher_004',
      room: 'Room 202',
      subjects: ['Mathematics', 'English', 'Hindi', 'Science', 'Social Studies'],
      academicLevel: 'standard',
      specialFocus: null
    },
    {
      id: 'class_3A',
      className: 'Class 3',
      section: 'A',
      grade: 3,
      capacity: 35,
      currentStrength: 33,
      classTeacher: 'teacher_005',
      room: 'Room 301',
      subjects: ['Mathematics', 'English', 'Hindi', 'Science', 'Social Studies', 'Computer'],
      academicLevel: 'advanced',
      specialFocus: 'technology'
    }
  ],

  students: [
    {
      id: 'student_001',
      name: 'Aarav Sharma',
      rollNumber: '1A01',
      currentClass: 'class_1A',
      grade: 1,
      dateOfBirth: '2017-05-15',
      gender: 'male',
      admissionDate: '2024-04-01',
      academicPerformance: {
        overallGrade: 'A',
        subjects: {
          'Mathematics': 'A+',
          'English': 'A',
          'Hindi': 'B+',
          'Drawing': 'A',
          'Games': 'A+'
        },
        averageScore: 92.5,
        rank: 2
      },
      behaviorScore: 85,
      attendancePercentage: 94.5,
      specialNeeds: false,
      learningStyle: 'visual',
      parentPreferences: {
        classTeacher: null,
        section: null,
        specialFocus: 'academic_excellence'
      },
      friendGroups: ['student_002', 'student_005'],
      medicalConditions: [],
      transportMode: 'school_bus',
      address: {
        area: 'Green Park',
        distance: 5.2 // km from school
      }
    },
    {
      id: 'student_002',
      name: 'Priya Patel',
      rollNumber: '1A02',
      currentClass: 'class_1A',
      grade: 1,
      dateOfBirth: '2017-08-22',
      gender: 'female',
      admissionDate: '2024-04-01',
      academicPerformance: {
        overallGrade: 'A+',
        subjects: {
          'Mathematics': 'A+',
          'English': 'A+',
          'Hindi': 'A',
          'Drawing': 'A+',
          'Games': 'A'
        },
        averageScore: 96.8,
        rank: 1
      },
      behaviorScore: 95,
      attendancePercentage: 96.8,
      specialNeeds: false,
      learningStyle: 'auditory',
      parentPreferences: {
        classTeacher: 'teacher_001',
        section: 'A',
        specialFocus: 'all_round_development'
      },
      friendGroups: ['student_001', 'student_003'],
      medicalConditions: [],
      transportMode: 'private',
      address: {
        area: 'Vasant Vihar',
        distance: 3.8
      }
    },
    {
      id: 'student_003',
      name: 'Arjun Singh',
      rollNumber: '2A01',
      currentClass: 'class_2A',
      grade: 2,
      dateOfBirth: '2016-12-10',
      gender: 'male',
      admissionDate: '2024-04-01',
      academicPerformance: {
        overallGrade: 'B+',
        subjects: {
          'Mathematics': 'B',
          'English': 'B+',
          'Hindi': 'A',
          'Science': 'B+',
          'Social Studies': 'B'
        },
        averageScore: 78.3,
        rank: 18
      },
      behaviorScore: 65,
      attendancePercentage: 92.3,
      specialNeeds: true,
      specialNeedsType: 'learning_difficulty',
      learningStyle: 'kinesthetic',
      parentPreferences: {
        classTeacher: null,
        section: null,
        specialFocus: 'individual_attention'
      },
      friendGroups: ['student_004'],
      medicalConditions: ['mild_asthma'],
      transportMode: 'school_bus',
      address: {
        area: 'Lajpat Nagar',
        distance: 8.5
      }
    },
    {
      id: 'student_004',
      name: 'Ananya Gupta',
      rollNumber: '2A02',
      currentClass: 'class_2A',
      grade: 2,
      dateOfBirth: '2016-06-18',
      gender: 'female',
      admissionDate: '2024-04-01',
      academicPerformance: {
        overallGrade: 'A',
        subjects: {
          'Mathematics': 'A',
          'English': 'A+',
          'Hindi': 'A',
          'Science': 'A+',
          'Social Studies': 'A'
        },
        averageScore: 89.7,
        rank: 5
      },
      behaviorScore: 88,
      attendancePercentage: 95.2,
      specialNeeds: false,
      learningStyle: 'mixed',
      parentPreferences: {
        classTeacher: null,
        section: null,
        specialFocus: 'science_focus'
      },
      friendGroups: ['student_003', 'student_005'],
      medicalConditions: [],
      transportMode: 'private',
      address: {
        area: 'Defence Colony',
        distance: 4.1
      }
    },
    {
      id: 'student_005',
      name: 'Kabir Joshi',
      rollNumber: '3A01',
      currentClass: 'class_3A',
      grade: 3,
      dateOfBirth: '2015-11-03',
      gender: 'male',
      admissionDate: '2024-04-01',
      academicPerformance: {
        overallGrade: 'A+',
        subjects: {
          'Mathematics': 'A+',
          'English': 'A',
          'Hindi': 'A',
          'Science': 'A+',
          'Social Studies': 'A',
          'Computer': 'A+'
        },
        averageScore: 94.1,
        rank: 1
      },
      behaviorScore: 92,
      attendancePercentage: 98.1,
      specialNeeds: false,
      learningStyle: 'visual',
      parentPreferences: {
        classTeacher: null,
        section: 'A',
        specialFocus: 'technology_focus'
      },
      friendGroups: ['student_001', 'student_004'],
      medicalConditions: [],
      transportMode: 'school_bus',
      address: {
        area: 'Saket',
        distance: 6.7
      }
    }
  ],

  distributionCriteria: [
    {
      id: 'academic_performance',
      name: 'Academic Performance',
      description: 'Balance students based on academic grades and scores',
      weight: 40,
      enabled: true,
      parameters: {
        gradeDistribution: 'normal',
        avoidClustering: true,
        maintainClassAverage: true
      }
    },
    {
      id: 'behavioral_assessment',
      name: 'Behavioral Assessment',
      description: 'Consider behavior scores for balanced classroom environment',
      weight: 25,
      enabled: true,
      parameters: {
        mixBehaviorLevels: true,
        leadershipDistribution: true,
        specialNeedsSupport: true
      }
    },
    {
      id: 'gender_balance',
      name: 'Gender Balance',
      description: 'Maintain balanced gender ratio in each class',
      weight: 15,
      enabled: true,
      parameters: {
        targetRatio: '50:50',
        allowableVariance: 10 // percentage
      }
    },
    {
      id: 'friend_groups',
      name: 'Friend Groups',
      description: 'Consider social connections and friendships',
      weight: 10,
      enabled: true,
      parameters: {
        keepFriendsTogther: true,
        maxFriendsPerClass: 3,
        avoidIsolation: true
      }
    },
    {
      id: 'special_needs',
      name: 'Special Needs',
      description: 'Ensure appropriate support for special needs students',
      weight: 5,
      enabled: true,
      parameters: {
        maxPerClass: 3,
        teacherTraining: true,
        resourceAllocation: true
      }
    },
    {
      id: 'transport_logistics',
      name: 'Transport Logistics',
      description: 'Consider transportation and geographical factors',
      weight: 5,
      enabled: false,
      parameters: {
        busRouteOptimization: true,
        distanceConsideration: false
      }
    }
  ],

  distributionHistory: [
    {
      id: 'dist_001',
      academicYear: '2024-25',
      distributionDate: '2024-03-15',
      distributionType: 'annual_promotion',
      criteria: ['academic_performance', 'behavioral_assessment', 'gender_balance'],
      studentsAffected: 247,
      classesInvolved: ['Class 1', 'Class 2', 'Class 3'],
      approvedBy: 'principal_001',
      status: 'completed',
      feedback: {
        teacherSatisfaction: 4.2,
        parentComplaints: 8,
        adjustmentsMade: 3
      }
    },
    {
      id: 'dist_002',
      academicYear: '2024-25',
      distributionDate: '2024-06-20',
      distributionType: 'mid_year_adjustment',
      criteria: ['academic_performance', 'special_needs'],
      studentsAffected: 12,
      classesInvolved: ['Class 2A', 'Class 2B'],
      approvedBy: 'vice_principal_001',
      status: 'completed',
      feedback: {
        teacherSatisfaction: 4.5,
        parentComplaints: 2,
        adjustmentsMade: 0
      }
    }
  ],

  waitingLists: [
    {
      id: 'wait_001',
      className: 'Class 1',
      section: 'A',
      studentsWaiting: [
        {
          studentId: 'student_pending_001',
          studentName: 'Riya Verma',
          applicationDate: '2024-05-15',
          priority: 'high',
          reason: 'sibling_in_school',
          estimatedAdmission: '2024-08-01'
        }
      ],
      currentCapacity: 30,
      waitingCount: 1
    }
  ],

  transferRequests: [
    {
      id: 'transfer_001',
      studentId: 'student_003',
      currentClass: 'class_2A',
      requestedClass: 'class_2B',
      reason: 'academic_support_needed',
      requestDate: '2024-12-20',
      requestedBy: 'parent',
      status: 'under_review',
      teacherRecommendation: 'support_needed',
      principalApproval: null,
      targetDate: '2025-01-15'
    }
  ],

  optimizationResults: {
    currentDistribution: {
      totalStudents: 247,
      averageClassSize: 29.6,
      classUtilization: 84.6, // percentage
      genderBalance: {
        overall: '52:48', // male:female
        byClass: {
          'Class 1': '55:45',
          'Class 2': '48:52',
          'Class 3': '53:47'
        }
      },
      academicBalance: {
        averageGradeDistribution: 'normal',
        topPerformersSpread: 'balanced',
        supportNeedsDistribution: 'appropriate'
      }
    },
    lastOptimization: {
      date: '2024-12-01',
      improvementScore: 15.3,
      changesRecommended: 8,
      changesImplemented: 5,
      nextOptimizationDue: '2025-03-01'
    }
  }
};

// Get current class distribution overview
router.get('/overview', (req, res) => {
  const { schoolId = 'school_001' } = req.query;
  
  const school = distributionData.schools.find(s => s.id === schoolId);
  if (!school) {
    return res.status(404).json({ error: 'School not found' });
  }
  
  // Calculate distribution statistics
  const classStats = distributionData.classStructure.map(classInfo => {
    const classStudents = distributionData.students.filter(s => s.currentClass === classInfo.id);
    
    const genderDistribution = {
      male: classStudents.filter(s => s.gender === 'male').length,
      female: classStudents.filter(s => s.gender === 'female').length
    };
    
    const academicDistribution = {
      'A+': classStudents.filter(s => s.academicPerformance.overallGrade === 'A+').length,
      'A': classStudents.filter(s => s.academicPerformance.overallGrade === 'A').length,
      'B+': classStudents.filter(s => s.academicPerformance.overallGrade === 'B+').length,
      'B': classStudents.filter(s => s.academicPerformance.overallGrade === 'B').length,
      'C': classStudents.filter(s => s.academicPerformance.overallGrade === 'C').length
    };
    
    const specialNeedsCount = classStudents.filter(s => s.specialNeeds).length;
    const averageAttendance = classStudents.length > 0 ? 
      (classStudents.reduce((sum, s) => sum + s.attendancePercentage, 0) / classStudents.length).toFixed(1) : 0;
    
    return {
      ...classInfo,
      actualStrength: classStudents.length,
      utilizationRate: ((classStudents.length / classInfo.capacity) * 100).toFixed(1),
      genderDistribution,
      academicDistribution,
      specialNeedsCount,
      averageAttendance: parseFloat(averageAttendance)
    };
  });
  
  const totalStudents = distributionData.students.length;
  const totalCapacity = distributionData.classStructure.reduce((sum, c) => sum + c.capacity, 0);
  
  res.json({
    school: school,
    summary: {
      totalStudents,
      totalCapacity,
      utilizationRate: ((totalStudents / totalCapacity) * 100).toFixed(1),
      totalClasses: distributionData.classStructure.length,
      averageClassSize: (totalStudents / distributionData.classStructure.length).toFixed(1)
    },
    classStatistics: classStats,
    optimizationStatus: distributionData.optimizationResults.lastOptimization
  });
});

// Get detailed class information
router.get('/classes/:classId', (req, res) => {
  const { classId } = req.params;
  
  const classInfo = distributionData.classStructure.find(c => c.id === classId);
  if (!classInfo) {
    return res.status(404).json({ error: 'Class not found' });
  }
  
  const classStudents = distributionData.students.filter(s => s.currentClass === classId);
  
  // Enhanced student information
  const enrichedStudents = classStudents.map(student => ({
    ...student,
    suitabilityScore: calculateSuitabilityScore(student, classInfo),
    recommendedActions: getRecommendedActions(student, classInfo)
  }));
  
  // Class analytics
  const analytics = {
    demographics: calculateClassDemographics(classStudents),
    academicProfile: calculateAcademicProfile(classStudents),
    behaviorProfile: calculateBehaviorProfile(classStudents),
    balanceScore: calculateClassBalance(classStudents, classInfo)
  };
  
  res.json({
    classInfo: classInfo,
    students: enrichedStudents,
    analytics: analytics,
    recommendations: generateClassRecommendations(classInfo, classStudents)
  });
});

// Get students eligible for redistribution
router.get('/eligible-students', (req, res) => {
  const { criteria, targetClass, minScore = 0 } = req.query;
  
  let eligibleStudents = distributionData.students;
  
  // Filter by criteria
  if (criteria) {
    const criteriaList = criteria.split(',');
    eligibleStudents = eligibleStudents.filter(student => 
      evaluateStudentForCriteria(student, criteriaList)
    );
  }
  
  // Calculate redistribution scores
  const studentsWithScores = eligibleStudents.map(student => {
    const currentClass = distributionData.classStructure.find(c => c.id === student.currentClass);
    const redistributionScore = calculateRedistributionScore(student, targetClass);
    
    return {
      ...student,
      currentClassInfo: currentClass,
      redistributionScore: redistributionScore,
      redistributionReasons: getRedistributionReasons(student, targetClass)
    };
  });
  
  // Filter by minimum score
  const qualifiedStudents = studentsWithScores.filter(s => 
    s.redistributionScore >= parseFloat(minScore)
  );
  
  // Sort by redistribution score (highest first)
  qualifiedStudents.sort((a, b) => b.redistributionScore - a.redistributionScore);
  
  res.json({
    totalEligible: qualifiedStudents.length,
    students: qualifiedStudents
  });
});

// Generate optimal distribution plan
router.post('/generate-plan', (req, res) => {
  const {
    targetAcademicYear = '2025-26',
    criteria = ['academic_performance', 'behavioral_assessment', 'gender_balance'],
    constraints = {},
    preserveExisting = false
  } = req.body;
  
  // Get active criteria with weights
  const activeCriteria = distributionData.distributionCriteria.filter(c => 
    criteria.includes(c.id) && c.enabled
  );
  
  // Generate distribution plan
  const distributionPlan = generateOptimalDistribution(
    distributionData.students,
    distributionData.classStructure,
    activeCriteria,
    constraints,
    preserveExisting
  );
  
  // Calculate improvement metrics
  const currentMetrics = calculateDistributionMetrics(getCurrentDistribution());
  const plannedMetrics = calculateDistributionMetrics(distributionPlan.newDistribution);
  const improvement = calculateImprovement(currentMetrics, plannedMetrics);
  
  const plan = {
    id: 'plan_' + Date.now(),
    targetAcademicYear,
    generatedAt: new Date().toISOString(),
    criteria: activeCriteria,
    constraints,
    distributionChanges: distributionPlan.changes,
    affectedStudents: distributionPlan.affectedStudents,
    metrics: {
      current: currentMetrics,
      planned: plannedMetrics,
      improvement: improvement
    },
    implementationSteps: generateImplementationSteps(distributionPlan.changes),
    estimatedDuration: calculateImplementationDuration(distributionPlan.changes),
    riskAssessment: assessImplementationRisks(distributionPlan.changes),
    status: 'draft'
  };
  
  res.json({
    success: true,
    plan: plan,
    message: `Distribution plan generated with ${distributionPlan.changes.length} recommended changes`
  });
});

// Simulate distribution changes
router.post('/simulate', (req, res) => {
  const { changes, targetMetrics } = req.body;
  
  if (!Array.isArray(changes) || changes.length === 0) {
    return res.status(400).json({ error: 'Changes array is required' });
  }
  
  // Create simulation environment
  const simulatedDistribution = simulateDistributionChanges(changes);
  
  // Calculate metrics for simulated distribution
  const simulatedMetrics = calculateDistributionMetrics(simulatedDistribution);
  
  // Compare with current metrics
  const currentMetrics = calculateDistributionMetrics(getCurrentDistribution());
  const comparison = compareMetrics(currentMetrics, simulatedMetrics);
  
  // Check if target metrics are met
  const targetsMet = targetMetrics ? 
    checkTargetsMet(simulatedMetrics, targetMetrics) : null;
  
  res.json({
    simulation: {
      changesApplied: changes.length,
      affectedStudents: getAffectedStudents(changes).length,
      newDistribution: simulatedDistribution
    },
    metrics: {
      current: currentMetrics,
      simulated: simulatedMetrics,
      comparison: comparison
    },
    targetAnalysis: targetsMet,
    recommendations: generateSimulationRecommendations(comparison, targetsMet)
  });
});

// Apply distribution changes
router.post('/apply-changes', (req, res) => {
  const { changes, approvedBy, effectiveDate = new Date().toISOString().split('T')[0] } = req.body;
  
  if (!Array.isArray(changes) || changes.length === 0) {
    return res.status(400).json({ error: 'Changes array is required' });
  }
  
  const results = [];
  const errors = [];
  
  changes.forEach(change => {
    try {
      const result = applyDistributionChange(change, approvedBy, effectiveDate);
      results.push(result);
    } catch (error) {
      errors.push({
        change: change,
        error: error.message
      });
    }
  });
  
  // Update distribution history
  const historyEntry = {
    id: 'dist_' + Date.now(),
    academicYear: '2024-25',
    distributionDate: effectiveDate,
    distributionType: 'manual_adjustment',
    criteria: ['manual'],
    studentsAffected: results.length,
    classesInvolved: [...new Set(results.map(r => r.newClass))],
    approvedBy: approvedBy,
    status: errors.length === 0 ? 'completed' : 'partial',
    changes: results,
    errors: errors
  };
  
  distributionData.distributionHistory.push(historyEntry);
  
  res.json({
    success: errors.length === 0,
    changesApplied: results.length,
    changesFailed: errors.length,
    results: results,
    errors: errors,
    historyId: historyEntry.id,
    message: `${results.length} changes applied successfully${errors.length > 0 ? `, ${errors.length} failed` : ''}`
  });
});

// Get distribution analytics
router.get('/analytics', (req, res) => {
  const { timeframe = 'current', compareWith } = req.query;
  
  const currentDistribution = getCurrentDistribution();
  const currentMetrics = calculateDistributionMetrics(currentDistribution);
  
  let comparison = null;
  if (compareWith) {
    const historicalDistribution = getHistoricalDistribution(compareWith);
    if (historicalDistribution) {
      const historicalMetrics = calculateDistributionMetrics(historicalDistribution);
      comparison = compareMetrics(historicalMetrics, currentMetrics);
    }
  }
  
  const analytics = {
    overview: distributionData.optimizationResults.currentDistribution,
    detailedMetrics: currentMetrics,
    trends: calculateDistributionTrends(),
    balanceAnalysis: calculateBalanceAnalysis(),
    optimization: {
      currentScore: calculateOverallOptimizationScore(currentMetrics),
      possibleImprovements: identifyImprovementOpportunities(),
      nextOptimizationDue: distributionData.optimizationResults.lastOptimization.nextOptimizationDue
    },
    comparison: comparison
  };
  
  res.json(analytics);
});

// Get transfer requests
router.get('/transfer-requests', (req, res) => {
  const { status, studentId, classId } = req.query;
  
  let requests = distributionData.transferRequests;
  
  // Apply filters
  if (status) {
    requests = requests.filter(req => req.status === status);
  }
  
  if (studentId) {
    requests = requests.filter(req => req.studentId === studentId);
  }
  
  if (classId) {
    requests = requests.filter(req => 
      req.currentClass === classId || req.requestedClass === classId
    );
  }
  
  // Enrich with student and class information
  const enrichedRequests = requests.map(request => {
    const student = distributionData.students.find(s => s.id === request.studentId);
    const currentClass = distributionData.classStructure.find(c => c.id === request.currentClass);
    const requestedClass = distributionData.classStructure.find(c => c.id === request.requestedClass);
    
    return {
      ...request,
      studentInfo: student,
      currentClassInfo: currentClass,
      requestedClassInfo: requestedClass,
      feasibilityScore: calculateTransferFeasibility(request, student, currentClass, requestedClass)
    };
  });
  
  res.json(enrichedRequests);
});

// Create transfer request
router.post('/transfer-requests', (req, res) => {
  const {
    studentId,
    requestedClass,
    reason,
    requestedBy = 'parent',
    targetDate
  } = req.body;
  
  // Validate required fields
  if (!studentId || !requestedClass || !reason) {
    return res.status(400).json({ error: 'Student ID, requested class, and reason are required' });
  }
  
  // Check if student exists
  const student = distributionData.students.find(s => s.id === studentId);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }
  
  // Check if requested class exists
  const targetClass = distributionData.classStructure.find(c => c.id === requestedClass);
  if (!targetClass) {
    return res.status(404).json({ error: 'Requested class not found' });
  }
  
  // Check if transfer is to same class
  if (student.currentClass === requestedClass) {
    return res.status(400).json({ error: 'Student is already in the requested class' });
  }
  
  // Create transfer request
  const newRequest = {
    id: 'transfer_' + Date.now(),
    studentId,
    currentClass: student.currentClass,
    requestedClass,
    reason,
    requestDate: new Date().toISOString().split('T')[0],
    requestedBy,
    status: 'under_review',
    teacherRecommendation: null,
    principalApproval: null,
    targetDate: targetDate || null,
    createdAt: new Date().toISOString()
  };
  
  distributionData.transferRequests.push(newRequest);
  
  res.json({
    success: true,
    transferRequest: newRequest,
    message: 'Transfer request created successfully'
  });
});

// Process transfer request
router.put('/transfer-requests/:requestId', (req, res) => {
  const { requestId } = req.params;
  const { status, notes, processedBy } = req.body;
  
  const requestIndex = distributionData.transferRequests.findIndex(r => r.id === requestId);
  
  if (requestIndex === -1) {
    return res.status(404).json({ error: 'Transfer request not found' });
  }
  
  const request = distributionData.transferRequests[requestIndex];
  
  // Update request status
  request.status = status;
  request.processingNotes = notes || '';
  request.processedBy = processedBy;
  request.processedAt = new Date().toISOString();
  
  // If approved, apply the transfer
  if (status === 'approved') {
    try {
      const transferResult = applyDistributionChange({
        studentId: request.studentId,
        fromClass: request.currentClass,
        toClass: request.requestedClass,
        reason: request.reason
      }, processedBy, request.targetDate);
      
      request.transferApplied = true;
      request.transferResult = transferResult;
    } catch (error) {
      request.status = 'approved_pending';
      request.transferError = error.message;
    }
  }
  
  res.json({
    success: true,
    transferRequest: request,
    message: `Transfer request ${status} successfully`
  });
});

// Helper Functions
function calculateSuitabilityScore(student, classInfo) {
  let score = 0;
  
  // Academic fit (40%)
  const academicFit = calculateAcademicFit(student, classInfo);
  score += academicFit * 0.4;
  
  // Behavioral fit (30%)
  const behavioralFit = calculateBehavioralFit(student, classInfo);
  score += behavioralFit * 0.3;
  
  // Social fit (20%)
  const socialFit = calculateSocialFit(student, classInfo);
  score += socialFit * 0.2;
  
  // Special needs accommodation (10%)
  const specialNeedsFit = calculateSpecialNeedsFit(student, classInfo);
  score += specialNeedsFit * 0.1;
  
  return Math.round(score);
}

function calculateAcademicFit(student, classInfo) {
  const gradeValues = { 'A+': 95, 'A': 85, 'B+': 75, 'B': 65, 'C': 55 };
  const studentScore = gradeValues[student.academicPerformance.overallGrade] || 50;
  
  // Compare with class academic level
  const targetScore = classInfo.academicLevel === 'advanced' ? 85 : 
                     classInfo.academicLevel === 'standard' ? 75 : 65;
  
  const difference = Math.abs(studentScore - targetScore);
  return Math.max(0, 100 - (difference * 2));
}

function calculateBehavioralFit(student, classInfo) {
  // Simple behavioral scoring based on behavior score
  return Math.min(100, student.behaviorScore + 10);
}

function calculateSocialFit(student, classInfo) {
  // Consider friend groups and social connections
  const classStudents = distributionData.students.filter(s => s.currentClass === classInfo.id);
  const friendsInClass = student.friendGroups.filter(friendId => 
    classStudents.some(s => s.id === friendId)
  ).length;
  
  return Math.min(100, 60 + (friendsInClass * 20));
}

function calculateSpecialNeedsFit(student, classInfo) {
  if (!student.specialNeeds) return 100;
  
  const specialNeedsInClass = distributionData.students.filter(s => 
    s.currentClass === classInfo.id && s.specialNeeds
  ).length;
  
  // Prefer classes with fewer special needs students
  return Math.max(20, 100 - (specialNeedsInClass * 25));
}

function getRecommendedActions(student, classInfo) {
  const actions = [];
  
  if (student.academicPerformance.averageScore < 70) {
    actions.push('Additional academic support needed');
  }
  
  if (student.behaviorScore < 70) {
    actions.push('Behavioral intervention recommended');
  }
  
  if (student.attendancePercentage < 90) {
    actions.push('Attendance improvement plan required');
  }
  
  if (student.specialNeeds) {
    actions.push('Special needs accommodation required');
  }
  
  return actions;
}

function calculateClassDemographics(students) {
  const totalStudents = students.length;
  
  return {
    totalCount: totalStudents,
    genderDistribution: {
      male: students.filter(s => s.gender === 'male').length,
      female: students.filter(s => s.gender === 'female').length,
      ratio: totalStudents > 0 ? 
        `${students.filter(s => s.gender === 'male').length}:${students.filter(s => s.gender === 'female').length}` : '0:0'
    },
    specialNeeds: {
      count: students.filter(s => s.specialNeeds).length,
      percentage: totalStudents > 0 ? ((students.filter(s => s.specialNeeds).length / totalStudents) * 100).toFixed(1) : 0
    },
    transportModes: {
      school_bus: students.filter(s => s.transportMode === 'school_bus').length,
      private: students.filter(s => s.transportMode === 'private').length,
      walking: students.filter(s => s.transportMode === 'walking').length
    }
  };
}

function calculateAcademicProfile(students) {
  if (students.length === 0) return null;
  
  const averageScore = (students.reduce((sum, s) => sum + s.academicPerformance.averageScore, 0) / students.length).toFixed(1);
  
  const gradeDistribution = {
    'A+': students.filter(s => s.academicPerformance.overallGrade === 'A+').length,
    'A': students.filter(s => s.academicPerformance.overallGrade === 'A').length,
    'B+': students.filter(s => s.academicPerformance.overallGrade === 'B+').length,
    'B': students.filter(s => s.academicPerformance.overallGrade === 'B').length,
    'C': students.filter(s => s.academicPerformance.overallGrade === 'C').length
  };
  
  return {
    averageScore: parseFloat(averageScore),
    gradeDistribution,
    topPerformers: students.filter(s => s.academicPerformance.averageScore >= 90).length,
    needsSupport: students.filter(s => s.academicPerformance.averageScore < 70).length
  };
}

function calculateBehaviorProfile(students) {
  if (students.length === 0) return null;
  
  const averageBehaviorScore = (students.reduce((sum, s) => sum + s.behaviorScore, 0) / students.length).toFixed(1);
  
  return {
    averageScore: parseFloat(averageBehaviorScore),
    excellent: students.filter(s => s.behaviorScore >= 90).length,
    good: students.filter(s => s.behaviorScore >= 70 && s.behaviorScore < 90).length,
    needsImprovement: students.filter(s => s.behaviorScore < 70).length
  };
}

function calculateClassBalance(students, classInfo) {
  // Calculate overall balance score based on multiple factors
  let balanceScore = 0;
  
  // Gender balance (25%)
  const genderBalance = calculateGenderBalance(students);
  balanceScore += genderBalance * 0.25;
  
  // Academic balance (35%)
  const academicBalance = calculateAcademicBalance(students);
  balanceScore += academicBalance * 0.35;
  
  // Behavioral balance (25%)
  const behavioralBalance = calculateBehavioralBalance(students);
  balanceScore += behavioralBalance * 0.25;
  
  // Special needs distribution (15%)
  const specialNeedsBalance = calculateSpecialNeedsBalance(students, classInfo);
  balanceScore += specialNeedsBalance * 0.15;
  
  return Math.round(balanceScore);
}

function calculateGenderBalance(students) {
  const total = students.length;
  if (total === 0) return 100;
  
  const males = students.filter(s => s.gender === 'male').length;
  const females = students.filter(s => s.gender === 'female').length;
  
  const ratio = Math.min(males, females) / Math.max(males, females);
  return Math.round(ratio * 100);
}

function calculateAcademicBalance(students) {
  if (students.length === 0) return 100;
  
  const gradeDistribution = {
    'A+': students.filter(s => s.academicPerformance.overallGrade === 'A+').length,
    'A': students.filter(s => s.academicPerformance.overallGrade === 'A').length,
    'B+': students.filter(s => s.academicPerformance.overallGrade === 'B+').length,
    'B': students.filter(s => s.academicPerformance.overallGrade === 'B').length,
    'C': students.filter(s => s.academicPerformance.overallGrade === 'C').length
  };
  
  // Check for normal distribution
  const expectedDistribution = [10, 25, 30, 25, 10]; // percentages
  const actualDistribution = Object.values(gradeDistribution).map(count => 
    (count / students.length) * 100
  );
  
  let variance = 0;
  for (let i = 0; i < expectedDistribution.length; i++) {
    variance += Math.pow(actualDistribution[i] - expectedDistribution[i], 2);
  }
  
  return Math.max(0, 100 - variance);
}

function calculateBehavioralBalance(students) {
  if (students.length === 0) return 100;
  
  const excellent = students.filter(s => s.behaviorScore >= 90).length;
  const good = students.filter(s => s.behaviorScore >= 70 && s.behaviorScore < 90).length;
  const needsImprovement = students.filter(s => s.behaviorScore < 70).length;
  
  // Ideal distribution: 20% excellent, 70% good, 10% needs improvement
  const ideal = [20, 70, 10];
  const actual = [
    (excellent / students.length) * 100,
    (good / students.length) * 100,
    (needsImprovement / students.length) * 100
  ];
  
  let variance = 0;
  for (let i = 0; i < ideal.length; i++) {
    variance += Math.pow(actual[i] - ideal[i], 2);
  }
  
  return Math.max(0, 100 - variance);
}

function calculateSpecialNeedsBalance(students, classInfo) {
  const specialNeedsCount = students.filter(s => s.specialNeeds).length;
  const maxRecommended = 3; // Maximum recommended special needs students per class
  
  if (specialNeedsCount <= maxRecommended) {
    return 100;
  } else {
    return Math.max(0, 100 - ((specialNeedsCount - maxRecommended) * 20));
  }
}

function generateClassRecommendations(classInfo, students) {
  const recommendations = [];
  
  // Check class size
  if (students.length > classInfo.capacity * 0.9) {
    recommendations.push({
      type: 'capacity',
      priority: 'high',
      message: 'Class is near capacity. Consider redistribution or capacity increase.',
      action: 'redistribute_students'
    });
  }
  
  // Check gender balance
  const genderBalance = calculateGenderBalance(students);
  if (genderBalance < 70) {
    recommendations.push({
      type: 'gender_balance',
      priority: 'medium',
      message: 'Gender imbalance detected. Consider redistributing students for better balance.',
      action: 'balance_gender'
    });
  }
  
  // Check academic distribution
  const academicBalance = calculateAcademicBalance(students);
  if (academicBalance < 70) {
    recommendations.push({
      type: 'academic_balance',
      priority: 'medium',
      message: 'Academic performance is not well distributed. Consider academic grouping.',
      action: 'balance_academics'
    });
  }
  
  // Check special needs support
  const specialNeedsCount = students.filter(s => s.specialNeeds).length;
  if (specialNeedsCount > 3) {
    recommendations.push({
      type: 'special_needs',
      priority: 'high',
      message: 'High concentration of special needs students. Additional support may be required.',
      action: 'provide_additional_support'
    });
  }
  
  return recommendations;
}

function getCurrentDistribution() {
  return distributionData.students.map(student => ({
    studentId: student.id,
    currentClass: student.currentClass,
    academicScore: student.academicPerformance.averageScore,
    behaviorScore: student.behaviorScore,
    specialNeeds: student.specialNeeds,
    gender: student.gender
  }));
}

function calculateDistributionMetrics(distribution) {
  // Group by class
  const classCounts = {};
  distribution.forEach(student => {
    if (!classCounts[student.currentClass]) {
      classCounts[student.currentClass] = [];
    }
    classCounts[student.currentClass].push(student);
  });
  
  // Calculate metrics for each class
  const classMetrics = {};
  Object.keys(classCounts).forEach(classId => {
    const students = classCounts[classId];
    classMetrics[classId] = {
      count: students.length,
      genderBalance: calculateGenderBalance(students),
      academicBalance: calculateAcademicBalance(students),
      behaviorBalance: calculateBehavioralBalance(students),
      specialNeedsCount: students.filter(s => s.specialNeeds).length
    };
  });
  
  return {
    totalStudents: distribution.length,
    classMetrics: classMetrics,
    overallBalance: calculateOverallBalance(classMetrics)
  };
}

function calculateOverallBalance(classMetrics) {
  const classes = Object.values(classMetrics);
  if (classes.length === 0) return 0;
  
  const avgGenderBalance = classes.reduce((sum, c) => sum + c.genderBalance, 0) / classes.length;
  const avgAcademicBalance = classes.reduce((sum, c) => sum + c.academicBalance, 0) / classes.length;
  const avgBehaviorBalance = classes.reduce((sum, c) => sum + c.behaviorBalance, 0) / classes.length;
  
  return Math.round((avgGenderBalance + avgAcademicBalance + avgBehaviorBalance) / 3);
}

// Placeholder functions for complex operations
function evaluateStudentForCriteria(student, criteria) {
  return true; // Simplified implementation
}

function calculateRedistributionScore(student, targetClass) {
  return Math.floor(Math.random() * 100); // Placeholder
}

function getRedistributionReasons(student, targetClass) {
  return ['Academic fit', 'Better balance']; // Placeholder
}

function generateOptimalDistribution(students, classes, criteria, constraints, preserveExisting) {
  return {
    changes: [],
    affectedStudents: 0,
    newDistribution: getCurrentDistribution()
  }; // Placeholder
}

function calculateImprovement(current, planned) {
  return {
    balanceImprovement: planned.overallBalance - current.overallBalance,
    utilizationImprovement: 0
  }; // Placeholder
}

function generateImplementationSteps(changes) {
  return ['Review changes', 'Notify parents', 'Update records']; // Placeholder
}

function calculateImplementationDuration(changes) {
  return '2-3 weeks'; // Placeholder
}

function assessImplementationRisks(changes) {
  return ['Parent concerns', 'Academic disruption']; // Placeholder
}

function simulateDistributionChanges(changes) {
  return getCurrentDistribution(); // Placeholder
}

function compareMetrics(current, simulated) {
  return {
    balanceChange: simulated.overallBalance - current.overallBalance
  }; // Placeholder
}

function getAffectedStudents(changes) {
  return changes.map(c => c.studentId); // Placeholder
}

function checkTargetsMet(metrics, targets) {
  return { met: true, details: {} }; // Placeholder
}

function generateSimulationRecommendations(comparison, targetsMet) {
  return ['Proceed with changes']; // Placeholder
}

function applyDistributionChange(change, approvedBy, effectiveDate) {
  // Find and update student
  const student = distributionData.students.find(s => s.id === change.studentId);
  if (student) {
    const oldClass = student.currentClass;
    student.currentClass = change.toClass;
    
    return {
      studentId: change.studentId,
      oldClass: oldClass,
      newClass: change.toClass,
      appliedAt: new Date().toISOString()
    };
  }
  throw new Error('Student not found');
}

function calculateDistributionTrends() {
  return { improving: true }; // Placeholder
}

function calculateBalanceAnalysis() {
  return { overall: 'good' }; // Placeholder
}

function calculateOverallOptimizationScore(metrics) {
  return metrics.overallBalance || 75; // Placeholder
}

function identifyImprovementOpportunities() {
  return ['Better gender balance']; // Placeholder
}

function getHistoricalDistribution(date) {
  return null; // Placeholder
}

function calculateTransferFeasibility(request, student, currentClass, requestedClass) {
  return Math.floor(Math.random() * 100); // Placeholder
}

module.exports = router;