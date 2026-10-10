import {
  PublicQuiz,
  ScoreboardResponse,
  QuizAttempt,
  QuestionReviewItem,
  BankQuestion,
  CustomPageElement,
  PageSettings,
  PageCustomizationStore,
} from '../types.ts';

const API_BASE = '/api';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number = 400) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, { ...options, headers });
  const data = await response.json();

  if (!response.ok || data.success === false) {
    throw new ApiError(data.error || 'Network request failed', response.status);
  }

  return data as T;
}

export const api = {
  // Questions Bank
  getQuestionBank: async (): Promise<{ success: boolean; questions: BankQuestion[] }> => {
    return request('/questions/bank');
  },

  // Featured quizzes
  getFeaturedQuizzes: async (): Promise<{ success: boolean; quizzes: any[] }> => {
    return request('/quizzes/featured');
  },

  // Create Quiz
  createQuiz: async (payload: {
    creatorName: string;
    creatorGender?: 'male' | 'female';
    title: string;
    description?: string;
    themeColor?: string;
    coverEmoji?: string;
    settings?: any;
    questions: Array<{
      text: string;
      options: Array<{ id: string; text: string; emoji?: string }>;
      correctOptionId: string;
      explanation?: string;
    }>;
  }): Promise<{ success: boolean; code: string; editToken: string; quiz: PublicQuiz }> => {
    return request('/quizzes', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Get Public Quiz
  getPublicQuiz: async (code: string): Promise<{ success: boolean; quiz: PublicQuiz }> => {
    return request(`/quizzes/${code}`);
  },

  // Get Full Quiz with Token
  getQuizAdmin: async (code: string, token: string): Promise<{ success: boolean; quiz: any }> => {
    return request(`/quizzes/${code}/admin`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Get Quiz Analytics
  getQuizAnalytics: async (code: string, token: string): Promise<{ success: boolean; analytics: any }> => {
    return request(`/quizzes/${code}/analytics`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Update Quiz
  updateQuiz: async (
    code: string,
    token: string,
    updates: any
  ): Promise<{ success: boolean; quiz: PublicQuiz }> => {
    return request(`/quizzes/${code}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(updates),
    });
  },

  // Delete Quiz
  deleteQuiz: async (code: string, token: string): Promise<{ success: boolean; message: string }> => {
    return request(`/quizzes/${code}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Submit Attempt
  submitAttempt: async (
    code: string,
    payload: {
      participantName: string;
      participantGender?: 'male' | 'female';
      answers: Record<string, string>;
      timeSpentSeconds: number;
    }
  ): Promise<{
    success: boolean;
    attempt: QuizAttempt;
    questionReview: QuestionReviewItem[];
  }> => {
    return request(`/quizzes/${code}/submit`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Scoreboard
  getScoreboard: async (
    code: string,
    params: { page?: number; limit?: number; search?: string } = {}
  ): Promise<{
    success: boolean;
    quizTitle: string;
    creatorName: string;
    coverEmoji: string;
    scoreboard: ScoreboardResponse;
  }> => {
    const query = new URLSearchParams();
    if (params.page) query.set('page', params.page.toString());
    if (params.limit) query.set('limit', params.limit.toString());
    if (params.search) query.set('search', params.search);
    return request(`/quizzes/${code}/scoreboard?${query.toString()}`);
  },

  // Get Attempt Result
  getAttempt: async (
    code: string,
    attemptId: string
  ): Promise<{
    success: boolean;
    quiz: {
      code: string;
      title: string;
      creatorName: string;
      coverEmoji: string;
      themeColor: string;
      totalQuestions: number;
    };
    attempt: QuizAttempt;
    review: QuestionReviewItem[];
  }> => {
    return request(`/quizzes/${code}/attempt/${attemptId}`);
  },

  // Report Quiz
  reportQuiz: async (
    code: string,
    reason: string,
    details: string
  ): Promise<{ success: boolean; message: string }> => {
    return request(`/quizzes/${code}/report`, {
      method: 'POST',
      body: JSON.stringify({ reason, details }),
    });
  },

  // Contact Form
  submitContact: async (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<{ success: boolean; message: string }> => {
    return request('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Photo upload
  uploadPhoto: async (dataUrl: string, filename?: string): Promise<{ success: boolean; url: string }> => {
    return request('/upload', {
      method: 'POST',
      body: JSON.stringify({ dataUrl, filename }),
    });
  },

  // Admin APIs
  adminLogin: async (password: string): Promise<{ success: boolean; token: string }> => {
    return request('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
  },

  adminGetStats: async (token: string): Promise<{ success: boolean; stats: any }> => {
    return request('/admin/stats', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  adminGetQuizzes: async (token: string): Promise<{ success: boolean; quizzes: any[] }> => {
    return request('/admin/quizzes', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  adminToggleStatus: async (code: string, token: string): Promise<{ success: boolean; quiz: any }> => {
    return request(`/admin/quizzes/${code}/toggle-status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  adminDeleteQuiz: async (code: string, token: string): Promise<{ success: boolean }> => {
    return request(`/admin/quizzes/${code}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  adminGetReports: async (token: string): Promise<{ success: boolean; reports: any[] }> => {
    return request('/admin/reports', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  adminUpdateReport: async (
    id: string,
    status: string,
    token: string
  ): Promise<{ success: boolean }> => {
    return request(`/admin/reports/${id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
  },

  // Admin Question Bank Management
  adminGetBankQuestions: async (token: string): Promise<{ success: boolean; questions: BankQuestion[] }> => {
    return request('/admin/questions', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  adminAddBankQuestion: async (
    token: string,
    payload: {
      category: string;
      categoryBn?: string;
      text: string;
      textBn?: string;
      emoji?: string;
      options: Array<{ id?: string; text: string; textBn?: string; emoji?: string; imageUrl?: string }>;
    }
  ): Promise<{ success: boolean; question: BankQuestion }> => {
    return request('/admin/questions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
  },

  adminUpdateBankQuestion: async (
    token: string,
    id: string,
    updates: Partial<BankQuestion>
  ): Promise<{ success: boolean; question: BankQuestion }> => {
    return request(`/admin/questions/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(updates),
    });
  },

  adminDeleteBankQuestion: async (token: string, id: string): Promise<{ success: boolean }> => {
    return request(`/admin/questions/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  adminGetQuizFull: async (token: string, code: string): Promise<{ success: boolean; quiz: any }> => {
    return request(`/admin/quizzes/${code}/full`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  adminUpdateQuizQuestions: async (
    token: string,
    code: string,
    questions: any[]
  ): Promise<{ success: boolean; quiz: any }> => {
    return request(`/admin/quizzes/${code}/questions`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ questions }),
    });
  },

  runServerTests: async (): Promise<{
    success: boolean;
    allPassed: boolean;
    totalTests: number;
    passedCount: number;
    failedCount: number;
    results: any[];
  }> => {
    return request('/test/run', { method: 'POST' });
  },

  // Public Customizations
  getCustomizations: async (
    pageId?: string
  ): Promise<{ success: boolean; customizations: PageCustomizationStore }> => {
    const q = pageId ? `?pageId=${encodeURIComponent(pageId)}` : '';
    return request(`/customizations${q}`);
  },

  // Admin Customizations
  adminGetCustomizations: async (
    token: string,
    pageId?: string
  ): Promise<{ success: boolean; customizations: PageCustomizationStore }> => {
    const q = pageId ? `?pageId=${encodeURIComponent(pageId)}` : '';
    return request(`/admin/customizations${q}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  adminSavePageSettings: async (
    token: string,
    pageId: string,
    settings: Partial<PageSettings>
  ): Promise<{ success: boolean; settings: PageSettings }> => {
    return request(`/admin/customizations/settings/${pageId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(settings),
    });
  },

  adminSaveCustomElement: async (
    token: string,
    elementData: Partial<CustomPageElement> & { pageId: string }
  ): Promise<{ success: boolean; element: CustomPageElement }> => {
    return request('/admin/customizations/elements', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(elementData),
    });
  },

  adminUpdateElementPosition: async (
    token: string,
    id: string,
    position: { x: number; y: number; unit?: '%' | 'px' }
  ): Promise<{ success: boolean }> => {
    return request(`/admin/customizations/elements/${id}/position`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ position }),
    });
  },

  adminDeleteCustomElement: async (
    token: string,
    id: string
  ): Promise<{ success: boolean }> => {
    return request(`/admin/customizations/elements/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  adminResetCustomizations: async (
    token: string,
    pageId?: string
  ): Promise<{ success: boolean }> => {
    return request('/admin/customizations/reset', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ pageId }),
    });
  },
};
