// arattai-alert.js - Arattai Integration Module for SmartGenEduX ERP

const express = require('express');
const router = express.Router();
const fetch = require('node-fetch'); // Or axios if preferred

// Load Arattai API credentials from environment variables
const ARATTAI_BASE_URL = process.env.ARATTAI_BASE_URL;
const ARATTAI_API_KEY = process.env.ARATTAI_API_KEY;

// Sample Arattai alert templates setup, same pattern as WhatsApp integration
const arattaiAlertTemplates = [
  {
    id: 'template_001',
    name: 'Attendance Alert',
    category: 'attendance',
    type: 'automated',
    message: 'Dear {parentname}, your child {studentname} was marked absent today ({date}). Please contact school if this is an error. - {schoolname}',
    variables: ['parentname', 'studentname', 'date', 'schoolname'],
    active: true,
    sendTime: 'immediate'
  }
  // Add additional templates as needed
];

// Endpoint: Get all Arattai alert templates
router.get('/templates', (req, res) => {
  res.json(arattaiAlertTemplates);
});

// Endpoint: Get single template by ID
router.get('/templates/:templateId', (req, res) => {
  const template = arattaiAlertTemplates.find(t => t.id === req.params.templateId);
  if (!template) {
    return res.status(404).json({ error: 'Template not found' });
  }
  res.json(template);
});

// Send Arattai Message Endpoint
router.post('/send', async (req, res) => {
  try {
    const { templateId, recipientNumber, variables } = req.body;

    // Validate template
    const template = arattaiAlertTemplates.find(t => t.id === templateId);
    if (!template || !template.active) {
      return res.status(400).json({ error: 'Invalid or inactive template.' });
    }

    // Replace variables in message template
    let messageText = template.message;
    Object.keys(variables || {}).forEach(key => {
      const regex = new RegExp(`{${key}}`, 'g');
      messageText = messageText.replace(regex, variables[key]);
    });

    // Construct Arattai API request payload
    const payload = {
      to: recipientNumber,
      message: messageText,
      apiKey: ARATTAI_API_KEY
    };

    // Call Arattai Send Message API
    const response = await fetch(`${ARATTAI_BASE_URL}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ARATTAI_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const responseData = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to send Arattai message', details: responseData });
    }

    // Success - log or perform additional actions if needed
    res.json({
      success: true,
      message: messageText,
      arattaiResponse: responseData
    });
  } catch (error) {
    console.error('Error sending Arattai message:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

module.exports = router;
// Part 2: Arattai Integration Advanced Messaging - Scheduling, Broadcast, Automation

const express = require('express');
const router = express.Router();

// In-memory storage structure - replace with DB in production
const arattaiData = {
  scheduledMessages: [],
  broadcastCampaigns: [],
  automationRules: []
};

// Helper function to process message templates with variables
function processMessageTemplate(message, variables) {
  let processedMessage = message;
  Object.keys(variables).forEach(key => {
    const placeholder = `{{${key}}}`;
    processedMessage = processedMessage.replace(new RegExp(placeholder, 'g'), variables[key]);
  });
  return processedMessage;
}

// Schedule a message
router.post('/schedule', (req, res) => {
  const { templateId, recipientNumber, recipientName, studentId, variables = {}, scheduledFor, priority = 'medium' } = req.body;

  if (!templateId || !recipientNumber || !scheduledFor) {
    return res.status(400).json({ error: 'Required fields: templateId, recipientNumber, scheduledFor' });
  }

  // Find template (from previous part assumed stored somewhere accessible)
  // Here using a placeholder getTemplate function
  const template = getTemplate(templateId);
  if (!template || !template.active) {
    return res.status(404).json({ error: 'Template not found or inactive' });
  }

  const message = processMessageTemplate(template.message, variables);

  const scheduledMessage = {
    id: 'scheduled_' + Date.now(),
    templateId,
    recipientNumber,
    recipientName,
    studentId,
    scheduledFor,
    message,
    status: 'scheduled',
    priority,
    category: template.category,
    createdAt: new Date().toISOString()
  };

  arattaiData.scheduledMessages.push(scheduledMessage);

  res.json({ success: true, scheduled: true, message: scheduledMessage });
});

// Get scheduled messages with optional filters
router.get('/scheduled', (req, res) => {
  const { status, category } = req.query;
  let scheduled = arattaiData.scheduledMessages;

  if (status) scheduled = scheduled.filter(msg => msg.status === status);
  if (category) scheduled = scheduled.filter(msg => msg.category === category);

  scheduled.sort((a, b) => new Date(a.scheduledFor) - new Date(b.scheduledFor));

  res.json(scheduled);
});

// Cancel a scheduled message
router.delete('/scheduled/:messageId', (req, res) => {
  const { messageId } = req.params;
  const index = arattaiData.scheduledMessages.findIndex(m => m.id === messageId);

  if (index === -1) return res.status(404).json({ error: 'Scheduled message not found' });

  if (arattaiData.scheduledMessages[index].status !== 'scheduled') {
    return res.status(400).json({ error: 'Message cannot be cancelled' });
  }

  arattaiData.scheduledMessages.splice(index, 1);
  res.json({ success: true, message: 'Scheduled message cancelled successfully' });
});

// Create broadcast campaign
router.post('/broadcast', (req, res) => {
  const { name, templateId, targetAudience, recipientList, variables = {}, scheduledFor } = req.body;

  if (!name || !templateId || (!targetAudience && !recipientList)) {
    return res.status(400).json({ error: 'Required fields: name, templateId, targetAudience or recipientList' });
  }

  const template = getTemplate(templateId);
  if (!template) return res.status(404).json({ error: 'Template not found' });

  // Determine recipients (simple example)
  let recipients = [];
  if (targetAudience === 'all_parents') recipients = getAllParents(); // placeholder
  else if (targetAudience === 'fee_pending_parents') recipients = getFeePendingParents(); // placeholder
  else recipients = recipientList;

  const message = processMessageTemplate(template.message, variables);

  const campaign = {
    id: 'campaign_' + Date.now(),
    name,
    templateId,
    targetAudience: targetAudience || 'custom',
    message,
    scheduledFor: scheduledFor || new Date().toISOString(),
    status: scheduledFor ? 'scheduled' : 'processing',
    totalRecipients: recipients.length,
    sentCount: 0,
    deliveredCount: 0,
    failedCount: 0,
    readCount: 0,
    estimatedCost: recipients.length * 0.50, // example cost
    createdBy: req.body.createdBy || 'system',
    createdAt: new Date().toISOString()
  };

  arattaiData.broadcastCampaigns.push(campaign);

  if (!scheduledFor) {
    // Simulate immediate sending after 5 seconds
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

  res.json({ success: true, campaign, message: scheduledFor ? 'Broadcast scheduled successfully' : 'Broadcast initiated' });
});

// Get automation rules with filters
router.get('/automation', (req, res) => {
  const { active, trigger } = req.query;
  let rules = arattaiData.automationRules;

  if (active !== undefined) rules = rules.filter(r => r.active === (active === 'true'));
  if (trigger) rules = rules.filter(r => r.trigger === trigger);

  res.json(rules);
});

// Create automation rule
router.post('/automation', (req, res) => {
  const { name, trigger, templateId, conditions = [], active = true, createdBy } = req.body;

  if (!name || !trigger || !templateId || !conditions.length) {
    return res.status(400).json({ error: 'Required fields: name, trigger, templateId, conditions' });
  }

  const newRule = {
    id: 'rule_' + Date.now(),
    name,
    trigger,
    templateId,
    conditions,
    active,
    executionCount: 0,
    successRate: 0,
    createdBy: createdBy || 'system',
    createdAt: new Date().toISOString()
  };

  arattaiData.automationRules.push(newRule);
  res.json({ success: true, rule: newRule, message: 'Automation rule created successfully' });
});

// Update automation rule
router.put('/automation/:ruleId', (req, res) => {
  const { ruleId } = req.params;
  const updateData = req.body;

  const idx = arattaiData.automationRules.findIndex(r => r.id === ruleId);
  if (idx === -1) return res.status(404).json({ error: 'Automation rule not found' });

  arattaiData.automationRules[idx] = { ...arattaiData.automationRules[idx], ...updateData, updatedAt: new Date().toISOString() };
  res.json({ success: true, rule: arattaiData.automationRules[idx] });
});

// Placeholder functions - replace with actual implementations or DB calls
function getTemplate(templateId) {
  // Return template object by ID from stored templates (to be implemented)
  return {
    id: templateId,
    message: 'Dear {{parent_name}}, your child {{student_name}} was marked absent today ({{date}}). - {{school_name}}',
    active: true,
    category: 'attendance'
  };
}

function getAllParents() {
  // Return all parents contacts (to be implemented)
  return [{ phoneNumber: '+911234567890' }, { phoneNumber: '+919876543210' }];
}

function getFeePendingParents() {
  // Return parents with pending fees (to be implemented)
  return [{ phoneNumber: '+911234567890' }];
}

module.exports = router;
// Part 3: Arattai Contact Management - Preferences, Consent, Verification

const express = require('express');
const router = express.Router();

// In-memory storage for contacts, replace with DB later
const arattaiData = {
  contacts: [
    // Example contact structure
    /*
    {
      id: 'contact_001',
      studentId: 'student_001',
      studentName: 'Aarav Sharma',
      class: 'Class 1-A',
      parentName: 'Mr. Suresh Verma',
      parentType: 'father',
      phoneNumber: '+91-9876543240',
      arattaiVerified: true,
      preferredLanguage: 'english',
      consentGiven: true,
      consentDate: '2024-04-01',
      notificationPreferences: ['attendance', 'academic', 'events', 'behavior'],
      blockedCategories: [],
      lastMessageSent: '2024-12-29T09:15:00Z',
      messageCount: 12,
      deliveryRate: 100,
      readRate: 85.7
    }
    */
  ]
};

// List contacts with optional filters: studentId, verified, consent, preferredLanguage
router.get('/contacts', (req, res) => {
  let contacts = arattaiData.contacts;
  const { studentId, verified, consent, preferredLanguage } = req.query;

  if (studentId) contacts = contacts.filter(c => c.studentId === studentId);
  if (verified !== undefined) contacts = contacts.filter(c => c.arattaiVerified === (verified === 'true'));
  if (consent !== undefined) contacts = contacts.filter(c => c.consentGiven === (consent === 'true'));
  if (preferredLanguage) contacts = contacts.filter(c => c.preferredLanguage === preferredLanguage.toLowerCase());

  res.json(contacts);
});

// Get single contact by ID
router.get('/contacts/:contactId', (req, res) => {
  const contact = arattaiData.contacts.find(c => c.id === req.params.contactId);
  if (!contact) return res.status(404).json({ error: 'Contact not found' });
  res.json(contact);
});

// Update contact information and preferences
router.put('/contacts/:contactId', (req, res) => {
  const { contactId } = req.params;
  const updateData = req.body;

  const idx = arattaiData.contacts.findIndex(c => c.id === contactId);
  if (idx === -1) return res.status(404).json({ error: 'Contact not found' });

  arattaiData.contacts[idx] = {
    ...arattaiData.contacts[idx],
    ...updateData,
    updatedAt: new Date().toISOString()
  };
  res.json({ success: true, contact: arattaiData.contacts[idx] });
});

// Add new contact
router.post('/contacts', (req, res) => {
  const newContact = req.body;

  if (!newContact.studentId || !newContact.parentName || !newContact.phoneNumber) {
    return res.status(400).json({ error: 'studentId, parentName, and phoneNumber are required' });
  }

  newContact.id = 'contact_' + Date.now();
  newContact.updatedAt = new Date().toISOString();
  newContact.arattaiVerified = newContact.arattaiVerified || false;
  newContact.consentGiven = newContact.consentGiven || false;
  newContact.messageCount = 0;
  newContact.deliveryRate = 100;
  newContact.readRate = 100;

  arattaiData.contacts.push(newContact);
  res.json({ success: true, contact: newContact, message: 'Contact added successfully' });
});

module.exports = router;
// Part 4: Arattai Delivery & Read Receipt Webhook Handling

const express = require('express');
const router = express.Router();

// Assuming access to arattaiData.sentMessages or database for messages
const arattaiData = {
  sentMessages: [
    /*
    {
      id: 'msg_001',
      messageId: 'arattai_msg_123',
      recipientNumber: '+91-9876543210',
      status: 'sent', // sent, delivered, read
      sentAt: '2025-01-01T10:00:00Z',
      deliveredAt: null,
      readAt: null,
      // other message metadata...
    }
    */
  ]
};

// Webhook endpoint to receive delivery reports and read receipts from Arattai
router.post('/webhook', (req, res) => {
  const { messageId, status, timestamp, readTimestamp } = req.body;

  // Validate input
  if (!messageId || !status) {
    return res.status(400).json({ error: 'messageId and status are required' });
  }

  // Locate message record
  const messageIndex = arattaiData.sentMessages.findIndex(msg => msg.messageId === messageId);
  if (messageIndex === -1) {
    return res.status(404).json({ error: 'Message not found' });
  }

  const message = arattaiData.sentMessages[messageIndex];

  // Update message status based on webhook
  message.status = status;

  if (status === 'delivered' && timestamp) {
    message.deliveredAt = new Date(timestamp * 1000).toISOString();
  }

  if (status === 'read' && readTimestamp) {
    message.readAt = new Date(readTimestamp * 1000).toISOString();
  }

  // Additional handling: update analytics, trigger events, etc.

  res.json({ success: true });
});

module.exports = router;
// Part 5: Arattai Analytics and Reporting Endpoints

const express = require('express');
const router = express.Router();

// Assuming access to arattaiData.sentMessages or DB equivalents
const arattaiData = {
  sentMessages: [
    /*
    {
      id: 'msg_001',
      templateId: 'template_001',
      category: 'attendance',
      status: 'delivered',
      readAt: '2025-02-01T12:00:00Z',
      sentAt: '2025-02-01T11:55:00Z',
      cost: 0.50,
      // other message details
    }
    */
  ]
};

// Utility: calculate delivery status distribution
function getDeliveryStatusDistribution() {
  const distribution = {};
  arattaiData.sentMessages.forEach(msg => {
    distribution[msg.status] = (distribution[msg.status] || 0) + 1;
  });
  return distribution;
}

// Utility: get top performing templates by read rate
function getTopPerformingTemplates() {
  const templateStats = {};

  arattaiData.sentMessages.forEach(msg => {
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
      deliveryRate: stats.sent > 0 ? ((stats.delivered / stats.sent) * 100).toFixed(1) : '0.0',
      readRate: stats.sent > 0 ? ((stats.read / stats.sent) * 100).toFixed(1) : '0.0',
    }))
    .sort((a, b) => b.readRate - a.readRate)
    .slice(0, 5);
}

// Utility: get message count and engagement per contact
function getContactEngagement() {
  // Placeholder aggregation logic; replace with DB aggregation in real system
  const engagementMap = {};

  arattaiData.sentMessages.forEach(msg => {
    const contactId = msg.recipientNumber; // or contact id linking
    if (!engagementMap[contactId]) {
      engagementMap[contactId] = {
        totalSent: 0,
        delivered: 0,
        read: 0
      };
    }
    engagementMap[contactId].totalSent++;
    if (msg.status === 'delivered') engagementMap[contactId].delivered++;
    if (msg.readAt) engagementMap[contactId].read++;
  });

  return Object.entries(engagementMap).map(([contact, stats]) => ({
    contact,
    ...stats,
    deliveryRate: stats.totalSent > 0 ? ((stats.delivered / stats.totalSent)*100).toFixed(1) : '0.0',
    readRate: stats.totalSent > 0 ? ((stats.read / stats.totalSent)*100).toFixed(1) : '0.0'
  }));
}

// Main analytics endpoint
router.get('/analytics', (req, res) => {
  const { period = 'month', category } = req.query;

  let messages = arattaiData.sentMessages;

  if (category) {
    messages = messages.filter(msg => msg.category === category);
  }

  // Calculate basic stats
  const totalMessagesSent = messages.length;
  const deliveredCount = messages.filter(msg => msg.status === 'delivered').length;
  const readCount = messages.filter(msg => msg.readAt).length;
  const totalCost = messages.reduce((sum, msg) => sum + (msg.cost || 0), 0);
  const avgCostPerMessage = totalMessagesSent ? totalCost / totalMessagesSent : 0;

  const categoryBreakdown = messages.reduce((acc, msg) => {
    acc[msg.category] = (acc[msg.category] || 0) + 1;
    return acc;
  }, {});

  // Build response
  const response = {
    totalMessagesSent,
    deliveryRate: totalMessagesSent ? ((deliveredCount / totalMessagesSent) * 100).toFixed(1) : '0.0',
    readRate: totalMessagesSent ? ((readCount / totalMessagesSent) * 100).toFixed(1) : '0.0',
    totalCost: totalCost.toFixed(2),
    avgCostPerMessage: avgCostPerMessage.toFixed(2),
    categoryBreakdown,
    topPerformingTemplates: getTopPerformingTemplates(),
    contactEngagement: getContactEngagement(),
    realTimeStats: {
      messagesLast24Hours: messages.filter(msg => new Date(msg.sentAt) > new Date(Date.now() - 24*60*60*1000)).length,
      deliveryStatusDistribution: getDeliveryStatusDistribution()
    }
  };

  res.json(response);
});

module.exports = router;
// Part 6: Arattai Configuration, Rate Limiting, Opt-Out, and Content Controls

const express = require('express');
const router = express.Router();

// In-memory store of settings and opt-outs (replace with persistent DB)
let arattaiSettings = {
  businessNumber: '+91-9876543200',
  businessName: 'Delhi Public School',
  apiProvider: 'arattai_business_api',
  dailyLimit: 1000,
  monthlyLimit: 25000,
  currentUsage: 0,
  remainingQuota: 25000,
  rateLimiting: {
    messagesPerMinute: 20,
    messagesPerHour: 600
  },
  contentFiltering: true,
  spamProtection: true,
  automaticOptOut: true,
  deliveryReports: true,
  readReceipts: true,
  webhookUrl: 'https://school-api.com/arattai/webhook',
  webhookSecret: 'secure_webhook_secret_key',
  consentRequired: true,
  dataRetentionDays: 90
};

const optOutNumbers = new Set(); // phone numbers opted out

// Get current settings
router.get('/settings', (req, res) => {
  res.json(arattaiSettings);
});

// Update settings
router.put('/settings', (req, res) => {
  arattaiSettings = { ...arattaiSettings, ...req.body, updatedAt: new Date().toISOString() };
  res.json({ success: true, settings: arattaiSettings, message: 'Settings updated' });
});

// Opt-out handling - parent can opt out from receiving messages
router.post('/optout', (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) return res.status(400).json({ error: 'phoneNumber is required' });

  optOutNumbers.add(phoneNumber);
  res.json({ success: true, message: `Number ${phoneNumber} opted out successfully` });
});

// Check if a number has opted out
router.get('/optout/:phoneNumber', (req, res) => {
  const { phoneNumber } = req.params;
  const optedOut = optOutNumbers.has(phoneNumber);
  res.json({ phoneNumber, optedOut });
});

// Middleware for rate limiting (simple example, extend with real logic)
function rateLimit(req, res, next) {
  // Implement logic counting messages per phone number, per minute, hour, day
  // and block if exceeding limits. Placeholder:
  next();
}

// Content filtering middleware (placeholder)
function contentFilter(req, res, next) {
  if (!arattaiSettings.contentFiltering) return next();

  const message = req.body.message || '';
  // Implement banned word checks, phishing/spam detection
  // Placeholder:
  const bannedWords = ['spam', 'scam', 'fake'];
  const found = bannedWords.some(word => message.toLowerCase().includes(word));
  if (found) {
    return res.status(400).json({ error: 'Message contains prohibited content' });
  }

  next();
}

// Use middleware before sending message endpoint
router.post('/send', rateLimit, contentFilter, (req, res, next) => {
  // Proceed with sending message implementation or forward to actual send logic
  next();
});

module.exports = router;
/ GET /api/arattai-alert/contacts
router.get('/contacts', (req, res) => {
  // Fetch contacts from DB or memory
  res.json(arattaiData.contacts || []);
});
