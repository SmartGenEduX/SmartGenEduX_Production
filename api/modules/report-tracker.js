// Report Tracker Module - Complete Implementation
const express = require('express');
const router = express.Router();

const reportData = {
  academicReports: [
    {
      id: 'report_001',
      reportType: 'progress_report',
      title: 'Mid-Term Progress Report',
      studentId: 'student_001',
      studentName: 'Aarav Sharma',
      class: 'Class 1-A',
      rollNumber: '001',
      academicYear: '2024-25',
      term: 'Mid-Term',
      reportPeriod: {
        startDate: '2024-07-01',
        endDate: '2024-12-15'
      },
      subjects: [
        {
          subjectId: 'math',
          subjectName: 'Mathematics',
          teacher: 'Ms. Priya Sharma',
          marksObtained: 92,
          totalMarks: 100,
          grade: 'A+',
          percentage: 92,
          remarks: 'Excellent understanding of concepts. Shows great problem-solving skills.',
          skills: {
            numeracy: 'Excellent',
            problemSolving: 'Excellent',
            logicalThinking: 'Very Good'
          }
        },
        {
          subjectId: 'english',
          subjectName: 'English',
          teacher: 'Mr. Rajesh Kumar',
          marksObtained: 85,
          totalMarks: 100,
          grade: 'A',
          percentage: 85,
          remarks: 'Good language skills. Needs improvement in creative writing.',
          skills: {
            reading: 'Very Good',
            writing: 'Good',
            speaking: 'Excellent',
            listening: 'Very Good'
          }
        },
        {
          subjectId: 'hindi',
          subjectName: 'Hindi',
          teacher: 'Mrs. Anita Singh',
          marksObtained: 78,
          totalMarks: 100,
          grade: 'B+',
          percentage: 78,
          remarks: 'Satisfactory performance. Practice required in grammar.',
          skills: {
            reading: 'Good',
            writing: 'Average',
            speaking: 'Good'
          }
        },
        {
          subjectId: 'drawing',
          subjectName: 'Drawing & Craft',
          teacher: 'Ms. Kavya Reddy',
          marksObtained: 95,
          totalMarks: 100,
          grade: 'A+',
          percentage: 95,
          remarks: 'Outstanding creativity and artistic skills.',
          skills: {
            creativity: 'Excellent',
            handEyeCoordination: 'Excellent',
            colorSense: 'Very Good'
          }
        },
        {
          subjectId: 'games',
          subjectName: 'Physical Education',
          teacher: 'Mr. Vikram Gupta',
          marksObtained: 88,
          totalMarks: 100,
          grade: 'A',
          percentage: 88,
          remarks: 'Active participation in sports. Good team player.',
          skills: {
            physicalFitness: 'Very Good',
            teamwork: 'Excellent',
            sportsmanship: 'Very Good'
          }
        }
      ],
      overallPerformance: {
        totalMarks: 500,
        marksObtained: 438,
        percentage: 87.6,
        overallGrade: 'A',
        classRank: 2,
        classStrength: 28
      },
      attendance: {
        totalDays: 120,
        presentDays: 115,
        absentDays: 5,
        attendancePercentage: 95.8
      },
      behaviorAssessment: {
        discipline: 'Excellent',
        punctuality: 'Very Good',
        cooperation: 'Excellent',
        leadership: 'Good',
        overallBehavior: 'Excellent'
      },
      coActivities: {
        sportsParticipation: ['Cricket Team', 'Swimming'],
        culturalActivities: ['Art Competition Winner', 'Science Exhibition'],
        specialAchievements: ['Best Student of the Month - October']
      },
      teacherRemarks: 'Aarav is a bright and enthusiastic student who consistently performs well across all subjects. His positive attitude and willingness to help others make him a role model for his peers.',
      principalRemarks: 'Commendable performance. Keep up the good work.',
      parentFeedback: '',
      nextTermTargets: [
        'Improve Hindi grammar skills',
        'Participate in more cultural activities',
        'Maintain excellent academic performance'
      ],
      reportGeneratedBy: 'teacher_001',
      generatedDate: '2024-12-15',
      status: 'finalized',
      distributedToParents: true,
      distributionDate: '2024-12-16'
    },
    {
      id: 'report_002',
      reportType: 'annual_report',
      title: 'Annual Assessment Report',
      studentId: 'student_002',
      studentName: 'Priya Patel',
      class: 'Class 1-A',
      rollNumber: '002',
      academicYear: '2024-25',
      term: 'Annual',
      reportPeriod: {
        startDate: '2024-04-01',
        endDate: '2024-03-31'
      },
      subjects: [
        {
          subjectId: 'math',
          subjectName: 'Mathematics',
          teacher: 'Ms. Priya Sharma',
          marksObtained: 96,
          totalMarks: 100,
          grade: 'A+',
          percentage: 96,
          remarks: 'Outstanding mathematical aptitude. Consistently top performer.',
          skills: {
            numeracy: 'Excellent',
            problemSolving: 'Excellent',
            logicalThinking: 'Excellent'
          }
        },
        {
          subjectId: 'english',
          subjectName: 'English',
          teacher: 'Mr. Rajesh Kumar',
          marksObtained: 94,
          totalMarks: 100,
          grade: 'A+',
          percentage: 94,
          remarks: 'Exceptional language skills. Creative and expressive writing.',
          skills: {
            reading: 'Excellent',
            writing: 'Excellent',
            speaking: 'Excellent',
            listening: 'Excellent'
          }
        }
      ],
      overallPerformance: {
        totalMarks: 500,
        marksObtained: 475,
        percentage: 95.0,
        overallGrade: 'A+',
        classRank: 1,
        classStrength: 28
      },
      status: 'draft'
    }
  ],

  reportTemplates: [
    {
      id: 'template_001',
      name: 'Primary Progress Report',
      description: 'Standard progress report for primary classes (1-5)',
      applicableClasses: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'],
      sections: [
        {
          section: 'student_info',
          title: 'Student Information',
          fields: ['name', 'class', 'rollNumber', 'admissionNumber', 'dateOfBirth']
        },
        {
          section: 'academic_performance',
          title: 'Academic Performance',
          fields: ['subjects', 'marks', 'grades', 'teacherRemarks']
        },
        {
          section: 'attendance',
          title: 'Attendance Record',
          fields: ['totalDays', 'presentDays', 'attendancePercentage']
        },
        {
          section: 'behavior',
          title: 'Behavior Assessment',
          fields: ['discipline', 'punctuality', 'cooperation', 'leadership']
        },
        {
          section: 'activities',
          title: 'Co-curricular Activities',
          fields: ['sportsParticipation', 'culturalActivities', 'specialAchievements']
        },
        {
          section: 'remarks',
          title: 'Teacher & Principal Remarks',
          fields: ['teacherRemarks', 'principalRemarks']
        }
      ],
      gradingScale: [
        { grade: 'A+', minMarks: 95, maxMarks: 100, description: 'Outstanding' },
        { grade: 'A', minMarks: 85, maxMarks: 94, description: 'Excellent' },
        { grade: 'B+', minMarks: 75, maxMarks: 84, description: 'Very Good' },
        { grade: 'B', minMarks: 65, maxMarks: 74, description: 'Good' },
        { grade: 'C+', minMarks: 55, maxMarks: 64, description: 'Satisfactory' },
        { grade: 'C', minMarks: 45, maxMarks: 54, description: 'Needs Improvement' },
        { grade: 'D', minMarks: 35, maxMarks: 44, description: 'Unsatisfactory' },
        { grade: 'F', minMarks: 0, maxMarks: 34, description: 'Fail' }
      ]
    },
    {
      id: 'template_002',
      name: 'Skill-Based Assessment Report',
      description: 'Comprehensive skill assessment report',
      applicableClasses: ['Class 1', 'Class 2', 'Class 3'],
      sections: [
        {
          section: 'cognitive_skills',
          title: 'Cognitive Development',
          fields: ['problemSolving', 'criticalThinking', 'creativity', 'memory']
        },
        {
          section: 'social_skills',
          title: 'Social & Emotional Development',
          fields: ['communication', 'teamwork', 'empathy', 'selfControl']
        },
        {
          section: 'physical_skills',
          title: 'Physical Development',
          fields: ['motorSkills', 'coordination', 'fitness', 'health']
        }
      ]
    }
  ],

  reportSchedule: [
    {
      id: 'schedule_001',
      reportType: 'progress_report',
      term: 'First Term',
      scheduledDate: '2024-08-15',
      submissionDeadline: '2024-08-20',
      distributionDate: '2024-08-25',
      classes: ['Class 1-A', 'Class 1-B', 'Class 2-A', 'Class 2-B'],
      status: 'completed',
      completionRate: 100
    },
    {
      id: 'schedule_002',
      reportType: 'progress_report',
      term: 'Mid Term',
      scheduledDate: '2024-12-15',
      submissionDeadline: '2024-12-20',
      distributionDate: '2024-12-22',
      classes: ['Class 1-A', 'Class 1-B', 'Class 2-A', 'Class 2-B'],
      status: 'in_progress',
      completionRate: 75
    },
    {
      id: 'schedule_003',
      reportType: 'annual_report',
      term: 'Annual',
      scheduledDate: '2025-03-15',
      submissionDeadline: '2025-03-25',
      distributionDate: '2025-03-30',
      classes: ['Class 1-A', 'Class 1-B', 'Class 2-A', 'Class 2-B'],
      status: 'scheduled',
      completionRate: 0
    }
  ],

  reportAnalytics: {
    classPerformance: {
      'Class 1-A': {
        averagePercentage: 84.2,
        topPerformers: 5,
        needsImprovement: 3,
        attendanceRate: 94.5,
        subjectWiseAverage: {
          'Mathematics': 86.3,
          'English': 83.1,
          'Hindi': 82.8,
          'Drawing': 88.9,
          'Physical Education': 85.7
        }
      },
      'Class 1-B': {
        averagePercentage: 82.1,
        topPerformers: 4,
        needsImprovement: 4,
        attendanceRate: 93.2,
        subjectWiseAverage: {
          'Mathematics': 84.1,
          'English': 81.3,
          'Hindi': 80.9,
          'Drawing': 86.2,
          'Physical Education': 84.1
        }
      }
    },
    performanceTrends: {
      improving: 45,
      stable: 38,
      declining: 8
    },
    parentEngagement: {
      reportsDownloaded: 87,
      parentTeacherMeetings: 23,
      feedbackReceived: 45
    }
  },

  reportSettings: {
    autoGeneration: true,
    reminderNotifications: true,
    parentNotifications: true,
    digitalDistribution: true,
    printCopies: false,
    gradeCalculationMethod: 'weighted_average',
    skillAssessmentEnabled: true,
    behaviorTrackingEnabled: true,
    attendanceIntegration: true,
    reportCardDesign: 'modern_template',
    languageOptions: ['English', 'Hindi'],
    parentPortalAccess: true
  }
};

// Get all reports
router.get('/reports', (req, res) => {
  const { 
    studentId, 
    class: className, 
    term, 
    reportType, 
    status,
    academicYear = '2024-25' 
  } = req.query;
  
  let reports = reportData.academicReports;
  
  // Apply filters
  if (studentId) {
    reports = reports.filter(report => report.studentId === studentId);
  }
  
  if (className) {
    reports = reports.filter(report => report.class === className);
  }
  
  if (term) {
    reports = reports.filter(report => report.term === term);
  }
  
  if (reportType) {
    reports = reports.filter(report => report.reportType === reportType);
  }
  
  if (status) {
    reports = reports.filter(report => report.status === status);
  }
  
  if (academicYear) {
    reports = reports.filter(report => report.academicYear === academicYear);
  }
  
  // Sort by generation date (newest first)
  reports.sort((a, b) => new Date(b.generatedDate) - new Date(a.generatedDate));
  
  res.json(reports);
});

// Get report by ID
router.get('/reports/:reportId', (req, res) => {
  const { reportId } = req.params;
  
  const report = reportData.academicReports.find(r => r.id === reportId);
  
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }
  
  res.json(report);
});

// Generate new report
router.post('/reports/generate', (req, res) => {
  const {
    studentIds,
    reportType = 'progress_report',
    term,
    templateId = 'template_001',
    customSettings = {}
  } = req.body;
  
  // Validate required fields
  if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
    return res.status(400).json({ error: 'Student IDs array is required' });
  }
  
  if (!term) {
    return res.status(400).json({ error: 'Term is required' });
  }
  
  // Get template
  const template = reportData.reportTemplates.find(t => t.id === templateId);
  if (!template) {
    return res.status(404).json({ error: 'Template not found' });
  }
  
  const generatedReports = [];
  const errors = [];
  
  studentIds.forEach(studentId => {
    try {
      // Generate report for each student
      const newReport = {
        id: 'report_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        reportType,
        title: `${term} ${template.name}`,
        studentId,
        studentName: `Student ${studentId}`, // Would fetch from student database
        class: 'Class 1-A', // Would fetch from student database
        rollNumber: '000', // Would fetch from student database
        academicYear: '2024-25',
        term,
        reportPeriod: {
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0]
        },
        template: templateId,
        subjects: [], // Would populate from academic data
        overallPerformance: {
          totalMarks: 0,
          marksObtained: 0,
          percentage: 0,
          overallGrade: 'N/A',
          classRank: 0,
          classStrength: 0
        },
        attendance: {
          totalDays: 0,
          presentDays: 0,
          absentDays: 0,
          attendancePercentage: 0
        },
        behaviorAssessment: {},
        coActivities: {},
        teacherRemarks: '',
        principalRemarks: '',
        parentFeedback: '',
        nextTermTargets: [],
        reportGeneratedBy: 'system',
        generatedDate: new Date().toISOString().split('T')[0],
        status: 'draft',
        distributedToParents: false,
        distributionDate: null,
        customSettings
      };
      
      generatedReports.push(newReport);
      reportData.academicReports.push(newReport);
      
    } catch (error) {
      errors.push({
        studentId,
        error: error.message
      });
    }
  });
  
  res.json({
    success: true,
    reportsGenerated: generatedReports.length,
    reportsFailed: errors.length,
    reports: generatedReports,
    errors: errors,
    message: `${generatedReports.length} reports generated successfully`
  });
});

// Update report
router.put('/reports/:reportId', (req, res) => {
  const { reportId } = req.params;
  const updateData = req.body;
  
  const reportIndex = reportData.academicReports.findIndex(r => r.id === reportId);
  
  if (reportIndex === -1) {
    return res.status(404).json({ error: 'Report not found' });
  }
  
  // Update report
  reportData.academicReports[reportIndex] = {
    ...reportData.academicReports[reportIndex],
    ...updateData,
    updatedAt: new Date().toISOString()
  };
  
  res.json({ 
    success: true, 
    report: reportData.academicReports[reportIndex] 
  });
});

// Finalize report
router.post('/reports/:reportId/finalize', (req, res) => {
  const { reportId } = req.params;
  const { finalizedBy } = req.body;
  
  const reportIndex = reportData.academicReports.findIndex(r => r.id === reportId);
  
  if (reportIndex === -1) {
    return res.status(404).json({ error: 'Report not found' });
  }
  
  const report = reportData.academicReports[reportIndex];
  
  // Update status to finalized
  report.status = 'finalized';
  report.finalizedBy = finalizedBy;
  report.finalizedDate = new Date().toISOString().split('T')[0];
  
  res.json({ 
    success: true, 
    report: report,
    message: 'Report finalized successfully'
  });
});

// Distribute reports to parents
router.post('/reports/:reportId/distribute', (req, res) => {
  const { reportId } = req.params;
  const { distributionMethod = 'digital', notifyParents = true } = req.body;
  
  const reportIndex = reportData.academicReports.findIndex(r => r.id === reportId);
  
  if (reportIndex === -1) {
    return res.status(404).json({ error: 'Report not found' });
  }
  
  const report = reportData.academicReports[reportIndex];
  
  if (report.status !== 'finalized') {
    return res.status(400).json({ error: 'Report must be finalized before distribution' });
  }
  
  // Update distribution status
  report.distributedToParents = true;
  report.distributionDate = new Date().toISOString().split('T')[0];
  report.distributionMethod = distributionMethod;
  
  // Send notifications if requested
  if (notifyParents) {
    sendParentNotification(report);
  }
  
  res.json({ 
    success: true, 
    report: report,
    message: 'Report distributed to parents successfully'
  });
});

// Bulk generate reports for class
router.post('/reports/bulk-generate', (req, res) => {
  const {
    classId,
    reportType = 'progress_report',
    term,
    templateId = 'template_001',
    includeAllStudents = true
  } = req.body;
  
  // Validate required fields
  if (!classId || !term) {
    return res.status(400).json({ error: 'Class ID and term are required' });
  }
  
  // Get students for the class (would fetch from student database)
  const classStudents = [
    'student_001', 'student_002', 'student_003', 'student_004'
  ]; // Placeholder student IDs
  
  // Generate reports for all students
  const generateRequest = {
    studentIds: classStudents,
    reportType,
    term,
    templateId
  };
  
  // Reuse the generate endpoint logic
  // This is a simplified version - would call the actual generate function
  res.json({
    success: true,
    message: `Bulk report generation initiated for ${classStudents.length} students`,
    studentsIncluded: classStudents.length,
    estimatedCompletionTime: '10-15 minutes'
  });
});

// Get report templates
router.get('/templates', (req, res) => {
  const { applicableClass } = req.query;
  
  let templates = reportData.reportTemplates;
  
  if (applicableClass) {
    templates = templates.filter(template => 
      template.applicableClasses.some(cls => cls.includes(applicableClass))
    );
  }
  
  res.json(templates);
});

// Create custom template
router.post('/templates', (req, res) => {
  const templateData = req.body;
  
  // Validate required fields
  const requiredFields = ['name', 'description', 'applicableClasses', 'sections'];
  for (const field of requiredFields) {
    if (!templateData[field]) {
      return res.status(400).json({ error: `${field} is required` });
    }
  }
  
  // Create new template
  const newTemplate = {
    id: 'template_' + Date.now(),
    ...templateData,
    createdAt: new Date().toISOString(),
    createdBy: templateData.createdBy || 'system'
  };
  
  reportData.reportTemplates.push(newTemplate);
  
  res.json({ 
    success: true, 
    template: newTemplate,
    message: 'Template created successfully'
  });
});

// Get report schedule
router.get('/schedule', (req, res) => {
  const { academicYear = '2024-25', status } = req.query;
  
  let schedule = reportData.reportSchedule;
  
  if (status) {
    schedule = schedule.filter(item => item.status === status);
  }
  
  // Sort by scheduled date
  schedule.sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
  
  res.json(schedule);
});

// Create report schedule
router.post('/schedule', (req, res) => {
  const scheduleData = req.body;
  
  // Validate required fields
  const requiredFields = ['reportType', 'term', 'scheduledDate', 'submissionDeadline', 'classes'];
  for (const field of requiredFields) {
    if (!scheduleData[field]) {
      return res.status(400).json({ error: `${field} is required` });
    }
  }
  
  // Create new schedule
  const newSchedule = {
    id: 'schedule_' + Date.now(),
    ...scheduleData,
    status: 'scheduled',
    completionRate: 0,
    createdAt: new Date().toISOString()
  };
  
  reportData.reportSchedule.push(newSchedule);
  
  res.json({ 
    success: true, 
    schedule: newSchedule,
    message: 'Report schedule created successfully'
  });
});

// Get analytics
router.get('/analytics', (req, res) => {
  const { 
    classId, 
    term, 
    academicYear = '2024-25',
    analysisType = 'performance' 
  } = req.query;
  
  let analytics = reportData.reportAnalytics;
  
  // Filter analytics based on parameters
  if (classId) {
    const classPerformance = analytics.classPerformance[classId];
    if (classPerformance) {
      analytics = {
        ...analytics,
        classPerformance: { [classId]: classPerformance }
      };
    }
  }
  
  // Add computed analytics
  const computedAnalytics = {
    ...analytics,
    reportingStats: {
      totalReports: reportData.academicReports.length,
      finalizedReports: reportData.academicReports.filter(r => r.status === 'finalized').length,
      distributedReports: reportData.academicReports.filter(r => r.distributedToParents).length,
      pendingReports: reportData.academicReports.filter(r => r.status === 'draft').length,
      averageGenerationTime: '2.5 hours', // Would calculate from actual data
      parentSatisfactionRate: 4.2 // Would come from parent feedback
    },
    subjectAnalysis: calculateSubjectAnalysis(),
    performanceDistribution: calculatePerformanceDistribution(),
    attendanceCorrelation: calculateAttendanceCorrelation()
  };
  
  res.json(computedAnalytics);
});

// Get report card in different formats
router.get('/reports/:reportId/export', (req, res) => {
  const { reportId } = req.params;
  const { format = 'pdf', template = 'standard' } = req.query;
  
  const report = reportData.academicReports.find(r => r.id === reportId);
  
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }
  
  if (format === 'pdf') {
    // Generate PDF report card
    const pdfData = generateReportCardPDF(report, template);
    res.json({
      success: true,
      downloadUrl: `/api/reports/${reportId}/download.pdf`,
      format: 'pdf',
      template: template
    });
  } else if (format === 'excel') {
    // Generate Excel report
    const excelData = generateReportCardExcel(report);
    res.json({
      success: true,
      downloadUrl: `/api/reports/${reportId}/download.xlsx`,
      format: 'excel'
    });
  } else {
    res.status(400).json({ error: 'Unsupported format' });
  }
});

// Submit parent feedback
router.post('/reports/:reportId/feedback', (req, res) => {
  const { reportId } = req.params;
  const { feedback, rating, parentName } = req.body;
  
  const reportIndex = reportData.academicReports.findIndex(r => r.id === reportId);
  
  if (reportIndex === -1) {
    return res.status(404).json({ error: 'Report not found' });
  }
  
  const report = reportData.academicReports[reportIndex];
  
  // Add parent feedback
  report.parentFeedback = feedback || '';
  report.parentRating = rating;
  report.parentName = parentName;
  report.feedbackSubmittedAt = new Date().toISOString();
  
  res.json({ 
    success: true, 
    message: 'Parent feedback submitted successfully' 
  });
});

// Get report settings
router.get('/settings', (req, res) => {
  res.json(reportData.reportSettings);
});

// Update report settings
router.put('/settings', (req, res) => {
  const updateData = req.body;
  
  reportData.reportSettings = {
    ...reportData.reportSettings,
    ...updateData,
    updatedAt: new Date().toISOString()
  };
  
  res.json({ 
    success: true, 
    settings: reportData.reportSettings,
    message: 'Report settings updated successfully'
  });
});

// Helper Functions
function sendParentNotification(report) {
  // Simulate sending notification to parents
  console.log(`Notification sent to parents of ${report.studentName} - Report card available`);
  return true;
}

function calculateSubjectAnalysis() {
  // Calculate subject-wise performance analysis
  return {
    'Mathematics': { averageScore: 86.3, trend: 'improving', difficulty: 'moderate' },
    'English': { averageScore: 83.1, trend: 'stable', difficulty: 'easy' },
    'Hindi': { averageScore: 82.8, trend: 'declining', difficulty: 'moderate' },
    'Drawing': { averageScore: 88.9, trend: 'improving', difficulty: 'easy' },
    'Physical Education': { averageScore: 85.7, trend: 'stable', difficulty: 'easy' }
  };
}

function calculatePerformanceDistribution() {
  // Calculate grade distribution
  return {
    'A+': 25,
    'A': 35,
    'B+': 20,
    'B': 15,
    'C+': 3,
    'C': 2,
    'D': 0,
    'F': 0
  };
}

function calculateAttendanceCorrelation() {
  // Calculate correlation between attendance and performance
  return {
    correlation: 0.78,
    highAttendanceHighPerformance: 65,
    lowAttendanceLowPerformance: 12,
    insights: 'Strong positive correlation between attendance and academic performance'
  };
}

function generateReportCardPDF(report, template) {
  // Generate PDF report card
  return {
    filename: `${report.studentName}_${report.term}_Report.pdf`,
    size: '2.5 MB',
    pages: 3
  };
}

function generateReportCardExcel(report) {
  // Generate Excel report
  return {
    filename: `${report.studentName}_${report.term}_Report.xlsx`,
    size: '156 KB',
    sheets: ['Academic Performance', 'Attendance', 'Behavior']
  };
}

module.exports = router;
const fetch = require('node-fetch');
const ARATTAI_SEND_URL = process.env.NEXTPUBLICAPIURL + '/arattai-alert/send';

async function sendReportCardReady(parentPhone, studentName, term, grade, schoolName) {
  const payload = {
    templateId: 'template_report_card_ready',
    recipientNumber: parentPhone,
    variables: {
      parent_name: 'Parent',
      student_name: studentName,
      term: term,
      grade: grade,
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
    console.error('Error sending Arattai report card alert:', error);
    return null;
  }
}

// Call sendReportCardReady when report card available

module.exports = { sendReportCardReady };
