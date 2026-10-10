export interface QuizOption {
  id: string;
  text: string;
  emoji?: string;
  imageUrl?: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
  correctOptionId: string; // Stored securely on server, NEVER sent in public quiz API
  explanation?: string;
}

export interface QuizSettings {
  allowMultipleAttempts: boolean;
  timeLimitSeconds?: number;
  showInstantFeedback?: boolean;
}

export interface QuizAttempt {
  id: string;
  quizCode: string;
  participantName: string;
  participantGender?: 'male' | 'female';
  score: number;
  maxScore: number;
  percentage: number;
  timeSpentSeconds: number;
  submittedAt: string;
  answers: Record<string, string>; // questionId -> selectedOptionId
}

export interface Quiz {
  code: string; // Unique public unguessable code, e.g. "bm-7k9x2p"
  editToken: string; // Secret creator token required to manage/edit/delete
  creatorName: string;
  creatorGender?: 'male' | 'female';
  title: string;
  description?: string;
  themeColor: string;
  coverEmoji: string;
  settings: QuizSettings;
  questions: QuizQuestion[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  viewsCount: number;
  attemptsCount: number;
}

export interface QuizReport {
  id: string;
  quizCode: string;
  quizTitle: string;
  reason: 'inappropriate' | 'spam' | 'harassment' | 'other';
  details: string;
  createdAt: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

// Sanitized public quiz without correctOptionId
export interface PublicQuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
  explanation?: string;
}

export interface PublicQuiz {
  code: string;
  creatorName: string;
  creatorGender?: 'male' | 'female';
  title: string;
  description?: string;
  themeColor: string;
  coverEmoji: string;
  settings: QuizSettings;
  questions: PublicQuizQuestion[];
  totalQuestions: number;
  attemptsCount: number;
  createdAt: string;
  isActive: boolean;
}

export interface CustomPageElement {
  id: string;
  pageId: string; // e.g. 'home' | 'quiz-landing' | 'quiz-play' | 'quiz-result' | 'quiz-scoreboard' | 'create' | 'dashboard' | 'contact' | 'privacy' | 'terms' | 'not-found' | 'global'
  type: 'text' | 'image' | 'gif' | 'banner' | 'mascot' | 'sticker' | 'button' | 'badge' | 'card';
  content: string; // text content, or URL for image/gif, or mascot/sticker id
  title?: string;
  linkUrl?: string;
  position: {
    x: number; // percentage (0 to 100) or px
    y: number; // percentage (0 to 100) or px
    unit?: '%' | 'px';
  };
  styles?: {
    color?: string;
    backgroundColor?: string;
    fontSize?: number;
    fontWeight?: string;
    borderRadius?: number;
    padding?: number;
    width?: number;
    height?: number;
    borderColor?: string;
    borderWidth?: number;
    rotation?: number;
    opacity?: number;
    zIndex?: number;
    boxShadow?: string;
  };
  visible: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PageSettings {
  pageId: string;
  titleOverride?: string;
  subtitleOverride?: string;
  heroHeadlineOverride?: string;
  heroSubheadlineOverride?: string;
  bannerNotice?: {
    enabled: boolean;
    text: string;
    bg?: string;
    textColor?: string;
    icon?: string;
  };
  backgroundColor?: string;
  customBackgroundUrl?: string;
  themeColor?: string;
  showMascots?: boolean;
  showDoodles?: boolean;
  hiddenSections?: string[];
}

export interface PageCustomizationStore {
  pageSettings: Record<string, PageSettings>;
  elements: CustomPageElement[];
}
