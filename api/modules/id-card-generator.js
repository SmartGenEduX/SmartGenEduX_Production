// ID Card Generator Module - SmartGenEduX
// Complete ID card generation system for students and teachers

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/id-photos');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${req.body.userId}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPEG, JPG, and PNG images are allowed'));
    }
  }
});

// Demo data for ID card requests
let idCardRequests = [
  {
    id: 'IDR001',
    userId: 'STU001',
    userType: 'student',
    name: 'Rajesh Kumar',
    class: '10th A',
    rollNumber: 'R001',
    admissionNumber: 'ADM2024001',
    dateOfBirth: '2009-05-15',
    bloodGroup: 'B+',
    address: '123 MG Road, Bangalore',
    emergencyContact: '+91-9876543210',
    parentName: 'Suresh Kumar',
    photoUrl: '/uploads/id-photos/student_001.jpg',
    status: 'pending_approval',
    submittedAt: new Date('2024-12-28'),
    approvedBy: null,
    approvedAt: null,
    schoolId: 'SCH001'
  },
  {
    id: 'IDR002',
    userId: 'TEA001',
    userType: 'teacher',
    name: 'Dr. Priya Sharma',
    designation: 'Mathematics Teacher',
    employeeId: 'EMP001',
    department: 'Mathematics',
    qualification: 'M.Sc Mathematics, B.Ed',
    dateOfJoining: '2020-06-01',
    bloodGroup: 'A+',
    address: '456 Brigade Road, Bangalore',
    emergencyContact: '+91-9876543211',
    photoUrl: '/uploads/id-photos/teacher_001.jpg',
    status: 'approved',
    submittedAt: new Date('2024-12-27'),
    approvedBy: 'Principal',
    approvedAt: new Date('2024-12-28'),
    schoolId: 'SCH001'
  },
  {
    id: 'IDR003',
    userId: 'STU002',
    userType: 'student',
    name: 'Anita Singh',
    class: '12th B',
    rollNumber: 'R002',
    admissionNumber: 'ADM2024002',
    dateOfBirth: '2007-08-20',
    bloodGroup: 'O+',
    address: '789 Commercial Street, Bangalore',
    emergencyContact: '+91-9876543212',
    parentName: 'Rakesh Singh',
    photoUrl: '/uploads/id-photos/student_002.jpg',
    status: 'approved',
    submittedAt: new Date('2024-12-26'),
    approvedBy: 'Principal',
    approvedAt: new Date('2024-12-27'),
    schoolId: 'SCH001'
  }
];

// Generated ID cards database
let generatedIdCards = [
  {
    id: 'ID001',
    requestId: 'IDR002',
    cardNumber: 'SGX2024001',
    userId: 'TEA001',
    userType: 'teacher',
    name: 'Dr. Priya Sharma',
    designatedBy: 'Principal',
    validUntil: '2025-12-31',
    generatedAt: new Date('2024-12-28'),
    qrCode: 'SGX2024001_QR',
    schoolId: 'SCH001',
    isActive: true
  },
  {
    id: 'ID002',
    requestId: 'IDR003',
    cardNumber: 'SGX2024002',
    userId: 'STU002',
    userType: 'student',
    name: 'Anita Singh',
    designatedBy: 'Principal',
    validUntil: '2025-12-31',
    generatedAt: new Date('2024-12-27'),
    qrCode: 'SGX2024002_QR',
    schoolId: 'SCH001',
    isActive: true
  }
];

module.exports = {
  // Get all ID card requests for school
  async getIdCardRequests(req, res) {
    try {
      const { schoolId, status, userType } = req.query;
      
      let filteredRequests = idCardRequests.filter(request => 
        request.schoolId === (schoolId || 'SCH001')
      );
      
      if (status) {
        filteredRequests = filteredRequests.filter(request => request.status === status);
      }
      
      if (userType) {
        filteredRequests = filteredRequests.filter(request => request.userType === userType);
      }
      
      // Add summary statistics
      const summary = {
        total: filteredRequests.length,
        pending: filteredRequests.filter(r => r.status === 'pending_approval').length,
        approved: filteredRequests.filter(r => r.status === 'approved').length,
        rejected: filteredRequests.filter(r => r.status === 'rejected').length,
        generated: filteredRequests.filter(r => r.status === 'id_generated').length
      };
      
      res.json({
        success: true,
        data: filteredRequests,
        summary,
        message: `Retrieved ${filteredRequests.length} ID card requests`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Submit new ID card request
  async submitIdCardRequest(req, res) {
    try {
      const requestData = req.body;
      
      // Validate required fields
      const requiredFields = ['userId', 'userType', 'name', 'schoolId'];
      for (const field of requiredFields) {
        if (!requestData[field]) {
          return res.status(400).json({
            success: false,
            error: `Missing required field: ${field}`
          });
        }
      }
      
      // Check if user already has a pending or approved request
      const existingRequest = idCardRequests.find(request => 
        request.userId === requestData.userId && 
        ['pending_approval', 'approved', 'id_generated'].includes(request.status)
      );
      
      if (existingRequest) {
        return res.status(400).json({
          success: false,
          error: 'User already has an active ID card request'
        });
      }
      
      const newRequest = {
        id: `IDR${String(idCardRequests.length + 1).padStart(3, '0')}`,
        ...requestData,
        status: 'pending_approval',
        submittedAt: new Date(),
        approvedBy: null,
        approvedAt: null
      };
      
      idCardRequests.push(newRequest);
      
      res.json({
        success: true,
        data: newRequest,
        message: 'ID card request submitted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Upload photo for ID card
  async uploadPhoto(req, res) {
    try {
      upload.single('photo')(req, res, (err) => {
        if (err) {
          return res.status(400).json({
            success: false,
            error: err.message
          });
        }
        
        if (!req.file) {
          return res.status(400).json({
            success: false,
            error: 'No photo uploaded'
          });
        }
        
        const photoUrl = `/uploads/id-photos/${req.file.filename}`;
        
        res.json({
          success: true,
          data: {
            photoUrl,
            originalName: req.file.originalname,
            size: req.file.size
          },
          message: 'Photo uploaded successfully'
        });
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Approve/Reject ID card request (Principal only)
  async approveIdCardRequest(req, res) {
    try {
      const { requestId } = req.params;
      const { action, approvedBy, remarks } = req.body;
      
      if (!['approve', 'reject'].includes(action)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid action. Must be approve or reject'
        });
      }
      
      const requestIndex = idCardRequests.findIndex(request => request.id === requestId);
      
      if (requestIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'ID card request not found'
        });
      }
      
      const request = idCardRequests[requestIndex];
      
      if (request.status !== 'pending_approval') {
        return res.status(400).json({
          success: false,
          error: 'Request is not in pending status'
        });
      }
      
      // Update request status
      idCardRequests[requestIndex] = {
        ...request,
        status: action === 'approve' ? 'approved' : 'rejected',
        approvedBy: approvedBy || 'Principal',
        approvedAt: new Date(),
        remarks: remarks || null
      };
      
      res.json({
        success: true,
        data: idCardRequests[requestIndex],
        message: `ID card request ${action}d successfully`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Generate ID card after approval
  async generateIdCard(req, res) {
    try {
      const { requestId } = req.params;
      const { designatedBy } = req.body;
      
      const requestIndex = idCardRequests.findIndex(request => request.id === requestId);
      
      if (requestIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'ID card request not found'
        });
      }
      
      const request = idCardRequests[requestIndex];
      
      if (request.status !== 'approved') {
        return res.status(400).json({
          success: false,
          error: 'Request must be approved before generating ID card'
        });
      }
      
      // Generate unique card number
      const cardNumber = `SGX${new Date().getFullYear()}${String(generatedIdCards.length + 1).padStart(3, '0')}`;
      
      const newIdCard = {
        id: `ID${String(generatedIdCards.length + 1).padStart(3, '0')}`,
        requestId: request.id,
        cardNumber,
        userId: request.userId,
        userType: request.userType,
        name: request.name,
        designatedBy: designatedBy || 'Principal',
        validUntil: `${new Date().getFullYear() + 1}-12-31`,
        generatedAt: new Date(),
        qrCode: `${cardNumber}_QR`,
        schoolId: request.schoolId,
        isActive: true
      };
      
      generatedIdCards.push(newIdCard);
      
      // Update request status
      idCardRequests[requestIndex].status = 'id_generated';
      
      res.json({
        success: true,
        data: {
          idCard: newIdCard,
          request: idCardRequests[requestIndex]
        },
        message: 'ID card generated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Get generated ID cards
  async getGeneratedIdCards(req, res) {
    try {
      const { schoolId, userType, userId } = req.query;
      
      let filteredCards = generatedIdCards.filter(card => 
        card.schoolId === (schoolId || 'SCH001')
      );
      
      if (userType) {
        filteredCards = filteredCards.filter(card => card.userType === userType);
      }
      
      if (userId) {
        filteredCards = filteredCards.filter(card => card.userId === userId);
      }
      
      res.json({
        success: true,
        data: filteredCards,
        summary: {
          total: filteredCards.length,
          active: filteredCards.filter(card => card.isActive).length,
          students: filteredCards.filter(card => card.userType === 'student').length,
          teachers: filteredCards.filter(card => card.userType === 'teacher').length
        },
        message: `Retrieved ${filteredCards.length} generated ID cards`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Get ID card template configuration
  async getIdCardTemplate(req, res) {
    try {
      const template = {
        schoolLogo: '/assets/logos/school-logo.png',
        schoolName: 'SmartGenEduX Academy',
        schoolAddress: '123 Education Street, Bangalore, India',
        schoolPhone: '+91-80-12345678',
        schoolEmail: 'info@smartgenedux.org',
        principalSignature: '/assets/signatures/principal-signature.png',
        cardDimensions: {
          width: '85.6mm',
          height: '53.98mm'
        },
        colors: {
          primary: '#2563eb',
          secondary: '#1e40af',
          accent: '#3b82f6'
        },
        fields: {
          student: [
            'name', 'class', 'rollNumber', 'admissionNumber',
            'dateOfBirth', 'bloodGroup', 'emergencyContact', 'parentName'
          ],
          teacher: [
            'name', 'designation', 'employeeId', 'department',
            'qualification', 'dateOfJoining', 'bloodGroup', 'emergencyContact'
          ]
        }
      };
      
      res.json({
        success: true,
        data: template,
        message: 'ID card template configuration retrieved'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Get dashboard analytics
  async getIdCardAnalytics(req, res) {
    try {
      const { schoolId } = req.query;
      
      const schoolRequests = idCardRequests.filter(request => 
        request.schoolId === (schoolId || 'SCH001')
      );
      
      const schoolCards = generatedIdCards.filter(card => 
        card.schoolId === (schoolId || 'SCH001')
      );
      
      const analytics = {
        totalRequests: schoolRequests.length,
        pendingApproval: schoolRequests.filter(r => r.status === 'pending_approval').length,
        approved: schoolRequests.filter(r => r.status === 'approved').length,
        rejected: schoolRequests.filter(r => r.status === 'rejected').length,
        cardsGenerated: schoolCards.length,
        activeCards: schoolCards.filter(c => c.isActive).length,
        studentCards: schoolCards.filter(c => c.userType === 'student').length,
        teacherCards: schoolCards.filter(c => c.userType === 'teacher').length,
        recentActivity: [
          ...schoolRequests.slice(-5).map(r => ({
            type: 'request',
            action: `${r.name} submitted ID card request`,
            timestamp: r.submittedAt,
            status: r.status
          })),
          ...schoolCards.slice(-5).map(c => ({
            type: 'generation',
            action: `ID card generated for ${c.name}`,
            timestamp: c.generatedAt,
            cardNumber: c.cardNumber
          }))
        ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10)
      };
      
      res.json({
        success: true,
        data: analytics,
        message: 'ID card analytics retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};