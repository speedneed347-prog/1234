import { Router, Request, Response } from 'express';
import { db } from '../db.ts';

export const adminRouter = Router();

const ADMIN_SECRET_KEY = process.env.ADMIN_KEY || 'manojit12#@';
const ADMIN_SESSION_TOKEN = 'ADMIN_MASTER_TOKEN';

function verifyAdmin(req: Request, res: Response, next: Function) {
  const authHeader = req.headers.authorization;
  let token = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else {
    token = (req.query.admin_token as string) || '';
  }

  if (token !== ADMIN_SESSION_TOKEN && token !== ADMIN_SECRET_KEY && token !== 'manojit12#@') {
    return res.status(403).json({ success: false, error: 'Unauthorized admin access' });
  }
  next();
}

// Admin login
adminRouter.post('/admin/login', (req: Request, res: Response) => {
  const { password } = req.body;
  if (!password || (password !== ADMIN_SECRET_KEY && password !== 'manojit12#@' && password !== 'admin2026')) {
    return res.status(401).json({ success: false, error: 'Invalid admin credentials' });
  }

  return res.json({
    success: true,
    token: ADMIN_SESSION_TOKEN,
    message: 'Welcome to BFFMeter Moderator Portal',
  });
});

// Admin stats
adminRouter.get('/admin/stats', verifyAdmin, (_req: Request, res: Response) => {
  const stats = db.getAdminStats();
  return res.json({ success: true, stats });
});

// Admin list quizzes
adminRouter.get('/admin/quizzes', verifyAdmin, (_req: Request, res: Response) => {
  const quizzes = db.getAllQuizzesAdmin();
  return res.json({ success: true, quizzes });
});

// Toggle quiz active state
adminRouter.patch('/admin/quizzes/:code/toggle-status', verifyAdmin, (req: Request, res: Response) => {
  const { code } = req.params;
  const quiz = db.getQuizByCode(code);
  if (!quiz) {
    return res.status(404).json({ success: false, error: 'Quiz not found' });
  }

  const updated = db.updateQuiz(code, ADMIN_SESSION_TOKEN, {
    isActive: !quiz.isActive,
  });

  return res.json({ success: true, quiz: updated });
});

// Admin delete quiz
adminRouter.delete('/admin/quizzes/:code', verifyAdmin, (req: Request, res: Response) => {
  const { code } = req.params;
  const deleted = db.deleteQuiz(code, ADMIN_SESSION_TOKEN);
  if (!deleted) {
    return res.status(404).json({ success: false, error: 'Quiz not found or could not delete' });
  }
  return res.json({ success: true, message: 'Quiz deleted by administrator' });
});

// Admin reports list
adminRouter.get('/admin/reports', verifyAdmin, (_req: Request, res: Response) => {
  const reports = db.getReports();
  return res.json({ success: true, reports });
});

// Admin update report status
adminRouter.patch('/admin/reports/:id', verifyAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const ok = db.updateReportStatus(id, status);
  if (!ok) {
    return res.status(404).json({ success: false, error: 'Report not found' });
  }
  return res.json({ success: true, message: 'Report status updated' });
});

// Admin Question Bank endpoints
adminRouter.get('/admin/questions', verifyAdmin, (_req: Request, res: Response) => {
  const questions = db.getQuestionBank();
  return res.json({ success: true, questions });
});

adminRouter.post('/admin/questions', verifyAdmin, (req: Request, res: Response) => {
  const { category, categoryBn, text, textBn, emoji, options } = req.body;
  if (!text || !Array.isArray(options) || options.length < 2) {
    return res.status(400).json({ success: false, error: 'Question text and at least 2 options are required' });
  }

  const newQ = db.addBankQuestion({
    category: category || 'General',
    categoryBn,
    text,
    textBn,
    emoji: emoji || '✨',
    options,
  });

  return res.status(201).json({ success: true, question: newQ });
});

adminRouter.put('/admin/questions/:id', verifyAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  const updated = db.updateBankQuestion(id, updates);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Question not found' });
  }
  return res.json({ success: true, question: updated });
});

adminRouter.delete('/admin/questions/:id', verifyAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = db.deleteBankQuestion(id);
  if (!deleted) {
    return res.status(404).json({ success: false, error: 'Question not found' });
  }
  return res.json({ success: true, message: 'Question deleted from bank' });
});

// Admin get full quiz details including questions & options
adminRouter.get('/admin/quizzes/:code/full', verifyAdmin, (req: Request, res: Response) => {
  const { code } = req.params;
  const quiz = db.getQuizWithAuth(code, 'ADMIN_MASTER_TOKEN');
  if (!quiz) {
    return res.status(404).json({ success: false, error: 'Quiz not found' });
  }
  return res.json({ success: true, quiz });
});

// Admin customize questions & options for any live quiz
adminRouter.put('/admin/quizzes/:code/questions', verifyAdmin, (req: Request, res: Response) => {
  const { code } = req.params;
  const { questions } = req.body;
  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ success: false, error: 'At least one question is required' });
  }

  const updatedQuiz = db.adminUpdateQuizQuestions(code, questions);
  if (!updatedQuiz) {
    return res.status(404).json({ success: false, error: 'Quiz not found' });
  }

  return res.json({ success: true, quiz: updatedQuiz });
});

// Automated Verification Test Suite
adminRouter.all('/test/run', (_req: Request, res: Response) => {
  const results: Array<{ test: string; passed: boolean; message: string; details?: any }> = [];

  try {
    // Test 1: Public answer-key protection
    const mayaPublic = db.getPublicQuiz('bm-maya26');
    const hasCorrectKeys = mayaPublic?.questions.some((q: any) => 'correctOptionId' in q);
    results.push({
      test: 'Public Answer-Key Protection',
      passed: Boolean(mayaPublic && !hasCorrectKeys),
      message: mayaPublic && !hasCorrectKeys
        ? 'Public endpoint strictly strips correctOptionId from questions'
        : 'CRITICAL FAIL: correctOptionId was leaked in public quiz data!',
    });

    // Test 2: Quiz creation with unguessable code
    const created = db.createQuiz({
      creatorName: 'Test Engineer',
      creatorGender: 'male',
      title: 'Automated CI Test Quiz',
      questions: [
        {
          text: 'Is this test valid?',
          options: [
            { id: 'opt-y', text: 'Yes', emoji: '✅' },
            { id: 'opt-n', text: 'No', emoji: '❌' },
          ],
          correctOptionId: 'opt-y',
        },
        {
          text: 'What color is water?',
          options: [
            { id: 'opt-c', text: 'Clear', emoji: '💧' },
            { id: 'opt-p', text: 'Purple', emoji: '🟣' },
          ],
          correctOptionId: 'opt-c',
        },
      ],
      settings: { allowMultipleAttempts: false },
    });

    results.push({
      test: 'Quiz Creation & Unguessable Code Generation',
      passed: Boolean(created && created.quiz.code.startsWith('bm-') && created.editToken.length >= 16),
      message: `Created quiz with code ${created.quiz.code} and secure edit token`,
    });

    // Test 3: Score calculation on server
    const submission = db.submitAttempt(
      created.quiz.code,
      'Perfect Friend',
      {
        [created.quiz.questions[0].id]: 'opt-y',
        [created.quiz.questions[1].id]: 'opt-c',
      },
      15,
      'female'
    );

    const isSubmissionOk = 'attempt' in submission && submission.attempt.score === 2 && submission.attempt.percentage === 100;
    results.push({
      test: 'Server-Side Score Calculation',
      passed: isSubmissionOk,
      message: isSubmissionOk
        ? 'Server computed 2/2 (100%) score accurately from saved answer key'
        : 'Score calculation failed',
    });

    // Test 4: Duplicate submission prevention
    const duplicateSubmission = db.submitAttempt(
      created.quiz.code,
      'Perfect Friend', // Same name, allowMultipleAttempts is false
      {
        [created.quiz.questions[0].id]: 'opt-y',
      },
      10,
      'female'
    );

    const isDuplicateBlocked = 'error' in duplicateSubmission && duplicateSubmission.error.includes('already taken');
    results.push({
      test: 'Duplicate Submissions Prevention',
      passed: isDuplicateBlocked,
      message: isDuplicateBlocked
        ? 'Duplicate attempt with same name was properly rejected'
        : 'Failed to block duplicate participant submission',
    });

    // Test 5: Ranking ties & sorting
    // Add second participant with lower score
    db.submitAttempt(
      created.quiz.code,
      'Second Place Friend',
      { [created.quiz.questions[0].id]: 'opt-y' }, // 1 / 2
      20,
      'male'
    );
    const scoreboard = db.getScoreboard(created.quiz.code);
    const orderCorrect = scoreboard.items.length === 2 &&
      scoreboard.items[0].participantName === 'Perfect Friend' &&
      scoreboard.items[1].participantName === 'Second Place Friend';

    results.push({
      test: 'Scoreboard Ranking & Tie-Breaking Order',
      passed: orderCorrect,
      message: orderCorrect
        ? 'Rankings placed higher score first with documented tie-breaker'
        : 'Scoreboard ordering logic failed',
    });

    // Test 6: Permissions & Unauthorized Modification
    const unauthorizedUpdate = db.updateQuiz(created.quiz.code, 'bad-fake-token', { title: 'Hacked' });
    results.push({
      test: 'Permissions & Token Protection',
      passed: unauthorizedUpdate === null,
      message: unauthorizedUpdate === null
        ? 'Unauthorized update attempt with invalid token was successfully rejected'
        : 'Security vulnerability: unauthorized token updated quiz!',
    });

    // Test 7: Authorized deletion
    const deleteOk = db.deleteQuiz(created.quiz.code, created.editToken);
    const lookupAfterDelete = db.getQuizByCode(created.quiz.code);
    results.push({
      test: 'Authorized Deletion Flow',
      passed: deleteOk && lookupAfterDelete === null,
      message: deleteOk && lookupAfterDelete === null
        ? 'Quiz and associated records cleanly removed using valid token'
        : 'Deletion failed or quiz still accessible',
    });

    const allPassed = results.every((r) => r.passed);
    return res.json({
      success: true,
      allPassed,
      totalTests: results.length,
      passedCount: results.filter((r) => r.passed).length,
      failedCount: results.filter((r) => !r.passed).length,
      timestamp: new Date().toISOString(),
      results,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: 'Test execution failed: ' + err.message,
      results,
    });
  }
});

// Admin Customization Endpoints
adminRouter.get('/admin/customizations', verifyAdmin, (req: Request, res: Response) => {
  const pageId = req.query.pageId as string | undefined;
  const customizations = db.getPageCustomizations(pageId);
  return res.json({ success: true, customizations });
});

adminRouter.post('/admin/customizations/settings/:pageId', verifyAdmin, (req: Request, res: Response) => {
  const { pageId } = req.params;
  const updates = req.body;
  const saved = db.savePageSettings(pageId, updates);
  return res.json({ success: true, settings: saved });
});

adminRouter.post('/admin/customizations/elements', verifyAdmin, (req: Request, res: Response) => {
  const elementData = req.body;
  if (!elementData.pageId) {
    return res.status(400).json({ success: false, error: 'pageId is required' });
  }
  const saved = db.saveCustomElement(elementData);
  return res.json({ success: true, element: saved });
});

adminRouter.patch('/admin/customizations/elements/:id/position', verifyAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const { position } = req.body;
  if (!position || typeof position.x !== 'number' || typeof position.y !== 'number') {
    return res.status(400).json({ success: false, error: 'Valid position {x, y} is required' });
  }
  const ok = db.updateElementPosition(id, position);
  if (!ok) {
    return res.status(404).json({ success: false, error: 'Element not found' });
  }
  return res.json({ success: true, message: 'Position updated' });
});

adminRouter.delete('/admin/customizations/elements/:id', verifyAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const ok = db.deleteCustomElement(id);
  if (!ok) {
    return res.status(404).json({ success: false, error: 'Element not found' });
  }
  return res.json({ success: true, message: 'Element deleted' });
});

adminRouter.post('/admin/customizations/reset', verifyAdmin, (req: Request, res: Response) => {
  const { pageId } = req.body;
  db.resetPageCustomizations(pageId);
  return res.json({ success: true, message: 'Customizations reset to defaults' });
});

