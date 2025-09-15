// Vipu AI Module - Complete Implementation (Basic AI Assistant)
const express = require('express');
const router = express.Router();

const vipuAIData = {
  conversations: [
    {
      id: 'conv_001',
      userId: 'teacher_001',
      userName: 'Ms. Priya Sharma',
      userRole: 'teacher',
      title: 'Mathematics Teaching Help',
      startedAt: '2024-12-29T10:30:00Z',
      lastMessageAt: '2024-12-29T10:45:00Z',
      status: 'active',
      category: 'academic_support',
      messages: [
        {
          id: 'msg_001',
          role: 'user',
          content: 'How can I make addition more engaging for Class 1 students?',
          timestamp: '2024-12-29T10:30:00Z',
          attachments: []
        },
        {
          id: 'msg_002',
          role: 'assistant',
          content: 'Here are some engaging ways to teach addition to Class 1 students:\n\n1. **Using Manipulatives**: Use colorful blocks, counting bears, or toys for hands-on learning\n2. **Number Stories**: Create fun stories like "3 birds on a tree, 2 more came to play. How many birds are there now?"\n3. **Visual Learning**: Use pictures, drawings, and number lines\n4. **Games**: Play simple addition games with dice or cards\n5. **Real-life Examples**: Count classroom objects, snacks, or toys\n\nWould you like specific activity ideas for any of these methods?',
          timestamp: '2024-12-29T10:32:00Z',
          helpful: true,
          confidence: 95
        },
        {
          id: 'msg_003',
          role: 'user',
          content: 'Can you suggest some specific games?',
          timestamp: '2024-12-29T10:35:00Z',
          attachments: []
        },
        {
          id: 'msg_004',
          role: 'assistant',
          content: 'Here are 5 fun addition games for Class 1:\n\n**1. Addition Bowling**\n- Set up pins with numbers\n- Roll 2 balls, add the numbers where they land\n\n**2. Teddy Bear Picnic**\n- "5 teddy bears having a picnic, 3 more join them. How many now?"\n- Use actual teddy bears or pictures\n\n**3. Finger Addition**\n- Show numbers on fingers and add them together\n- Very visual and always available!\n\n**4. Addition Race**\n- Give simple addition problems\n- First to solve correctly wins a sticker\n\n**5. Shopping Game**\n- "Buy" 2 items, add their "prices" (simple numbers)\n- Makes math practical and fun\n\nThese games make addition feel like play rather than work!',
          timestamp: '2024-12-29T10:40:00Z',
          helpful: true,
          confidence: 92
        }
      ],
      totalMessages: 4,
      satisfactionRating: null
    },
    {
      id: 'conv_002',
      userId: 'admin_001',
      userName: 'Principal',
      userRole: 'admin',
      title: 'Student Behavior Management',
      startedAt: '2024-12-28T15:20:00Z',
      lastMessageAt: '2024-12-28T15:35:00Z',
      status: 'completed',
      category: 'behavior_management',
      messages: [
        {
          id: 'msg_005',
          role: 'user',
          content: 'What are effective strategies for managing disruptive behavior in primary classes?',
          timestamp: '2024-12-28T15:20:00Z',
          attachments: []
        },
        {
          id: 'msg_006',
          role: 'assistant',
          content: 'Here are proven strategies for managing disruptive behavior in primary classes:\n\n**Preventive Strategies:**\n1. **Clear Expectations**: Establish and display classroom rules\n2. **Engaging Lessons**: Keep students actively involved\n3. **Positive Environment**: Create a supportive atmosphere\n4. **Routine**: Maintain consistent daily schedules\n\n**Intervention Strategies:**\n1. **Positive Reinforcement**: Reward good behavior immediately\n2. **Redirection**: Guide attention to appropriate activities\n3. **Cool-down Time**: Provide space for emotional regulation\n4. **Individual Attention**: Address underlying needs\n\n**Collaborative Approaches:**\n1. **Parent Communication**: Keep parents informed and involved\n2. **Behavior Plans**: Create individualized support plans\n3. **Peer Support**: Use positive peer influence\n\nWould you like detailed guidance on any specific strategy?',
          timestamp: '2024-12-28T15:25:00Z',
          helpful: true,
          confidence: 88
        }
      ],
      totalMessages: 2,
      satisfactionRating: 5
    }
  ],

  knowledgeBase: {
    categories: [
      {
        id: 'academic_support',
        name: 'Academic Support',
        description: 'Teaching methods, curriculum guidance, and subject-specific help',
        topicCount: 145,
        popular: true
      },
      {
        id: 'behavior_management',
        name: 'Behavior Management',
        description: 'Classroom discipline, student behavior strategies',
        topicCount: 89,
        popular: true
      },
      {
        id: 'administrative',
        name: 'Administrative',
        description: 'School policies, procedures, and management guidance',
        topicCount: 67,
        popular: false
      },
      {
        id: 'parent_communication',
        name: 'Parent Communication',
        description: 'Strategies for effective parent-teacher interaction',
        topicCount: 56,
        popular: true
      },
      {
        id: 'technology',
        name: 'Educational Technology',
        description: 'Digital tools and technology integration in teaching',
        topicCount: 78,
        popular: false
      },
      {
        id: 'assessment',
        name: 'Assessment & Evaluation',
        description: 'Testing strategies, grading, and student evaluation',
        topicCount: 92,
        popular: true
      }
    ],

    popularQuestions: [
      {
        id: 'faq_001',
        question: 'How to handle students who don\'t complete homework?',
        category: 'behavior_management',
        answer: 'Start by understanding the root cause - is it lack of understanding, time management, or home environment issues? Then implement strategies like homework contracts, peer buddy systems, and parent communication.',
        viewCount: 156,
        helpful: 89
      },
      {
        id: 'faq_002',
        question: 'Best methods to teach reading to slow learners?',
        category: 'academic_support',
        answer: 'Use multi-sensory approaches: phonics with visual aids, read-aloud sessions, guided reading groups, and one-on-one support. Break lessons into smaller, manageable chunks.',
        viewCount: 134,
        helpful: 92
      },
      {
        id: 'faq_003',
        question: 'How to communicate with difficult parents?',
        category: 'parent_communication',
        answer: 'Stay professional, listen actively, focus on the child\'s best interests, document all interactions, and always suggest solutions alongside problems.',
        viewCount: 112,
        helpful: 85
      },
      {
        id: 'faq_004',
        question: 'Creating engaging lesson plans for primary students?',
        category: 'academic_support',
        answer: 'Include variety: hands-on activities, games, visual aids, group work, and movement. Keep lessons short (15-20 minutes) and always connect to real-life examples.',
        viewCount: 167,
        helpful: 94
      },
      {
        id: 'faq_005',
        question: 'Managing large class sizes effectively?',
        category: 'administrative',
        answer: 'Use group activities, peer learning, clear classroom management systems, visual schedules, and differentiated instruction to meet diverse needs efficiently.',
        viewCount: 98,
        helpful: 87
      }
    ]
  },

  capabilities: [
    {
      id: 'teaching_support',
      name: 'Teaching Support',
      description: 'Lesson planning, teaching strategies, curriculum guidance',
      features: [
        'Lesson plan suggestions',
        'Activity ideas',
        'Subject-specific help',
        'Age-appropriate content',
        'Differentiated instruction'
      ],
      available: true
    },
    {
      id: 'behavior_guidance',
      name: 'Behavior Guidance',
      description: 'Classroom management and student behavior strategies',
      features: [
        'Behavior intervention plans',
        'Positive reinforcement ideas',
        'De-escalation techniques',
        'Parent communication scripts',
        'Individual student support'
      ],
      available: true
    },
    {
      id: 'assessment_help',
      name: 'Assessment Help',
      description: 'Evaluation methods and grading strategies',
      features: [
        'Assessment design',
        'Rubric creation',
        'Progress tracking',
        'Feedback strategies',
        'Report writing help'
      ],
      available: true
    },
    {
      id: 'parent_relations',
      name: 'Parent Relations',
      description: 'Communication strategies and parent engagement',
      features: [
        'Meeting preparation',
        'Difficult conversation guidance',
        'Communication templates',
        'Engagement activities',
        'Conflict resolution'
      ],
      available: true
    },
    {
      id: 'administrative_support',
      name: 'Administrative Support',
      description: 'School policies and management guidance',
      features: [
        'Policy interpretation',
        'Procedure guidance',
        'Documentation help',
        'Compliance support',
        'Best practices'
      ],
      available: true
    },
    {
      id: 'professional_development',
      name: 'Professional Development',
      description: 'Career growth and skill enhancement',
      features: [
        'Skill assessment',
        'Learning recommendations',
        'Career guidance',
        'Training suggestions',
        'Goal setting'
      ],
      available: false,
      comingSoon: true
    }
  ],

  analytics: {
    usage: {
      totalConversations: 234,
      activeUsers: 45,
      averageSessionDuration: '12.5 minutes',
      satisfactionRating: 4.3,
      mostPopularCategory: 'academic_support',
      peakUsageHours: ['10:00-11:00', '15:00-16:00', '20:00-21:00']
    },
    performance: {
      responseAccuracy: 89.2,
      helpfulnessRating: 4.2,
      responseTime: '1.3 seconds',
      resolutionRate: 78.5,
      userRetention: 85.7
    },
    feedback: {
      positiveResponses: 892,
      negativeResponses: 98,
      improvementSuggestions: 23,
      featureRequests: 34
    }
  },

  settings: {
    language: 'english',
    responseStyle: 'friendly_professional',
    maxResponseLength: 500,
    includeExamples: true,
    personalizedResponses: true,
    learningEnabled: true,
    dataRetention: 90,
    privacyMode: 'enhanced',
    contentFiltering: true,
    moderationLevel: 'strict'
  },

  prompts: {
    system: 'You are Vipu AI, a helpful educational assistant for Delhi Public School. You provide practical, evidence-based guidance for teachers, administrators, and staff. Keep responses concise, actionable, and specific to primary education. Always prioritize student wellbeing and educational best practices.',
    greetings: [
      'Hello! I\'m Vipu AI, your educational assistant. How can I help you today?',
      'Hi there! I\'m here to support you with teaching, behavior management, or any school-related questions.',
      'Welcome! I\'m Vipu AI. Whether you need lesson ideas, behavior strategies, or administrative guidance, I\'m here to help.',
      'Good day! I\'m your AI assistant for all things education. What would you like to explore today?'
    ],
    categories: [
      'Would you like help with teaching strategies, behavior management, parent communication, or something else?',
      'I can assist with lesson planning, classroom management, assessment ideas, or administrative questions. What interests you?',
      'My expertise covers academic support, behavior guidance, parent relations, and school administration. What can I help with?'
    ]
  }
};

// Start new conversation
router.post('/chat/start', (req, res) => {
  const { userId, userName, userRole, initialMessage } = req.body;
  
  // Validate required fields
  if (!userId || !initialMessage) {
    return res.status(400).json({ error: 'User ID and initial message are required' });
  }
  
  // Create new conversation
  const newConversation = {
    id: 'conv_' + Date.now(),
    userId,
    userName: userName || 'User',
    userRole: userRole || 'teacher',
    title: generateConversationTitle(initialMessage),
    startedAt: new Date().toISOString(),
    lastMessageAt: new Date().toISOString(),
    status: 'active',
    category: categorizeMessage(initialMessage),
    messages: [
      {
        id: 'msg_' + Date.now(),
        role: 'user',
        content: initialMessage,
        timestamp: new Date().toISOString(),
        attachments: []
      }
    ],
    totalMessages: 1,
    satisfactionRating: null
  };
  
  // Generate AI response
  const aiResponse = generateAIResponse(initialMessage, newConversation.category);
  
  newConversation.messages.push({
    id: 'msg_' + (Date.now() + 1),
    role: 'assistant',
    content: aiResponse.content,
    timestamp: new Date().toISOString(),
    helpful: null,
    confidence: aiResponse.confidence
  });
  
  newConversation.totalMessages = 2;
  newConversation.lastMessageAt = new Date().toISOString();
  
  vipuAIData.conversations.push(newConversation);
  
  res.json({
    success: true,
    conversation: newConversation,
    message: 'Conversation started successfully'
  });
});

// Continue conversation
router.post('/chat/:conversationId/message', (req, res) => {
  const { conversationId } = req.params;
  const { message, attachments = [] } = req.body;
  
  // Find conversation
  const conversation = vipuAIData.conversations.find(c => c.id === conversationId);
  
  if (!conversation) {
    return res.status(404).json({ error: 'Conversation not found' });
  }
  
  if (conversation.status !== 'active') {
    return res.status(400).json({ error: 'Conversation is not active' });
  }
  
  // Add user message
  const userMessage = {
    id: 'msg_' + Date.now(),
    role: 'user',
    content: message,
    timestamp: new Date().toISOString(),
    attachments: attachments
  };
  
  conversation.messages.push(userMessage);
  
  // Generate AI response
  const context = conversation.messages.slice(-5); // Last 5 messages for context
  const aiResponse = generateAIResponse(message, conversation.category, context);
  
  const assistantMessage = {
    id: 'msg_' + (Date.now() + 1),
    role: 'assistant',
    content: aiResponse.content,
    timestamp: new Date().toISOString(),
    helpful: null,
    confidence: aiResponse.confidence
  };
  
  conversation.messages.push(assistantMessage);
  conversation.totalMessages += 2;
  conversation.lastMessageAt = new Date().toISOString();
  
  res.json({
    success: true,
    userMessage: userMessage,
    assistantMessage: assistantMessage,
    conversation: conversation
  });
});

// Get conversation
router.get('/chat/:conversationId', (req, res) => {
  const { conversationId } = req.params;
  
  const conversation = vipuAIData.conversations.find(c => c.id === conversationId);
  
  if (!conversation) {
    return res.status(404).json({ error: 'Conversation not found' });
  }
  
  res.json(conversation);
});

// Get user conversations
router.get('/chat/user/:userId', (req, res) => {
  const { userId } = req.params;
  const { status, limit = 10 } = req.query;
  
  let conversations = vipuAIData.conversations.filter(c => c.userId === userId);
  
  // Filter by status
  if (status) {
    conversations = conversations.filter(c => c.status === status);
  }
  
  // Sort by last message (newest first)
  conversations.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
  
  // Limit results
  conversations = conversations.slice(0, parseInt(limit));
  
  // Return summary without full message history
  const conversationSummaries = conversations.map(conv => ({
    id: conv.id,
    title: conv.title,
    category: conv.category,
    startedAt: conv.startedAt,
    lastMessageAt: conv.lastMessageAt,
    status: conv.status,
    totalMessages: conv.totalMessages,
    satisfactionRating: conv.satisfactionRating,
    lastMessage: conv.messages[conv.messages.length - 1]?.content.slice(0, 100) + '...'
  }));
  
  res.json(conversationSummaries);
});

// Rate conversation
router.post('/chat/:conversationId/rate', (req, res) => {
  const { conversationId } = req.params;
  const { rating, feedback } = req.body;
  
  // Validate rating
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }
  
  const conversation = vipuAIData.conversations.find(c => c.id === conversationId);
  
  if (!conversation) {
    return res.status(404).json({ error: 'Conversation not found' });
  }
  
  // Update conversation rating
  conversation.satisfactionRating = rating;
  conversation.userFeedback = feedback || '';
  conversation.ratedAt = new Date().toISOString();
  
  res.json({
    success: true,
    message: 'Thank you for your feedback!'
  });
});

// Mark message as helpful/not helpful
router.post('/chat/message/:messageId/feedback', (req, res) => {
  const { messageId } = req.params;
  const { helpful } = req.body;
  
  // Find message in all conversations
  let targetMessage = null;
  for (const conversation of vipuAIData.conversations) {
    const message = conversation.messages.find(m => m.id === messageId);
    if (message) {
      targetMessage = message;
      break;
    }
  }
  
  if (!targetMessage) {
    return res.status(404).json({ error: 'Message not found' });
  }
  
  if (targetMessage.role !== 'assistant') {
    return res.status(400).json({ error: 'Can only rate assistant messages' });
  }
  
  // Update message feedback
  targetMessage.helpful = helpful;
  targetMessage.feedbackAt = new Date().toISOString();
  
  res.json({
    success: true,
    message: 'Feedback recorded successfully'
  });
});

// Get knowledge base
router.get('/knowledge-base', (req, res) => {
  const { category } = req.query;
  
  let knowledge = vipuAIData.knowledgeBase;
  
  if (category) {
    knowledge = {
      ...knowledge,
      popularQuestions: knowledge.popularQuestions.filter(q => q.category === category)
    };
  }
  
  res.json(knowledge);
});

// Search knowledge base
router.get('/knowledge-base/search', (req, res) => {
  const { query, category } = req.query;
  
  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }
  
  let questions = vipuAIData.knowledgeBase.popularQuestions;
  
  // Filter by category
  if (category) {
    questions = questions.filter(q => q.category === category);
  }
  
  // Search in questions and answers
  const searchResults = questions.filter(q => 
    q.question.toLowerCase().includes(query.toLowerCase()) ||
    q.answer.toLowerCase().includes(query.toLowerCase())
  );
  
  // Sort by relevance (simplified - by view count)
  searchResults.sort((a, b) => b.viewCount - a.viewCount);
  
  res.json({
    query: query,
    results: searchResults,
    total: searchResults.length
  });
});

// Get capabilities
router.get('/capabilities', (req, res) => {
  res.json(vipuAIData.capabilities);
});

// Get analytics
router.get('/analytics', (req, res) => {
  const { period = 'month' } = req.query;
  
  // Add real-time calculations
  const enhancedAnalytics = {
    ...vipuAIData.analytics,
    realtimeStats: {
      activeConversations: vipuAIData.conversations.filter(c => c.status === 'active').length,
      averageMessagesPerConversation: vipuAIData.conversations.length > 0 ? 
        (vipuAIData.conversations.reduce((sum, c) => sum + c.totalMessages, 0) / vipuAIData.conversations.length).toFixed(1) : 0,
      categoryDistribution: getCategoryDistribution(),
      userRoleDistribution: getUserRoleDistribution(),
      responseHelpfulness: getResponseHelpfulness()
    }
  };
  
  res.json(enhancedAnalytics);
});

// Get settings
router.get('/settings', (req, res) => {
  res.json(vipuAIData.settings);
});

// Update settings
router.put('/settings', (req, res) => {
  const updateData = req.body;
  
  vipuAIData.settings = {
    ...vipuAIData.settings,
    ...updateData,
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    settings: vipuAIData.settings,
    message: 'Settings updated successfully'
  });
});

// Quick help endpoint
router.post('/quick-help', (req, res) => {
  const { question, category, userRole } = req.body;
  
  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }
  
  // Generate quick response without starting a conversation
  const response = generateAIResponse(question, category || 'general');
  
  res.json({
    question: question,
    answer: response.content,
    confidence: response.confidence,
    category: category || categorizeMessage(question),
    suggestions: getSuggestions(question, category),
    relatedQuestions: getRelatedQuestions(question, category)
  });
});

// Helper Functions
function generateConversationTitle(message) {
  // Simple title generation based on message content
  const words = message.split(' ').slice(0, 5).join(' ');
  return words.length > 30 ? words.slice(0, 30) + '...' : words;
}

function categorizeMessage(message) {
  const keywords = {
    'academic_support': ['teaching', 'lesson', 'curriculum', 'subject', 'learn', 'study', 'homework'],
    'behavior_management': ['behavior', 'discipline', 'manage', 'disruptive', 'rules', 'control'],
    'parent_communication': ['parent', 'communication', 'meeting', 'talk', 'discuss'],
    'assessment': ['test', 'exam', 'grade', 'assess', 'evaluate', 'mark'],
    'administrative': ['policy', 'procedure', 'admin', 'management', 'system']
  };
  
  const messageLower = message.toLowerCase();
  
  for (const [category, words] of Object.entries(keywords)) {
    if (words.some(word => messageLower.includes(word))) {
      return category;
    }
  }
  
  return 'general';
}

function generateAIResponse(message, category, context = []) {
  // Simulate AI response generation
  const responses = {
    'academic_support': [
      'Here are some effective teaching strategies for your situation:\n\n1. **Visual Learning**: Use charts, diagrams, and visual aids\n2. **Hands-on Activities**: Incorporate manipulatives and interactive exercises\n3. **Differentiated Instruction**: Adapt content for different learning styles\n4. **Regular Assessment**: Check understanding frequently\n\nWould you like me to elaborate on any of these approaches?',
      'For engaging primary students, try these proven methods:\n\n• **Interactive Games**: Make learning fun through educational games\n• **Real-world Connections**: Relate lessons to students\' experiences\n• **Collaborative Learning**: Use group work and peer teaching\n• **Multimedia Resources**: Include videos, songs, and digital tools\n\nWhat specific subject or topic would you like help with?'
    ],
    'behavior_management': [
      'Effective behavior management strategies include:\n\n1. **Clear Expectations**: Establish and communicate rules clearly\n2. **Positive Reinforcement**: Reward good behavior immediately\n3. **Consistent Consequences**: Apply rules fairly and consistently\n4. **Building Relationships**: Connect with students personally\n5. **Environmental Setup**: Organize classroom for success\n\nWhich aspect would you like to explore further?',
      'Here\'s a comprehensive approach to managing challenging behaviors:\n\n• **Prevention**: Create engaging lessons and clear routines\n• **Intervention**: Use redirection and calming strategies\n• **Support**: Collaborate with parents and counselors\n• **Documentation**: Track patterns and progress\n\nWhat specific behavior challenges are you facing?'
    ],
    'parent_communication': [
      'Effective parent communication strategies:\n\n1. **Regular Updates**: Send weekly progress reports\n2. **Positive Focus**: Share achievements along with concerns\n3. **Open Dialogue**: Listen actively to parent perspectives\n4. **Solution-Oriented**: Always suggest actionable steps\n5. **Professional Tone**: Maintain respect and understanding\n\nWhat type of parent interaction do you need help with?',
      'Building strong parent partnerships involves:\n\n• **Proactive Communication**: Don\'t wait for problems\n• **Multiple Channels**: Use calls, emails, and meetings\n• **Cultural Sensitivity**: Respect diverse backgrounds\n• **Collaborative Approach**: Work together for student success\n\nWould you like templates for specific communications?'
    ]
  };
  
  const categoryResponses = responses[category] || responses['academic_support'];
  const selectedResponse = categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
  
  return {
    content: selectedResponse,
    confidence: Math.floor(Math.random() * 20) + 80 // 80-100% confidence
  };
}

function getSuggestions(question, category) {
  return [
    'Try breaking the task into smaller steps',
    'Consider using visual aids or examples',
    'Involve parents in the solution',
    'Document the situation for future reference'
  ];
}

function getRelatedQuestions(question, category) {
  return vipuAIData.knowledgeBase.popularQuestions
    .filter(q => q.category === category)
    .slice(0, 3)
    .map(q => q.question);
}

function getCategoryDistribution() {
  const distribution = {};
  vipuAIData.conversations.forEach(conv => {
    distribution[conv.category] = (distribution[conv.category] || 0) + 1;
  });
  return distribution;
}

function getUserRoleDistribution() {
  const distribution = {};
  vipuAIData.conversations.forEach(conv => {
    distribution[conv.userRole] = (distribution[conv.userRole] || 0) + 1;
  });
  return distribution;
}

function getResponseHelpfulness() {
  let helpful = 0;
  let total = 0;
  
  vipuAIData.conversations.forEach(conv => {
    conv.messages.forEach(msg => {
      if (msg.role === 'assistant' && msg.helpful !== null) {
        total++;
        if (msg.helpful) helpful++;
      }
    });
  });
  
  return total > 0 ? ((helpful / total) * 100).toFixed(1) : 0;
}

module.exports = router;