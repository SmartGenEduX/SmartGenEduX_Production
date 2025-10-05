// Fee Management Module - Complete Implementation
const express = require('express');
const router = express.Router();

const feeData = {
  feeStructures: [
    {
      id: 'fee_struct_001',
      schoolId: 'school_001',
      academicYear: '2024-25',
      class: 'Class 1',
      feeType: 'annual',
      components: [
        { name: 'Tuition Fee', amount: 45000, mandatory: true, dueDate: '2024-04-15' },
        { name: 'Development Fee', amount: 8000, mandatory: true, dueDate: '2024-04-15' },
        { name: 'Library Fee', amount: 2000, mandatory: true, dueDate: '2024-04-15' },
        { name: 'Sports Fee', amount: 3000, mandatory: true, dueDate: '2024-04-15' },
        { name: 'Computer Lab Fee', amount: 4000, mandatory: true, dueDate: '2024-04-15' },
        { name: 'Transport Fee', amount: 12000, mandatory: false, dueDate: '2024-04-15' },
        { name: 'Hostel Fee', amount: 25000, mandatory: false, dueDate: '2024-04-15' }
      ],
      totalMandatory: 62000,
      totalOptional: 37000,
      installments: [
        { number: 1, amount: 20000, dueDate: '2024-04-15', description: 'First Installment' },
        { number: 2, amount: 21000, dueDate: '2024-08-15', description: 'Second Installment' },
        { number: 3, amount: 21000, dueDate: '2024-12-15', description: 'Third Installment' }
      ],
      lateFeePolicy: {
        gracePeriod: 15, // days
        penaltyType: 'percentage',
        penaltyRate: 2, // 2% per month
        maxPenalty: 10 // 10% of total fee
      }
    },
    {
      id: 'fee_struct_002',
      schoolId: 'school_001',
      academicYear: '2024-25',
      class: 'Class 2',
      feeType: 'annual',
      components: [
        { name: 'Tuition Fee', amount: 47000, mandatory: true, dueDate: '2024-04-15' },
        { name: 'Development Fee', amount: 8500, mandatory: true, dueDate: '2024-04-15' },
        { name: 'Library Fee', amount: 2200, mandatory: true, dueDate: '2024-04-15' },
        { name: 'Sports Fee', amount: 3200, mandatory: true, dueDate: '2024-04-15' },
        { name: 'Computer Lab Fee', amount: 4300, mandatory: true, dueDate: '2024-04-15' },
        { name: 'Transport Fee', amount: 12000, mandatory: false, dueDate: '2024-04-15' },
        { name: 'Hostel Fee', amount: 25000, mandatory: false, dueDate: '2024-04-15' }
      ],
      totalMandatory: 65200,
      totalOptional: 37000,
      installments: [
        { number: 1, amount: 22000, dueDate: '2024-04-15', description: 'First Installment' },
        { number: 2, amount: 21600, dueDate: '2024-08-15', description: 'Second Installment' },
        { number: 3, amount: 21600, dueDate: '2024-12-15', description: 'Third Installment' }
      ],
      lateFeePolicy: {
        gracePeriod: 15,
        penaltyType: 'percentage',
        penaltyRate: 2,
        maxPenalty: 10
      }
    }
  ],

  students: [
    {
      id: 'student_001',
      name: 'Aarav Sharma',
      rollNumber: '1A01',
      class: 'Class 1',
      section: 'A',
      parentName: 'Mr. Rakesh Sharma',
      parentPhone: '+91-9876543210',
      parentEmail: 'rakesh.sharma@email.com',
      address: '123, Green Park, New Delhi - 110016',
      feeStructureId: 'fee_struct_001',
      admissionNumber: 'ADM2024001',
      enrollmentDate: '2024-04-01',
      discountApplicable: false,
      scholarshipApplicable: false,
      transportAvailed: true,
      hostelAvailed: false
    },
    {
      id: 'student_002',
      name: 'Priya Patel',
      rollNumber: '1A02',
      class: 'Class 1',
      section: 'A',
      parentName: 'Mr. Amit Patel',
      parentPhone: '+91-9876543211',
      parentEmail: 'amit.patel@email.com',
      address: '456, Blue Heights, Gurgaon - 122001',
      feeStructureId: 'fee_struct_001',
      admissionNumber: 'ADM2024002',
      enrollmentDate: '2024-04-01',
      discountApplicable: true,
      discountPercentage: 10,
      scholarshipApplicable: false,
      transportAvailed: false,
      hostelAvailed: false
    },
    {
      id: 'student_003',
      name: 'Arjun Singh',
      rollNumber: '2A01',
      class: 'Class 2',
      section: 'A',
      parentName: 'Mrs. Sunita Singh',
      parentPhone: '+91-9876543212',
      parentEmail: 'sunita.singh@email.com',
      address: '789, Rose Gardens, Noida - 201301',
      feeStructureId: 'fee_struct_002',
      admissionNumber: 'ADM2024003',
      enrollmentDate: '2024-04-01',
      discountApplicable: false,
      scholarshipApplicable: true,
      scholarshipPercentage: 25,
      transportAvailed: true,
      hostelAvailed: false
    }
  ],

  feePayments: [
    {
      id: 'payment_001',
      studentId: 'student_001',
      academicYear: '2024-25',
      installmentNumber: 1,
      amount: 32000, // 20000 + 12000 transport
      paidAmount: 32000,
      paymentDate: '2024-04-10',
      paymentMethod: 'online',
      transactionId: 'TXN20240410001',
      receiptNumber: 'REC/2024/001',
      status: 'completed',
      lateFee: 0,
      discount: 0,
      components: [
        { name: 'First Installment', amount: 20000, paid: true },
        { name: 'Transport Fee', amount: 12000, paid: true }
      ],
      paymentGateway: 'Razorpay',
      processedBy: 'system',
      remarks: 'Full payment received on time'
    },
    {
      id: 'payment_002',
      studentId: 'student_002',
      academicYear: '2024-25',
      installmentNumber: 1,
      amount: 18000, // 20000 - 10% discount
      paidAmount: 18000,
      paymentDate: '2024-04-12',
      paymentMethod: 'bank_transfer',
      transactionId: 'TXN20240412002',
      receiptNumber: 'REC/2024/002',
      status: 'completed',
      lateFee: 0,
      discount: 2000,
      components: [
        { name: 'First Installment', amount: 20000, paid: true, discount: 2000 }
      ],
      paymentGateway: null,
      processedBy: 'accounts_office',
      remarks: '10% sibling discount applied'
    },
    {
      id: 'payment_003',
      studentId: 'student_001',
      academicYear: '2024-25',
      installmentNumber: 2,
      amount: 21000,
      paidAmount: 21500, // Late fee included
      paymentDate: '2024-08-25',
      paymentMethod: 'cash',
      transactionId: null,
      receiptNumber: 'REC/2024/003',
      status: 'completed',
      lateFee: 500,
      discount: 0,
      components: [
        { name: 'Second Installment', amount: 21000, paid: true },
        { name: 'Late Fee', amount: 500, paid: true }
      ],
      paymentGateway: null,
      processedBy: 'accounts_office',
      remarks: 'Late payment - 10 days after due date'
    }
  ],

  pendingPayments: [
    {
      id: 'pending_001',
      studentId: 'student_002',
      academicYear: '2024-25',
      installmentNumber: 2,
      dueDate: '2024-08-15',
      amount: 18900, // 21000 - 10% discount
      lateFee: 0,
      discount: 2100,
      daysOverdue: 0,
      status: 'upcoming',
      components: [
        { name: 'Second Installment', amount: 21000, discount: 2100 }
      ]
    },
    {
      id: 'pending_002',
      studentId: 'student_003',
      academicYear: '2024-25',
      installmentNumber: 1,
      dueDate: '2024-04-15',
      amount: 28450, // (22000 + 12000 transport) - 25% scholarship
      lateFee: 2500,
      discount: 8500,
      daysOverdue: 259,
      status: 'overdue',
      components: [
        { name: 'First Installment', amount: 22000, discount: 5500 },
        { name: 'Transport Fee', amount: 12000, discount: 3000 },
        { name: 'Late Fee', amount: 2500 }
      ]
    }
  ],

  feeCategories: [
    {
      id: 'tuition',
      name: 'Tuition Fee',
      description: 'Academic instruction and curriculum',
      mandatory: true,
      taxable: false
    },
    {
      id: 'development',
      name: 'Development Fee',
      description: 'Infrastructure and facility development',
      mandatory: true,
      taxable: true,
      taxRate: 18
    },
    {
      id: 'transport',
      name: 'Transport Fee',
      description: 'School bus transportation service',
      mandatory: false,
      taxable: true,
      taxRate: 18
    },
    {
      id: 'hostel',
      name: 'Hostel Fee',
      description: 'Boarding and lodging facilities',
      mandatory: false,
      taxable: true,
      taxRate: 18
    }
  ],

  discountSchemes: [
    {
      id: 'sibling_discount',
      name: 'Sibling Discount',
      description: '10% discount for second child onwards',
      type: 'percentage',
      value: 10,
      applicableOn: ['tuition', 'development'],
      conditions: 'Second child or more in same family',
      autoApply: true,
      maxDiscount: 15000
    },
    {
      id: 'early_bird',
      name: 'Early Bird Discount',
      description: '5% discount for payments before due date',
      type: 'percentage',
      value: 5,
      applicableOn: ['tuition'],
      conditions: 'Payment made 30 days before due date',
      autoApply: false,
      maxDiscount: 5000
    },
    {
      id: 'merit_scholarship',
      name: 'Merit Scholarship',
      description: 'Scholarship based on academic performance',
      type: 'percentage',
      value: 25,
      applicableOn: ['tuition', 'development'],
      conditions: 'Top 10% academic performers',
      autoApply: false,
      maxDiscount: 25000
    }
  ],

  paymentMethods: [
    {
      id: 'online',
      name: 'Online Payment',
      description: 'Credit/Debit Card, Net Banking, UPI',
      enabled: true,
      processingFee: 1.5, // percentage
      maxProcessingFee: 500,
      gateway: 'Razorpay'
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      description: 'Direct bank transfer or NEFT/RTGS',
      enabled: true,
      processingFee: 0,
      bankDetails: {
        accountName: 'Delhi Public School',
        accountNumber: '1234567890',
        ifscCode: 'HDFC0001234',
        bankName: 'HDFC Bank',
        branch: 'Green Park, New Delhi'
      }
    },
    {
      id: 'cash',
      name: 'Cash Payment',
      description: 'Direct cash payment at accounts office',
      enabled: true,
      processingFee: 0,
      officeHours: '9:00 AM - 4:00 PM (Mon-Fri)'
    },
    {
      id: 'cheque',
      name: 'Cheque Payment',
      description: 'Payment by cheque',
      enabled: true,
      processingFee: 0,
      clearanceDays: 3
    }
  ],

  feeReports: {
    monthlyCollection: {
      '2024-04': { collected: 450000, pending: 125000, students: 45 },
      '2024-05': { collected: 380000, pending: 95000, students: 42 },
      '2024-06': { collected: 520000, pending: 75000, students: 48 },
      '2024-07': { collected: 295000, pending: 180000, students: 50 },
      '2024-08': { collected: 675000, pending: 145000, students: 52 }
    },
    
    defaulterAnalysis: {
      totalDefaulters: 12,
      totalAmount: 485000,
      categories: [
        { range: '1-30 days', count: 5, amount: 125000 },
        { range: '31-60 days', count: 4, amount: 185000 },
        { range: '61-90 days', count: 2, amount: 95000 },
        { range: '90+ days', count: 1, amount: 80000 }
      ]
    },
    
    paymentMethodStats: {
      online: { count: 125, amount: 1250000, percentage: 45.5 },
      bank_transfer: { count: 85, amount: 895000, percentage: 32.6 },
      cash: { count: 45, amount: 425000, percentage: 15.5 },
      cheque: { count: 20, amount: 175000, percentage: 6.4 }
    }
  }
};

// Get fee structure for a class
router.get('/structure/:classId', (req, res) => {
  const { classId } = req.params;
  const { academicYear = '2024-25' } = req.query;
  
  const structure = feeData.feeStructures.find(s => 
    s.class === classId && s.academicYear === academicYear
  );
  
  if (!structure) {
    return res.status(404).json({ error: 'Fee structure not found' });
  }
  
  res.json(structure);
});

// Get fee details for a specific student
router.get('/student/:studentId', (req, res) => {
  const { studentId } = req.params;
  const { academicYear = '2024-25' } = req.query;
  
  const student = feeData.students.find(s => s.id === studentId);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }
  
  const structure = feeData.feeStructures.find(s => s.id === student.feeStructureId);
  const payments = feeData.feePayments.filter(p => 
    p.studentId === studentId && p.academicYear === academicYear
  );
  const pending = feeData.pendingPayments.filter(p => 
    p.studentId === studentId && p.academicYear === academicYear
  );
  
  // Calculate total fee for this student
  let totalFee = structure.totalMandatory;
  if (student.transportAvailed) totalFee += 12000;
  if (student.hostelAvailed) totalFee += 25000;
  
  // Apply discounts
  let totalDiscount = 0;
  if (student.discountApplicable && student.discountPercentage) {
    totalDiscount += (structure.totalMandatory * student.discountPercentage) / 100;
  }
  if (student.scholarshipApplicable && student.scholarshipPercentage) {
    totalDiscount += (totalFee * student.scholarshipPercentage) / 100;
  }
  
  const totalPaid = payments.reduce((sum, p) => sum + p.paidAmount, 0);
  const totalPending = pending.reduce((sum, p) => sum + p.amount, 0);
  const totalLateFee = payments.reduce((sum, p) => sum + p.lateFee, 0) + 
                      pending.reduce((sum, p) => sum + p.lateFee, 0);
  
  res.json({
    student: student,
    feeStructure: structure,
    summary: {
      totalFee: totalFee,
      totalDiscount: totalDiscount,
      netFee: totalFee - totalDiscount,
      totalPaid: totalPaid,
      totalPending: totalPending,
      totalLateFee: totalLateFee,
      balanceAmount: (totalFee - totalDiscount + totalLateFee) - totalPaid
    },
    payments: payments,
    pendingPayments: pending
  });
});

// Process fee payment
router.post('/payment', (req, res) => {
  const { 
    studentId, 
    installmentNumber, 
    amount, 
    paymentMethod, 
    transactionId,
    components 
  } = req.body;
  
  // Validate required fields
  if (!studentId || !amount || !paymentMethod) {
    return res.status(400).json({ error: 'Student ID, amount, and payment method are required' });
  }
  
  const student = feeData.students.find(s => s.id === studentId);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }
  
  // Check if payment already exists for this installment
  const existingPayment = feeData.feePayments.find(p => 
    p.studentId === studentId && p.installmentNumber === installmentNumber
  );
  
  if (existingPayment) {
    return res.status(409).json({ error: 'Payment already processed for this installment' });
  }
  
  // Calculate late fee if applicable
  const pending = feeData.pendingPayments.find(p => 
    p.studentId === studentId && p.installmentNumber === installmentNumber
  );
  
  let lateFee = 0;
  if (pending && pending.daysOverdue > 15) {
    const structure = feeData.feeStructures.find(s => s.id === student.feeStructureId);
    lateFee = Math.min(
      (amount * structure.lateFeePolicy.penaltyRate / 100) * Math.floor(pending.daysOverdue / 30),
      amount * structure.lateFeePolicy.maxPenalty / 100
    );
  }
  
  // Create payment record
  const newPayment = {
    id: 'payment_' + Date.now(),
    studentId,
    academicYear: '2024-25',
    installmentNumber: installmentNumber || null,
    amount: amount,
    paidAmount: amount,
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod,
    transactionId: transactionId || null,
    receiptNumber: `REC/2024/${Date.now()}`,
    status: 'completed',
    lateFee: lateFee,
    discount: pending ? pending.discount : 0,
    components: components || [],
    paymentGateway: paymentMethod === 'online' ? 'Razorpay' : null,
    processedBy: 'system',
    remarks: '',
    createdAt: new Date().toISOString()
  };
  
  feeData.feePayments.push(newPayment);
  
  // Remove from pending payments
  if (pending) {
    const pendingIndex = feeData.pendingPayments.findIndex(p => p.id === pending.id);
    if (pendingIndex > -1) {
      feeData.pendingPayments.splice(pendingIndex, 1);
    }
  }
  
  // Generate receipt
  const receipt = generateReceipt(student, newPayment);
  
  res.json({ 
    success: true, 
    payment: newPayment,
    receipt: receipt 
  });
});

// Get pending payments summary
router.get('/pending', (req, res) => {
  const { classId, overdue = false } = req.query;
  
  let pending = feeData.pendingPayments;
  
  if (classId) {
    const classStudents = feeData.students.filter(s => s.class === classId);
    const classStudentIds = classStudents.map(s => s.id);
    pending = pending.filter(p => classStudentIds.includes(p.studentId));
  }
  
  if (overdue === 'true') {
    pending = pending.filter(p => p.daysOverdue > 0);
  }
  
  // Add student information
  const pendingWithStudents = pending.map(p => {
    const student = feeData.students.find(s => s.id === p.studentId);
    return {
      ...p,
      student: student
    };
  });
  
  // Calculate summary
  const summary = {
    totalAmount: pending.reduce((sum, p) => sum + p.amount, 0),
    totalLateFee: pending.reduce((sum, p) => sum + p.lateFee, 0),
    totalStudents: pending.length,
    overdueStudents: pending.filter(p => p.daysOverdue > 0).length
  };
  
  res.json({
    summary: summary,
    pendingPayments: pendingWithStudents
  });
});

// Get defaulters list
router.get('/defaulters', (req, res) => {
  const { minAmount = 0, minDays = 0 } = req.query;
  
  const defaulters = feeData.pendingPayments.filter(p => 
    p.daysOverdue >= parseInt(minDays) && p.amount >= parseInt(minAmount)
  );
  
  const defaultersWithStudents = defaulters.map(p => {
    const student = feeData.students.find(s => s.id === p.studentId);
    const totalPending = feeData.pendingPayments
      .filter(pen => pen.studentId === p.studentId)
      .reduce((sum, pen) => sum + pen.amount + pen.lateFee, 0);
    
    return {
      student: student,
      totalPending: totalPending,
      oldestPending: Math.max(...feeData.pendingPayments
        .filter(pen => pen.studentId === p.studentId)
        .map(pen => pen.daysOverdue)),
      pendingInstallments: feeData.pendingPayments.filter(pen => pen.studentId === p.studentId)
    };
  });
  
  // Remove duplicates based on student ID
  const uniqueDefaulters = defaultersWithStudents.filter((defaulter, index, self) =>
    index === self.findIndex(d => d.student.id === defaulter.student.id)
  );
  
  res.json({
    totalDefaulters: uniqueDefaulters.length,
    totalAmount: uniqueDefaulters.reduce((sum, d) => sum + d.totalPending, 0),
    defaulters: uniqueDefaulters.sort((a, b) => b.totalPending - a.totalPending)
  });
});

// Generate fee receipt
router.get('/receipt/:paymentId', (req, res) => {
  const { paymentId } = req.params;
  
  const payment = feeData.feePayments.find(p => p.id === paymentId);
  if (!payment) {
    return res.status(404).json({ error: 'Payment not found' });
  }
  
  const student = feeData.students.find(s => s.id === payment.studentId);
  const receipt = generateReceipt(student, payment);
  
  res.json(receipt);
});

// Get fee collection reports
router.get('/reports/collection', (req, res) => {
  const { period = 'monthly', startDate, endDate } = req.query;
  
  if (period === 'monthly') {
    res.json({
      period: 'monthly',
      data: feeData.feeReports.monthlyCollection
    });
  } else if (period === 'custom' && startDate && endDate) {
    // Filter payments by date range
    const payments = feeData.feePayments.filter(p => 
      p.paymentDate >= startDate && p.paymentDate <= endDate
    );
    
    const totalCollected = payments.reduce((sum, p) => sum + p.paidAmount, 0);
    const totalTransactions = payments.length;
    
    res.json({
      period: 'custom',
      startDate,
      endDate,
      totalCollected,
      totalTransactions,
      payments: payments
    });
  } else {
    res.status(400).json({ error: 'Invalid period or missing date range' });
  }
});

// Get payment method statistics
router.get('/reports/payment-methods', (req, res) => {
  res.json({
    title: 'Payment Method Statistics',
    data: feeData.feeReports.paymentMethodStats
  });
});

// Get fee category wise collection
router.get('/reports/categories', (req, res) => {
  const categoryStats = {};
  
  feeData.feePayments.forEach(payment => {
    payment.components.forEach(component => {
      if (!categoryStats[component.name]) {
        categoryStats[component.name] = {
          totalAmount: 0,
          totalTransactions: 0
        };
      }
      categoryStats[component.name].totalAmount += component.amount;
      categoryStats[component.name].totalTransactions += 1;
    });
  });
  
  res.json({
    title: 'Category-wise Fee Collection',
    data: categoryStats
  });
});

// Apply discount to student
router.post('/discount/apply', (req, res) => {
  const { studentId, discountSchemeId, customDiscount } = req.body;
  
  const student = feeData.students.find(s => s.id === studentId);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }
  
  let discountApplied = {};
  
  if (discountSchemeId) {
    const scheme = feeData.discountSchemes.find(s => s.id === discountSchemeId);
    if (!scheme) {
      return res.status(404).json({ error: 'Discount scheme not found' });
    }
    
    discountApplied = {
      type: 'scheme',
      schemeId: discountSchemeId,
      schemeName: scheme.name,
      percentage: scheme.value,
      maxAmount: scheme.maxDiscount
    };
  } else if (customDiscount) {
    discountApplied = {
      type: 'custom',
      percentage: customDiscount.percentage || 0,
      amount: customDiscount.amount || 0,
      reason: customDiscount.reason || 'Custom discount'
    };
  }
  
  // Update pending payments with new discount
  feeData.pendingPayments.forEach(pending => {
    if (pending.studentId === studentId) {
      if (discountApplied.percentage) {
        pending.discount = (pending.amount * discountApplied.percentage) / 100;
      } else if (discountApplied.amount) {
        pending.discount = discountApplied.amount;
      }
      pending.amount = pending.amount - pending.discount;
    }
  });
  
  res.json({ 
    success: true, 
    message: 'Discount applied successfully',
    discountApplied: discountApplied 
  });
});

// Send fee reminder
router.post('/reminder/send', (req, res) => {
  const { studentIds, reminderType = 'email', customMessage } = req.body;
  
  if (!Array.isArray(studentIds) || studentIds.length === 0) {
    return res.status(400).json({ error: 'Student IDs array is required' });
  }
  
  const reminders = [];
  
  studentIds.forEach(studentId => {
    const student = feeData.students.find(s => s.id === studentId);
    if (student) {
      const pending = feeData.pendingPayments.filter(p => p.studentId === studentId);
      
      if (pending.length > 0) {
        const totalPending = pending.reduce((sum, p) => sum + p.amount + p.lateFee, 0);
        
        const reminder = {
          id: 'reminder_' + Date.now() + '_' + studentId,
          studentId: studentId,
          studentName: student.name,
          parentName: student.parentName,
          parentPhone: student.parentPhone,
          parentEmail: student.parentEmail,
          reminderType: reminderType,
          totalPending: totalPending,
          pendingInstallments: pending.length,
          message: customMessage || generateReminderMessage(student, pending),
          sentAt: new Date().toISOString(),
          status: 'sent'
        };
        
        reminders.push(reminder);
      }
    }
  });
  
  res.json({
    success: true,
    remindersSent: reminders.length,
    reminders: reminders
  });
});

// Helper Functions
function generateReceipt(student, payment) {
  return {
    receiptNumber: payment.receiptNumber,
    date: payment.paymentDate,
    student: {
      name: student.name,
      rollNumber: student.rollNumber,
      class: student.class,
      section: student.section,
      admissionNumber: student.admissionNumber
    },
    payment: {
      amount: payment.paidAmount,
      method: payment.paymentMethod,
      transactionId: payment.transactionId,
      components: payment.components,
      lateFee: payment.lateFee,
      discount: payment.discount
    },
    school: {
      name: 'Delhi Public School',
      address: 'Green Park, New Delhi - 110016',
      phone: '+91-11-1234567890',
      email: 'accounts@dps.edu'
    },
    generatedAt: new Date().toISOString()
  };
}

function generateReminderMessage(student, pendingPayments) {
  const totalAmount = pendingPayments.reduce((sum, p) => sum + p.amount + p.lateFee, 0);
  
  return `Dear ${student.parentName},

This is a gentle reminder that the fee payment for ${student.name} (${student.rollNumber}) is pending.

Pending Amount: ₹${totalAmount.toLocaleString()}
Installments Due: ${pendingPayments.length}

Please make the payment at your earliest convenience to avoid additional late fees.

For any queries, please contact the accounts office.

Thank You,
Delhi Public School`;
}

module.exports = router;
const fetch = require('node-fetch');
const ARATTAI_SEND_URL = process.env.NEXTPUBLICAPIURL + '/arattai-alert/send';

async function sendFeeDueReminder(parentPhone, studentName, amount, dueDate, schoolName) {
  const payload = {
    templateId: 'template_fee_reminder', // Use actual template ID for fee reminders
    recipientNumber: parentPhone,
    variables: {
      parent_name: 'Parent', // Fetch actual parent name if available
      student_name: studentName,
      amount: amount,
      due_date: dueDate,
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
    console.error('Error sending Arattai fee reminder:', error);
    return null;
  }
}

// Call sendFeeDueReminder where fee reminders are generated

module.exports = { sendFeeDueReminder };
