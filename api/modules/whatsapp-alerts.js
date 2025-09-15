// Smart WhatsApp Alert Module - Complete Implementation
const express = require('express');
const router = express.Router();

const whatsappData = {
  alertTemplates: [
    {
      id: 'template_001',
      name: 'Attendance Alert',
      category: 'attendance',
      type: 'automated',
      message: 'Dear {{parent_name}}, your child {{student_name}} was marked absent today ({{date}}). Please contact school if this is an error. - {{school_name}}',
      variables: ['parent_name', 'student_name', 'date', 'school_name'],
      active: true,
      triggerCondition: 'student_absent',
      sendTime: 'immediate'
    },
    {
      id: 'template_002',
      name: 'Fee Reminder',
      category: 'fee',
      type: 'automated',
      message: 'Dear {{parent_name}}, fee payment of ₹{{amount}} for {{student_name}} ({{class}}) is due on {{due_date}}. Please pay to avoid late charges. - {{school_name}}',
      variables: ['parent_name', 'student_name', 'class', 'amount', 'due_date', 'school_name'],
      active: true,
      triggerCondition: 'fee_due_reminder',
      sendTime: '10:00'
    },
    {
      id: 'template_003',
      name: 'Assignment Reminder',
      category: 'academic',
      type: 'automated',
      message: 'Dear {{parent_name}}, {{student_name}} has pending assignment: {{assignment_name}} due on {{due_date}}. Subject: {{subject}}. - {{school_name}}',
      variables: ['parent_name', 'student_name', 'assignment_name', 'due_date', 'subject', 'school_name'],
      active: true,
      triggerCondition: 'assignment_pending',
      sendTime: '16:00'
    },
    {
      id: 'template_004',
      name: 'Event Notification',
      category: 'events',
      type: 'broadcast',
      message: 'Dear Parents, {{event_name}} is scheduled on {{event_date}} at {{event_time}}. Venue: {{venue}}. Please ensure your child participates. - {{school_name}}',
      variables: ['event_name', 'event_date', 'event_time', 'venue', 'school_name'],
      active: true,
      triggerCondition: 'event_reminder',
      sendTime: 'manual'
    },
    {
      id: 'template_005',
      name: 'Exam Schedule',
      category: 'academic',
      type: 'automated',
      message: 'Dear {{parent_name}}, {{exam_name}} for {{student_name}} ({{class}}) is on {{exam_date}} at {{exam_time}}. Subject: {{subject}}. Reporting time: {{reporting_time}}. - {{school_name}}',
      variables: ['parent_name', 'student_name', 'class', 'exam_name', 'exam_date', 'exam_time', 'subject', 'reporting_time', 'school_name'],
      active: true,
      triggerCondition: 'exam_reminder',
      sendTime: '18:00'
    },
    {
      id: 'template_006',
      name: 'Behavior Alert',
      category: 'behavior',
      type: 'triggered',
      message: 'Dear {{parent_name}}, we would like to discuss {{student_name}}\'s behavior in school. Please contact class teacher {{teacher_name}} at your earliest convenience. - {{school_name}}',
      variables: ['parent_name', 'student_name', 'teacher_name', 'school_name'],
      active: true,
      triggerCondition: 'behavior_incident',
      sendTime: 'immediate'
    },
    {
      id: 'template_007',
      name: 'Achievement Celebration',
      category: 'achievement',
      type: 'triggered',
      message: 'Congratulations! {{student_name}} has achieved {{achievement}} in {{subject_event}}. We are proud of this accomplishment. - {{school_name}}',
      variables: ['student_name', 'achievement', 'subject_event', 'school_name'],
      active: true,
      triggerCondition: 'achievement_recorded',
      sendTime: 'immediate'
    },
    {
      id: 'template_008',
      name: 'Report Card Ready',
      category: 'academic',
      type: 'automated',
      message: 'Dear {{parent_name}}, {{student_name}}\'s {{term}} report card is ready. Overall grade: {{grade}}. Please visit school or download from parent portal. - {{school_name}}',
      variables: ['parent_name', 'student_name', 'term', 'grade', 'school_name'],
      active: true,
      triggerCondition: 'report_ready',
      sendTime: '11:00'
    }
  ],

  sentMessages: [
    {
      id: 'msg_001',
      templateId: 'template_001',
      recipientNumber: '+91-9876543240',
      recipientName: 'Mr. Suresh Verma',
      studentId: 'student_001',
      studentName: 'Aarav Sharma',
      message: 'Dear Mr. Suresh Verma, your child Aarav Sharma was marked absent today (29-Dec-2024). Please contact school if this is an error. - Delhi Public School',
      status: 'delivered',
      sentAt: '2024-12-29T09:15:00Z',
      deliveredAt: '2024-12-29T09:15:30Z',
      readAt: '2024-12-29T09:32:15Z',
      category: 'attendance',
      priority: 'high',
      cost: 0.50,
      messageId: 'wa_msg_123456789'
    },
    {
      id: 'msg_002',
      templateId: 'template_002',
      recipientNumber: '+91-9876543241',
      recipientName: 'Mrs. Priya Verma',
      studentId: 'student_002',
      studentName: 'Priya Patel',
      message: 'Dear Mrs. Priya Verma, fee payment of ₹11,500 for Priya Patel (Class 1-A) is due on 05-Jan-2025. Please pay to avoid late charges. - Delhi Public School',
      status: 'delivered',
      sentAt: '2024-12-28T10:00:00Z',
      deliveredAt: '2024-12-28T10:00:45Z',
      readAt: '2024-12-28T14:22:10Z',
      category: 'fee',
      priority: 'medium',
      cost: 0.50,
      messageId: 'wa_msg_123456790'
    },
    {
      id: 'msg_003',
      templateId: 'template_004',
      recipientNumber: '+91-9876543242',
      recipientName: 'Mr. Rajesh Gupta',
      studentId: 'student_003',
      studentName: 'Ravi Gupta',
      message: 'Dear Parents, Annual Sports Day is scheduled on 15-Jan-2025 at 08:00 AM. Venue: School Sports Ground. Please ensure your child participates. - Delhi Public School',
      status: 'sent',
      sentAt: '2024-12-27T16:30:00Z',
      deliveredAt: null,
      readAt: null,
      category: 'events',
      priority: 'medium',
      cost: 0.50,
      messageId: 'wa_msg_123456791'
    },
    {
      id: 'msg_004',
      templateId: 'template_007',
      recipientNumber: '+91-9876543240',
      recipientName: 'Mr. Suresh Verma',
      studentId: 'student_001',
      studentName: 'Aarav Sharma',
      message: 'Congratulations! Aarav Sharma has achieved First Prize in Mathematics Quiz Competition. We are proud of this accomplishment. - Delhi Public School',
      status: 'delivered',
      sentAt: '2024-12-26T15:45:00Z',
      deliveredAt: '2024-12-26T15:45:20Z',
      readAt: '2024-12-26T16:12:35Z',
      category: 'achievement',
      priority: 'low',
      cost: 0.50,
      messageId: 'wa_msg_123456792'
    },
    {
      id: 'msg_005',
      templateId: 'template_006',
      recipientNumber: '+91-9876543242',
      recipientName: 'Mr. Rajesh Gupta',
      studentId: 'student_003',
      studentName: 'Ravi Gupta',
      message: 'Dear Mr. Rajesh Gupta, we would like to discuss Ravi Gupta\'s behavior in school. Please contact class teacher Ms. Priya Sharma at your earliest convenience. - Delhi Public School',
      status: 'delivered',
      sentAt: '2024-12-25T11:20:00Z',
      deliveredAt: '2024-12-25T11:20:15Z',
      readAt: '2024-12-25T12:05:42Z',
      category: 'behavior',
      priority: 'high',
      cost: 0.50,
      messageId: 'wa_msg_123456793'
    }
  ],

  scheduledMessages: [
    {
      id: 'scheduled_001',
      templateId: 'template_005',
      recipientNumber: '+91-9876543240',
      recipientName: 'Mr. Suresh Verma',
      studentId: 'student_001',
      studentName: 'Aarav Sharma',
      scheduledFor: '2025-01-02T18:00:00Z',
      message: 'Dear Mr. Suresh Verma, Mid-Term Examination for Aarav Sharma (Class 1-A) is on 05-Jan-2025 at 09:00 AM. Subject: Mathematics. Reporting time: 08:30 AM. - Delhi Public School',
      status: 'scheduled',
      category: 'academic',
      priority: 'high',
      createdAt: '2024-12-29T10:00:00Z'
    },
    {
      id: 'scheduled_002',
      templateId: 'template_008',
      recipientNumber: '+91-9876543241',
      recipientName: 'Mrs. Priya Verma',
      studentId: 'student_002',
      studentName: 'Priya Patel',
      scheduledFor: '2025-01-03T11:00:00Z',
      message: 'Dear Mrs. Priya Verma, Priya Patel\'s Mid-Term report card is ready. Overall grade: A+. Please visit school or download from parent portal. - Delhi Public School',
      status: 'scheduled',
      category: 'academic',
      priority: 'medium',
      createdAt: '2024-12-29T09:30:00Z'
    }
  ],

  broadcastCampaigns: [
    {
      id: 'campaign_001',
      name: 'Sports Day Announcement',
      templateId: 'template_004',
      targetAudience: 'all_parents',
      message: 'Dear Parents, Annual Sports Day is scheduled on 15-Jan-2025 at 08:00 AM. Venue: School Sports Ground. Please ensure your child participates. - Delhi Public School',
      scheduledFor: '2024-12-30T09:00:00Z',
      status: 'completed',
      totalRecipients: 247,
      sentCount: 244,
      deliveredCount: 241,
      failedCount: 3,
      readCount: 189,
      cost: 122.00,
      createdBy: 'admin_001',
      createdAt: '2024-12-29T14:30:00Z',
      completedAt: '2024-12-30T09:15:00Z'
    },
    {
      id: 'campaign_002',
      name: 'Fee Payment Reminder',
      templateId: 'template_002',
      targetAudience: 'fee_pending_parents',
      message: 'Dear Parent, fee payment for your child is pending. Please clear dues at the earliest to avoid late charges. - Delhi Public School',
      scheduledFor: '2025-01-01T10:00:00Z',
      status: 'scheduled',
      totalRecipients: 45,
      sentCount: 0,
      deliveredCount: 0,
      failedCount: 0,
      readCount: 0,
      estimatedCost: 22.50,
      createdBy: 'admin_001',
      createdAt: '2024-12-29T16:00:00Z'
    }
  ],

  automationRules: [
    {
      id: 'rule_001',
      name: 'Daily Attendance Alert',
      description: 'Send WhatsApp alert to parents when student is marked absent',
      trigger: 'attendance_marked_absent',
      templateId: 'template_001',
      active: true,
      conditions: [
        { field: 'attendance_status', operator: 'equals', value: 'absent' },
        { field: 'notification_preference', operator: 'includes', value: 'whatsapp' }
      ],
      timing: 'immediate',
      frequency: 'per_occurrence',
      priority: 'high',
      createdBy: 'admin_001',
      createdAt: '2024-11-01T00:00:00Z',
      executionCount: 23,
      successRate: 95.7
    },
    {
      id: 'rule_002',
      name: 'Fee Due Reminder',
      description: 'Send fee reminder 3 days before due date',
      trigger: 'fee_due_reminder',
      templateId: 'template_002',
      active: true,
      conditions: [
        { field: 'fee_status', operator: 'equals', value: 'pending' },
        { field: 'days_to_due', operator: 'equals', value: 3 }
      ],
      timing: '10:00',
      frequency: 'once_per_due_date',
      priority: 'medium',
      createdBy: 'admin_001',
      createdAt: '2024-11-01T00:00:00Z',
      executionCount: 67,
      successRate: 98.5
    },
    {
      id: 'rule_003',
      name: 'Behavior Incident Alert',
      description: 'Immediate alert for negative behavior incidents',
      trigger: 'behavior_incident_logged',
      templateId: 'template_006',
      active: true,
      conditions: [
        { field: 'behavior_type', operator: 'equals', value: 'negative' },
        { field: 'severity', operator: 'greater_than', value: 5 }
      ],
      timing: 'immediate',
      frequency: 'per_occurrence',
      priority: 'high',
      createdBy: 'admin_001',
      createdAt: '2024-11-01T00:00:00Z',
      executionCount: 8,
      successRate: 100.0
    },
    {
      id: 'rule_004',
      name: 'Achievement Celebration',
      description: 'Congratulatory message for student achievements',
      trigger: 'achievement_recorded',
      templateId: 'template_007',
      active: true,
      conditions: [
        { field: 'achievement_type', operator: 'in', value: ['academic', 'sports', 'cultural'] }
      ],
      timing: 'immediate',
      frequency: 'per_achievement',
      priority: 'low',
      createdBy: 'admin_001',
      createdAt: '2024-11-01T00:00:00Z',
      executionCount: 15,
      successRate: 100.0
    }
  ],

  contacts: [
    {
      id: 'contact_001',
      studentId: 'student_001',
      studentName: 'Aarav Sharma',
      class: 'Class 1-A',
      parentName: 'Mr. Suresh Verma',
      parentType: 'father',
      phoneNumber: '+91-9876543240',
      whatsappVerified: true,
      preferredLanguage: 'english',
      consentGiven: true,
      consentDate: '2024-04-01',
      notificationPreferences: ['attendance', 'academic', 'events', 'behavior'],
      blockedCategories: [],
      lastMessageSent: '2024-12-29T09:15:00Z',
      messageCount: 12,
      deliveryRate: 100,
      readRate: 85.7
    },
    {
      id: 'contact_002',
      studentId: 'student_001',
      studentName: 'Aarav Sharma',
      class: 'Class 1-A',
      parentName: 'Mrs. Priya Verma',
      parentType: 'mother',
      phoneNumber: '+91-9876543241',
      whatsappVerified: true,
      preferredLanguage: 'english',
      consentGiven: true,
      consentDate: '2024-04-01',
      notificationPreferences: ['academic', 'events', 'fee'],
      blockedCategories: ['behavior'],
      lastMessageSent: '2024-12-28T10:00:00Z',
      messageCount: 8,
      deliveryRate: 100,
      readRate: 92.3
    },
    {
      id: 'contact_003',
      studentId: 'student_003',
      studentName: 'Ravi Gupta',
      class: 'Class 1-A',
      parentName: 'Mr. Rajesh Gupta',
      parentType: 'father',
      phoneNumber: '+91-9876543242',
      whatsappVerified: true,
      preferredLanguage: 'hindi',
      consentGiven: true,
      consentDate: '2024-04-01',
      notificationPreferences: ['attendance', 'academic', 'behavior'],
      blockedCategories: [],
      lastMessageSent: '2024-12-27T16:30:00Z',
      messageCount: 18,
      deliveryRate: 94.4,
      readRate: 78.9
    }
  ],

  analytics: {
    monthlyStats: {
      totalMessagesSent: 456,
      deliveryRate: 96.7,
      readRate: 82.3,
      totalCost: 228.00,
      avgCostPerMessage: 0.50,
      categoryBreakdown: {
        attendance: 145,
        academic: 123,
        fee: 89,
        events: 56,
        behavior: 34,
        achievement: 9
      },
      responseRate: 15.2,
      optOutRate: 1.3
    },
    performanceMetrics: {
      bestPerformingTemplate: 'template_007',
      highestReadRate: 94.5,
      lowestDeliveryRate: 92.1,
      peakSendingTime: '10:00',
      mostActiveDay: 'Monday',
      averageResponseTime: '2.5 hours'
    },
    campaignInsights: {
      totalCampaigns: 12,
      successfulCampaigns: 11,
      averageReachRate: 98.2,
      bestPerformingCategory: 'academic',
      totalReach: 2847,
      totalEngagement: 1256
    }
  },

  settings: {
    businessNumber: '+91-9876543200',
    businessName: 'Delhi Public School',
    apiProvider: 'whatsapp_business_api',
    dailyLimit: 1000,
    monthlyLimit: 25000,
    currentUsage: 456,
    remainingQuota: 24544,
    rateLimiting: {
      messagesPerMinute: 20,
      messagesPerHour: 600
    },
    contentFiltering: true,
    spamProtection: true,
    automaticOptOut: true,
    deliveryReports: true,
    readReceipts: true,
    webhookUrl: 'https://school-api.com/whatsapp/webhook',
    webhookSecret: 'secure_webhook_secret_key',
    consentRequired: true,
    dataRetentionDays: 90
  }
};

// Get all alert templates
router.get('/templates', (req, res) => {
  const { category, type, active } = req.query;
  
  let templates = whatsappData.alertTemplates;
  
  // Apply filters
  if (category) {
    templates = templates.filter(template => template.category === category);
  }
  
  if (type) {
    templates = templates.filter(template => template.type === type);
  }
  
  if (active !== undefined) {
    templates = templates.filter(template => template.active === (active === 'true'));
  }
  
  res.json(templates);
});

// Get template by ID
router.get('/templates/:templateId', (req, res) => {
  const { templateId } = req.params;
  
  const template = whatsappData.alertTemplates.find(t => t.id === templateId);
  
  if (!template) {
    return res.status(404).json({ error: 'Template not found' });
  }
  
  // Get usage statistics for this template
  const usageStats = whatsappData.sentMessages
    .filter(msg => msg.templateId === templateId)
    .reduce((stats, msg) => {
      stats.totalSent++;
      if (msg.status === 'delivered') stats.delivered++;
      if (msg.readAt) stats.read++;
      return stats;
    }, { totalSent: 0, delivered: 0, read: 0 });
  
  res.json({
    ...template,
    usageStats: {
      ...usageStats,
      deliveryRate: usageStats.totalSent > 0 ? (usageStats.delivered / usageStats.totalSent * 100).toFixed(1) : 0,
      readRate: usageStats.totalSent > 0 ? (usageStats.read / usageStats.totalSent * 100).toFixed(1) : 0
    }
  });
});

// Create new template
router.post('/templates', (req, res) => {
  const templateData = req.body;
  
  // Validate required fields
  const requiredFields = ['name', 'category', 'type', 'message'];
  for (const field of requiredFields) {
    if (!templateData[field]) {
      return res.status(400).json({ error: `${field} is required` });
    }
  }
  
  // Extract variables from message
  const variables = extractVariables(templateData.message);
  
  // Create new template
  const newTemplate = {
    id: 'template_' + Date.now(),
    ...templateData,
    variables: variables,
    active: templateData.active !== undefined ? templateData.active : true,
    sendTime: templateData.sendTime || 'manual',
    createdAt: new Date().toISOString()
  };
  
  whatsappData.alertTemplates.push(newTemplate);
  
  res.json({ 
    success: true, 
    template: newTemplate,
    message: 'Template created successfully'
  });
});

// Update template
router.put('/templates/:templateId', (req, res) => {
  const { templateId } = req.params;
  const updateData = req.body;
  
  const templateIndex = whatsappData.alertTemplates.findIndex(t => t.id === templateId);
  
  if (templateIndex === -1) {
    return res.status(404).json({ error: 'Template not found' });
  }
  
  // Update variables if message changed
  if (updateData.message) {
    updateData.variables = extractVariables(updateData.message);
  }
  
  // Update template
  whatsappData.alertTemplates[templateIndex] = {
    ...whatsappData.alertTemplates[templateIndex],
    ...updateData,
    updatedAt: new Date().toISOString()
  };
  
  res.json({ 
    success: true, 
    template: whatsappData.alertTemplates[templateIndex] 
  });
});

// Send single message
router.post('/send', (req, res) => {
  const {
    templateId,
    recipientNumber,
    recipientName,
    studentId,
    variables = {},
    priority = 'medium',
    scheduledFor
  } = req.body;
  
  // Validate required fields
  if (!templateId || !recipientNumber) {
    return res.status(400).json({ error: 'Template ID and recipient number are required' });
  }
  
  // Get template
  const template = whatsappData.alertTemplates.find(t => t.id === templateId);
  if (!template) {
    return res.status(404).json({ error: 'Template not found' });
  }
  
  // Check if template is active
  if (!template.active) {
    return res.status(400).json({ error: 'Template is not active' });
  }
  
  // Process message with variables
  const processedMessage = processMessageTemplate(template.message, variables);
  
  if (scheduledFor) {
    // Schedule message
    const scheduledMessage = {
      id: 'scheduled_' + Date.now(),
      templateId,
      recipientNumber,
      recipientName,
      studentId,
      scheduledFor,
      message: processedMessage,
      status: 'scheduled',
      category: template.category,
      priority,
      createdAt: new Date().toISOString()
    };
    
    whatsappData.scheduledMessages.push(scheduledMessage);
    
    res.json({
      success: true,
      scheduled: true,
      message: scheduledMessage,
      deliveryTime: scheduledFor
    });
  } else {
    // Send immediately
    const sentMessage = {
      id: 'msg_' + Date.now(),
      templateId,
      recipientNumber,
      recipientName,
      studentId,
      message: processedMessage,
      status: 'sent',
      sentAt: new Date().toISOString(),
      category: template.category,
      priority,
      cost: 0.50,
      messageId: 'wa_msg_' + Date.now()
    };
    
    // Simulate delivery status
    setTimeout(() => {
      sentMessage.status = 'delivered';
      sentMessage.deliveredAt = new Date().toISOString();
    }, 1000);
    
    whatsappData.sentMessages.push(sentMessage);
    
    res.json({
      success: true,
      sent: true,
      message: sentMessage,
      estimatedDelivery: '30 seconds'
    });
  }
});

// Send broadcast message
router.post('/broadcast', (req, res) => {
  const {
    name,
    templateId,
    targetAudience,
    recipientList,
    variables = {},
    scheduledFor
  } = req.body;
  
  // Validate required fields
  if (!name || !templateId || (!targetAudience && !recipientList)) {
    return res.status(400).json({ error: 'Name, template ID, and target audience or recipient list are required' });
  }
  
  // Get template
  const template = whatsappData.alertTemplates.find(t => t.id === templateId);
  if (!template) {
    return res.status(404).json({ error: 'Template not found' });
  }
  
  // Determine recipients
  let recipients = [];
  if (targetAudience === 'all_parents') {
    recipients = whatsappData.contacts.filter(contact => contact.consentGiven);
  } else if (targetAudience === 'fee_pending_parents') {
    recipients = whatsappData.contacts.filter(contact => 
      contact.consentGiven && contact.notificationPreferences.includes('fee')
    );
  } else if (recipientList) {
    recipients = recipientList;
  }
  
  // Process message
  const processedMessage = processMessageTemplate(template.message, variables);
  
  // Create broadcast campaign
  const campaign = {
    id: 'campaign_' + Date.now(),
    name,
    templateId,
    targetAudience: targetAudience || 'custom',
    message: processedMessage,
    scheduledFor: scheduledFor || new Date().toISOString(),
    status: scheduledFor ? 'scheduled' : 'processing',
    totalRecipients: recipients.length,
    sentCount: 0,
    deliveredCount: 0,
    failedCount: 0,
    readCount: 0,
    estimatedCost: recipients.length * 0.50,
    createdBy: req.body.createdBy || 'system',
    createdAt: new Date().toISOString()
  };
  
  whatsappData.broadcastCampaigns.push(campaign);
  
  // If immediate sending, simulate processing
  if (!scheduledFor) {
    setTimeout(() => {
      campaign.status = 'completed';
      campaign.sentCount = recipients.length;
      campaign.deliveredCount = Math.floor(recipients.length * 0.98);
      campaign.failedCount = recipients.length - campaign.deliveredCount;
      campaign.readCount = Math.floor(campaign.deliveredCount * 0.82);
      campaign.cost = campaign.sentCount * 0.50;
      campaign.completedAt = new Date().toISOString();
    }, 5000);
  }
  
  res.json({
    success: true,
    campaign: campaign,
    message: scheduledFor ? 'Broadcast scheduled successfully' : 'Broadcast initiated'
  });
});

// Get sent messages
router.get('/messages', (req, res) => {
  const { 
    status, 
    category, 
    studentId, 
    startDate, 
    endDate,
    limit = 50,
    offset = 0 
  } = req.query;
  
  let messages = whatsappData.sentMessages;
  
  // Apply filters
  if (status) {
    messages = messages.filter(msg => msg.status === status);
  }
  
  if (category) {
    messages = messages.filter(msg => msg.category === category);
  }
  
  if (studentId) {
    messages = messages.filter(msg => msg.studentId === studentId);
  }
  
  if (startDate) {
    messages = messages.filter(msg => msg.sentAt >= startDate);
  }
  
  if (endDate) {
    messages = messages.filter(msg => msg.sentAt <= endDate);
  }
  
  // Sort by sent date (newest first)
  messages.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));
  
  // Pagination
  const total = messages.length;
  messages = messages.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
  
  res.json({
    messages: messages,
    pagination: {
      total: total,
      limit: parseInt(limit),
      offset: parseInt(offset),
      hasMore: (parseInt(offset) + parseInt(limit)) < total
    }
  });
});

// Get scheduled messages
router.get('/scheduled', (req, res) => {
  const { status, category } = req.query;
  
  let scheduled = whatsappData.scheduledMessages;
  
  // Apply filters
  if (status) {
    scheduled = scheduled.filter(msg => msg.status === status);
  }
  
  if (category) {
    scheduled = scheduled.filter(msg => msg.category === category);
  }
  
  // Sort by scheduled time
  scheduled.sort((a, b) => new Date(a.scheduledFor) - new Date(b.scheduledFor));
  
  res.json(scheduled);
});

// Cancel scheduled message
router.delete('/scheduled/:messageId', (req, res) => {
  const { messageId } = req.params;
  
  const messageIndex = whatsappData.scheduledMessages.findIndex(msg => msg.id === messageId);
  
  if (messageIndex === -1) {
    return res.status(404).json({ error: 'Scheduled message not found' });
  }
  
  const message = whatsappData.scheduledMessages[messageIndex];
  
  if (message.status !== 'scheduled') {
    return res.status(400).json({ error: 'Message cannot be cancelled' });
  }
  
  // Remove from scheduled messages
  whatsappData.scheduledMessages.splice(messageIndex, 1);
  
  res.json({ 
    success: true, 
    message: 'Scheduled message cancelled successfully' 
  });
});

// Get automation rules
router.get('/automation', (req, res) => {
  const { active, trigger } = req.query;
  
  let rules = whatsappData.automationRules;
  
  // Apply filters
  if (active !== undefined) {
    rules = rules.filter(rule => rule.active === (active === 'true'));
  }
  
  if (trigger) {
    rules = rules.filter(rule => rule.trigger === trigger);
  }
  
  res.json(rules);
});

// Create automation rule
router.post('/automation', (req, res) => {
  const ruleData = req.body;
  
  // Validate required fields
  const requiredFields = ['name', 'trigger', 'templateId', 'conditions'];
  for (const field of requiredFields) {
    if (!ruleData[field]) {
      return res.status(400).json({ error: `${field} is required` });
    }
  }
  
  // Create new automation rule
  const newRule = {
    id: 'rule_' + Date.now(),
    ...ruleData,
    active: ruleData.active !== undefined ? ruleData.active : true,
    executionCount: 0,
    successRate: 0,
    createdBy: ruleData.createdBy || 'system',
    createdAt: new Date().toISOString()
  };
  
  whatsappData.automationRules.push(newRule);
  
  res.json({ 
    success: true, 
    rule: newRule,
    message: 'Automation rule created successfully'
  });
});

// Update automation rule
router.put('/automation/:ruleId', (req, res) => {
  const { ruleId } = req.params;
  const updateData = req.body;
  
  const ruleIndex = whatsappData.automationRules.findIndex(r => r.id === ruleId);
  
  if (ruleIndex === -1) {
    return res.status(404).json({ error: 'Automation rule not found' });
  }
  
  // Update rule
  whatsappData.automationRules[ruleIndex] = {
    ...whatsappData.automationRules[ruleIndex],
    ...updateData,
    updatedAt: new Date().toISOString()
  };
  
  res.json({ 
    success: true, 
    rule: whatsappData.automationRules[ruleIndex] 
  });
});

// Get contacts
router.get('/contacts', (req, res) => {
  const { studentId, verified, consent } = req.query;
  
  let contacts = whatsappData.contacts;
  
  // Apply filters
  if (studentId) {
    contacts = contacts.filter(contact => contact.studentId === studentId);
  }
  
  if (verified !== undefined) {
    contacts = contacts.filter(contact => contact.whatsappVerified === (verified === 'true'));
  }
  
  if (consent !== undefined) {
    contacts = contacts.filter(contact => contact.consentGiven === (consent === 'true'));
  }
  
  res.json(contacts);
});

// Update contact preferences
router.put('/contacts/:contactId', (req, res) => {
  const { contactId } = req.params;
  const updateData = req.body;
  
  const contactIndex = whatsappData.contacts.findIndex(c => c.id === contactId);
  
  if (contactIndex === -1) {
    return res.status(404).json({ error: 'Contact not found' });
  }
  
  // Update contact
  whatsappData.contacts[contactIndex] = {
    ...whatsappData.contacts[contactIndex],
    ...updateData,
    updatedAt: new Date().toISOString()
  };
  
  res.json({ 
    success: true, 
    contact: whatsappData.contacts[contactIndex] 
  });
});

// Get analytics
router.get('/analytics', (req, res) => {
  const { period = 'month', category } = req.query;
  
  let analytics = whatsappData.analytics;
  
  // Filter by category if specified
  if (category) {
    const categoryMessages = whatsappData.sentMessages.filter(msg => msg.category === category);
    const deliveredCount = categoryMessages.filter(msg => msg.status === 'delivered').length;
    const readCount = categoryMessages.filter(msg => msg.readAt).length;
    
    analytics = {
      ...analytics,
      categorySpecific: {
        totalMessages: categoryMessages.length,
        deliveryRate: categoryMessages.length > 0 ? (deliveredCount / categoryMessages.length * 100).toFixed(1) : 0,
        readRate: categoryMessages.length > 0 ? (readCount / categoryMessages.length * 100).toFixed(1) : 0,
        totalCost: categoryMessages.length * 0.50
      }
    };
  }
  
  // Add real-time calculations
  const enhancedAnalytics = {
    ...analytics,
    realtimeStats: {
      messagesLast24Hours: whatsappData.sentMessages.filter(msg => 
        new Date(msg.sentAt) > new Date(Date.now() - 24*60*60*1000)
      ).length,
      deliveryStatusDistribution: getDeliveryStatusDistribution(),
      topPerformingTemplates: getTopPerformingTemplates(),
      contactEngagement: getContactEngagement()
    }
  };
  
  res.json(enhancedAnalytics);
});

// Get settings
router.get('/settings', (req, res) => {
  res.json(whatsappData.settings);
});

// Update settings
router.put('/settings', (req, res) => {
  const updateData = req.body;
  
  whatsappData.settings = {
    ...whatsappData.settings,
    ...updateData,
    updatedAt: new Date().toISOString()
  };
  
  res.json({ 
    success: true, 
    settings: whatsappData.settings,
    message: 'Settings updated successfully'
  });
});

// Webhook endpoint for delivery reports
router.post('/webhook', (req, res) => {
  const { messageId, status, timestamp, readTimestamp } = req.body;
  
  // Find and update message status
  const messageIndex = whatsappData.sentMessages.findIndex(msg => msg.messageId === messageId);
  
  if (messageIndex >= 0) {
    const message = whatsappData.sentMessages[messageIndex];
    message.status = status;
    
    if (status === 'delivered' && timestamp) {
      message.deliveredAt = new Date(timestamp * 1000).toISOString();
    }
    
    if (readTimestamp) {
      message.readAt = new Date(readTimestamp * 1000).toISOString();
    }
  }
  
  res.json({ success: true });
});

// Helper Functions
function extractVariables(message) {
  const matches = message.match(/\{\{([^}]+)\}\}/g);
  return matches ? matches.map(match => match.replace(/[{}]/g, '')) : [];
}

function processMessageTemplate(message, variables) {
  let processedMessage = message;
  
  // Replace variables with actual values
  Object.keys(variables).forEach(key => {
    const placeholder = `{{${key}}}`;
    processedMessage = processedMessage.replace(new RegExp(placeholder, 'g'), variables[key]);
  });
  
  return processedMessage;
}

function getDeliveryStatusDistribution() {
  const distribution = {};
  whatsappData.sentMessages.forEach(msg => {
    distribution[msg.status] = (distribution[msg.status] || 0) + 1;
  });
  return distribution;
}

function getTopPerformingTemplates() {
  const templateStats = {};
  
  whatsappData.sentMessages.forEach(msg => {
    if (!templateStats[msg.templateId]) {
      templateStats[msg.templateId] = { sent: 0, delivered: 0, read: 0 };
    }
    templateStats[msg.templateId].sent++;
    if (msg.status === 'delivered') templateStats[msg.templateId].delivered++;
    if (msg.readAt) templateStats[msg.templateId].read++;
  });
  
  return Object.entries(templateStats)
    .map(([templateId, stats]) => ({
      templateId,
      ...stats,
      deliveryRate: (stats.delivered / stats.sent * 100).toFixed(1),
      readRate: (stats.read / stats.sent * 100).toFixed(1)
    }))
    .sort((a, b) => b.readRate - a.readRate)
    .slice(0, 5);
}

function getContactEngagement() {
  return whatsappData.contacts.map(contact => ({
    contactId: contact.id,
    studentName: contact.studentName,
    messageCount: contact.messageCount,
    deliveryRate: contact.deliveryRate,
    readRate: contact.readRate,
    lastActive: contact.lastMessageSent
  })).sort((a, b) => b.readRate - a.readRate);
}

module.exports = router;