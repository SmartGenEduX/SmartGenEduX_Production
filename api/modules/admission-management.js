// Admission Management Module - Complete Implementation
const express = require('express');
const router = express.Router();

const admissionData = {
  applications: [
    {
      id: 'app_001',
      applicationNumber: 'ADM2024001',
      studentName: 'Aadhya Verma',
      dateOfBirth: '2017-08-15',
      gender: 'female',
      bloodGroup: 'A+',
      nationality: 'Indian',
      religion: 'Hindu',
      category: 'General',
      appliedForClass: 'Class 1',
      appliedForSection: 'A',
      academicYear: '2024-25',
      
      // Parent Information
      fatherName: 'Mr. Suresh Verma',
      fatherOccupation: 'Software Engineer',
      fatherPhone: '+91-9876543240',
      fatherEmail: 'suresh.verma@email.com',
      
      motherName: 'Mrs. Priya Verma',
      motherOccupation: 'Teacher',
      motherPhone: '+91-9876543241',
      motherEmail: 'priya.verma@email.com',
      
      // Address
      address: {
        street: '456, Green Valley Apartments',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110016',
        country: 'India'
      },
      
      // Application Details
      applicationDate: '2024-03-15',
      status: 'under_review',
      priority: 'normal',
      source: 'online',
      
      // Documents
      documents: [
        {
          type: 'birth_certificate',
          name: 'Birth Certificate',
          uploaded: true,
          verified: true,
          fileName: 'birth_cert_aadhya.pdf'
        },
        {
          type: 'address_proof',
          name: 'Address Proof',
          uploaded: true,
          verified: true,
          fileName: 'address_proof.pdf'
        },
        {
          type: 'passport_photo',
          name: 'Passport Size Photo',
          uploaded: true,
          verified: true,
          fileName: 'photo_aadhya.jpg'
        },
        {
          type: 'previous_school_certificate',
          name: 'Previous School Certificate',
          uploaded: false,
          verified: false,
          fileName: null
        }
      ],
      
      // Assessment
      assessmentScheduled: true,
      assessmentDate: '2024-04-20',
      assessmentTime: '10:00 AM',
      assessmentType: 'oral_written',
      assessmentScore: null,
      assessmentRemarks: '',
      
      // Interview
      interviewScheduled: false,
      interviewDate: null,
      interviewTime: null,
      interviewPanel: [],
      interviewFeedback: '',
      
      // Fee Structure
      admissionFee: 15000,
      securityDeposit: 5000,
      totalAdmissionAmount: 20000,
      feeStatus: 'pending',
      
      // Admission Decision
      admissionStatus: 'pending',
      admissionDate: null,
      allocatedClass: null,
      allocatedSection: null,
      rollNumber: null,
      remarks: 'Application under review',
      
      // Medical Information
      medicalInfo: {
        allergies: 'None',
        medicalConditions: 'None',
        emergencyContact: 'Dr. Sharma - +91-9876543250',
        bloodGroup: 'A+',
        vaccinationComplete: true
      },
      
      // Preferences
      preferences: {
        transportRequired: true,
        hostelRequired: false,
        extraCurricularInterests: ['Drawing', 'Dancing', 'Sports'],
        languagePreference: 'English'
      }
    },
    
    {
      id: 'app_002',
      applicationNumber: 'ADM2024002',
      studentName: 'Aryan Gupta',
      dateOfBirth: '2016-11-22',
      gender: 'male',
      bloodGroup: 'B+',
      nationality: 'Indian',
      religion: 'Hindu',
      category: 'OBC',
      appliedForClass: 'Class 2',
      appliedForSection: 'A',
      academicYear: '2024-25',
      
      fatherName: 'Mr. Rajesh Gupta',
      fatherOccupation: 'Business',
      fatherPhone: '+91-9876543242',
      fatherEmail: 'rajesh.gupta@email.com',
      
      motherName: 'Mrs. Sunita Gupta',
      motherOccupation: 'Homemaker',
      motherPhone: '+91-9876543243',
      motherEmail: 'sunita.gupta@email.com',
      
      address: {
        street: '789, Park View Society',
        city: 'Gurgaon',
        state: 'Haryana',
        pincode: '122001',
        country: 'India'
      },
      
      applicationDate: '2024-03-20',
      status: 'approved',
      priority: 'high',
      source: 'referral',
      
      documents: [
        {
          type: 'birth_certificate',
          name: 'Birth Certificate',
          uploaded: true,
          verified: true,
          fileName: 'birth_cert_aryan.pdf'
        },
        {
          type: 'address_proof',
          name: 'Address Proof',
          uploaded: true,
          verified: true,
          fileName: 'address_proof_gupta.pdf'
        },
        {
          type: 'passport_photo',
          name: 'Passport Size Photo',
          uploaded: true,
          verified: true,
          fileName: 'photo_aryan.jpg'
        },
        {
          type: 'previous_school_certificate',
          name: 'Previous School Certificate',
          uploaded: true,
          verified: true,
          fileName: 'prev_school_cert.pdf'
        }
      ],
      
      assessmentScheduled: true,
      assessmentDate: '2024-04-18',
      assessmentTime: '09:30 AM',
      assessmentType: 'oral_written',
      assessmentScore: 85,
      assessmentRemarks: 'Good performance in all areas',
      
      interviewScheduled: true,
      interviewDate: '2024-04-25',
      interviewTime: '11:00 AM',
      interviewPanel: ['Principal', 'Class Teacher', 'Counselor'],
      interviewFeedback: 'Confident child with good communication skills',
      
      admissionFee: 15000,
      securityDeposit: 5000,
      totalAdmissionAmount: 20000,
      feeStatus: 'paid',
      
      admissionStatus: 'admitted',
      admissionDate: '2024-04-30',
      allocatedClass: 'Class 2',
      allocatedSection: 'A',
      rollNumber: '2A03',
      remarks: 'Admission confirmed',
      
      medicalInfo: {
        allergies: 'Dust allergy',
        medicalConditions: 'Asthma (mild)',
        emergencyContact: 'Dr. Patel - +91-9876543251',
        bloodGroup: 'B+',
        vaccinationComplete: true
      },
      
      preferences: {
        transportRequired: false,
        hostelRequired: false,
        extraCurricularInterests: ['Cricket', 'Chess', 'Music'],
        languagePreference: 'English'
      }
    }
  ],
  
  assessmentResults: [
    {
      applicationId: 'app_002',
      assessmentDate: '2024-04-18',
      subjects: [
        {
          subject: 'English',
          maxMarks: 25,
          obtainedMarks: 22,
          grade: 'A',
          remarks: 'Excellent reading and comprehension'
        },
        {
          subject: 'Mathematics',
          maxMarks: 25,
          obtainedMarks: 20,
          grade: 'A',
          remarks: 'Good numerical skills'
        },
        {
          subject: 'General Knowledge',
          maxMarks: 25,
          obtainedMarks: 18,
          grade: 'B+',
          remarks: 'Average awareness'
        },
        {
          subject: 'Drawing',
          maxMarks: 25,
          obtainedMarks: 25,
          grade: 'A+',
          remarks: 'Exceptional creative ability'
        }
      ],
      totalMarks: 100,
      obtainedMarks: 85,
      percentage: 85,
      result: 'pass',
      assessorName: 'Mrs. Meera Sharma',
      assessorRemarks: 'Well-prepared student with good potential'
    }
  ],
  
  admissionSettings: {
    currentAcademicYear: '2024-25',
    admissionStartDate: '2024-03-01',
    admissionEndDate: '2024-06-30',
    assessmentRequired: true,
    interviewRequired: true,
    minimumAge: {
      'Class 1': 5,
      'Class 2': 6,
      'Class 3': 7,
      'Class 4': 8,
      'Class 5': 9
    },
    maximumAge: {
      'Class 1': 7,
      'Class 2': 8,
      'Class 3': 9,
      'Class 4': 10,
      'Class 5': 11
    },
    classCapacity: {
      'Class 1': 30,
      'Class 2': 32,
      'Class 3': 35,
      'Class 4': 35,
      'Class 5': 35
    },
    requiredDocuments: [
      'birth_certificate',
      'address_proof',
      'passport_photo',
      'previous_school_certificate'
    ],
    admissionFeeStructure: {
      'Class 1': { admission: 15000, security: 5000 },
      'Class 2': { admission: 15000, security: 5000 },
      'Class 3': { admission: 16000, security: 5000 },
      'Class 4': { admission: 16000, security: 5000 },
      'Class 5': { admission: 17000, security: 5000 }
    }
  },
  
  meritList: [
    {
      applicationId: 'app_002',
      studentName: 'Aryan Gupta',
      class: 'Class 2',
      assessmentScore: 85,
      interviewScore: 90,
      totalScore: 175,
      rank: 1,
      category: 'OBC',
      status: 'selected'
    },
    {
      applicationId: 'app_001',
      studentName: 'Aadhya Verma',
      class: 'Class 1',
      assessmentScore: null,
      interviewScore: null,
      totalScore: null,
      rank: null,
      category: 'General',
      status: 'pending'
    }
  ],
  
  waitingList: [],
  
  inquiries: [
    {
      id: 'inq_001',
      inquiryNumber: 'INQ2024001',
      parentName: 'Mr. Deepak Kumar',
      parentPhone: '+91-9876543260',
      parentEmail: 'deepak.kumar@email.com',
      studentName: 'Ishaan Kumar',
      studentAge: 6,
      interestedClass: 'Class 1',
      inquiryDate: '2024-02-15',
      source: 'walk_in',
      status: 'follow_up_pending',
      assignedTo: 'admission_counselor_001',
      remarks: 'Interested in admission. Requested school visit.',
      followUpDate: '2024-03-01',
      converted: false
    }
  ]
};

// Get all applications
router.get('/applications', (req, res) => {
  const { status, class: appliedClass, academicYear, source, priority } = req.query;
  
  let applications = admissionData.applications;
  
  // Apply filters
  if (status) {
    applications = applications.filter(app => app.status === status);
  }
  
  if (appliedClass) {
    applications = applications.filter(app => app.appliedForClass === appliedClass);
  }
  
  if (academicYear) {
    applications = applications.filter(app => app.academicYear === academicYear);
  }
  
  if (source) {
    applications = applications.filter(app => app.source === source);
  }
  
  if (priority) {
    applications = applications.filter(app => app.priority === priority);
  }
  
  // Add summary information
  const summary = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    under_review: applications.filter(a => a.status === 'under_review').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
    admitted: applications.filter(a => a.admissionStatus === 'admitted').length
  };
  
  res.json({
    applications: applications,
    summary: summary
  });
});

// Get application by ID
router.get('/applications/:id', (req, res) => {
  const { id } = req.params;
  
  const application = admissionData.applications.find(app => app.id === id);
  
  if (!application) {
    return res.status(404).json({ error: 'Application not found' });
  }
  
  // Get assessment results if available
  const assessmentResult = admissionData.assessmentResults.find(result => 
    result.applicationId === application.id
  );
  
  res.json({
    application: application,
    assessmentResult: assessmentResult
  });
});

// Create new application
router.post('/applications', (req, res) => {
  const applicationData = req.body;
  
  // Validate required fields
  const requiredFields = ['studentName', 'dateOfBirth', 'fatherName', 'motherName', 'appliedForClass'];
  for (const field of requiredFields) {
    if (!applicationData[field]) {
      return res.status(400).json({ error: `${field} is required` });
    }
  }
  
  // Check age eligibility
  const studentAge = calculateAge(applicationData.dateOfBirth);
  const classSettings = admissionData.admissionSettings;
  const minAge = classSettings.minimumAge[applicationData.appliedForClass];
  const maxAge = classSettings.maximumAge[applicationData.appliedForClass];
  
  if (studentAge < minAge || studentAge > maxAge) {
    return res.status(400).json({ 
      error: `Student age (${studentAge}) not eligible for ${applicationData.appliedForClass}. Required age: ${minAge}-${maxAge} years` 
    });
  }
  
  // Generate application number
  const applicationNumber = `ADM${new Date().getFullYear()}${String(Date.now()).slice(-3)}`;
  
  // Create new application
  const newApplication = {
    id: 'app_' + Date.now(),
    applicationNumber: applicationNumber,
    ...applicationData,
    applicationDate: new Date().toISOString().split('T')[0],
    status: 'pending',
    priority: applicationData.priority || 'normal',
    source: applicationData.source || 'online',
    admissionStatus: 'pending',
    feeStatus: 'pending',
    documents: admissionData.admissionSettings.requiredDocuments.map(docType => ({
      type: docType,
      name: formatDocumentName(docType),
      uploaded: false,
      verified: false,
      fileName: null
    }))
  };
  
  admissionData.applications.push(newApplication);
  
  res.json({ 
    success: true, 
    application: newApplication,
    message: `Application ${applicationNumber} created successfully`
  });
});

// Update application
router.put('/applications/:id', (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  
  const applicationIndex = admissionData.applications.findIndex(app => app.id === id);
  
  if (applicationIndex === -1) {
    return res.status(404).json({ error: 'Application not found' });
  }
  
  // Update application
  admissionData.applications[applicationIndex] = {
    ...admissionData.applications[applicationIndex],
    ...updateData,
    updatedAt: new Date().toISOString()
  };
  
  res.json({ 
    success: true, 
    application: admissionData.applications[applicationIndex] 
  });
});

// Schedule assessment
router.post('/applications/:id/schedule-assessment', (req, res) => {
  const { id } = req.params;
  const { assessmentDate, assessmentTime, assessmentType } = req.body;
  
  const applicationIndex = admissionData.applications.findIndex(app => app.id === id);
  
  if (applicationIndex === -1) {
    return res.status(404).json({ error: 'Application not found' });
  }
  
  const application = admissionData.applications[applicationIndex];
  
  // Update assessment details
  application.assessmentScheduled = true;
  application.assessmentDate = assessmentDate;
  application.assessmentTime = assessmentTime;
  application.assessmentType = assessmentType || 'oral_written';
  application.status = 'assessment_scheduled';
  
  // Send notification to parents
  sendAssessmentNotification(application);
  
  res.json({ 
    success: true, 
    message: 'Assessment scheduled successfully',
    application: application
  });
});

// Record assessment results
router.post('/applications/:id/assessment-result', (req, res) => {
  const { id } = req.params;
  const { subjects, assessorName, assessorRemarks } = req.body;
  
  const application = admissionData.applications.find(app => app.id === id);
  
  if (!application) {
    return res.status(404).json({ error: 'Application not found' });
  }
  
  // Calculate total marks
  const totalMarks = subjects.reduce((sum, subject) => sum + subject.maxMarks, 0);
  const obtainedMarks = subjects.reduce((sum, subject) => sum + subject.obtainedMarks, 0);
  const percentage = (obtainedMarks / totalMarks) * 100;
  
  // Create assessment result
  const assessmentResult = {
    applicationId: id,
    assessmentDate: application.assessmentDate,
    subjects: subjects,
    totalMarks: totalMarks,
    obtainedMarks: obtainedMarks,
    percentage: percentage.toFixed(2),
    result: percentage >= 60 ? 'pass' : 'fail',
    assessorName: assessorName,
    assessorRemarks: assessorRemarks,
    recordedAt: new Date().toISOString()
  };
  
  // Update application
  application.assessmentScore = obtainedMarks;
  application.assessmentRemarks = assessorRemarks;
  application.status = percentage >= 60 ? 'assessment_passed' : 'assessment_failed';
  
  // Store assessment result
  const existingResultIndex = admissionData.assessmentResults.findIndex(result => 
    result.applicationId === id
  );
  
  if (existingResultIndex >= 0) {
    admissionData.assessmentResults[existingResultIndex] = assessmentResult;
  } else {
    admissionData.assessmentResults.push(assessmentResult);
  }
  
  res.json({ 
    success: true, 
    assessmentResult: assessmentResult,
    application: application
  });
});

// Schedule interview
router.post('/applications/:id/schedule-interview', (req, res) => {
  const { id } = req.params;
  const { interviewDate, interviewTime, interviewPanel } = req.body;
  
  const applicationIndex = admissionData.applications.findIndex(app => app.id === id);
  
  if (applicationIndex === -1) {
    return res.status(404).json({ error: 'Application not found' });
  }
  
  const application = admissionData.applications[applicationIndex];
  
  // Update interview details
  application.interviewScheduled = true;
  application.interviewDate = interviewDate;
  application.interviewTime = interviewTime;
  application.interviewPanel = interviewPanel || [];
  application.status = 'interview_scheduled';
  
  // Send notification
  sendInterviewNotification(application);
  
  res.json({ 
    success: true, 
    message: 'Interview scheduled successfully',
    application: application
  });
});

// Make admission decision
router.post('/applications/:id/admission-decision', (req, res) => {
  const { id } = req.params;
  const { decision, remarks, allocatedClass, allocatedSection, rollNumber } = req.body;
  
  const applicationIndex = admissionData.applications.findIndex(app => app.id === id);
  
  if (applicationIndex === -1) {
    return res.status(404).json({ error: 'Application not found' });
  }
  
  const application = admissionData.applications[applicationIndex];
  
  // Update admission status
  application.admissionStatus = decision; // 'admitted', 'rejected', 'waitlisted'
  application.admissionDate = new Date().toISOString().split('T')[0];
  application.remarks = remarks || '';
  
  if (decision === 'admitted') {
    application.allocatedClass = allocatedClass;
    application.allocatedSection = allocatedSection;
    application.rollNumber = rollNumber;
    application.status = 'admitted';
    
    // Generate student record
    createStudentRecord(application);
  } else if (decision === 'rejected') {
    application.status = 'rejected';
  } else if (decision === 'waitlisted') {
    application.status = 'waitlisted';
    addToWaitingList(application);
  }
  
  // Send notification to parents
  sendAdmissionDecisionNotification(application);
  
  res.json({ 
    success: true, 
    message: `Application ${decision} successfully`,
    application: application
  });
});

// Get merit list
router.get('/merit-list', (req, res) => {
  const { class: className, category } = req.query;
  
  let meritList = admissionData.meritList;
  
  // Filter by class
  if (className) {
    meritList = meritList.filter(entry => entry.class === className);
  }
  
  // Filter by category
  if (category) {
    meritList = meritList.filter(entry => entry.category === category);
  }
  
  // Sort by total score (highest first)
  meritList.sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
  
  res.json(meritList);
});

// Get waiting list
router.get('/waiting-list', (req, res) => {
  const { class: className } = req.query;
  
  let waitingList = admissionData.waitingList;
  
  if (className) {
    waitingList = waitingList.filter(entry => entry.class === className);
  }
  
  res.json(waitingList);
});

// Upload document
router.post('/applications/:id/upload-document', (req, res) => {
  const { id } = req.params;
  const { documentType, fileName } = req.body;
  
  const application = admissionData.applications.find(app => app.id === id);
  
  if (!application) {
    return res.status(404).json({ error: 'Application not found' });
  }
  
  const documentIndex = application.documents.findIndex(doc => doc.type === documentType);
  
  if (documentIndex === -1) {
    return res.status(400).json({ error: 'Invalid document type' });
  }
  
  // Update document status
  application.documents[documentIndex].uploaded = true;
  application.documents[documentIndex].fileName = fileName;
  application.documents[documentIndex].uploadedAt = new Date().toISOString();
  
  res.json({ 
    success: true, 
    message: 'Document uploaded successfully',
    document: application.documents[documentIndex]
  });
});

// Verify document
router.post('/applications/:id/verify-document', (req, res) => {
  const { id } = req.params;
  const { documentType, verified, verificationRemarks } = req.body;
  
  const application = admissionData.applications.find(app => app.id === id);
  
  if (!application) {
    return res.status(404).json({ error: 'Application not found' });
  }
  
  const documentIndex = application.documents.findIndex(doc => doc.type === documentType);
  
  if (documentIndex === -1) {
    return res.status(400).json({ error: 'Document not found' });
  }
  
  // Update verification status
  application.documents[documentIndex].verified = verified;
  application.documents[documentIndex].verificationRemarks = verificationRemarks || '';
  application.documents[documentIndex].verifiedAt = new Date().toISOString();
  
  res.json({ 
    success: true, 
    message: 'Document verification updated',
    document: application.documents[documentIndex]
  });
});

// Get admission statistics
router.get('/statistics', (req, res) => {
  const { academicYear = '2024-25' } = req.query;
  
  const applications = admissionData.applications.filter(app => 
    app.academicYear === academicYear
  );
  
  const stats = {
    total: applications.length,
    statusBreakdown: {
      pending: applications.filter(a => a.status === 'pending').length,
      under_review: applications.filter(a => a.status === 'under_review').length,
      assessment_scheduled: applications.filter(a => a.status === 'assessment_scheduled').length,
      assessment_passed: applications.filter(a => a.status === 'assessment_passed').length,
      interview_scheduled: applications.filter(a => a.status === 'interview_scheduled').length,
      admitted: applications.filter(a => a.status === 'admitted').length,
      rejected: applications.filter(a => a.status === 'rejected').length,
      waitlisted: applications.filter(a => a.status === 'waitlisted').length
    },
    classWiseApplications: getClassWiseBreakdown(applications),
    sourceBreakdown: getSourceBreakdown(applications),
    categoryBreakdown: getCategoryBreakdown(applications),
    conversionRate: calculateConversionRate(applications),
    averageAssessmentScore: calculateAverageAssessmentScore(),
    documentCompletionRate: calculateDocumentCompletionRate(applications)
  };
  
  res.json(stats);
});

// Get inquiries
router.get('/inquiries', (req, res) => {
  const { status, assignedTo, source } = req.query;
  
  let inquiries = admissionData.inquiries;
  
  // Apply filters
  if (status) {
    inquiries = inquiries.filter(inq => inq.status === status);
  }
  
  if (assignedTo) {
    inquiries = inquiries.filter(inq => inq.assignedTo === assignedTo);
  }
  
  if (source) {
    inquiries = inquiries.filter(inq => inq.source === source);
  }
  
  res.json(inquiries);
});

// Create new inquiry
router.post('/inquiries', (req, res) => {
  const inquiryData = req.body;
  
  // Generate inquiry number
  const inquiryNumber = `INQ${new Date().getFullYear()}${String(Date.now()).slice(-3)}`;
  
  const newInquiry = {
    id: 'inq_' + Date.now(),
    inquiryNumber: inquiryNumber,
    ...inquiryData,
    inquiryDate: new Date().toISOString().split('T')[0],
    status: 'new',
    converted: false
  };
  
  admissionData.inquiries.push(newInquiry);
  
  res.json({ 
    success: true, 
    inquiry: newInquiry,
    message: `Inquiry ${inquiryNumber} created successfully`
  });
});

// Helper Functions
function calculateAge(dateOfBirth) {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

function formatDocumentName(docType) {
  const names = {
    'birth_certificate': 'Birth Certificate',
    'address_proof': 'Address Proof',
    'passport_photo': 'Passport Size Photo',
    'previous_school_certificate': 'Previous School Certificate',
    'transfer_certificate': 'Transfer Certificate',
    'character_certificate': 'Character Certificate'
  };
  
  return names[docType] || docType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function sendAssessmentNotification(application) {
  console.log(`Assessment notification sent to ${application.fatherEmail} for ${application.studentName}`);
  return true;
}

function sendInterviewNotification(application) {
  console.log(`Interview notification sent to ${application.fatherEmail} for ${application.studentName}`);
  return true;
}

function sendAdmissionDecisionNotification(application) {
  console.log(`Admission decision notification sent to ${application.fatherEmail} for ${application.studentName}`);
  return true;
}

function createStudentRecord(application) {
  // Create student record in the main student database
  console.log(`Student record created for ${application.studentName} - Roll No: ${application.rollNumber}`);
  return true;
}

function addToWaitingList(application) {
  const waitingListEntry = {
    applicationId: application.id,
    studentName: application.studentName,
    class: application.appliedForClass,
    applicationDate: application.applicationDate,
    assessmentScore: application.assessmentScore,
    position: admissionData.waitingList.length + 1
  };
  
  admissionData.waitingList.push(waitingListEntry);
}

function getClassWiseBreakdown(applications) {
  const breakdown = {};
  applications.forEach(app => {
    breakdown[app.appliedForClass] = (breakdown[app.appliedForClass] || 0) + 1;
  });
  return breakdown;
}

function getSourceBreakdown(applications) {
  const breakdown = {};
  applications.forEach(app => {
    breakdown[app.source] = (breakdown[app.source] || 0) + 1;
  });
  return breakdown;
}

function getCategoryBreakdown(applications) {
  const breakdown = {};
  applications.forEach(app => {
    breakdown[app.category] = (breakdown[app.category] || 0) + 1;
  });
  return breakdown;
}

function calculateConversionRate(applications) {
  const admitted = applications.filter(a => a.admissionStatus === 'admitted').length;
  return applications.length > 0 ? ((admitted / applications.length) * 100).toFixed(1) : 0;
}

function calculateAverageAssessmentScore() {
  const results = admissionData.assessmentResults;
  if (results.length === 0) return 0;
  
  const totalScore = results.reduce((sum, result) => sum + result.obtainedMarks, 0);
  return (totalScore / results.length).toFixed(1);
}

function calculateDocumentCompletionRate(applications) {
  let totalDocuments = 0;
  let uploadedDocuments = 0;
  
  applications.forEach(app => {
    totalDocuments += app.documents.length;
    uploadedDocuments += app.documents.filter(doc => doc.uploaded).length;
  });
  
  return totalDocuments > 0 ? ((uploadedDocuments / totalDocuments) * 100).toFixed(1) : 0;
}

module.exports = router;
