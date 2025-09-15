// CBSE Registration Module - SmartGenEduX
// Complete CBSE 9th and 11th registration system with document management

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for document uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/cbse-documents');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${req.body.studentId}_${req.body.documentType}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|jpg|jpeg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, JPG, JPEG, and PNG files are allowed'));
    }
  }
});

// Demo data for CBSE registrations
let cbseRegistrations = [
  {
    id: 'CBSE001',
    studentId: 'STU001',
    studentName: 'Rajesh Kumar',
    class: '9th',
    academicYear: '2024-25',
    personalDetails: {
      fullName: 'Rajesh Kumar Singh',
      dateOfBirth: '2009-05-15',
      gender: 'Male',
      category: 'General',
      aadhaarNumber: '1234-5678-9012',
      emisNumber: 'EMIS001234567',
      bloodGroup: 'B+',
      nationality: 'Indian',
      religion: 'Hindu',
      motherTongue: 'Hindi',
      address: {
        permanent: '123 MG Road, Bangalore, Karnataka - 560001',
        correspondence: '123 MG Road, Bangalore, Karnataka - 560001'
      }
    },
    parentDetails: {
      fatherName: 'Suresh Kumar Singh',
      fatherOccupation: 'Software Engineer',
      fatherQualification: 'B.Tech',
      fatherSalary: '850000',
      fatherAadhaar: '2345-6789-0123',
      fatherPhone: '+91-9876543210',
      motherName: 'Priya Singh',
      motherOccupation: 'Teacher',
      motherQualification: 'M.A. English',
      motherSalary: '450000',
      motherAadhaar: '3456-7890-1234',
      motherPhone: '+91-9876543211',
      guardianName: 'Suresh Kumar Singh',
      guardianRelation: 'Father',
      guardianPhone: '+91-9876543210'
    },
    documents: {
      birthCertificate: '/uploads/cbse-documents/STU001_birth_cert.pdf',
      aadhaarCard: '/uploads/cbse-documents/STU001_aadhaar.pdf',
      transferCertificate: '/uploads/cbse-documents/STU001_tc.pdf',
      markSheet: '/uploads/cbse-documents/STU001_marks_8th.pdf',
      casteCertificate: null,
      incomeCertificate: '/uploads/cbse-documents/STU001_income.pdf',
      parentAadhaar: '/uploads/cbse-documents/STU001_parent_aadhaar.pdf',
      photograph: '/uploads/cbse-documents/STU001_photo.jpg'
    },
    previousEducation: {
      lastSchoolName: 'ABC Public School',
      lastSchoolBoard: 'CBSE',
      lastClass: '8th',
      passingYear: '2024',
      rollNumber: 'R12345',
      percentage: 89.5,
      subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science']
    },
    status: 'submitted',
    submittedAt: new Date('2024-12-28'),
    submittedBy: 'parent',
    teacherVerification: {
      verified: false,
      verifiedBy: null,
      verifiedAt: null,
      remarks: null
    },
    principalApproval: {
      approved: false,
      approvedBy: null,
      approvedAt: null,
      remarks: null
    },
    cbseSubmission: {
      submitted: false,
      submittedAt: null,
      cbseApplicationNumber: null,
      cbseStatus: 'pending'
    },
    schoolId: 'SCH001'
  },
  {
    id: 'CBSE002',
    studentId: 'STU002',
    studentName: 'Anita Sharma',
    class: '11th',
    academicYear: '2024-25',
    personalDetails: {
      fullName: 'Anita Sharma',
      dateOfBirth: '2007-08-20',
      gender: 'Female',
      category: 'OBC',
      aadhaarNumber: '4567-8901-2345',
      emisNumber: 'EMIS001234568',
      bloodGroup: 'O+',
      nationality: 'Indian',
      religion: 'Hindu',
      motherTongue: 'Hindi',
      address: {
        permanent: '456 Brigade Road, Bangalore, Karnataka - 560025',
        correspondence: '456 Brigade Road, Bangalore, Karnataka - 560025'
      }
    },
    parentDetails: {
      fatherName: 'Rakesh Sharma',
      fatherOccupation: 'Business',
      fatherQualification: 'B.Com',
      fatherSalary: '1200000',
      fatherAadhaar: '5678-9012-3456',
      fatherPhone: '+91-9876543212',
      motherName: 'Sunita Sharma',
      motherOccupation: 'Homemaker',
      motherQualification: 'B.A.',
      motherSalary: '0',
      motherAadhaar: '6789-0123-4567',
      motherPhone: '+91-9876543213',
      guardianName: 'Rakesh Sharma',
      guardianRelation: 'Father',
      guardianPhone: '+91-9876543212'
    },
    documents: {
      birthCertificate: '/uploads/cbse-documents/STU002_birth_cert.pdf',
      aadhaarCard: '/uploads/cbse-documents/STU002_aadhaar.pdf',
      transferCertificate: '/uploads/cbse-documents/STU002_tc.pdf',
      markSheet: '/uploads/cbse-documents/STU002_marks_10th.pdf',
      casteCertificate: '/uploads/cbse-documents/STU002_caste.pdf',
      incomeCertificate: '/uploads/cbse-documents/STU002_income.pdf',
      parentAadhaar: '/uploads/cbse-documents/STU002_parent_aadhaar.pdf',
      photograph: '/uploads/cbse-documents/STU002_photo.jpg'
    },
    previousEducation: {
      lastSchoolName: 'XYZ Public School',
      lastSchoolBoard: 'CBSE',
      lastClass: '10th',
      passingYear: '2024',
      rollNumber: 'R67890',
      percentage: 92.8,
      subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science']
    },
    status: 'teacher_verified',
    submittedAt: new Date('2024-12-27'),
    submittedBy: 'student',
    teacherVerification: {
      verified: true,
      verifiedBy: 'Mrs. Priya Sharma',
      verifiedAt: new Date('2024-12-28'),
      remarks: 'All documents verified and found correct'
    },
    principalApproval: {
      approved: false,
      approvedBy: null,
      approvedAt: null,
      remarks: null
    },
    cbseSubmission: {
      submitted: false,
      submittedAt: null,
      cbseApplicationNumber: null,
      cbseStatus: 'pending'
    },
    schoolId: 'SCH001'
  },
  {
    id: 'CBSE003',
    studentId: 'STU003',
    studentName: 'Vikram Patel',
    class: '9th',
    academicYear: '2024-25',
    personalDetails: {
      fullName: 'Vikram Ashwin Patel',
      dateOfBirth: '2009-12-10',
      gender: 'Male',
      category: 'General',
      aadhaarNumber: '7890-1234-5678',
      emisNumber: 'EMIS001234569',
      bloodGroup: 'A+',
      nationality: 'Indian',
      religion: 'Hindu',
      motherTongue: 'Gujarati',
      address: {
        permanent: '789 Commercial Street, Bangalore, Karnataka - 560001',
        correspondence: '789 Commercial Street, Bangalore, Karnataka - 560001'
      }
    },
    parentDetails: {
      fatherName: 'Ashwin Patel',
      fatherOccupation: 'Doctor',
      fatherQualification: 'MBBS, MD',
      fatherSalary: '1500000',
      fatherAadhaar: '8901-2345-6789',
      fatherPhone: '+91-9876543214',
      motherName: 'Meera Patel',
      motherOccupation: 'Pharmacist',
      motherQualification: 'B.Pharm',
      motherSalary: '600000',
      motherAadhaar: '9012-3456-7890',
      motherPhone: '+91-9876543215',
      guardianName: 'Ashwin Patel',
      guardianRelation: 'Father',
      guardianPhone: '+91-9876543214'
    },
    documents: {
      birthCertificate: '/uploads/cbse-documents/STU003_birth_cert.pdf',
      aadhaarCard: '/uploads/cbse-documents/STU003_aadhaar.pdf',
      transferCertificate: '/uploads/cbse-documents/STU003_tc.pdf',
      markSheet: '/uploads/cbse-documents/STU003_marks_8th.pdf',
      casteCertificate: null,
      incomeCertificate: '/uploads/cbse-documents/STU003_income.pdf',
      parentAadhaar: '/uploads/cbse-documents/STU003_parent_aadhaar.pdf',
      photograph: '/uploads/cbse-documents/STU003_photo.jpg'
    },
    previousEducation: {
      lastSchoolName: 'PQR International School',
      lastSchoolBoard: 'ICSE',
      lastClass: '8th',
      passingYear: '2024',
      rollNumber: 'R98765',
      percentage: 94.2,
      subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Studies', 'Computer Science']
    },
    status: 'principal_approved',
    submittedAt: new Date('2024-12-26'),
    submittedBy: 'parent',
    teacherVerification: {
      verified: true,
      verifiedBy: 'Mr. Rajesh Kumar',
      verifiedAt: new Date('2024-12-27'),
      remarks: 'Excellent academic record, all documents verified'
    },
    principalApproval: {
      approved: true,
      approvedBy: 'Dr. Suresh Gupta',
      approvedAt: new Date('2024-12-28'),
      remarks: 'Approved for CBSE registration. Outstanding student.'
    },
    cbseSubmission: {
      submitted: false,
      submittedAt: null,
      cbseApplicationNumber: null,
      cbseStatus: 'ready_for_submission'
    },
    schoolId: 'SCH001'
  }
];

// Required documents configuration
const requiredDocuments = {
  '9th': [
    'birthCertificate',
    'aadhaarCard',
    'transferCertificate',
    'markSheet',
    'incomeCertificate',
    'parentAadhaar',
    'photograph'
  ],
  '11th': [
    'birthCertificate',
    'aadhaarCard',
    'transferCertificate',
    'markSheet',
    'incomeCertificate',
    'parentAadhaar',
    'photograph'
  ]
};

module.exports = {
  // Get all CBSE registrations for school
  async getCbseRegistrations(req, res) {
    try {
      const { schoolId, class: studentClass, status, academicYear } = req.query;
      
      let filteredRegistrations = cbseRegistrations.filter(registration => 
        registration.schoolId === (schoolId || 'SCH001')
      );
      
      if (studentClass) {
        filteredRegistrations = filteredRegistrations.filter(registration => 
          registration.class === studentClass
        );
      }
      
      if (status) {
        filteredRegistrations = filteredRegistrations.filter(registration => 
          registration.status === status
        );
      }
      
      if (academicYear) {
        filteredRegistrations = filteredRegistrations.filter(registration => 
          registration.academicYear === academicYear
        );
      }
      
      // Add summary statistics
      const summary = {
        total: filteredRegistrations.length,
        submitted: filteredRegistrations.filter(r => r.status === 'submitted').length,
        teacherVerified: filteredRegistrations.filter(r => r.status === 'teacher_verified').length,
        principalApproved: filteredRegistrations.filter(r => r.status === 'principal_approved').length,
        cbseSubmitted: filteredRegistrations.filter(r => r.status === 'cbse_submitted').length,
        class9th: filteredRegistrations.filter(r => r.class === '9th').length,
        class11th: filteredRegistrations.filter(r => r.class === '11th').length
      };
      
      res.json({
        success: true,
        data: filteredRegistrations,
        summary,
        message: `Retrieved ${filteredRegistrations.length} CBSE registrations`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Submit new CBSE registration
  async submitCbseRegistration(req, res) {
    try {
      const registrationData = req.body;
      
      // Validate required fields
      const requiredFields = ['studentId', 'studentName', 'class', 'academicYear', 'personalDetails', 'parentDetails'];
      for (const field of requiredFields) {
        if (!registrationData[field]) {
          return res.status(400).json({
            success: false,
            error: `Missing required field: ${field}`
          });
        }
      }
      
      // Check if student already has registration for this academic year
      const existingRegistration = cbseRegistrations.find(registration => 
        registration.studentId === registrationData.studentId && 
        registration.academicYear === registrationData.academicYear
      );
      
      if (existingRegistration) {
        return res.status(400).json({
          success: false,
          error: 'Student already has CBSE registration for this academic year'
        });
      }
      
      const newRegistration = {
        id: `CBSE${String(cbseRegistrations.length + 1).padStart(3, '0')}`,
        ...registrationData,
        documents: registrationData.documents || {},
        status: 'submitted',
        submittedAt: new Date(),
        submittedBy: registrationData.submittedBy || 'student',
        teacherVerification: {
          verified: false,
          verifiedBy: null,
          verifiedAt: null,
          remarks: null
        },
        principalApproval: {
          approved: false,
          approvedBy: null,
          approvedAt: null,
          remarks: null
        },
        cbseSubmission: {
          submitted: false,
          submittedAt: null,
          cbseApplicationNumber: null,
          cbseStatus: 'pending'
        },
        schoolId: registrationData.schoolId || 'SCH001'
      };
      
      cbseRegistrations.push(newRegistration);
      
      res.json({
        success: true,
        data: newRegistration,
        message: 'CBSE registration submitted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Upload documents for CBSE registration
  async uploadDocument(req, res) {
    try {
      upload.single('document')(req, res, (err) => {
        if (err) {
          return res.status(400).json({
            success: false,
            error: err.message
          });
        }
        
        if (!req.file) {
          return res.status(400).json({
            success: false,
            error: 'No document uploaded'
          });
        }
        
        const documentUrl = `/uploads/cbse-documents/${req.file.filename}`;
        
        res.json({
          success: true,
          data: {
            documentUrl,
            documentType: req.body.documentType,
            originalName: req.file.originalname,
            size: req.file.size
          },
          message: 'Document uploaded successfully'
        });
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Teacher verification of CBSE registration
  async teacherVerification(req, res) {
    try {
      const { registrationId } = req.params;
      const { verified, verifiedBy, remarks } = req.body;
      
      const registrationIndex = cbseRegistrations.findIndex(registration => 
        registration.id === registrationId
      );
      
      if (registrationIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'CBSE registration not found'
        });
      }
      
      const registration = cbseRegistrations[registrationIndex];
      
      if (registration.status !== 'submitted') {
        return res.status(400).json({
          success: false,
          error: 'Registration is not in submitted status'
        });
      }
      
      // Update teacher verification
      cbseRegistrations[registrationIndex].teacherVerification = {
        verified: verified === true,
        verifiedBy: verifiedBy || 'Teacher',
        verifiedAt: new Date(),
        remarks: remarks || null
      };
      
      if (verified === true) {
        cbseRegistrations[registrationIndex].status = 'teacher_verified';
      } else {
        cbseRegistrations[registrationIndex].status = 'teacher_rejected';
      }
      
      res.json({
        success: true,
        data: cbseRegistrations[registrationIndex],
        message: `Registration ${verified ? 'verified' : 'rejected'} by teacher`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Principal approval of CBSE registration
  async principalApproval(req, res) {
    try {
      const { registrationId } = req.params;
      const { approved, approvedBy, remarks } = req.body;
      
      const registrationIndex = cbseRegistrations.findIndex(registration => 
        registration.id === registrationId
      );
      
      if (registrationIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'CBSE registration not found'
        });
      }
      
      const registration = cbseRegistrations[registrationIndex];
      
      if (registration.status !== 'teacher_verified') {
        return res.status(400).json({
          success: false,
          error: 'Registration must be teacher verified first'
        });
      }
      
      // Update principal approval
      cbseRegistrations[registrationIndex].principalApproval = {
        approved: approved === true,
        approvedBy: approvedBy || 'Principal',
        approvedAt: new Date(),
        remarks: remarks || null
      };
      
      if (approved === true) {
        cbseRegistrations[registrationIndex].status = 'principal_approved';
        cbseRegistrations[registrationIndex].cbseSubmission.cbseStatus = 'ready_for_submission';
      } else {
        cbseRegistrations[registrationIndex].status = 'principal_rejected';
      }
      
      res.json({
        success: true,
        data: cbseRegistrations[registrationIndex],
        message: `Registration ${approved ? 'approved' : 'rejected'} by principal`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Submit to CBSE (final step)
  async submitToCbse(req, res) {
    try {
      const { registrationId } = req.params;
      const { submittedBy } = req.body;
      
      const registrationIndex = cbseRegistrations.findIndex(registration => 
        registration.id === registrationId
      );
      
      if (registrationIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'CBSE registration not found'
        });
      }
      
      const registration = cbseRegistrations[registrationIndex];
      
      if (registration.status !== 'principal_approved') {
        return res.status(400).json({
          success: false,
          error: 'Registration must be principal approved first'
        });
      }
      
      // Generate CBSE application number
      const cbseApplicationNumber = `CBSE${new Date().getFullYear()}${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`;
      
      // Update CBSE submission details
      cbseRegistrations[registrationIndex].cbseSubmission = {
        submitted: true,
        submittedAt: new Date(),
        cbseApplicationNumber,
        cbseStatus: 'submitted'
      };
      
      cbseRegistrations[registrationIndex].status = 'cbse_submitted';
      
      res.json({
        success: true,
        data: cbseRegistrations[registrationIndex],
        message: `Registration submitted to CBSE. Application Number: ${cbseApplicationNumber}`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Get required documents for a class
  async getRequiredDocuments(req, res) {
    try {
      const { class: studentClass } = req.params;
      
      if (!requiredDocuments[studentClass]) {
        return res.status(400).json({
          success: false,
          error: 'Invalid class. Only 9th and 11th are supported'
        });
      }
      
      const documents = {
        class: studentClass,
        required: requiredDocuments[studentClass],
        documentDetails: {
          birthCertificate: 'Birth Certificate (Government issued)',
          aadhaarCard: 'Aadhaar Card (Student)',
          transferCertificate: 'Transfer Certificate from previous school',
          markSheet: `Mark Sheet of previous class (${studentClass === '9th' ? '8th' : '10th'})`,
          casteCertificate: 'Caste Certificate (if applicable)',
          incomeCertificate: 'Income Certificate (Parents)',
          parentAadhaar: 'Aadhaar Cards (Both Parents)',
          photograph: 'Recent Passport Size Photograph'
        },
        formats: ['PDF', 'JPG', 'JPEG', 'PNG'],
        maxSize: '10MB per document'
      };
      
      res.json({
        success: true,
        data: documents,
        message: `Required documents for class ${studentClass} retrieved`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Get CBSE registration analytics
  async getCbseAnalytics(req, res) {
    try {
      const { schoolId, academicYear } = req.query;
      
      let schoolRegistrations = cbseRegistrations.filter(registration => 
        registration.schoolId === (schoolId || 'SCH001')
      );
      
      if (academicYear) {
        schoolRegistrations = schoolRegistrations.filter(registration => 
          registration.academicYear === academicYear
        );
      }
      
      const analytics = {
        totalRegistrations: schoolRegistrations.length,
        statusBreakdown: {
          submitted: schoolRegistrations.filter(r => r.status === 'submitted').length,
          teacherVerified: schoolRegistrations.filter(r => r.status === 'teacher_verified').length,
          teacherRejected: schoolRegistrations.filter(r => r.status === 'teacher_rejected').length,
          principalApproved: schoolRegistrations.filter(r => r.status === 'principal_approved').length,
          principalRejected: schoolRegistrations.filter(r => r.status === 'principal_rejected').length,
          cbseSubmitted: schoolRegistrations.filter(r => r.status === 'cbse_submitted').length
        },
        classBreakdown: {
          class9th: schoolRegistrations.filter(r => r.class === '9th').length,
          class11th: schoolRegistrations.filter(r => r.class === '11th').length
        },
        submissionMethods: {
          byParent: schoolRegistrations.filter(r => r.submittedBy === 'parent').length,
          byStudent: schoolRegistrations.filter(r => r.submittedBy === 'student').length
        },
        pendingActions: {
          awaitingTeacherVerification: schoolRegistrations.filter(r => r.status === 'submitted').length,
          awaitingPrincipalApproval: schoolRegistrations.filter(r => r.status === 'teacher_verified').length,
          readyForCbseSubmission: schoolRegistrations.filter(r => r.status === 'principal_approved').length
        },
        recentActivity: schoolRegistrations
          .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
          .slice(0, 10)
          .map(registration => ({
            studentName: registration.studentName,
            class: registration.class,
            status: registration.status,
            submittedAt: registration.submittedAt,
            submittedBy: registration.submittedBy
          }))
      };
      
      res.json({
        success: true,
        data: analytics,
        message: 'CBSE registration analytics retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Get single registration details
  async getRegistrationById(req, res) {
    try {
      const { registrationId } = req.params;
      
      const registration = cbseRegistrations.find(r => r.id === registrationId);
      
      if (!registration) {
        return res.status(404).json({
          success: false,
          error: 'CBSE registration not found'
        });
      }
      
      res.json({
        success: true,
        data: registration,
        message: 'Registration details retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};