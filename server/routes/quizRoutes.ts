import { Router, Request, Response } from 'express';
import { db } from '../db.ts';
import { QUESTION_BANK } from '../questionBank.ts';

export const quizRouter = Router();

// Question bank endpoint (Admin customized)
quizRouter.get('/questions/bank', (_req: Request, res: Response) => {
  return res.json({ success: true, questions: db.getQuestionBank() });
});

// Featured quizzes for homepage
quizRouter.get('/quizzes/featured', (_req: Request, res: Response) => {
  const featured = db.getRecentFeaturedQuizzes();
  return res.json({ success: true, quizzes: featured });
});

// Public Page Customizations
quizRouter.get('/customizations', (req: Request, res: Response) => {
  const pageId = req.query.pageId as string | undefined;
  const customizations = db.getPageCustomizations(pageId);
  return res.json({ success: true, customizations });
});

quizRouter.get('/customizations/:pageId', (req: Request, res: Response) => {
  const { pageId } = req.params;
  const customizations = db.getPageCustomizations(pageId);
  return res.json({ success: true, customizations });
});

// Create Quiz
quizRouter.post('/quizzes', (req: Request, res: Response) => {
  try {
    const { creatorName, creatorGender, title, description, themeColor, coverEmoji, settings, questions } = req.body;

    if (!creatorName || typeof creatorName !== 'string' || !creatorName.trim()) {
      return res.status(400).json({ success: false, error: 'Creator name is required (at least 2 characters).' });
    }

    if (!creatorGender || (creatorGender !== 'male' && creatorGender !== 'female')) {
      return res.status(400).json({ success: false, error: 'Please select your gender (Boy / Girl) / নিজের জেন্ডার নির্বাচন করুন।' });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, error: 'At least one question is required.' });
    }

    // Validate each question
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text || typeof q.text !== 'string' || !q.text.trim()) {
        return res.status(400).json({ success: false, error: `Question #${i + 1} is missing text.` });
      }

      if (!Array.isArray(q.options) || q.options.length < 2) {
        return res.status(400).json({
          success: false,
          error: `Question #${i + 1} must have at least 2 answer options.`,
        });
      }

      for (let j = 0; j < q.options.length; j++) {
        const opt = q.options[j];
        if (!opt.text || typeof opt.text !== 'string' || !opt.text.trim()) {
          return res.status(400).json({
            success: false,
            error: `Option #${j + 1} in Question #${i + 1} cannot be blank.`,
          });
        }
      }

      if (!q.correctOptionId) {
        return res.status(400).json({
          success: false,
          error: `Please select your correct answer for Question #${i + 1}.`,
        });
      }

      const hasCorrect = q.options.some((opt: any) => opt.id === q.correctOptionId);
      if (!hasCorrect) {
        return res.status(400).json({
          success: false,
          error: `Selected correct answer in Question #${i + 1} does not match any valid option.`,
        });
      }
    }

    const result = db.createQuiz({
      creatorName,
      creatorGender,
      title,
      description,
      themeColor,
      coverEmoji,
      settings,
      questions,
    });

    return res.status(201).json({
      success: true,
      code: result.quiz.code,
      editToken: result.editToken,
      quiz: db.getPublicQuiz(result.quiz.code),
    });
  } catch (err: any) {
    console.error('Error creating quiz:', err);
    return res.status(500).json({ success: false, error: 'Internal server error creating quiz' });
  }
});

// Get Public Quiz (NEVER leaks correctOptionId)
quizRouter.get('/quizzes/:code', (req: Request, res: Response) => {
  const { code } = req.params;
  const publicQuiz = db.getPublicQuiz(code);

  if (!publicQuiz) {
    return res.status(404).json({ success: false, error: 'Quiz not found' });
  }

  db.recordView(code);
  return res.json({ success: true, quiz: publicQuiz });
});

// Helper to extract auth token
function getAuthToken(req: Request): string {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  return (req.query.token as string) || '';
}

// Get Full Quiz for Owner (with correct answers & attempts)
quizRouter.get('/quizzes/:code/admin', (req: Request, res: Response) => {
  const { code } = req.params;
  const token = getAuthToken(req);

  if (!token) {
    return res.status(401).json({ success: false, error: 'Missing creator authorization token' });
  }

  const quiz = db.getQuizWithAuth(code, token);
  if (!quiz) {
    return res.status(403).json({ success: false, error: 'Invalid token or unauthorized access' });
  }

  return res.json({ success: true, quiz });
});

// Get Quiz Analytics for Owner
quizRouter.get('/quizzes/:code/analytics', (req: Request, res: Response) => {
  const { code } = req.params;
  const token = getAuthToken(req);

  const analytics = db.getQuizAnalytics(code, token);
  if (!analytics) {
    return res.status(403).json({ success: false, error: 'Unauthorized or quiz not found' });
  }

  return res.json({ success: true, analytics });
});

// Update Quiz
quizRouter.put('/quizzes/:code', (req: Request, res: Response) => {
  const { code } = req.params;
  const token = getAuthToken(req);

  if (!token) {
    return res.status(401).json({ success: false, error: 'Missing creator authorization token' });
  }

  const updated = db.updateQuiz(code, token, req.body);
  if (!updated) {
    return res.status(403).json({ success: false, error: 'Unable to update quiz (invalid token or not found)' });
  }

  return res.json({ success: true, quiz: db.getPublicQuiz(code) });
});

// Delete Quiz
quizRouter.delete('/quizzes/:code', (req: Request, res: Response) => {
  const { code } = req.params;
  const token = getAuthToken(req);

  if (!token) {
    return res.status(401).json({ success: false, error: 'Missing creator authorization token' });
  }

  const deleted = db.deleteQuiz(code, token);
  if (!deleted) {
    return res.status(403).json({ success: false, error: 'Unable to delete quiz (invalid token or not found)' });
  }

  return res.json({ success: true, message: 'Quiz deleted successfully' });
});

// Submit Quiz Attempt (Server calculates score securely)
quizRouter.post('/quizzes/:code/submit', (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const { participantName, participantGender, answers, timeSpentSeconds } = req.body;

    if (!participantName || typeof participantName !== 'string' || !participantName.trim()) {
      return res.status(400).json({ success: false, error: 'Please enter your name to take the quiz.' });
    }

    if (!participantGender || (participantGender !== 'male' && participantGender !== 'female')) {
      return res.status(400).json({ success: false, error: 'Please select your gender (Boy / Girl) / কুইজে অংশ নিতে জেন্ডার সিলেক্ট করুন।' });
    }

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ success: false, error: 'Missing answers.' });
    }

    const result = db.submitAttempt(
      code,
      participantName,
      answers,
      Number(timeSpentSeconds) || 30,
      participantGender
    );

    if ('error' in result) {
      return res.status(400).json({ success: false, error: result.error });
    }

    return res.status(201).json({
      success: true,
      attempt: result.attempt,
      questionReview: result.questionReview,
    });
  } catch (err: any) {
    console.error('Submission error:', err);
    return res.status(500).json({ success: false, error: 'Server error processing your answers' });
  }
});

// Scoreboard / Leaderboard (Paginated with search)
quizRouter.get('/quizzes/:code/scoreboard', (req: Request, res: Response) => {
  const { code } = req.params;
  const quiz = db.getPublicQuiz(code);

  if (!quiz) {
    return res.status(404).json({ success: false, error: 'Quiz not found' });
  }

  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = Math.min(50, parseInt(req.query.limit as string, 10) || 10);
  const search = (req.query.search as string) || '';

  const scoreboard = db.getScoreboard(code, { page, limit, search });

  return res.json({
    success: true,
    quizTitle: quiz.title,
    creatorName: quiz.creatorName,
    coverEmoji: quiz.coverEmoji,
    scoreboard,
  });
});

// Get individual attempt result
quizRouter.get('/quizzes/:code/attempt/:attemptId', (req: Request, res: Response) => {
  const { code, attemptId } = req.params;
  const quiz = db.getQuizByCode(code);

  if (!quiz) {
    return res.status(404).json({ success: false, error: 'Quiz not found' });
  }

  const attempt = db.getAttempt(code, attemptId);
  if (!attempt) {
    return res.status(404).json({ success: false, error: 'Attempt result not found' });
  }

  // Build review with explanations
  const review = quiz.questions.map((q) => {
    const selected = attempt.answers[q.id];
    return {
      questionId: q.id,
      text: q.text,
      selectedOptionId: selected,
      correctOptionId: q.correctOptionId,
      isCorrect: selected === q.correctOptionId,
      options: q.options,
      explanation: q.explanation,
    };
  });

  return res.json({
    success: true,
    quiz: {
      code: quiz.code,
      title: quiz.title,
      creatorName: quiz.creatorName,
      coverEmoji: quiz.coverEmoji,
      themeColor: quiz.themeColor,
      totalQuestions: quiz.questions.length,
    },
    attempt,
    review,
  });
});

// Report Quiz
quizRouter.post('/quizzes/:code/report', (req: Request, res: Response) => {
  const { code } = req.params;
  const { reason, details } = req.body;

  if (!reason || !details) {
    return res.status(400).json({ success: false, error: 'Reason and details are required' });
  }

  const report = db.createReport(code, reason, details);
  return res.json({ success: true, message: 'Thank you for your report. Our moderators will review it shortly.', reportId: report.id });
});

// Contact form
quizRouter.post('/contact', (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Name, email, and message are required' });
  }

  const saved = db.saveContactMessage(name, email, subject || 'General Feedback', message);
  return res.json({ success: true, message: 'Your message has been received! We will reply promptly.', id: saved.id });
});
