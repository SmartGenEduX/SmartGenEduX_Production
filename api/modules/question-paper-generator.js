// Question Paper Generator Module - Complete Implementation
const express = require('express');
const router = express.Router();

const questionPaperData = {
  subjects: [
    {
      id: 'mathematics',
      name: 'Mathematics',
      classes: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'],
      chapters: [
        { id: 'ch1', name: 'Numbers and Counting', class: 'Class 1', weightage: 25 },
        { id: 'ch2', name: 'Addition and Subtraction', class: 'Class 1', weightage: 30 },
        { id: 'ch3', name: 'Shapes and Patterns', class: 'Class 1', weightage: 20 },
        { id: 'ch4', name: 'Measurement', class: 'Class 1', weightage: 25 },
        { id: 'ch5', name: 'Multiplication Tables', class: 'Class 2', weightage: 35 },
        { id: 'ch6', name: 'Division Basics', class: 'Class 2', weightage: 30 },
        { id: 'ch7', name: 'Fractions Introduction', class: 'Class 2', weightage: 35 }
      ]
    },
    {
      id: 'english',
      name: 'English',
      classes: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'],
      chapters: [
        { id: 'en1', name: 'Reading Comprehension', class: 'Class 1', weightage: 40 },
        { id: 'en2', name: 'Grammar Basics', class: 'Class 1', weightage: 35 },
        { id: 'en3', name: 'Creative Writing', class: 'Class 1', weightage: 25 },
        { id: 'en4', name: 'Poetry and Rhymes', class: 'Class 2', weightage: 30 },
        { id: 'en5', name: 'Story Writing', class: 'Class 2', weightage: 40 },
        { id: 'en6', name: 'Vocabulary Building', class: 'Class 2', weightage: 30 }
      ]
    },
    {
      id: 'science',
      name: 'Science',
      classes: ['Class 3', 'Class 4', 'Class 5'],
      chapters: [
        { id: 'sc1', name: 'Plants and Animals', class: 'Class 3', weightage: 30 },
        { id: 'sc2', name: 'Our Environment', class: 'Class 3', weightage: 25 },
        { id: 'sc3', name: 'Matter and Materials', class: 'Class 3', weightage: 25 },
        { id: 'sc4', name: 'Force and Energy', class: 'Class 3', weightage: 20 }
      ]
    }
  ],

  questionBank: [
    // Mathematics Questions
    {
      id: 'q001',
      subject: 'mathematics',
      chapter: 'ch1',
      class: 'Class 1',
      type: 'mcq',
      difficulty: 'easy',
      marks: 1,
      question: 'What comes after the number 5?',
      options: ['4', '6', '7', '8'],
      correctAnswer: '6',
      explanation: 'Numbers follow a sequence: 1, 2, 3, 4, 5, 6, 7...',
      bloomsTaxonomy: 'knowledge',
      keywords: ['counting', 'sequence', 'numbers'],
      timeRequired: 1 // minutes
    },
    {
      id: 'q002',
      subject: 'mathematics',
      chapter: 'ch1',
      class: 'Class 1',
      type: 'fill_blank',
      difficulty: 'easy',
      marks: 1,
      question: 'Count the apples: 🍎🍎🍎🍎. There are _____ apples.',
      correctAnswer: '4',
      explanation: 'Count each apple: 1, 2, 3, 4',
      bloomsTaxonomy: 'application',
      keywords: ['counting', 'objects'],
      timeRequired: 2
    },
    {
      id: 'q003',
      subject: 'mathematics',
      chapter: 'ch2',
      class: 'Class 1',
      type: 'short_answer',
      difficulty: 'medium',
      marks: 2,
      question: 'Add these numbers: 3 + 4 = ?',
      correctAnswer: '7',
      explanation: 'Start with 3, then count 4 more: 4, 5, 6, 7',
      bloomsTaxonomy: 'application',
      keywords: ['addition', 'counting'],
      timeRequired: 3
    },
    {
      id: 'q004',
      subject: 'mathematics',
      chapter: 'ch2',
      class: 'Class 1',
      type: 'long_answer',
      difficulty: 'hard',
      marks: 5,
      question: 'Solve this word problem: Ram has 8 marbles. He gives 3 marbles to his friend. How many marbles does Ram have now? Show your working.',
      correctAnswer: '5 marbles',
      explanation: 'Ram starts with 8 marbles. He gives away 3 marbles. 8 - 3 = 5 marbles remaining.',
      bloomsTaxonomy: 'analysis',
      keywords: ['subtraction', 'word problem', 'real life'],
      timeRequired: 5
    },

    // English Questions
    {
      id: 'q005',
      subject: 'english',
      chapter: 'en1',
      class: 'Class 1',
      type: 'mcq',
      difficulty: 'easy',
      marks: 1,
      question: 'Which letter comes after "B"?',
      options: ['A', 'C', 'D', 'E'],
      correctAnswer: 'C',
      explanation: 'The alphabet sequence is A, B, C, D, E...',
      bloomsTaxonomy: 'knowledge',
      keywords: ['alphabet', 'sequence'],
      timeRequired: 1
    },
    {
      id: 'q006',
      subject: 'english',
      chapter: 'en2',
      class: 'Class 1',
      type: 'fill_blank',
      difficulty: 'medium',
      marks: 2,
      question: 'Complete the sentence: The cat _____ on the mat.',
      correctAnswer: 'sits',
      explanation: 'The sentence describes what the cat is doing - sitting on the mat.',
      bloomsTaxonomy: 'comprehension',
      keywords: ['grammar', 'verbs', 'sentence'],
      timeRequired: 2
    },

    // Science Questions
    {
      id: 'q007',
      subject: 'science',
      chapter: 'sc1',
      class: 'Class 3',
      type: 'mcq',
      difficulty: 'medium',
      marks: 2,
      question: 'Which of these is NOT a living thing?',
      options: ['Tree', 'Dog', 'Rock', 'Flower'],
      correctAnswer: 'Rock',
      explanation: 'Living things grow, breathe, and reproduce. A rock does not have these characteristics.',
      bloomsTaxonomy: 'analysis',
      keywords: ['living', 'non-living', 'characteristics'],
      timeRequired: 3
    }
  ],

  paperTemplates: [
    {
      id: 'template_001',
      name: 'Standard Primary Template',
      description: 'Standard template for primary classes (1-5)',
      classes: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'],
      duration: 120, // minutes
      totalMarks: 50,
      structure: [
        {
          section: 'A',
          title: 'Multiple Choice Questions',
          type: 'mcq',
          questionCount: 10,
          marksPerQuestion: 1,
          totalMarks: 10,
          instruction: 'Choose the correct answer from the given options.'
        },
        {
          section: 'B',
          title: 'Fill in the Blanks',
          type: 'fill_blank',
          questionCount: 10,
          marksPerQuestion: 1,
          totalMarks: 10,
          instruction: 'Fill in the blanks with appropriate words.'
        },
        {
          section: 'C',
          title: 'Short Answer Questions',
          type: 'short_answer',
          questionCount: 10,
          marksPerQuestion: 2,
          totalMarks: 20,
          instruction: 'Answer in 2-3 sentences.'
        },
        {
          section: 'D',
          title: 'Long Answer Questions',
          type: 'long_answer',
          questionCount: 2,
          marksPerQuestion: 5,
          totalMarks: 10,
          instruction: 'Answer in detail with examples.'
        }
      ],
      difficultyDistribution: {
        easy: 40,
        medium: 45,
        hard: 15
      }
    },
    {
      id: 'template_002',
      name: 'Unit Test Template',
      description: 'Template for unit tests and quick assessments',
      classes: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'],
      duration: 60,
      totalMarks: 25,
      structure: [
        {
          section: 'A',
          title: 'Objective Questions',
          type: 'mcq',
          questionCount: 15,
          marksPerQuestion: 1,
          totalMarks: 15,
          instruction: 'Choose the correct answer.'
        },
        {
          section: 'B',
          title: 'Short Questions',
          type: 'short_answer',
          questionCount: 5,
          marksPerQuestion: 2,
          totalMarks: 10,
          instruction: 'Answer briefly.'
        }
      ],
      difficultyDistribution: {
        easy: 50,
        medium: 40,
        hard: 10
      }
    }
  ],

  generatedPapers: [
    {
      id: 'paper_001',
      title: 'Mathematics - Class 1 - Unit Test',
      subject: 'mathematics',
      class: 'Class 1',
      template: 'template_002',
      examDate: '2024-12-30',
      duration: 60,
      totalMarks: 25,
      generatedBy: 'teacher_001',
      generatedAt: '2024-12-28T10:30:00Z',
      status: 'draft',
      questions: ['q001', 'q002', 'q003'],
      instructions: [
        'Read all questions carefully before attempting.',
        'Write clearly and legibly.',
        'Manage your time properly.',
        'Review your answers before submitting.'
      ],
      syllabus: ['Numbers and Counting', 'Addition and Subtraction']
    }
  ],

  examSettings: {
    schoolName: 'Delhi Public School',
    schoolAddress: 'Green Park, New Delhi - 110016',
    academicYear: '2024-25',
    logoUrl: '/assets/SmartGenEduX_Logo_1751034755324.png',
    defaultDuration: {
      'Class 1': 60,
      'Class 2': 90,
      'Class 3': 120,
      'Class 4': 150,
      'Class 5': 180
    },
    passingMarks: {
      percentage: 40,
      grade: 'D'
    },
    gradingScale: [
      { grade: 'A+', minPercentage: 95, maxPercentage: 100 },
      { grade: 'A', minPercentage: 85, maxPercentage: 94 },
      { grade: 'B+', minPercentage: 75, maxPercentage: 84 },
      { grade: 'B', minPercentage: 65, maxPercentage: 74 },
      { grade: 'C+', minPercentage: 55, maxPercentage: 64 },
      { grade: 'C', minPercentage: 45, maxPercentage: 54 },
      { grade: 'D', minPercentage: 40, maxPercentage: 44 },
      { grade: 'F', minPercentage: 0, maxPercentage: 39 }
    ]
  }
};

// Get all subjects
router.get('/subjects', (req, res) => {
  const { class: className } = req.query;
  
  let subjects = questionPaperData.subjects;
  
  if (className) {
    subjects = subjects.filter(subject => 
      subject.classes.includes(className)
    );
  }
  
  res.json(subjects);
});

// Get chapters for a subject
router.get('/subjects/:subjectId/chapters', (req, res) => {
  const { subjectId } = req.params;
  const { class: className } = req.query;
  
  const subject = questionPaperData.subjects.find(s => s.id === subjectId);
  
  if (!subject) {
    return res.status(404).json({ error: 'Subject not found' });
  }
  
  let chapters = subject.chapters;
  
  if (className) {
    chapters = chapters.filter(chapter => chapter.class === className);
  }
  
  res.json(chapters);
});

// Get question bank
router.get('/questions', (req, res) => {
  const { 
    subject, 
    class: className, 
    chapter, 
    type, 
    difficulty, 
    limit = 50 
  } = req.query;
  
  let questions = questionPaperData.questionBank;
  
  // Apply filters
  if (subject) {
    questions = questions.filter(q => q.subject === subject);
  }
  
  if (className) {
    questions = questions.filter(q => q.class === className);
  }
  
  if (chapter) {
    questions = questions.filter(q => q.chapter === chapter);
  }
  
  if (type) {
    questions = questions.filter(q => q.type === type);
  }
  
  if (difficulty) {
    questions = questions.filter(q => q.difficulty === difficulty);
  }
  
  // Limit results
  questions = questions.slice(0, parseInt(limit));
  
  res.json(questions);
});

// Add new question to bank
router.post('/questions', (req, res) => {
  const questionData = req.body;
  
  // Validate required fields
  const requiredFields = ['subject', 'chapter', 'class', 'type', 'difficulty', 'marks', 'question'];
  for (const field of requiredFields) {
    if (!questionData[field]) {
      return res.status(400).json({ error: `${field} is required` });
    }
  }
  
  // Create new question
  const newQuestion = {
    id: 'q' + Date.now(),
    ...questionData,
    createdAt: new Date().toISOString(),
    createdBy: questionData.createdBy || 'system'
  };
  
  questionPaperData.questionBank.push(newQuestion);
  
  res.json({ 
    success: true, 
    question: newQuestion,
    message: 'Question added to bank successfully'
  });
});

// Update question in bank
router.put('/questions/:questionId', (req, res) => {
  const { questionId } = req.params;
  const updateData = req.body;
  
  const questionIndex = questionPaperData.questionBank.findIndex(q => q.id === questionId);
  
  if (questionIndex === -1) {
    return res.status(404).json({ error: 'Question not found' });
  }
  
  // Update question
  questionPaperData.questionBank[questionIndex] = {
    ...questionPaperData.questionBank[questionIndex],
    ...updateData,
    updatedAt: new Date().toISOString()
  };
  
  res.json({ 
    success: true, 
    question: questionPaperData.questionBank[questionIndex] 
  });
});

// Delete question from bank
router.delete('/questions/:questionId', (req, res) => {
  const { questionId } = req.params;
  
  const questionIndex = questionPaperData.questionBank.findIndex(q => q.id === questionId);
  
  if (questionIndex === -1) {
    return res.status(404).json({ error: 'Question not found' });
  }
  
  questionPaperData.questionBank.splice(questionIndex, 1);
  
  res.json({ success: true, message: 'Question deleted successfully' });
});

// Get paper templates
router.get('/templates', (req, res) => {
  const { class: className } = req.query;
  
  let templates = questionPaperData.paperTemplates;
  
  if (className) {
    templates = templates.filter(template => 
      template.classes.includes(className)
    );
  }
  
  res.json(templates);
});

// Generate question paper
router.post('/generate', (req, res) => {
  const {
    title,
    subject,
    class: className,
    templateId,
    chapters,
    customInstructions,
    examDate,
    duration,
    generatedBy
  } = req.body;
  
  // Validate required fields
  if (!title || !subject || !className || !templateId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // Get template
  const template = questionPaperData.paperTemplates.find(t => t.id === templateId);
  if (!template) {
    return res.status(404).json({ error: 'Template not found' });
  }
  
  // Generate questions for each section
  const selectedQuestions = [];
  const paperStructure = [];
  
  for (const section of template.structure) {
    const sectionQuestions = selectQuestionsForSection(
      subject,
      className,
      chapters,
      section.type,
      section.questionCount,
      template.difficultyDistribution
    );
    
    selectedQuestions.push(...sectionQuestions);
    
    paperStructure.push({
      ...section,
      questions: sectionQuestions
    });
  }
  
  // Create new paper
  const newPaper = {
    id: 'paper_' + Date.now(),
    title,
    subject,
    class: className,
    template: templateId,
    examDate: examDate || null,
    duration: duration || template.duration,
    totalMarks: template.totalMarks,
    generatedBy: generatedBy || 'system',
    generatedAt: new Date().toISOString(),
    status: 'draft',
    questions: selectedQuestions.map(q => q.id),
    structure: paperStructure,
    instructions: customInstructions || [
      'Read all questions carefully before attempting.',
      'Write clearly and legibly.',
      'Manage your time properly.',
      'Review your answers before submitting.'
    ],
    syllabus: chapters || []
  };
  
  questionPaperData.generatedPapers.push(newPaper);
  
  res.json({ 
    success: true, 
    paper: newPaper,
    message: 'Question paper generated successfully'
  });
});

// Get generated papers
router.get('/papers', (req, res) => {
  const { subject, class: className, status, generatedBy } = req.query;
  
  let papers = questionPaperData.generatedPapers;
  
  // Apply filters
  if (subject) {
    papers = papers.filter(p => p.subject === subject);
  }
  
  if (className) {
    papers = papers.filter(p => p.class === className);
  }
  
  if (status) {
    papers = papers.filter(p => p.status === status);
  }
  
  if (generatedBy) {
    papers = papers.filter(p => p.generatedBy === generatedBy);
  }
  
  // Sort by generation date (newest first)
  papers.sort((a, b) => new Date(b.generatedAt) - new Date(a.generatedAt));
  
  res.json(papers);
});

// Get paper by ID
router.get('/papers/:paperId', (req, res) => {
  const { paperId } = req.params;
  
  const paper = questionPaperData.generatedPapers.find(p => p.id === paperId);
  
  if (!paper) {
    return res.status(404).json({ error: 'Paper not found' });
  }
  
  // Get full question details
  const fullQuestions = paper.questions.map(questionId => 
    questionPaperData.questionBank.find(q => q.id === questionId)
  ).filter(q => q !== undefined);
  
  res.json({
    ...paper,
    fullQuestions: fullQuestions
  });
});

// Update paper
router.put('/papers/:paperId', (req, res) => {
  const { paperId } = req.params;
  const updateData = req.body;
  
  const paperIndex = questionPaperData.generatedPapers.findIndex(p => p.id === paperId);
  
  if (paperIndex === -1) {
    return res.status(404).json({ error: 'Paper not found' });
  }
  
  // Update paper
  questionPaperData.generatedPapers[paperIndex] = {
    ...questionPaperData.generatedPapers[paperIndex],
    ...updateData,
    updatedAt: new Date().toISOString()
  };
  
  res.json({ 
    success: true, 
    paper: questionPaperData.generatedPapers[paperIndex] 
  });
});

// Finalize paper
router.post('/papers/:paperId/finalize', (req, res) => {
  const { paperId } = req.params;
  
  const paperIndex = questionPaperData.generatedPapers.findIndex(p => p.id === paperId);
  
  if (paperIndex === -1) {
    return res.status(404).json({ error: 'Paper not found' });
  }
  
  const paper = questionPaperData.generatedPapers[paperIndex];
  
  // Update status to finalized
  paper.status = 'finalized';
  paper.finalizedAt = new Date().toISOString();
  
  res.json({ 
    success: true, 
    paper: paper,
    message: 'Paper finalized successfully'
  });
});

// Export paper to different formats
router.get('/papers/:paperId/export', (req, res) => {
  const { paperId } = req.params;
  const { format = 'html' } = req.query;
  
  const paper = questionPaperData.generatedPapers.find(p => p.id === paperId);
  
  if (!paper) {
    return res.status(404).json({ error: 'Paper not found' });
  }
  
  // Get full question details
  const fullQuestions = paper.questions.map(questionId => 
    questionPaperData.questionBank.find(q => q.id === questionId)
  ).filter(q => q !== undefined);
  
  if (format === 'html') {
    const html = generatePaperHTML(paper, fullQuestions);
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } else if (format === 'json') {
    res.json({
      paper: paper,
      questions: fullQuestions
    });
  } else {
    res.status(400).json({ error: 'Unsupported format' });
  }
});

// Generate answer key
router.get('/papers/:paperId/answer-key', (req, res) => {
  const { paperId } = req.params;
  
  const paper = questionPaperData.generatedPapers.find(p => p.id === paperId);
  
  if (!paper) {
    return res.status(404).json({ error: 'Paper not found' });
  }
  
  // Get questions with answers
  const questionsWithAnswers = paper.questions.map(questionId => {
    const question = questionPaperData.questionBank.find(q => q.id === questionId);
    if (!question) return null;
    
    return {
      id: question.id,
      question: question.question,
      type: question.type,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      marks: question.marks,
      options: question.options || null
    };
  }).filter(q => q !== null);
  
  res.json({
    paper: {
      id: paper.id,
      title: paper.title,
      subject: paper.subject,
      class: paper.class,
      totalMarks: paper.totalMarks
    },
    answerKey: questionsWithAnswers
  });
});

// Get statistics
router.get('/statistics', (req, res) => {
  const stats = {
    totalQuestions: questionPaperData.questionBank.length,
    questionsBySubject: getQuestionsBySubject(),
    questionsByDifficulty: getQuestionsByDifficulty(),
    questionsByType: getQuestionsByType(),
    papersGenerated: questionPaperData.generatedPapers.length,
    papersFinalized: questionPaperData.generatedPapers.filter(p => p.status === 'finalized').length,
    averageQuestionsPerPaper: calculateAverageQuestionsPerPaper(),
    mostUsedTemplate: getMostUsedTemplate()
  };
  
  res.json(stats);
});

// Helper Functions
function selectQuestionsForSection(subject, className, chapters, questionType, count, difficultyDistribution) {
  // Get available questions
  let availableQuestions = questionPaperData.questionBank.filter(q => 
    q.subject === subject && 
    q.class === className && 
    q.type === questionType &&
    (!chapters || chapters.length === 0 || chapters.includes(q.chapter))
  );
  
  if (availableQuestions.length < count) {
    // If not enough questions, return what's available
    return availableQuestions.slice(0, count);
  }
  
  // Select questions based on difficulty distribution
  const easyCount = Math.floor((count * difficultyDistribution.easy) / 100);
  const mediumCount = Math.floor((count * difficultyDistribution.medium) / 100);
  const hardCount = count - easyCount - mediumCount;
  
  const selectedQuestions = [];
  
  // Select easy questions
  const easyQuestions = availableQuestions.filter(q => q.difficulty === 'easy');
  selectedQuestions.push(...selectRandomQuestions(easyQuestions, easyCount));
  
  // Select medium questions
  const mediumQuestions = availableQuestions.filter(q => q.difficulty === 'medium');
  selectedQuestions.push(...selectRandomQuestions(mediumQuestions, mediumCount));
  
  // Select hard questions
  const hardQuestions = availableQuestions.filter(q => q.difficulty === 'hard');
  selectedQuestions.push(...selectRandomQuestions(hardQuestions, hardCount));
  
  // If we don't have enough questions of specific difficulty, fill with any available
  const remaining = count - selectedQuestions.length;
  if (remaining > 0) {
    const usedIds = selectedQuestions.map(q => q.id);
    const remainingQuestions = availableQuestions.filter(q => !usedIds.includes(q.id));
    selectedQuestions.push(...selectRandomQuestions(remainingQuestions, remaining));
  }
  
  return selectedQuestions;
}

function selectRandomQuestions(questions, count) {
  if (questions.length <= count) return questions;
  
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generatePaperHTML(paper, questions) {
  const settings = questionPaperData.examSettings;
  
  let html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${paper.title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .school-name { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
          .school-address { font-size: 14px; color: #666; margin-bottom: 10px; }
          .paper-title { font-size: 20px; font-weight: bold; margin: 15px 0; }
          .paper-info { font-size: 14px; margin: 10px 0; }
          .instructions { margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 5px; }
          .section { margin: 30px 0; }
          .section-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; padding: 10px; background: #e8e8e8; }
          .question { margin: 20px 0; }
          .question-number { font-weight: bold; }
          .options { margin: 10px 0 0 20px; }
          .option { margin: 5px 0; }
          .answer-space { border-bottom: 1px solid #ccc; margin: 10px 0; height: 20px; }
          .marks { float: right; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="school-name">${settings.schoolName}</div>
          <div class="school-address">${settings.schoolAddress}</div>
          <div class="paper-title">${paper.title}</div>
          <div class="paper-info">
            <strong>Class:</strong> ${paper.class} | 
            <strong>Subject:</strong> ${paper.subject} | 
            <strong>Duration:</strong> ${paper.duration} minutes | 
            <strong>Total Marks:</strong> ${paper.totalMarks}
          </div>
          <div class="paper-info">
            <strong>Date:</strong> ${paper.examDate || '_____________'} | 
            <strong>Name:</strong> _________________ | 
            <strong>Roll No:</strong> _______
          </div>
        </div>
        
        <div class="instructions">
          <strong>Instructions:</strong>
          <ul>
            ${paper.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
          </ul>
        </div>
  `;
  
  // Group questions by section if structure is available
  if (paper.structure && paper.structure.length > 0) {
    paper.structure.forEach(section => {
      html += `
        <div class="section">
          <div class="section-title">
            Section ${section.section}: ${section.title} (${section.totalMarks} marks)
          </div>
          <p><em>${section.instruction}</em></p>
      `;
      
      section.questions.forEach((question, index) => {
        html += generateQuestionHTML(question, index + 1, section.marksPerQuestion);
      });
      
      html += '</div>';
    });
  } else {
    // Simple list of questions
    html += '<div class="section">';
    questions.forEach((question, index) => {
      html += generateQuestionHTML(question, index + 1, question.marks);
    });
    html += '</div>';
  }
  
  html += `
        <div style="margin-top: 50px; text-align: center; font-size: 12px; color: #666;">
          <p>Generated by SmartGenEduX Question Paper Generator</p>
          <p>Academic Year: ${settings.academicYear}</p>
        </div>
      </body>
    </html>
  `;
  
  return html;
}

function generateQuestionHTML(question, questionNumber, marks) {
  let html = `
    <div class="question">
      <div>
        <span class="question-number">Q${questionNumber}.</span> ${question.question}
        <span class="marks">[${marks} mark${marks > 1 ? 's' : ''}]</span>
      </div>
  `;
  
  if (question.type === 'mcq' && question.options) {
    html += '<div class="options">';
    question.options.forEach((option, index) => {
      const label = String.fromCharCode(97 + index); // a, b, c, d
      html += `<div class="option">(${label}) ${option}</div>`;
    });
    html += '</div>';
  } else if (question.type === 'fill_blank') {
    // Add answer spaces for fill in the blanks
    const blankCount = (question.question.match(/_+/g) || []).length;
    if (blankCount === 0) {
      html += '<div class="answer-space"></div>';
    }
  } else if (question.type === 'short_answer') {
    html += '<div class="answer-space"></div><div class="answer-space"></div><div class="answer-space"></div>';
  } else if (question.type === 'long_answer') {
    for (let i = 0; i < 8; i++) {
      html += '<div class="answer-space"></div>';
    }
  }
  
  html += '</div>';
  return html;
}

function getQuestionsBySubject() {
  const breakdown = {};
  questionPaperData.questionBank.forEach(q => {
    breakdown[q.subject] = (breakdown[q.subject] || 0) + 1;
  });
  return breakdown;
}

function getQuestionsByDifficulty() {
  const breakdown = {};
  questionPaperData.questionBank.forEach(q => {
    breakdown[q.difficulty] = (breakdown[q.difficulty] || 0) + 1;
  });
  return breakdown;
}

function getQuestionsByType() {
  const breakdown = {};
  questionPaperData.questionBank.forEach(q => {
    breakdown[q.type] = (breakdown[q.type] || 0) + 1;
  });
  return breakdown;
}

function calculateAverageQuestionsPerPaper() {
  if (questionPaperData.generatedPapers.length === 0) return 0;
  
  const totalQuestions = questionPaperData.generatedPapers.reduce((sum, paper) => 
    sum + paper.questions.length, 0
  );
  
  return (totalQuestions / questionPaperData.generatedPapers.length).toFixed(1);
}

function getMostUsedTemplate() {
  const templateUsage = {};
  questionPaperData.generatedPapers.forEach(paper => {
    templateUsage[paper.template] = (templateUsage[paper.template] || 0) + 1;
  });
  
  const mostUsed = Object.entries(templateUsage).reduce((max, current) => 
    current[1] > max[1] ? current : max, ['', 0]
  );
  
  const template = questionPaperData.paperTemplates.find(t => t.id === mostUsed[0]);
  return template ? template.name : 'None';
}

module.exports = router;