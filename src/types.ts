export interface QuizOption {
  id: string;
  text: string;
  emoji?: string;
  imageUrl?: string;
}

export interface PublicQuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
  explanation?: string;
}

export interface QuizSettings {
  allowMultipleAttempts: boolean;
  timeLimitSeconds?: number;
  showInstantFeedback?: boolean;
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

export interface QuestionReviewItem {
  questionId: string;
  questionText: string;
  selectedOptionId: string;
  correctOptionId: string;
  isCorrect: boolean;
  options: QuizOption[];
  explanation?: string;
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
  answers: Record<string, string>;
}

export interface ScoreboardItem {
  rank: number;
  id: string;
  participantName: string;
  participantGender?: 'male' | 'female';
  score: number;
  maxScore: number;
  percentage: number;
  timeSpentSeconds: number;
  submittedAt: string;
}

export interface ScoreboardResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  items: ScoreboardItem[];
  tieBreakRule: string;
}

export interface BankQuestion {
  id: string;
  category: string;
  categoryBn?: string;
  text: string;
  textBn?: string;
  emoji: string;
  options: { id: string; text: string; textBn?: string; emoji?: string; imageUrl?: string }[];
}

export interface StoredQuizRecord {
  code: string;
  editToken: string;
  title: string;
  creatorName: string;
  createdAt: string;
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
  elementOverrides?: Record<
    string,
    {
      text?: string;
      src?: string;
      color?: string;
      backgroundColor?: string;
      fontSize?: number;
      hidden?: boolean;
      emoji?: string;
      borderRadius?: number;
      boxShadow?: string;
      padding?: number;
    }
  >;
}

export interface PageCustomizationStore {
  pageSettings: Record<string, PageSettings>;
  elements: CustomPageElement[];
}
