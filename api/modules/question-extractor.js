// Question Extractor Module - Complete Implementation
const express = require('express');
const router = express.Router();

const extractorData = {
  extractedDocuments: [
    {
      id: 'doc_001',
      fileName: 'Mathematics_Grade1_Textbook.pdf',
      fileSize: '2.5 MB',
      uploadedAt: '2024-12-25T10:30:00Z',
      uploadedBy: 'teacher_001',
      processingStatus: 'completed',
      extractionMethod: 'ocr',
      totalPages: 45,
      processedPages: 45,
      questionsExtracted: 127,
      categories: ['mcq', 'fill_blank', 'short_answer', 'word_problems'],
      subjects: ['mathematics'],
      classes: ['Class 1'],
      language: 'english',
      quality: 'high',
      processingTime: 180, // seconds
      confidence: 94.5
    },
    {
      id: 'doc_002',
      fileName: 'English_Comprehension_Class2.pdf',
      fileSize: '1.8 MB',
      uploadedAt: '2024-12-26T14:20:00Z',
      uploadedBy: 'teacher_002',
      processingStatus: 'completed',
      extractionMethod: 'hybrid',
      totalPages: 32,
      processedPages: 32,
      questionsExtracted: 89,
      categories: ['reading_comprehension', 'grammar', 'vocabulary'],
      subjects: ['english'],
      classes: ['Class 2'],
      language: 'english',
      quality: 'medium',
      processingTime: 145,
      confidence: 87.2
    },
    {
      id: 'doc_003',
      fileName: 'Science_Workbook_Grade3.pdf',
      fileSize: '3.2 MB',
      uploadedAt: '2024-12-28T09:15:00Z',
      uploadedBy: 'teacher_003',
      processingStatus: 'processing',
      extractionMethod: 'ai_enhanced',
      totalPages: 58,
      processedPages: 45,
      questionsExtracted: 0,
      categories: [],
      subjects: ['science'],
      classes: ['Class 3'],
      language: 'english',
      quality: null,
      processingTime: null,
      confidence: null,
      estimatedCompletion: '2024-12-28T11:00:00Z'
    }
  ],

  extractedQuestions: [
    {
      id: 'ext_q001',
      documentId: 'doc_001',
      originalText: 'What is 5 + 3? (a) 6 (b) 7 (c) 8 (d) 9',
      extractedQuestion: 'What is 5 + 3?',
      questionType: 'mcq',
      subject: 'mathematics',
      class: 'Class 1',
      chapter: 'Addition',
      difficulty: 'easy',
      marks: 1,
      options: ['6', '7', '8', '9'],
      correctAnswer: '8',
      extractionConfidence: 98.5,
      pageNumber: 12,
      coordinates: { x: 150, y: 300, width: 400, height: 60 },
      aiProcessed: true,
      verified: false,
      verifiedBy: null,
      verificationNotes: '',
      tags: ['addition', 'basic_math', 'single_digit'],
      bloomsTaxonomy: 'knowledge',
      qualityScore: 95,
      needsReview: false
    },
    {
      id: 'ext_q002',
      documentId: 'doc_001',
      originalText: 'Count the objects: ●●●●● How many circles are there? _____',
      extractedQuestion: 'Count the objects: ●●●●● How many circles are there?',
      questionType: 'fill_blank',
      subject: 'mathematics',
      class: 'Class 1',
      chapter: 'Counting',
      difficulty: 'easy',
      marks: 1,
      options: null,
      correctAnswer: '5',
      extractionConfidence: 92.3,
      pageNumber: 8,
      coordinates: { x: 100, y: 200, width: 350, height: 80 },
      aiProcessed: true,
      verified: true,
      verifiedBy: 'teacher_001',
      verificationNotes: 'Verified correct',
      tags: ['counting', 'visual', 'objects'],
      bloomsTaxonomy: 'application',
      qualityScore: 90,
      needsReview: false
    },
    {
      id: 'ext_q003',
      documentId: 'doc_002',
      originalText: 'Read the passage and answer: The cat sat on the mat. Where did the cat sit?',
      extractedQuestion: 'Read the passage and answer: The cat sat on the mat. Where did the cat sit?',
      questionType: 'short_answer',
      subject: 'english',
      class: 'Class 2',
      chapter: 'Reading Comprehension',
      difficulty: 'easy',
      marks: 2,
      options: null,
      correctAnswer: 'On the mat',
      extractionConfidence: 89.7,
      pageNumber: 15,
      coordinates: { x: 120, y: 250, width: 450, height: 100 },
      aiProcessed: true,
      verified: false,
      verifiedBy: null,
      verificationNotes: '',
      tags: ['comprehension', 'simple_text', 'location'],
      bloomsTaxonomy: 'comprehension',
      qualityScore: 85,
      needsReview: true
    },
    {
      id: 'ext_q004',
      documentId: 'doc_001',
      originalText: 'Word Problem: Rahul has 8 apples. He eats 3 apples. How many apples does Rahul have left?',
      extractedQuestion: 'Rahul has 8 apples. He eats 3 apples. How many apples does Rahul have left?',
      questionType: 'word_problem',
      subject: 'mathematics',
      class: 'Class 1',
      chapter: 'Subtraction',
      difficulty: 'medium',
      marks: 3,
      options: null,
      correctAnswer: '5 apples',
      extractionConfidence: 94.1,
      pageNumber: 25,
      coordinates: { x: 80, y: 180, width: 480, height: 120 },
      aiProcessed: true,
      verified: true,
      verifiedBy: 'teacher_001',
      verificationNotes: 'Good word problem extraction',
      tags: ['subtraction', 'word_problem', 'real_life'],
      bloomsTaxonomy: 'application',
      qualityScore: 92,
      needsReview: false
    },
    {
      id: 'ext_q005',
      documentId: 'doc_002',
      originalText: 'Choose the correct verb: The bird _____ in the sky. (a) fly (b) flies (c) flying (d) flew',
      extractedQuestion: 'Choose the correct verb: The bird _____ in the sky.',
      questionType: 'mcq',
      subject: 'english',
      class: 'Class 2',
      chapter: 'Grammar - Verbs',
      difficulty: 'medium',
      marks: 1,
      options: ['fly', 'flies', 'flying', 'flew'],
      correctAnswer: 'flies',
      extractionConfidence: 96.8,
      pageNumber: 22,
      coordinates: { x: 90, y: 320, width: 420, height: 70 },
      aiProcessed: true,
      verified: false,
      verifiedBy: null,
      verificationNotes: '',
      tags: ['grammar', 'verbs', 'present_tense'],
      bloomsTaxonomy: 'application',
      qualityScore: 94,
      needsReview: false
    }
  ],

  extractionSettings: {
    supportedFormats: ['pdf', 'docx', 'doc', 'txt', 'jpg', 'png'],
    maxFileSize: '10 MB',
    ocrLanguages: ['english', 'hindi', 'spanish', 'french'],
    aiModels: [
      {
        id: 'basic_ocr',
        name: 'Basic OCR',
        description: 'Standard optical character recognition',
        accuracy: 85,
        speed: 'fast',
        cost: 'low'
      },
      {
        id: 'enhanced_ocr',
        name: 'Enhanced OCR',
        description: 'Improved OCR with better accuracy',
        accuracy: 92,
        speed: 'medium',
        cost: 'medium'
      },
      {
        id: 'ai_enhanced',
        name: 'AI Enhanced Extraction',
        description: 'AI-powered extraction with context understanding',
        accuracy: 96,
        speed: 'slow',
        cost: 'high'
      }
    ],
    qualityThresholds: {
      high: 90,
      medium: 75,
      low: 60
    },
    autoVerification: {
      enabled: true,
      confidenceThreshold: 95,
      requireHumanReview: ['word_problem', 'essay', 'creative_writing']
    }
  },

  processingQueue: [
    {
      id: 'queue_001',
      documentId: 'doc_003',
      status: 'processing',
      startedAt: '2024-12-28T09:20:00Z',
      estimatedCompletion: '2024-12-28T11:00:00Z',
      progress: 77,
      currentStep: 'ai_analysis',
      steps: [
        { name: 'file_upload', status: 'completed', duration: 5 },
        { name: 'format_validation', status: 'completed', duration: 2 },
        { name: 'ocr_processing', status: 'completed', duration: 120 },
        { name: 'text_extraction', status: 'completed', duration: 30 },
        { name: 'ai_analysis', status: 'processing', duration: null },
        { name: 'question_identification', status: 'pending', duration: null },
        { name: 'categorization', status: 'pending', duration: null },
        { name: 'quality_check', status: 'pending', duration: null }
      ]
    }
  ],

  extractionTemplates: [
    {
      id: 'template_math',
      name: 'Mathematics Questions',
      subject: 'mathematics',
      patterns: [
        {
          type: 'mcq',
          regex: /What is (\d+\s*[+\-*/]\s*\d+)\?\s*\(a\)\s*(.+?)\s*\(b\)\s*(.+?)\s*\(c\)\s*(.+?)\s*\(d\)\s*(.+)/gi,
          confidence: 95
        },
        {
          type: 'fill_blank',
          regex: /(.+?)\s*_+\s*(.+)/gi,
          confidence: 80
        },
        {
          type: 'word_problem',
          regex: /(.*has\s+\d+.*\.\s*.*\?\s*)/gi,
          confidence: 85
        }
      ]
    },
    {
      id: 'template_english',
      name: 'English Questions',
      subject: 'english',
      patterns: [
        {
          type: 'comprehension',
          regex: /(Read the passage.*?\.\s*.*\?)/gi,
          confidence: 90
        },
        {
          type: 'grammar',
          regex: /(Choose the correct.*?\(a\).*?\(b\).*?\(c\).*?\(d\).*)/gi,
          confidence: 88
        },
        {
          type: 'vocabulary',
          regex: /(What does.*mean\?|Give the meaning of.*)/gi,
          confidence: 85
        }
      ]
    }
  ],

  statistics: {
    totalDocumentsProcessed: 15,
    totalQuestionsExtracted: 456,
    averageExtractionTime: 165, // seconds
    accuracyRate: 91.3,
    topSubjects: [
      { subject: 'mathematics', count: 187 },
      { subject: 'english', count: 145 },
      { subject: 'science', count: 89 },
      { subject: 'social_studies', count: 35 }
    ],
    qualityDistribution: {
      high: 312,
      medium: 98,
      low: 46
    }
  }
};

// Get all extracted documents
router.get('/documents', (req, res) => {
  const { status, subject, class: className, uploadedBy } = req.query;
  
  let documents = extractorData.extractedDocuments;
  
  // Apply filters
  if (status) {
    documents = documents.filter(doc => doc.processingStatus === status);
  }
  
  if (subject) {
    documents = documents.filter(doc => doc.subjects.includes(subject));
  }
  
  if (className) {
    documents = documents.filter(doc => doc.classes.includes(className));
  }
  
  if (uploadedBy) {
    documents = documents.filter(doc => doc.uploadedBy === uploadedBy);
  }
  
  // Sort by upload date (newest first)
  documents.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
  
  res.json(documents);
});

// Get document by ID
router.get('/documents/:documentId', (req, res) => {
  const { documentId } = req.params;
  
  const document = extractorData.extractedDocuments.find(doc => doc.id === documentId);
  
  if (!document) {
    return res.status(404).json({ error: 'Document not found' });
  }
  
  // Get extracted questions for this document
  const questions = extractorData.extractedQuestions.filter(q => q.documentId === documentId);
  
  res.json({
    document: document,
    questions: questions,
    totalQuestions: questions.length,
    verifiedQuestions: questions.filter(q => q.verified).length,
    needsReview: questions.filter(q => q.needsReview).length
  });
});

// Upload and process document
router.post('/upload', (req, res) => {
  const {
    fileName,
    fileSize,
    extractionMethod = 'enhanced_ocr',
    subject,
    class: className,
    uploadedBy
  } = req.body;
  
  // Validate file
  if (!fileName || !fileSize) {
    return res.status(400).json({ error: 'File name and size are required' });
  }
  
  const fileExtension = fileName.split('.').pop().toLowerCase();
  if (!extractorData.extractionSettings.supportedFormats.includes(fileExtension)) {
    return res.status(400).json({ 
      error: 'Unsupported file format',
      supportedFormats: extractorData.extractionSettings.supportedFormats
    });
  }
  
  // Create new document entry
  const newDocument = {
    id: 'doc_' + Date.now(),
    fileName,
    fileSize,
    uploadedAt: new Date().toISOString(),
    uploadedBy: uploadedBy || 'system',
    processingStatus: 'queued',
    extractionMethod,
    totalPages: null,
    processedPages: 0,
    questionsExtracted: 0,
    categories: [],
    subjects: subject ? [subject] : [],
    classes: className ? [className] : [],
    language: 'english',
    quality: null,
    processingTime: null,
    confidence: null
  };
  
  extractorData.extractedDocuments.push(newDocument);
  
  // Start processing
  startDocumentProcessing(newDocument);
  
  res.json({
    success: true,
    document: newDocument,
    message: 'Document uploaded successfully and processing started'
  });
});

// Get extracted questions
router.get('/questions', (req, res) => {
  const { 
    documentId, 
    subject, 
    class: className, 
    type, 
    verified, 
    needsReview,
    limit = 50,
    offset = 0
  } = req.query;
  
  let questions = extractorData.extractedQuestions;
  
  // Apply filters
  if (documentId) {
    questions = questions.filter(q => q.documentId === documentId);
  }
  
  if (subject) {
    questions = questions.filter(q => q.subject === subject);
  }
  
  if (className) {
    questions = questions.filter(q => q.class === className);
  }
  
  if (type) {
    questions = questions.filter(q => q.questionType === type);
  }
  
  if (verified !== undefined) {
    questions = questions.filter(q => q.verified === (verified === 'true'));
  }
  
  if (needsReview !== undefined) {
    questions = questions.filter(q => q.needsReview === (needsReview === 'true'));
  }
  
  // Pagination
  const total = questions.length;
  questions = questions.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
  
  res.json({
    questions: questions,
    pagination: {
      total: total,
      limit: parseInt(limit),
      offset: parseInt(offset),
      hasMore: (parseInt(offset) + parseInt(limit)) < total
    }
  });
});

// Get question by ID
router.get('/questions/:questionId', (req, res) => {
  const { questionId } = req.params;
  
  const question = extractorData.extractedQuestions.find(q => q.id === questionId);
  
  if (!question) {
    return res.status(404).json({ error: 'Question not found' });
  }
  
  // Get source document info
  const document = extractorData.extractedDocuments.find(doc => doc.id === question.documentId);
  
  res.json({
    question: question,
    sourceDocument: document ? {
      id: document.id,
      fileName: document.fileName,
      uploadedAt: document.uploadedAt
    } : null
  });
});

// Update extracted question
router.put('/questions/:questionId', (req, res) => {
  const { questionId } = req.params;
  const updateData = req.body;
  
  const questionIndex = extractorData.extractedQuestions.findIndex(q => q.id === questionId);
  
  if (questionIndex === -1) {
    return res.status(404).json({ error: 'Question not found' });
  }
  
  // Update question
  extractorData.extractedQuestions[questionIndex] = {
    ...extractorData.extractedQuestions[questionIndex],
    ...updateData,
    updatedAt: new Date().toISOString()
  };
  
  res.json({ 
    success: true, 
    question: extractorData.extractedQuestions[questionIndex] 
  });
});

// Verify question
router.post('/questions/:questionId/verify', (req, res) => {
  const { questionId } = req.params;
  const { verified, verificationNotes, verifiedBy } = req.body;
  
  const questionIndex = extractorData.extractedQuestions.findIndex(q => q.id === questionId);
  
  if (questionIndex === -1) {
    return res.status(404).json({ error: 'Question not found' });
  }
  
  const question = extractorData.extractedQuestions[questionIndex];
  
  // Update verification status
  question.verified = verified;
  question.verificationNotes = verificationNotes || '';
  question.verifiedBy = verifiedBy;
  question.verifiedAt = new Date().toISOString();
  question.needsReview = !verified;
  
  res.json({ 
    success: true, 
    question: question,
    message: `Question ${verified ? 'verified' : 'marked for review'} successfully`
  });
});

// Bulk verify questions
router.post('/questions/bulk-verify', (req, res) => {
  const { questionIds, verified, verificationNotes, verifiedBy } = req.body;
  
  if (!Array.isArray(questionIds) || questionIds.length === 0) {
    return res.status(400).json({ error: 'Question IDs array is required' });
  }
  
  const updatedQuestions = [];
  
  questionIds.forEach(questionId => {
    const questionIndex = extractorData.extractedQuestions.findIndex(q => q.id === questionId);
    
    if (questionIndex >= 0) {
      const question = extractorData.extractedQuestions[questionIndex];
      
      question.verified = verified;
      question.verificationNotes = verificationNotes || '';
      question.verifiedBy = verifiedBy;
      question.verifiedAt = new Date().toISOString();
      question.needsReview = !verified;
      
      updatedQuestions.push(question);
    }
  });
  
  res.json({ 
    success: true, 
    updatedCount: updatedQuestions.length,
    message: `${updatedQuestions.length} questions ${verified ? 'verified' : 'marked for review'} successfully`
  });
});

// Delete extracted question
router.delete('/questions/:questionId', (req, res) => {
  const { questionId } = req.params;
  
  const questionIndex = extractorData.extractedQuestions.findIndex(q => q.id === questionId);
  
  if (questionIndex === -1) {
    return res.status(404).json({ error: 'Question not found' });
  }
  
  extractorData.extractedQuestions.splice(questionIndex, 1);
  
  res.json({ success: true, message: 'Question deleted successfully' });
});

// Export questions to question bank
router.post('/questions/export-to-bank', (req, res) => {
  const { questionIds, targetSubject, targetClass } = req.body;
  
  if (!Array.isArray(questionIds) || questionIds.length === 0) {
    return res.status(400).json({ error: 'Question IDs array is required' });
  }
  
  const questionsToExport = extractorData.extractedQuestions.filter(q => 
    questionIds.includes(q.id) && q.verified
  );
  
  if (questionsToExport.length === 0) {
    return res.status(400).json({ error: 'No verified questions found for export' });
  }
  
  // Convert to question bank format
  const exportedQuestions = questionsToExport.map(q => ({
    id: 'qb_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    subject: targetSubject || q.subject,
    class: targetClass || q.class,
    chapter: q.chapter,
    type: q.questionType,
    difficulty: q.difficulty,
    marks: q.marks,
    question: q.extractedQuestion,
    options: q.options,
    correctAnswer: q.correctAnswer,
    explanation: `Extracted from ${q.documentId}`,
    bloomsTaxonomy: q.bloomsTaxonomy,
    keywords: q.tags,
    source: 'extracted',
    extractionId: q.id,
    createdAt: new Date().toISOString()
  }));
  
  res.json({
    success: true,
    exportedCount: exportedQuestions.length,
    questions: exportedQuestions,
    message: `${exportedQuestions.length} questions exported to question bank successfully`
  });
});

// Get processing queue status
router.get('/processing-queue', (req, res) => {
  res.json(extractorData.processingQueue);
});

// Get extraction statistics
router.get('/statistics', (req, res) => {
  const { period = 'all' } = req.query;
  
  let stats = extractorData.statistics;
  
  // Add real-time calculations
  const totalQuestions = extractorData.extractedQuestions.length;
  const verifiedQuestions = extractorData.extractedQuestions.filter(q => q.verified).length;
  const needsReview = extractorData.extractedQuestions.filter(q => q.needsReview).length;
  
  const enhancedStats = {
    ...stats,
    currentStatus: {
      totalQuestions: totalQuestions,
      verifiedQuestions: verifiedQuestions,
      pendingVerification: totalQuestions - verifiedQuestions,
      needsReview: needsReview,
      verificationRate: totalQuestions > 0 ? ((verifiedQuestions / totalQuestions) * 100).toFixed(1) : 0
    },
    questionTypes: getQuestionTypeDistribution(),
    difficultyDistribution: getDifficultyDistribution(),
    confidenceDistribution: getConfidenceDistribution(),
    processingQueue: extractorData.processingQueue.length
  };
  
  res.json(enhancedStats);
});

// Get extraction settings
router.get('/settings', (req, res) => {
  res.json(extractorData.extractionSettings);
});

// Update extraction settings
router.put('/settings', (req, res) => {
  const updateData = req.body;
  
  extractorData.extractionSettings = {
    ...extractorData.extractionSettings,
    ...updateData,
    updatedAt: new Date().toISOString()
  };
  
  res.json({ 
    success: true, 
    settings: extractorData.extractionSettings,
    message: 'Extraction settings updated successfully'
  });
});

// Re-process document with different method
router.post('/documents/:documentId/reprocess', (req, res) => {
  const { documentId } = req.params;
  const { extractionMethod } = req.body;
  
  const document = extractorData.extractedDocuments.find(doc => doc.id === documentId);
  
  if (!document) {
    return res.status(404).json({ error: 'Document not found' });
  }
  
  // Update document for reprocessing
  document.processingStatus = 'queued';
  document.extractionMethod = extractionMethod || document.extractionMethod;
  document.processedPages = 0;
  document.questionsExtracted = 0;
  document.quality = null;
  document.confidence = null;
  
  // Remove old extracted questions
  extractorData.extractedQuestions = extractorData.extractedQuestions.filter(q => 
    q.documentId !== documentId
  );
  
  // Start reprocessing
  startDocumentProcessing(document);
  
  res.json({
    success: true,
    document: document,
    message: 'Document reprocessing started'
  });
});

// Helper Functions
function startDocumentProcessing(document) {
  // Simulate document processing
  setTimeout(() => {
    document.processingStatus = 'processing';
    document.totalPages = Math.floor(Math.random() * 50) + 10;
    
    // Add to processing queue
    const queueItem = {
      id: 'queue_' + Date.now(),
      documentId: document.id,
      status: 'processing',
      startedAt: new Date().toISOString(),
      estimatedCompletion: new Date(Date.now() + 120 * 60000).toISOString(), // 2 hours
      progress: 0,
      currentStep: 'ocr_processing',
      steps: [
        { name: 'file_upload', status: 'completed', duration: 5 },
        { name: 'format_validation', status: 'completed', duration: 2 },
        { name: 'ocr_processing', status: 'processing', duration: null },
        { name: 'text_extraction', status: 'pending', duration: null },
        { name: 'ai_analysis', status: 'pending', duration: null },
        { name: 'question_identification', status: 'pending', duration: null },
        { name: 'categorization', status: 'pending', duration: null },
        { name: 'quality_check', status: 'pending', duration: null }
      ]
    };
    
    extractorData.processingQueue.push(queueItem);
    
    // Simulate processing completion after some time
    setTimeout(() => {
      completeDocumentProcessing(document, queueItem);
    }, 5000);
    
  }, 1000);
}

function completeDocumentProcessing(document, queueItem) {
  // Update document status
  document.processingStatus = 'completed';
  document.processedPages = document.totalPages;
  document.questionsExtracted = Math.floor(Math.random() * 30) + 10;
  document.quality = ['high', 'medium', 'low'][Math.floor(Math.random() * 3)];
  document.confidence = Math.floor(Math.random() * 20) + 80;
  document.processingTime = Math.floor(Math.random() * 200) + 100;
  
  // Remove from processing queue
  const queueIndex = extractorData.processingQueue.findIndex(q => q.id === queueItem.id);
  if (queueIndex >= 0) {
    extractorData.processingQueue.splice(queueIndex, 1);
  }
  
  // Generate sample extracted questions
  generateSampleQuestions(document);
}

function generateSampleQuestions(document) {
  const questionTypes = ['mcq', 'fill_blank', 'short_answer', 'word_problem'];
  const difficulties = ['easy', 'medium', 'hard'];
  
  for (let i = 0; i < document.questionsExtracted; i++) {
    const question = {
      id: 'ext_q' + Date.now() + '_' + i,
      documentId: document.id,
      originalText: `Sample extracted text ${i + 1}`,
      extractedQuestion: `Sample question ${i + 1}`,
      questionType: questionTypes[Math.floor(Math.random() * questionTypes.length)],
      subject: document.subjects[0] || 'general',
      class: document.classes[0] || 'Class 1',
      chapter: 'Chapter ' + Math.floor(Math.random() * 10 + 1),
      difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
      marks: Math.floor(Math.random() * 3) + 1,
      options: null,
      correctAnswer: 'Sample answer',
      extractionConfidence: Math.floor(Math.random() * 20) + 80,
      pageNumber: Math.floor(Math.random() * document.totalPages) + 1,
      coordinates: { 
        x: Math.floor(Math.random() * 400) + 50, 
        y: Math.floor(Math.random() * 500) + 50, 
        width: Math.floor(Math.random() * 200) + 300, 
        height: Math.floor(Math.random() * 50) + 50 
      },
      aiProcessed: true,
      verified: false,
      verifiedBy: null,
      verificationNotes: '',
      tags: ['extracted', 'sample'],
      bloomsTaxonomy: ['knowledge', 'comprehension', 'application'][Math.floor(Math.random() * 3)],
      qualityScore: Math.floor(Math.random() * 20) + 80,
      needsReview: Math.random() > 0.7,
      extractedAt: new Date().toISOString()
    };
    
    extractorData.extractedQuestions.push(question);
  }
}

function getQuestionTypeDistribution() {
  const distribution = {};
  extractorData.extractedQuestions.forEach(q => {
    distribution[q.questionType] = (distribution[q.questionType] || 0) + 1;
  });
  return distribution;
}

function getDifficultyDistribution() {
  const distribution = {};
  extractorData.extractedQuestions.forEach(q => {
    distribution[q.difficulty] = (distribution[q.difficulty] || 0) + 1;
  });
  return distribution;
}

function getConfidenceDistribution() {
  const ranges = {
    'high (90-100%)': 0,
    'medium (75-89%)': 0,
    'low (60-74%)': 0,
    'very_low (<60%)': 0
  };
  
  extractorData.extractedQuestions.forEach(q => {
    if (q.extractionConfidence >= 90) {
      ranges['high (90-100%)']++;
    } else if (q.extractionConfidence >= 75) {
      ranges['medium (75-89%)']++;
    } else if (q.extractionConfidence >= 60) {
      ranges['low (60-74%)']++;
    } else {
      ranges['very_low (<60%)']++;
    }
  });
  
  return ranges;
}

module.exports = router;