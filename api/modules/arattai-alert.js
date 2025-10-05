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
