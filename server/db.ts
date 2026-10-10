import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {
  Quiz,
  PublicQuiz,
  QuizAttempt,
  QuizReport,
  ContactMessage,
  CustomPageElement,
  PageSettings,
  PageCustomizationStore,
} from './types.ts';
import { QUESTION_BANK, BankQuestion } from './questionBank.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'database.json');

interface DatabaseSchema {
  quizzes: Quiz[];
  attempts: QuizAttempt[];
  reports: QuizReport[];
  contactMessages: ContactMessage[];
  questionBank: BankQuestion[];
  pageCustomizations?: PageCustomizationStore;
}

function generateCode(): string {
  // Generates unguessable 6-8 char slug
  const chars = '23456789abcdefghjkmnpqrstuvwxyz';
  let str = 'bm-';
  for (let i = 0; i < 6; i++) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }
  return str;
}

function generateToken(): string {
  return crypto.randomBytes(16).toString('hex');
}

class Database {
  private data: DatabaseSchema = {
    quizzes: [],
    attempts: [],
    reports: [],
    contactMessages: [],
    questionBank: [],
  };

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        if (!this.data.questionBank || this.data.questionBank.length === 0) {
          this.data.questionBank = [...QUESTION_BANK];
          this.save();
        }
        if (!this.data.pageCustomizations) {
          this.data.pageCustomizations = this.getDefaultPageCustomizations();
          this.save();
        }
      } else {
        this.seedInitialData();
        this.save();
      }
    } catch (err) {
      console.warn('Failed to load DB file, seeding fresh in-memory data:', err);
      this.seedInitialData();
    }
  }

  private save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving database:', err);
    }
  }

  private seedInitialData() {
    this.data.questionBank = JSON.parse(JSON.stringify(QUESTION_BANK));

    const mayaQuestions = QUESTION_BANK.slice(0, 10).map((q, idx) => ({
      id: `q-${idx + 1}`,
      text: q.text,
      options: q.options.map((opt) => ({
        id: opt.id,
        text: opt.text,
        emoji: opt.emoji,
        imageUrl: opt.imageUrl,
      })),
      correctOptionId: q.options[idx % q.options.length].id,
      explanation: `Maya always chooses ${q.options[idx % q.options.length].text}!`,
    }));

    const mayaQuiz: Quiz = {
      code: 'bm-maya26',
      editToken: 'token-maya-secret-demo',
      creatorName: 'Maya Lin',
      title: "Maya's True Bestie Challenge",
      description: 'Think you know my secret quirks, snacks and routines? Take the test and claim your spot on my podium! 💖',
      themeColor: '#ec4899',
      coverEmoji: '💖',
      settings: {
        allowMultipleAttempts: false,
        timeLimitSeconds: 30,
        showInstantFeedback: false,
      },
      questions: mayaQuestions,
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      isActive: true,
      viewsCount: 142,
      attemptsCount: 6,
    };

    const leoQuestions = QUESTION_BANK.slice(2, 10).map((q, idx) => ({
      id: `lq-${idx + 1}`,
      text: q.text,
      options: q.options,
      correctOptionId: q.options[(idx + 1) % q.options.length].id,
    }));

    const leoQuiz: Quiz = {
      code: 'bm-leo99',
      editToken: 'token-leo-secret-demo',
      creatorName: 'Leo Vance',
      title: "Leo's Real Friends Quiz 🎮",
      description: 'Let us see who actually pays attention when we hang out. No cheating! 😂',
      themeColor: '#3b82f6',
      coverEmoji: '🎮',
      settings: {
        allowMultipleAttempts: true,
        showInstantFeedback: false,
      },
      questions: leoQuestions,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      isActive: true,
      viewsCount: 88,
      attemptsCount: 4,
    };

    const zoeQuestions = QUESTION_BANK.slice(4, 12).map((q, idx) => ({
      id: `zq-${idx + 1}`,
      text: q.text,
      options: q.options,
      correctOptionId: q.options[(idx + 2) % q.options.length].id,
    }));

    const zoeQuiz: Quiz = {
      code: 'bm-zoe01',
      editToken: 'token-zoe-secret-demo',
      creatorName: 'Zoe Brooks',
      title: "Zoe's Vibe Check & Friendship IQ ✨",
      description: 'Are we lifelong soulmates or just mutual Instagram story likers? Find out!',
      themeColor: '#8b5cf6',
      coverEmoji: '✨',
      settings: {
        allowMultipleAttempts: false,
        showInstantFeedback: false,
      },
      questions: zoeQuestions,
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      isActive: true,
      viewsCount: 65,
      attemptsCount: 3,
    };

    this.data.quizzes = [mayaQuiz, leoQuiz, zoeQuiz];

    // Seed realistic attempts for Maya's quiz
    this.data.attempts = [
      {
        id: 'att-maya-1',
        quizCode: 'bm-maya26',
        participantName: 'Sarah Jenkins',
        score: 10,
        maxScore: 10,
        percentage: 100,
        timeSpentSeconds: 42,
        submittedAt: new Date(Date.now() - 86400000 * 2.5).toISOString(),
        answers: mayaQuestions.reduce((acc, q) => ({ ...acc, [q.id]: q.correctOptionId }), {}),
      },
      {
        id: 'att-maya-2',
        quizCode: 'bm-maya26',
        participantName: 'Alex Thorne',
        score: 9,
        maxScore: 10,
        percentage: 90,
        timeSpentSeconds: 38,
        submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        answers: mayaQuestions.reduce((acc, q, idx) => ({
          ...acc,
          [q.id]: idx === 1 ? 'opt-other' : q.correctOptionId,
        }), {}),
      },
      {
        id: 'att-maya-3',
        quizCode: 'bm-maya26',
        participantName: 'Liam Carter',
        score: 8,
        maxScore: 10,
        percentage: 80,
        timeSpentSeconds: 55,
        submittedAt: new Date(Date.now() - 86400000 * 1.8).toISOString(),
        answers: {},
      },
      {
        id: 'att-maya-4',
        quizCode: 'bm-maya26',
        participantName: 'Jordan Rivera',
        score: 6,
        maxScore: 10,
        percentage: 60,
        timeSpentSeconds: 48,
        submittedAt: new Date(Date.now() - 86400000 * 1.2).toISOString(),
        answers: {},
      },
      {
        id: 'att-maya-5',
        quizCode: 'bm-maya26',
        participantName: 'Taylor Hayes',
        score: 4,
        maxScore: 10,
        percentage: 40,
        timeSpentSeconds: 62,
        submittedAt: new Date(Date.now() - 86400000 * 0.8).toISOString(),
        answers: {},
      },
      {
        id: 'att-maya-6',
        quizCode: 'bm-maya26',
        participantName: 'Sammy Chen',
        score: 2,
        maxScore: 10,
        percentage: 20,
        timeSpentSeconds: 31,
        submittedAt: new Date(Date.now() - 86400000 * 0.4).toISOString(),
        answers: {},
      },
      // Leo attempts
      {
        id: 'att-leo-1',
        quizCode: 'bm-leo99',
        participantName: 'Marcus Cole',
        score: 8,
        maxScore: 8,
        percentage: 100,
        timeSpentSeconds: 40,
        submittedAt: new Date(Date.now() - 86400000 * 1.5).toISOString(),
        answers: {},
      },
      {
        id: 'att-leo-2',
        quizCode: 'bm-leo99',
        participantName: 'Chloe Bennett',
        score: 7,
        maxScore: 8,
        percentage: 87.5,
        timeSpentSeconds: 45,
        submittedAt: new Date(Date.now() - 86400000 * 1.1).toISOString(),
        answers: {},
      },
      {
        id: 'att-leo-3',
        quizCode: 'bm-leo99',
        participantName: 'Lucas Grey',
        score: 5,
        maxScore: 8,
        percentage: 62.5,
        timeSpentSeconds: 52,
        submittedAt: new Date(Date.now() - 86400000 * 0.7).toISOString(),
        answers: {},
      },
    ];

    this.data.reports = [
      {
        id: 'rep-1',
        quizCode: 'bm-test-flag',
        quizTitle: 'Spam Quiz Sample',
        reason: 'spam',
        details: 'Self promotion link in question text',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        status: 'pending',
      },
    ];
  }

  // --- Quiz Methods ---

  public getQuizByCode(code: string): Quiz | null {
    const q = this.data.quizzes.find((quiz) => quiz.code.toLowerCase() === code.toLowerCase());
    return q || null;
  }

  /**
   * Returns public quiz data.
   * CRITICAL SECURITY INVARIANT:
   * NEVER include correctOptionId in this object.
   */
  public getPublicQuiz(code: string): PublicQuiz | null {
    const quiz = this.getQuizByCode(code);
    if (!quiz) return null;

    const publicQuestions = quiz.questions.map((q) => {
      let optionsToPresent = q.options;

      // When options are more than 2, pick creator's correct answer + 1 random distractor
      if (q.options.length > 2) {
        const correctOpt = q.options.find((opt) => opt.id === q.correctOptionId) || q.options[0];
        const distractors = q.options.filter((opt) => opt.id !== correctOpt.id);
        const randomDistractor =
          distractors.length > 0
            ? distractors[Math.floor(Math.random() * distractors.length)]
            : q.options[1] || q.options[0];

        const pair = [correctOpt, randomDistractor];
        if (Math.random() > 0.5) {
          pair.reverse();
        }
        optionsToPresent = pair;
      }

      return {
        id: q.id,
        text: q.text,
        options: optionsToPresent.map((opt) => ({
          id: opt.id,
          text: opt.text,
          emoji: opt.emoji,
          imageUrl: opt.imageUrl,
        })),
        explanation: q.explanation,
      };
    });

    return {
      code: quiz.code,
      creatorName: quiz.creatorName,
      creatorGender: quiz.creatorGender,
      title: quiz.title,
      description: quiz.description,
      themeColor: quiz.themeColor,
      coverEmoji: quiz.coverEmoji,
      settings: quiz.settings,
      questions: publicQuestions,
      totalQuestions: quiz.questions.length,
      attemptsCount: quiz.attemptsCount,
      createdAt: quiz.createdAt,
      isActive: quiz.isActive,
    };
  }

  public getQuizWithAuth(code: string, token: string): Quiz | null {
    const quiz = this.getQuizByCode(code);
    if (!quiz) return null;
    if (quiz.editToken !== token && token !== 'ADMIN_MASTER_TOKEN') return null;
    return quiz;
  }

  public createQuiz(payload: {
    creatorName: string;
    creatorGender?: 'male' | 'female';
    title: string;
    description?: string;
    themeColor?: string;
    coverEmoji?: string;
    settings?: Partial<Quiz['settings']>;
    questions: Array<{
      text: string;
      options: Array<{ id: string; text: string; emoji?: string; imageUrl?: string }>;
      correctOptionId: string;
      explanation?: string;
    }>;
  }): { quiz: Quiz; editToken: string } {
    let code = generateCode();
    while (this.getQuizByCode(code)) {
      code = generateCode();
    }

    const editToken = generateToken();
    const now = new Date().toISOString();

    const formattedQuestions = payload.questions.map((q, idx) => ({
      id: `q-${idx + 1}-${Date.now().toString(36)}`,
      text: q.text.trim(),
      options: q.options.map((opt, optIdx) => ({
        id: opt.id || `opt-${optIdx + 1}`,
        text: opt.text.trim(),
        emoji: opt.emoji || '✨',
        imageUrl: opt.imageUrl,
      })),
      correctOptionId: q.correctOptionId,
      explanation: q.explanation?.trim(),
    }));

    const newQuiz: Quiz = {
      code,
      editToken,
      creatorName: payload.creatorName.trim(),
      creatorGender: payload.creatorGender || 'female',
      title: payload.title.trim() || `${payload.creatorName.trim()}'s Friendship Quiz`,
      description: payload.description?.trim() || `How well do you know ${payload.creatorName.trim()}? Take the quiz!`,
      themeColor: payload.themeColor || '#ec4899',
      coverEmoji: payload.coverEmoji || '💖',
      settings: {
        allowMultipleAttempts: payload.settings?.allowMultipleAttempts ?? false,
        timeLimitSeconds: payload.settings?.timeLimitSeconds,
        showInstantFeedback: payload.settings?.showInstantFeedback ?? false,
      },
      questions: formattedQuestions,
      createdAt: now,
      updatedAt: now,
      isActive: true,
      viewsCount: 0,
      attemptsCount: 0,
    };

    this.data.quizzes.unshift(newQuiz);
    this.save();
    return { quiz: newQuiz, editToken };
  }

  public updateQuiz(
    code: string,
    editToken: string,
    updates: {
      creatorName?: string;
      title?: string;
      description?: string;
      themeColor?: string;
      coverEmoji?: string;
      settings?: Partial<Quiz['settings']>;
      questions?: Quiz['questions'];
      isActive?: boolean;
    }
  ): Quiz | null {
    const quiz = this.getQuizByCode(code);
    if (!quiz) return null;
    if (quiz.editToken !== editToken && editToken !== 'ADMIN_MASTER_TOKEN') {
      return null;
    }

    if (updates.creatorName !== undefined) quiz.creatorName = updates.creatorName.trim();
    if (updates.title !== undefined) quiz.title = updates.title.trim();
    if (updates.description !== undefined) quiz.description = updates.description.trim();
    if (updates.themeColor !== undefined) quiz.themeColor = updates.themeColor;
    if (updates.coverEmoji !== undefined) quiz.coverEmoji = updates.coverEmoji;
    if (updates.settings !== undefined) {
      quiz.settings = { ...quiz.settings, ...updates.settings };
    }
    if (updates.questions !== undefined && updates.questions.length > 0) {
      quiz.questions = updates.questions;
    }
    if (updates.isActive !== undefined) quiz.isActive = updates.isActive;

    quiz.updatedAt = new Date().toISOString();
    this.save();
    return quiz;
  }

  public deleteQuiz(code: string, token: string): boolean {
    const index = this.data.quizzes.findIndex((q) => q.code.toLowerCase() === code.toLowerCase());
    if (index === -1) return false;

    const quiz = this.data.quizzes[index];
    if (quiz.editToken !== token && token !== 'ADMIN_MASTER_TOKEN') {
      return false;
    }

    this.data.quizzes.splice(index, 1);
    // Also remove associated attempts
    this.data.attempts = this.data.attempts.filter((a) => a.quizCode.toLowerCase() !== code.toLowerCase());
    this.save();
    return true;
  }

  public recordView(code: string) {
    const quiz = this.getQuizByCode(code);
    if (quiz) {
      quiz.viewsCount = (quiz.viewsCount || 0) + 1;
      this.save();
    }
  }

  // --- Submission & Scoring ---

  public submitAttempt(
    code: string,
    participantName: string,
    submittedAnswers: Record<string, string>,
    timeSpentSeconds: number,
    participantGender?: 'male' | 'female'
  ): {
    attempt: QuizAttempt;
    questionReview: Array<{
      questionId: string;
      questionText: string;
      selectedOptionId: string;
      correctOptionId: string;
      isCorrect: boolean;
      options: Quiz['questions'][0]['options'];
      explanation?: string;
    }>;
  } | { error: string } {
    const quiz = this.getQuizByCode(code);
    if (!quiz) return { error: 'Quiz not found' };
    if (!quiz.isActive) return { error: 'This quiz is currently closed by the creator' };

    const trimmedName = participantName.trim();
    if (!trimmedName) return { error: 'Participant name is required' };

    // Check duplicate participant name if rule forbids multiple attempts
    if (!quiz.settings.allowMultipleAttempts) {
      const existing = this.data.attempts.find(
        (a) =>
          a.quizCode.toLowerCase() === code.toLowerCase() &&
          a.participantName.toLowerCase() === trimmedName.toLowerCase()
      );
      if (existing) {
        return { error: `"${trimmedName}" has already taken this quiz. The creator disabled retries.` };
      }
    }

    let score = 0;
    const maxScore = quiz.questions.length;
    const questionReview = quiz.questions.map((q) => {
      const selected = submittedAnswers[q.id] || '';
      const isCorrect = selected === q.correctOptionId;
      if (isCorrect) score += 1;

      return {
        questionId: q.id,
        questionText: q.text,
        selectedOptionId: selected,
        correctOptionId: q.correctOptionId,
        isCorrect,
        options: q.options,
        explanation: q.explanation,
      };
    });

    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

    const attempt: QuizAttempt = {
      id: `att-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      quizCode: quiz.code,
      participantName: trimmedName,
      participantGender: participantGender || 'male',
      score,
      maxScore,
      percentage,
      timeSpentSeconds: Math.max(1, Math.min(timeSpentSeconds || 30, 3600)),
      submittedAt: new Date().toISOString(),
      answers: submittedAnswers,
    };

    this.data.attempts.push(attempt);
    quiz.attemptsCount = (quiz.attemptsCount || 0) + 1;
    this.save();

    return { attempt, questionReview };
  }

  public getScoreboard(
    quizCode: string,
    options: { page?: number; limit?: number; search?: string } = {}
  ) {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const search = (options.search || '').toLowerCase().trim();

    let attempts = this.data.attempts.filter(
      (a) => a.quizCode.toLowerCase() === quizCode.toLowerCase()
    );

    if (search) {
      attempts = attempts.filter((a) => a.participantName.toLowerCase().includes(search));
    }

    // Tie-breaking rule:
    // 1. Highest score (descending)
    // 2. Fastest time spent (ascending)
    // 3. Earliest submission (ascending)
    attempts.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.timeSpentSeconds !== b.timeSpentSeconds) {
        return a.timeSpentSeconds - b.timeSpentSeconds;
      }
      return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
    });

    const total = attempts.length;
    const startIndex = (page - 1) * limit;
    const paginated = attempts.slice(startIndex, startIndex + limit).map((a, idx) => ({
      rank: startIndex + idx + 1,
      id: a.id,
      participantName: a.participantName,
      participantGender: a.participantGender || 'male',
      score: a.score,
      maxScore: a.maxScore,
      percentage: a.percentage,
      timeSpentSeconds: a.timeSpentSeconds,
      submittedAt: a.submittedAt,
    }));

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      items: paginated,
      tieBreakRule: 'Ranked by highest score, then fastest completion time, then earliest submission.',
    };
  }

  public getAttempt(quizCode: string, attemptId: string): QuizAttempt | null {
    const attempt = this.data.attempts.find(
      (a) => a.quizCode.toLowerCase() === quizCode.toLowerCase() && a.id === attemptId
    );
    return attempt || null;
  }

  public getQuizAnalytics(quizCode: string, token: string) {
    const quiz = this.getQuizWithAuth(quizCode, token);
    if (!quiz) return null;

    const attempts = this.data.attempts.filter(
      (a) => a.quizCode.toLowerCase() === quizCode.toLowerCase()
    );

    const totalAttempts = attempts.length;
    const avgScore =
      totalAttempts > 0
        ? Math.round(
            (attempts.reduce((sum, a) => sum + a.score, 0) /
              (totalAttempts * quiz.questions.length)) *
              100
          )
        : 0;

    // Breakdown per question
    const questionStats = quiz.questions.map((q) => {
      let correctCount = 0;
      let totalAnswered = 0;
      const optionCounts: Record<string, number> = {};

      for (const opt of q.options) {
        optionCounts[opt.id] = 0;
      }

      for (const att of attempts) {
        const chosen = att.answers[q.id];
        if (chosen) {
          totalAnswered++;
          optionCounts[chosen] = (optionCounts[chosen] || 0) + 1;
          if (chosen === q.correctOptionId) {
            correctCount++;
          }
        }
      }

      const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
      return {
        questionId: q.id,
        text: q.text,
        correctOptionId: q.correctOptionId,
        accuracy,
        totalAnswered,
        correctCount,
        optionCounts,
      };
    });

    return {
      quizTitle: quiz.title,
      creatorName: quiz.creatorName,
      code: quiz.code,
      totalAttempts,
      viewsCount: quiz.viewsCount,
      avgScorePercentage: avgScore,
      questionStats,
    };
  }

  // --- Reports & Moderation ---

  public createReport(quizCode: string, reason: QuizReport['reason'], details: string) {
    const quiz = this.getQuizByCode(quizCode);
    const report: QuizReport = {
      id: `rep-${Date.now().toString(36)}`,
      quizCode,
      quizTitle: quiz ? quiz.title : 'Unknown Quiz',
      reason,
      details: details.trim(),
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    this.data.reports.unshift(report);
    this.save();
    return report;
  }

  public getReports() {
    return this.data.reports;
  }

  public updateReportStatus(id: string, status: QuizReport['status']) {
    const rep = this.data.reports.find((r) => r.id === id);
    if (rep) {
      rep.status = status;
      this.save();
      return true;
    }
    return false;
  }

  public getAdminStats() {
    const totalQuizzes = this.data.quizzes.length;
    const activeQuizzes = this.data.quizzes.filter((q) => q.isActive).length;
    const totalAttempts = this.data.attempts.length;
    const pendingReports = this.data.reports.filter((r) => r.status === 'pending').length;

    return {
      totalQuizzes,
      activeQuizzes,
      totalAttempts,
      pendingReports,
      serverTime: new Date().toISOString(),
    };
  }

  public getAllQuizzesAdmin() {
    return this.data.quizzes.map((q) => ({
      code: q.code,
      creatorName: q.creatorName,
      title: q.title,
      isActive: q.isActive,
      questionsCount: q.questions.length,
      attemptsCount: q.attemptsCount,
      viewsCount: q.viewsCount,
      createdAt: q.createdAt,
    }));
  }

  public saveContactMessage(name: string, email: string, subject: string, message: string) {
    const msg: ContactMessage = {
      id: `msg-${Date.now().toString(36)}`,
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };
    this.data.contactMessages.unshift(msg);
    this.save();
    return msg;
  }

  public getRecentFeaturedQuizzes() {
    return this.data.quizzes
      .filter((q) => q.isActive)
      .slice(0, 4)
      .map((q) => ({
        code: q.code,
        creatorName: q.creatorName,
        title: q.title,
        description: q.description,
        coverEmoji: q.coverEmoji,
        themeColor: q.themeColor,
        attemptsCount: q.attemptsCount,
        totalQuestions: q.questions.length,
      }));
  }

  // --- Question Bank Management (Admin Customized) ---
  public getQuestionBank(): BankQuestion[] {
    if (!this.data.questionBank || this.data.questionBank.length === 0) {
      this.data.questionBank = JSON.parse(JSON.stringify(QUESTION_BANK));
      this.save();
    }
    return this.data.questionBank;
  }

  public addBankQuestion(payload: {
    category: string;
    categoryBn?: string;
    text: string;
    textBn?: string;
    emoji?: string;
    options: Array<{ id?: string; text: string; textBn?: string; emoji?: string; imageUrl?: string }>;
  }): BankQuestion {
    const id = `qb-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const newQ: BankQuestion = {
      id,
      category: payload.category.trim() || 'General & Friendship',
      categoryBn: payload.categoryBn?.trim(),
      text: payload.text.trim(),
      textBn: payload.textBn?.trim(),
      emoji: payload.emoji || '✨',
      options: payload.options.map((opt, idx) => ({
        id: opt.id || `opt-${idx + 1}-${Math.random().toString(36).substring(2, 6)}`,
        text: opt.text.trim(),
        textBn: opt.textBn?.trim(),
        emoji: opt.emoji || '🐾',
        imageUrl: opt.imageUrl,
      })),
    };

    if (!this.data.questionBank) this.data.questionBank = [];
    this.data.questionBank.unshift(newQ);
    this.save();
    return newQ;
  }

  public updateBankQuestion(id: string, updates: Partial<BankQuestion>): BankQuestion | null {
    if (!this.data.questionBank) return null;
    const idx = this.data.questionBank.findIndex((q) => q.id === id);
    if (idx === -1) return null;

    const current = this.data.questionBank[idx];
    const updated: BankQuestion = {
      ...current,
      ...updates,
      options: updates.options ? updates.options.map((opt, i) => ({
        id: opt.id || `opt-${i + 1}`,
        text: opt.text,
        textBn: opt.textBn,
        emoji: opt.emoji || '🐾',
        imageUrl: opt.imageUrl,
      })) : current.options,
    };

    this.data.questionBank[idx] = updated;
    this.save();
    return updated;
  }

  public deleteBankQuestion(id: string): boolean {
    if (!this.data.questionBank) return false;
    const initialLen = this.data.questionBank.length;
    this.data.questionBank = this.data.questionBank.filter((q) => q.id !== id);
    if (this.data.questionBank.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  public adminUpdateQuizQuestions(code: string, questions: any[]): Quiz | null {
    const quiz = this.getQuizByCode(code);
    if (!quiz) return null;

    quiz.questions = questions.map((q, idx) => ({
      id: q.id || `q-${idx + 1}-${Date.now().toString(36)}`,
      text: q.text.trim(),
      options: q.options.map((opt: any, optIdx: number) => ({
        id: opt.id || `opt-${optIdx + 1}`,
        text: opt.text.trim(),
        emoji: opt.emoji || '✨',
        imageUrl: opt.imageUrl,
      })),
      correctOptionId: q.correctOptionId,
      explanation: q.explanation?.trim(),
    }));

    quiz.updatedAt = new Date().toISOString();
    this.save();
    return quiz;
  }

  public getDefaultPageCustomizations(): PageCustomizationStore {
    return {
      pageSettings: {
        home: {
          pageId: 'home',
          titleOverride: '',
          subtitleOverride: '',
          heroHeadlineOverride: '',
          bannerNotice: {
            enabled: false,
            text: '✨ Welcome to BFFMeter! Challenge your friends and celebrate your true bond. 🐾',
            bg: '#FFF9D6',
            textColor: '#202B49',
            icon: '🎉',
          },
          showMascots: true,
          showDoodles: true,
        },
      },
      elements: [
        {
          id: 'elem-home-party-cat',
          pageId: 'home',
          type: 'gif',
          content: 'https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif',
          title: 'Dancing Cat',
          position: { x: 86, y: 14, unit: '%' },
          styles: {
            width: 100,
            height: 100,
            borderRadius: 20,
            borderColor: '#FFE779',
            borderWidth: 3,
            rotation: 5,
            zIndex: 40,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          },
          visible: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'elem-home-badge',
          pageId: 'home',
          type: 'badge',
          content: '💖 Besties Forever!',
          position: { x: 10, y: 20, unit: '%' },
          styles: {
            color: '#0798FF',
            backgroundColor: '#EFF6FF',
            fontSize: 14,
            fontWeight: 'bold',
            borderRadius: 16,
            padding: 8,
            borderColor: '#BAE6FD',
            borderWidth: 2,
            rotation: -4,
            zIndex: 40,
            boxShadow: '0 8px 16px rgba(7, 152, 255, 0.15)',
          },
          visible: true,
          createdAt: new Date().toISOString(),
        },
      ],
    };
  }

  public getPageCustomizations(pageId?: string): PageCustomizationStore {
    if (!this.data.pageCustomizations) {
      this.data.pageCustomizations = this.getDefaultPageCustomizations();
      this.save();
    }

    if (!pageId) {
      return this.data.pageCustomizations;
    }

    // Filter for pageId + global elements
    const filteredElements = (this.data.pageCustomizations.elements || []).filter(
      (el) => el.pageId === pageId || el.pageId === 'global'
    );

    return {
      pageSettings: {
        [pageId]: this.data.pageCustomizations.pageSettings[pageId] || {
          pageId,
          showMascots: true,
          showDoodles: true,
        },
      },
      elements: filteredElements,
    };
  }

  public savePageSettings(pageId: string, updates: Partial<PageSettings>): PageSettings {
    if (!this.data.pageCustomizations) {
      this.data.pageCustomizations = this.getDefaultPageCustomizations();
    }

    const current = this.data.pageCustomizations.pageSettings[pageId] || {
      pageId,
      showMascots: true,
      showDoodles: true,
    };

    const updated: PageSettings = {
      ...current,
      ...updates,
      pageId,
    };

    this.data.pageCustomizations.pageSettings[pageId] = updated;
    this.save();
    return updated;
  }

  public saveCustomElement(elementData: Partial<CustomPageElement> & { pageId: string }): CustomPageElement {
    if (!this.data.pageCustomizations) {
      this.data.pageCustomizations = this.getDefaultPageCustomizations();
    }

    const now = new Date().toISOString();
    let elem: CustomPageElement;

    if (elementData.id) {
      const idx = this.data.pageCustomizations.elements.findIndex((e) => e.id === elementData.id);
      if (idx !== -1) {
        const existing = this.data.pageCustomizations.elements[idx];
        elem = {
          ...existing,
          ...elementData,
          position: elementData.position ? { ...existing.position, ...elementData.position } : existing.position,
          styles: elementData.styles ? { ...existing.styles, ...elementData.styles } : existing.styles,
          updatedAt: now,
        };
        this.data.pageCustomizations.elements[idx] = elem;
        this.save();
        return elem;
      }
    }

    // Create new element
    const newId = `elem-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    elem = {
      id: newId,
      pageId: elementData.pageId,
      type: elementData.type || 'text',
      content: elementData.content || 'New Custom Element',
      title: elementData.title || '',
      linkUrl: elementData.linkUrl || '',
      position: elementData.position || { x: 50, y: 50, unit: '%' },
      styles: {
        fontSize: 16,
        padding: 10,
        borderRadius: 16,
        zIndex: 50,
        ...elementData.styles,
      },
      visible: elementData.visible !== false,
      createdAt: now,
      updatedAt: now,
    };

    this.data.pageCustomizations.elements.push(elem);
    this.save();
    return elem;
  }

  public updateElementPosition(
    id: string,
    position: { x: number; y: number; unit?: '%' | 'px' }
  ): boolean {
    if (!this.data.pageCustomizations) return false;
    const elem = this.data.pageCustomizations.elements.find((e) => e.id === id);
    if (!elem) return false;

    elem.position = {
      ...elem.position,
      ...position,
    };
    elem.updatedAt = new Date().toISOString();
    this.save();
    return true;
  }

  public deleteCustomElement(id: string): boolean {
    if (!this.data.pageCustomizations) return false;
    const initialLen = this.data.pageCustomizations.elements.length;
    this.data.pageCustomizations.elements = this.data.pageCustomizations.elements.filter(
      (e) => e.id !== id
    );
    if (this.data.pageCustomizations.elements.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  public resetPageCustomizations(pageId?: string): boolean {
    const defaults = this.getDefaultPageCustomizations();
    if (!pageId) {
      this.data.pageCustomizations = defaults;
      this.save();
      return true;
    }

    if (this.data.pageCustomizations) {
      // Remove elements for page
      this.data.pageCustomizations.elements = this.data.pageCustomizations.elements.filter(
        (e) => e.pageId !== pageId
      );
      // Restore default elements for this page if any
      const defaultPageElements = defaults.elements.filter((e) => e.pageId === pageId);
      this.data.pageCustomizations.elements.push(...defaultPageElements);

      // Reset settings
      if (defaults.pageSettings[pageId]) {
        this.data.pageCustomizations.pageSettings[pageId] = defaults.pageSettings[pageId];
      } else {
        delete this.data.pageCustomizations.pageSettings[pageId];
      }
      this.save();
      return true;
    }
    return false;
  }
}

export const db = new Database();
