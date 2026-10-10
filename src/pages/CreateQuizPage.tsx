import React, { useState, useEffect } from 'react';
import { api } from '../api/client.ts';
import { useStoredQuizzes } from '../hooks/useStoredQuizzes.ts';
import { BankQuestion } from '../types.ts';
import { ShareModal } from '../components/ShareModal.tsx';
import { OptionPhotoModal } from '../components/OptionPhotoModal.tsx';
import { useTranslation } from '../i18n/LanguageContext.tsx';
import {
  GenderSelectorWithCats,
  BoyCatSticker,
  GirlCatSticker,
  CatActivityCompanion,
} from '../components/CatMascots.tsx';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Share2,
  Trophy,
  ExternalLink,
  Camera,
  Image as ImageIcon,
} from 'lucide-react';

interface CreateQuizPageProps {
  onNavigate: (path: string) => void;
}

interface QuestionDraft {
  id: string;
  text: string;
  options: Array<{ id: string; text: string; emoji: string; imageUrl?: string }>;
  correctOptionId: string;
  explanation?: string;
}

const EMOJI_PRESETS = ['💖', '✨', '🎮', '🍕', '🏖️', '☕', '🚀', '🌟', '🌮', '🍿'];
const THEME_COLORS = ['#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6', '#10b981', '#f43f5e'];

export const CreateQuizPage: React.FC<CreateQuizPageProps> = ({ onNavigate }) => {
  const { t, lang } = useTranslation();
  const { saveQuiz } = useStoredQuizzes();

  // Wizard Step: 1 = Creator info, 2 = Questions, 3 = Preview & Verify, 4 = Published
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Photo modal state
  const [photoModalState, setPhotoModalState] = useState<{
    isOpen: boolean;
    questionIdx: number;
    optionIdx: number;
    currentImageUrl?: string;
    optionText: string;
  }>({
    isOpen: false,
    questionIdx: 0,
    optionIdx: 0,
    currentImageUrl: '',
    optionText: '',
  });

  // Form State
  const [creatorGender, setCreatorGender] = useState<'male' | 'female' | undefined>(undefined);
  const [genderError, setGenderError] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverEmoji, setCoverEmoji] = useState('💖');
  const [themeColor, setThemeColor] = useState('#f59e0b');
  const [allowMultipleAttempts, setAllowMultipleAttempts] = useState(false);
  const [timeLimitSeconds, setTimeLimitSeconds] = useState<number | undefined>(undefined);

  // Questions State
  const [questions, setQuestions] = useState<QuestionDraft[]>([]);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);

  // Question Bank Drawer
  const [bankQuestions, setBankQuestions] = useState<BankQuestion[]>([]);
  const [isBankOpen, setIsBankOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Submission State
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState('');
  const [publishedData, setPublishedData] = useState<{
    code: string;
    editToken: string;
    title: string;
  } | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Load Question Bank on mount
  useEffect(() => {
    api
      .getQuestionBank()
      .then((res) => {
        if (res.questions && res.questions.length > 0) {
          setBankQuestions(res.questions);

          // Seed initial 10 questions from the bank as draft
          const initial = res.questions.slice(0, 10).map((bq, idx) => ({
            id: `draft-${idx + 1}`,
            text: (lang === 'bn' && bq.textBn) ? bq.textBn : bq.text,
            options: bq.options.map((opt) => ({
              id: opt.id,
              text: (lang === 'bn' && opt.textBn) ? opt.textBn : opt.text,
              emoji: opt.emoji || '✨',
              imageUrl: opt.imageUrl,
            })),
            correctOptionId: bq.options[0].id,
            explanation: '',
          }));
          setQuestions(initial);
        }
      })
      .catch((err) => console.warn('Failed to load bank:', err));
  }, [lang]);

  // Sync title when creator name changes
  const handleNameChange = (val: string) => {
    setCreatorName(val);
    if (!title || title.includes("'s Friendship Quiz")) {
      setTitle(val ? `${val}'s Friendship Quiz` : '');
    }
  };

  // Add empty question
  const handleAddQuestion = () => {
    if (questions.length >= 20) return;
    const newQ: QuestionDraft = {
      id: `draft-${Date.now().toString(36)}`,
      text: '',
      options: [
        { id: 'opt-1', text: '', emoji: '✨' },
        { id: 'opt-2', text: '', emoji: '🌟' },
        { id: 'opt-3', text: '', emoji: '🍕' },
        { id: 'opt-4', text: '', emoji: '☕' },
      ],
      correctOptionId: 'opt-1',
      explanation: '',
    };
    setQuestions([...questions, newQ]);
    setActiveQuestionIdx(questions.length);
  };

  // Add more options to current question (up to 8)
  const handleAddOption = (qIdx: number) => {
    const current = questions[qIdx];
    if (!current || current.options.length >= 8) return;
    const newOptId = `opt-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`;
    const emojis = ['🎉', '🍕', '🐱', '✨', '🔥', '💖', '🍿', '🎧'];
    const updated = [...questions];
    updated[qIdx].options.push({
      id: newOptId,
      text: '',
      emoji: emojis[updated[qIdx].options.length % emojis.length],
    });
    setQuestions(updated);
  };

  // Remove option from current question
  const handleRemoveOption = (qIdx: number, oIdx: number) => {
    const current = questions[qIdx];
    if (!current || current.options.length <= 2) return;
    const removedOpt = current.options[oIdx];
    const updated = [...questions];
    updated[qIdx].options = updated[qIdx].options.filter((_, i) => i !== oIdx);
    if (current.correctOptionId === removedOpt.id) {
      updated[qIdx].correctOptionId = updated[qIdx].options[0].id;
    }
    setQuestions(updated);
  };

  // Apply rich preset option packs
  const handleApplyOptionPack = (qIdx: number, packOptions: Array<{ text: string; emoji: string; imageUrl?: string }>) => {
    const current = questions[qIdx];
    if (!current) return;
    const updated = [...questions];
    updated[qIdx].options = packOptions.map((po, idx) => ({
      id: `opt-${idx + 1}-${Date.now().toString(36)}`,
      text: po.text,
      emoji: po.emoji,
      imageUrl: po.imageUrl,
    }));
    updated[qIdx].correctOptionId = updated[qIdx].options[0].id;
    setQuestions(updated);
  };

  // Remove question
  const handleRemoveQuestion = (idx: number) => {
    if (questions.length <= 3) {
      alert('Your quiz must have at least 3 questions.');
      return;
    }
    const updated = questions.filter((_, i) => i !== idx);
    setQuestions(updated);
    if (activeQuestionIdx >= updated.length) {
      setActiveQuestionIdx(updated.length - 1);
    }
  };

  // Insert from bank
  const handleApplyBankQuestion = (bq: BankQuestion) => {
    const currentQ = questions[activeQuestionIdx];
    if (!currentQ) return;

    const updated = [...questions];
    updated[activeQuestionIdx] = {
      ...currentQ,
      text: (lang === 'bn' && bq.textBn) ? bq.textBn : bq.text,
      options: bq.options.map((opt) => ({
        id: opt.id,
        text: (lang === 'bn' && opt.textBn) ? opt.textBn : opt.text,
        emoji: opt.emoji || '✨',
        imageUrl: opt.imageUrl,
      })),
      correctOptionId: bq.options[0].id,
    };
    setQuestions(updated);
    setIsBankOpen(false);
  };

  // Validation
  const validateForm = (): string[] => {
    const errors: string[] = [];
    if (!creatorGender) {
      errors.push('কুইজ তৈরি করার আগে আপনার জেন্ডার (ছেলে অথবা মেয়ে বিড়াল) অবশ্যই নির্বাচন করতে হবে!');
    }
    if (!creatorName.trim()) {
      errors.push('Your name is required.');
    }
    if (questions.length < 3) {
      errors.push('Please include at least 3 questions in your quiz.');
    }
    questions.forEach((q, idx) => {
      if (!q.text.trim()) {
        errors.push(`Question #${idx + 1} has no question text.`);
      }
      q.options.forEach((opt, oIdx) => {
        if (!opt.text.trim()) {
          errors.push(`Question #${idx + 1}, Option #${oIdx + 1} is empty.`);
        }
      });
      if (!q.correctOptionId) {
        errors.push(`Question #${idx + 1} does not have a designated correct answer.`);
      }
    });
    return errors;
  };

  const validationErrors = validateForm();

  // Publish
  const handlePublish = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      setPublishError(errors[0]);
      return;
    }

    setPublishError('');
    setIsPublishing(true);

    try {
      const response = await api.createQuiz({
        creatorName: creatorName.trim(),
        creatorGender,
        title: title.trim() || `${creatorName.trim()}'s Friendship Quiz`,
        description: description.trim(),
        coverEmoji,
        themeColor,
        settings: {
          allowMultipleAttempts,
          timeLimitSeconds: timeLimitSeconds || undefined,
        },
        questions: questions.map((q) => ({
          text: q.text,
          options: q.options,
          correctOptionId: q.correctOptionId,
          explanation: q.explanation,
        })),
      });

      if (response.success) {
        saveQuiz({
          code: response.code,
          editToken: response.editToken,
          title: response.quiz.title,
          creatorName: response.quiz.creatorName,
          createdAt: new Date().toISOString(),
        });

        setPublishedData({
          code: response.code,
          editToken: response.editToken,
          title: response.quiz.title,
        });

        setStep(4);
      }
    } catch (err: any) {
      setPublishError(err.message || 'Failed to create quiz');
    } finally {
      setIsPublishing(false);
    }
  };

  const currentQ = questions[activeQuestionIdx];
  const categories = ['All', ...Array.from(new Set(bankQuestions.map((b) => b.category)))];
  const filteredBankQuestions =
    selectedCategory === 'All'
      ? bankQuestions
      : bankQuestions.filter((b) => b.category === selectedCategory);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Wizard Progress Stepper */}
      {step < 4 && (
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider mb-2">
            <span className={step >= 1 ? 'text-[#0798FF]' : 'text-slate-400'}>1. Profile &amp; Cats 🐾</span>
            <span className={step >= 2 ? 'text-[#0798FF]' : 'text-slate-400'}>2. Questions ({questions.length}) ✨</span>
            <span className={step >= 3 ? 'text-[#0798FF]' : 'text-slate-400'}>3. Review &amp; Launch 🚀</span>
          </div>
          <div className="w-full h-3 bg-white rounded-full overflow-hidden border-2 border-[#DFE8F2] p-0.5">
            <div
              className="h-full bg-[#0798FF] transition-all duration-300 rounded-full shadow-xs"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* STEP 1: Creator Setup */}
      {step === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-4 border-white shadow-xl space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE4EF] text-[#FF5793] text-xs font-black mb-2">
              <span>🐱 Step 1 of 3</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#202B49] font-display">
              Create Your Friendship Challenge
            </h2>
            <p className="text-sm text-slate-500 font-semibold mt-1">
              কুইজ তৈরির আগে নিজের জেন্ডার সিলেক্ট করুন এবং নিজের নাম লিখুন।
            </p>
          </div>

          {/* CUTE CAT GENDER SELECTOR */}
          <div className="p-4 sm:p-5 rounded-3xl bg-[#EDF6FF] border-2 border-[#DFE8F2]">
            <GenderSelectorWithCats
              selectedGender={creatorGender}
              onChange={(g) => {
                setCreatorGender(g);
                setGenderError('');
              }}
              error={genderError}
              label="কুইজ তৈরি করার আগে নিজের জেন্ডার সিলেক্ট করুন (Select Gender First)"
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-black text-[#202B49] uppercase tracking-wider block mb-1.5">
                Your Name / Nickname <span className="text-[#FF5793]">*</span>
              </label>
              <input
                type="text"
                value={creatorName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Maya, Jordan, Alex"
                className="w-full px-4 py-3 rounded-2xl border-2 border-[#DFE8F2] focus:border-[#0798FF] focus:ring-2 focus:ring-[#59B9EF]/30 outline-none text-base text-[#202B49] font-bold"
                autoFocus
              />
            </div>

            <div>
              <label className="text-xs font-black text-[#202B49] uppercase tracking-wider block mb-1.5">
                Quiz Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Maya's Ultimate Friendship Test"
                className="w-full px-4 py-3 rounded-2xl border-2 border-[#DFE8F2] focus:border-[#0798FF] focus:ring-2 focus:ring-[#59B9EF]/30 outline-none text-sm text-[#202B49] font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-black text-[#202B49] uppercase tracking-wider block mb-1.5">
                Subtitle / Challenge Note (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Only real besties get 8/10 or higher. No guessing allowed!"
                rows={2}
                className="w-full px-4 py-2.5 rounded-2xl border-2 border-[#DFE8F2] focus:border-[#0798FF] focus:ring-2 focus:ring-[#59B9EF]/30 outline-none text-sm text-[#202B49] font-medium"
              />
            </div>

            {/* Emoji & Theme selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-black text-[#202B49] uppercase tracking-wider block mb-2">
                  Cover Icon
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {EMOJI_PRESETS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setCoverEmoji(emoji)}
                      className={`w-10 h-10 rounded-2xl text-xl flex items-center justify-center transition-transform cursor-pointer border-2 ${
                        coverEmoji === emoji
                          ? 'bg-[#EDF6FF] border-[#0798FF] scale-110 shadow-xs'
                          : 'bg-white border-[#DFE8F2] hover:bg-slate-50'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-[#202B49] uppercase tracking-wider block mb-2">
                  Color Accent
                </label>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {THEME_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setThemeColor(color)}
                      style={{ backgroundColor: color }}
                      className={`w-9 h-9 rounded-full transition-transform cursor-pointer shadow-xs ${
                        themeColor === color ? 'ring-4 ring-offset-2 ring-[#0798FF] scale-110' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Quiz Rules & Restrictions */}
            <div className="pt-4 border-t border-[#DFE8F2] space-y-3">
              <label className="text-xs font-black text-[#202B49] uppercase tracking-wider block">
                Challenge Rules
              </label>
              <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#EDF6FF] border-2 border-[#DFE8F2] cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowMultipleAttempts}
                  onChange={(e) => setAllowMultipleAttempts(e.target.checked)}
                  className="w-4 h-4 text-[#0798FF] rounded border-[#DFE8F2] focus:ring-[#0798FF]"
                />
                <div className="text-xs font-semibold">
                  <span className="font-black text-[#202B49] block">Allow retries / multiple attempts</span>
                  <span className="text-slate-500">
                    If unchecked, each friend nickname can only submit once to protect fair rankings.
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => {
                if (!creatorGender) {
                  setGenderError('কুইজ তৈরি করার আগে অবশ্যই জেন্ডার (ছেলে অথবা মেয়ে বিড়াল) সিলেক্ট করতে হবে!');
                  return;
                }
                if (!creatorName.trim()) {
                  alert('Please enter your name first.');
                  return;
                }
                setStep(2);
              }}
              className="px-7 py-3.5 rounded-2xl bg-[#0798FF] hover:bg-[#0086e6] text-white font-black text-sm shadow-[0_3px_0_#006fc5] active:translate-y-0.5 active:shadow-none flex items-center gap-2 cursor-pointer transition-all"
            >
              <span>Continue to Questions</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Question Setup */}
      {step === 2 && currentQ && (
        <div className="space-y-6">
          {/* Cute Cat Activity Companion */}
          <div className="flex items-center justify-between">
            <CatActivityCompanion
              gender={creatorGender}
              message={
                creatorGender === 'male'
                  ? 'টম বিড়াল (Milo) আপনার সাথে আছে: দারুণ সব প্রশ্ন সাজাও! 🐾'
                  : 'মিমি বিড়াল (Luna) আপনার সাথে আছে: সেরা কুইজ বানাচ্ছো! 💖'
              }
            />
          </div>
          {/* Question Navigator Strip */}
          <div className="bg-white rounded-3xl p-4 border-4 border-white shadow-md flex items-center justify-between gap-4 overflow-x-auto">
            <div className="flex items-center gap-2">
              {questions.map((q, idx) => {
                const isCurrent = idx === activeQuestionIdx;
                const isAnswered = q.text.trim() && q.correctOptionId;
                return (
                  <button
                    key={q.id}
                    onClick={() => setActiveQuestionIdx(idx)}
                    className={`w-10 h-10 rounded-2xl font-black text-xs flex items-center justify-center transition-all cursor-pointer whitespace-nowrap shrink-0 border-2 ${
                      isCurrent
                        ? 'bg-[#0798FF] text-white border-[#0798FF] shadow-[0_2px_0_#006fc5]'
                        : isAnswered
                        ? 'bg-[#EDF6FF] text-[#0798FF] border-[#59B9EF]/50 hover:bg-[#dfe8f2]'
                        : 'bg-white text-slate-400 border-[#DFE8F2]'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
              {questions.length < 20 && (
                <button
                  onClick={handleAddQuestion}
                  className="w-10 h-10 rounded-2xl border-2 border-dashed border-[#59B9EF] text-[#0798FF] hover:bg-[#EDF6FF] flex items-center justify-center text-xs font-black cursor-pointer"
                  title="Add Question"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                </button>
              )}
            </div>

            <button
              onClick={() => setIsBankOpen(true)}
              className="px-4 py-2.5 bg-[#FFE4EF] hover:bg-[#ffd1e3] text-[#FF5793] border-2 border-[#FF5793]/30 rounded-2xl font-black text-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 shadow-xs active:scale-95 transition-all"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Question Bank Ideas</span>
            </button>
          </div>

          {/* Active Question Editor Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-white shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-[#0798FF] uppercase tracking-wider block">
                  Question #{activeQuestionIdx + 1} of {questions.length}
                </span>
                <h3 className="text-xl font-black text-[#202B49] font-display">Configure Question &amp; Your Answer</h3>
              </div>

              {questions.length > 3 && (
                <button
                  onClick={() => handleRemoveQuestion(activeQuestionIdx)}
                  className="text-xs text-[#FF5793] hover:text-rose-700 flex items-center gap-1 font-bold cursor-pointer p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Question</span>
                </button>
              )}
            </div>

            {/* Question Text */}
            <div>
              <label className="text-xs font-black text-[#202B49] uppercase tracking-wider block mb-1.5">
                Question Text
              </label>
              <input
                type="text"
                value={currentQ.text}
                onChange={(e) => {
                  const updated = [...questions];
                  updated[activeQuestionIdx].text = e.target.value;
                  setQuestions(updated);
                }}
                placeholder="e.g. What is my go-to order when getting coffee?"
                className="w-full px-4 py-3.5 rounded-2xl border-2 border-[#DFE8F2] focus:border-[#0798FF] focus:ring-2 focus:ring-[#59B9EF]/30 outline-none text-base text-[#202B49] font-bold"
              />
            </div>

            {/* Options Management Section with Many Options */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="text-xs font-black text-[#202B49] uppercase tracking-wider block">
                    Answer Options ({currentQ.options.length} options)
                  </label>
                  <p className="text-[11px] text-slate-500 font-semibold">
                    অনেকগুলো অপশন তৈরি করতে পারো, আর তোমার আসল উত্তরটির বৃত্তে ক্লিক করে সিলেক্ট করো!
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black text-[#0798FF] bg-[#EDF6FF] px-2.5 py-1 rounded-xl border border-[#DFE8F2]">
                    🎯 ক্লিক করে তোমার উত্তর সিলেক্ট করো
                  </span>
                  {currentQ.options.length < 8 && (
                    <button
                      type="button"
                      onClick={() => handleAddOption(activeQuestionIdx)}
                      className="px-3 py-1 bg-[#0798FF] hover:bg-[#0086e6] text-white text-xs font-black rounded-xl flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
                      title="Add another option"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>+ Add Option</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Ready Preset Option Packs */}
              <div className="p-3 rounded-2xl bg-[#EDF6FF]/60 border border-[#DFE8F2] space-y-2">
                <span className="text-[11px] font-black text-[#0798FF] uppercase tracking-wider flex items-center gap-1">
                  <span>💡</span>
                  <span>রেডি অপশন প্যাক (Quick Option Ideas):</span>
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() =>
                      handleApplyOptionPack(activeQuestionIdx, [
                        { text: 'চিকেন বিরিয়ানি', emoji: '🍗', imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&auto=format&fit=crop&q=80' },
                        { text: 'চিজি পিৎজা', emoji: '🍕', imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&auto=format&fit=crop&q=80' },
                        { text: 'স্পাইসি বার্গার ও ফ্রাইস', emoji: '🍔', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&auto=format&fit=crop&q=80' },
                        { text: 'ক্রিস্পি ফুচকা ও চটপটি', emoji: '🥣', imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&auto=format&fit=crop&q=80' },
                        { text: 'চকলেট আইসক্রিম', emoji: '🍨', imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&auto=format&fit=crop&q=80' },
                      ])
                    }
                    className="px-2.5 py-1 bg-white hover:bg-[#EDF6FF] text-[#202B49] text-xs font-bold rounded-xl border border-[#DFE8F2] transition-colors cursor-pointer shadow-xs"
                  >
                    🍕 খাবার ও স্ন্যাক্স প্যাক (৫টি অপশন)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleApplyOptionPack(activeQuestionIdx, [
                        { text: 'কোল্ড কফি / আইসড লাতে', emoji: '🧋', imageUrl: 'https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif' },
                        { text: 'গরম কড়া আদা চা', emoji: '☕', imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=300&auto=format&fit=crop&q=80' },
                        { text: 'চকলেট মিল্কশেক', emoji: '🥤', imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&auto=format&fit=crop&q=80' },
                        { text: 'ঠান্ডা কোকাকোলা', emoji: '🥫', imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&auto=format&fit=crop&q=80' },
                      ])
                    }
                    className="px-2.5 py-1 bg-white hover:bg-[#EDF6FF] text-[#202B49] text-xs font-bold rounded-xl border border-[#DFE8F2] transition-colors cursor-pointer shadow-xs"
                  >
                    ☕ প্রিয় ড্রিঙ্কস প্যাক (৪টি অপশন)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleApplyOptionPack(activeQuestionIdx, [
                        { text: 'কম্বল মুড়ি দিয়ে সিরিজ বিঞ্জ', emoji: '📺', imageUrl: 'https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif' },
                        { text: 'রাত জেগে অনলাইন গেম খেলা', emoji: '🎮', imageUrl: 'https://media.giphy.com/media/jpbnoe3UIa8TU8LM13/giphy.gif' },
                        { text: 'বন্ধুদের সাথে লং ড্রাইভ ও আড্ডা', emoji: '🚗', imageUrl: 'https://media.giphy.com/media/26tOZ42Mg6pbTUPHW/giphy.gif' },
                        { text: 'একটানা ১২ ঘণ্টা ঘুম', emoji: '💤', imageUrl: 'https://media.giphy.com/media/vFKqnCdLPNOKc/giphy.gif' },
                        { text: 'গান শুনে রিলস স্ক্রল করা', emoji: '🎧', imageUrl: 'https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif' },
                      ])
                    }
                    className="px-2.5 py-1 bg-white hover:bg-[#EDF6FF] text-[#202B49] text-xs font-bold rounded-xl border border-[#DFE8F2] transition-colors cursor-pointer shadow-xs"
                  >
                    🎬 উইকএন্ড রিল্যাক্স প্যাক (৫টি অপশন)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleApplyOptionPack(activeQuestionIdx, [
                        { text: 'সব জায়গায় লেট করে যাওয়া', emoji: '⏰', imageUrl: 'https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif' },
                        { text: 'সারাদিন ফোন সাইলেন্ট রাখা', emoji: '🔕', imageUrl: 'https://media.giphy.com/media/111ebonMs90YLu/giphy.gif' },
                        { text: 'সোশ্যাল মিডিয়ায় সিক্রেট গোয়েন্দাগিরি', emoji: '🕵️', imageUrl: 'https://media.giphy.com/media/3o7bu3XilJ5BOiSGic/giphy.gif' },
                        { text: 'অল্পতেই হেসে মাটিতে গড়াগড়ি', emoji: '🤣', imageUrl: 'https://media.giphy.com/media/jpbnoe3UIa8TU8LM13/giphy.gif' },
                      ])
                    }
                    className="px-2.5 py-1 bg-white hover:bg-[#EDF6FF] text-[#202B49] text-xs font-bold rounded-xl border border-[#DFE8F2] transition-colors cursor-pointer shadow-xs"
                  >
                    🐱 মজার স্বভাব প্যাক (৪টি অপশন)
                  </button>
                </div>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQ.options.map((opt, oIdx) => {
                  const isCorrect = currentQ.correctOptionId === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => {
                        const updated = [...questions];
                        updated[activeQuestionIdx].correctOptionId = opt.id;
                        setQuestions(updated);
                      }}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 relative group ${
                        isCorrect
                          ? 'bg-[#e6faf2] border-[#55D9AD] ring-2 ring-[#55D9AD]/30 shadow-xs'
                          : 'bg-white border-[#DFE8F2] hover:border-[#59B9EF] hover:bg-[#EDF6FF]/30'
                      }`}
                    >
                      <button
                        type="button"
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-colors shrink-0 ${
                          isCorrect ? 'bg-[#55D9AD] text-white shadow-xs' : 'border-2 border-slate-300 text-transparent'
                        }`}
                      >
                        ✓
                      </button>

                      {/* Photo Thumbnail or Add Photo Button */}
                      {opt.imageUrl ? (
                        <div
                          className="relative group shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPhotoModalState({
                              isOpen: true,
                              questionIdx: activeQuestionIdx,
                              optionIdx: oIdx,
                              currentImageUrl: opt.imageUrl,
                              optionText: opt.text,
                            });
                          }}
                          title="Click to change or remove photo"
                        >
                          <img
                            src={opt.imageUrl}
                            alt="Option photo"
                            className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-xs group-hover:scale-105 transition-transform"
                          />
                          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#0798FF] text-white text-[9px] flex items-center justify-center font-bold shadow-xs">
                            📷
                          </span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPhotoModalState({
                              isOpen: true,
                              questionIdx: activeQuestionIdx,
                              optionIdx: oIdx,
                              currentImageUrl: '',
                              optionText: opt.text,
                            });
                          }}
                          className="p-1.5 rounded-xl border border-dashed border-[#59B9EF] hover:bg-[#EDF6FF] text-[#0798FF] text-[10px] font-black flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
                          title="Attach Photo / ছবি সংযুক্ত করুন"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">+ Photo</span>
                        </button>
                      )}

                      <input
                        type="text"
                        value={opt.emoji}
                        onChange={(e) => {
                          e.stopPropagation();
                          const updated = [...questions];
                          updated[activeQuestionIdx].options[oIdx].emoji = e.target.value;
                          setQuestions(updated);
                        }}
                        className="w-8 text-center text-lg bg-transparent border-b border-transparent focus:border-[#0798FF] outline-none"
                        title="Option Emoji"
                      />

                      <input
                        type="text"
                        value={opt.text}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          const updated = [...questions];
                          updated[activeQuestionIdx].options[oIdx].text = e.target.value;
                          setQuestions(updated);
                        }}
                        placeholder={`Option ${String.fromCharCode(65 + oIdx)} text`}
                        className="flex-1 bg-transparent text-sm text-[#202B49] font-bold outline-none"
                      />

                      {/* Remove option button if more than 2 options */}
                      {currentQ.options.length > 2 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveOption(activeQuestionIdx, oIdx);
                          }}
                          className="w-7 h-7 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shrink-0"
                          title="Remove this option"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Add option bar */}
              {currentQ.options.length < 8 && (
                <div className="flex justify-center pt-1">
                  <button
                    type="button"
                    onClick={() => handleAddOption(activeQuestionIdx)}
                    className="px-4 py-2 rounded-2xl border-2 border-dashed border-[#59B9EF] text-[#0798FF] hover:bg-[#EDF6FF] text-xs font-black flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>+ আরও অপশন যোগ করো ({currentQ.options.length}/8)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Navigation buttons */}
            <div className="pt-4 flex items-center justify-between border-t border-[#DFE8F2]">
              <button
                onClick={() => {
                  if (activeQuestionIdx > 0) {
                    setActiveQuestionIdx(activeQuestionIdx - 1);
                  } else {
                    setStep(1);
                  }
                }}
                className="px-4 py-2.5 rounded-2xl border-2 border-[#DFE8F2] text-[#202B49] hover:bg-slate-50 text-xs font-black flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{activeQuestionIdx > 0 ? 'Previous Question' : 'Back to Profile'}</span>
              </button>

              <div className="flex items-center gap-2">
                {activeQuestionIdx < questions.length - 1 ? (
                  <button
                    onClick={() => setActiveQuestionIdx(activeQuestionIdx + 1)}
                    className="px-5 py-2.5 rounded-2xl bg-[#0798FF] hover:bg-[#0086e6] text-white text-xs font-black shadow-[0_2px_0_#006fc5] flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                ) : (
                  <button
                    onClick={() => setStep(3)}
                    className="px-6 py-3 rounded-2xl bg-[#FF5793] hover:bg-[#f14382] text-white text-xs font-black shadow-[0_3px_0_#d93872] active:translate-y-0.5 active:shadow-none flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Proceed to Review</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Review & Summary */}
      {step === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-4 border-white shadow-xl space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE779] text-[#202B49] text-xs font-black mb-2">
              <span>🚀 Step 3 of 3</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#202B49] font-display">
              Review Your Quiz Before Launch
            </h2>
            <p className="text-sm text-slate-500 font-semibold mt-1">
              Verify your questions and answers. Once published, answers are securely stored and will grade your friends.
            </p>
          </div>

          {/* Validation Checklist */}
          <div className="p-4 rounded-3xl bg-[#EDF6FF] border-2 border-[#DFE8F2] space-y-2">
            <h4 className="text-xs font-black text-[#0798FF] uppercase tracking-wider">Validation Status</h4>
            {validationErrors.length === 0 ? (
              <div className="flex items-center gap-2 text-xs font-black text-[#55D9AD]">
                <CheckCircle2 className="w-4 h-4 text-[#55D9AD]" />
                <span className="text-[#202B49]">All {questions.length} questions are fully configured and ready!</span>
              </div>
            ) : (
              <div className="space-y-1">
                {validationErrors.map((err, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-bold text-[#FF5793]">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{err}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quiz Summary Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#EDF6FF] border border-[#DFE8F2] space-y-1">
              <span className="text-slate-400 uppercase font-black text-[10px]">Creator</span>
              <p className="font-black text-[#202B49] text-sm">{creatorName}</p>
              <p className="text-slate-500 font-semibold font-display">{title}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#FFE4EF] border border-[#FF5793]/20 space-y-1">
              <span className="text-[#FF5793] uppercase font-black text-[10px]">Rules</span>
              <p className="font-black text-[#202B49]">
                {allowMultipleAttempts ? 'Retries Allowed' : 'Strict: 1 Attempt Per Nickname'}
              </p>
              <p className="text-slate-500 font-semibold">{questions.length} Questions total</p>
            </div>
          </div>

          {/* Questions mini list */}
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            <h4 className="text-xs font-black text-[#202B49] uppercase tracking-wider">Configured Questions Summary</h4>
            {questions.map((q, idx) => {
              const correctOpt = q.options.find((o) => o.id === q.correctOptionId);
              return (
                <div key={q.id} className="p-3.5 rounded-2xl bg-white border-2 border-[#DFE8F2] flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <p className="font-black text-[#202B49]">
                      {idx + 1}. {q.text || '(Blank question)'}
                    </p>
                    <p className="text-[#0798FF] font-bold">
                      True Answer: {correctOpt?.emoji} {correctOpt?.text || 'Not chosen'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveQuestionIdx(idx);
                      setStep(2);
                    }}
                    className="text-[#FF5793] hover:text-[#d93872] font-black text-[11px] underline cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              );
            })}
          </div>

          {publishError && (
            <div className="p-3.5 rounded-2xl bg-[#FFE4EF] border-2 border-[#FF5793] text-[#FF5793] text-xs font-black">
              {publishError}
            </div>
          )}

          <div className="pt-4 flex items-center justify-between border-t border-[#DFE8F2]">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-2xl border-2 border-[#DFE8F2] text-[#202B49] hover:bg-slate-50 text-xs font-black flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Questions</span>
            </button>

            <button
              onClick={handlePublish}
              disabled={isPublishing || validationErrors.length > 0}
              className={`px-8 py-3.5 rounded-2xl text-white font-black text-sm flex items-center gap-2 transition-all cursor-pointer shadow-[0_3px_0_#006fc5] active:translate-y-0.5 active:shadow-none ${
                isPublishing || validationErrors.length > 0
                  ? 'bg-slate-300 cursor-not-allowed shadow-none'
                  : 'bg-[#0798FF] hover:bg-[#0086e6]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{isPublishing ? 'Encrypting & Launching...' : 'Publish My Quiz!'}</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Congratulations & Share Hub */}
      {step === 4 && publishedData && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-4 border-white shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-3xl bg-[#FFE779] text-[#202B49] text-3xl flex items-center justify-center mx-auto shadow-md border-2 border-white">
            🎉
          </div>

          <div>
            <span className="text-xs font-black text-[#0798FF] uppercase tracking-wider block">Quiz Published!</span>
            <h2 className="text-3xl font-black text-[#202B49] font-display mt-1">{publishedData.title} is Live!</h2>
            <p className="text-sm text-slate-500 font-semibold max-w-md mx-auto mt-2">
              Your friendship quiz is active and waiting for your friends. Share your secret link to see who takes 1st place!
            </p>
          </div>

          {/* Quick Quiz Code Card */}
          <div className="max-w-md mx-auto p-4 rounded-3xl bg-[#EDF6FF] border-2 border-[#DFE8F2] space-y-2">
            <div className="text-xs font-black text-[#0798FF]">Your Shareable Quiz Code</div>
            <div className="text-2xl font-black font-mono text-[#202B49] tracking-wider">
              {publishedData.code}
            </div>
            <p className="text-[11px] text-slate-500 font-semibold">
              Saved automatically to your device! You can also manage it anytime from the Creator Dashboard.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="max-w-md mx-auto flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="w-full py-4 bg-[#FF5793] hover:bg-[#f14382] active:scale-95 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2 shadow-[0_3px_0_#d93872] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Share With Friends</span>
            </button>

            <button
              onClick={() => onNavigate(`/quiz/${publishedData.code}`)}
              className="w-full py-4 bg-white hover:bg-slate-50 text-[#202B49] font-black text-sm rounded-2xl border-2 border-[#DFE8F2] flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View Landing Page</span>
            </button>
          </div>

          <div className="pt-4 border-t border-[#DFE8F2] flex items-center justify-center gap-6 text-xs font-black text-slate-600">
            <button
              onClick={() => onNavigate(`/quiz/${publishedData.code}/scoreboard`)}
              className="hover:text-[#0798FF] flex items-center gap-1.5 cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5 text-[#FFE779]" />
              <span>View Scoreboard</span>
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => onNavigate(`/dashboard?code=${publishedData.code}`)}
              className="hover:text-[#0798FF] cursor-pointer"
            >
              Creator Controls &amp; Analytics
            </button>
          </div>
        </div>
      )}

      {/* Question Bank Modal */}
      {isBankOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border-4 border-white overflow-hidden">
            <div className="p-6 border-b border-[#DFE8F2] flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-[#202B49] font-display">Pick From Curated Question Bank</h3>
                <p className="text-xs text-slate-500 font-semibold">Click any question to apply it to Question #{activeQuestionIdx + 1}</p>
              </div>
              <button
                onClick={() => setIsBankOpen(false)}
                className="text-xs font-black text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {/* Category tabs */}
            <div className="px-6 py-3 bg-[#EDF6FF] border-b border-[#DFE8F2] flex items-center gap-2 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-black rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-[#0798FF] text-white shadow-xs'
                      : 'bg-white text-[#202B49] hover:bg-slate-50 border border-[#DFE8F2]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Questions list */}
            <div className="p-6 space-y-3 overflow-y-auto flex-1">
              {filteredBankQuestions.map((bq) => (
                <div
                  key={bq.id}
                  onClick={() => handleApplyBankQuestion(bq)}
                  className="p-4 rounded-2xl border-2 border-[#DFE8F2] hover:border-[#0798FF] hover:bg-[#EDF6FF]/50 transition-all cursor-pointer group space-y-2"
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-sm font-black text-[#202B49] group-hover:text-[#0798FF] transition-colors">
                      {bq.emoji} {bq.text}
                    </p>
                    <span className="text-[10px] uppercase font-black text-[#FF5793] bg-[#FFE4EF] px-2 py-0.5 rounded-lg shrink-0">
                      {bq.category}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-600 font-semibold">
                    {bq.options.map((opt) => (
                      <div key={opt.id} className="truncate">
                        {opt.emoji} {opt.text}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {publishedData && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          quizCode={publishedData.code}
          quizTitle={publishedData.title}
          creatorName={creatorName}
        />
      )}

      {/* Option Photo Attachment Modal */}
      <OptionPhotoModal
        isOpen={photoModalState.isOpen}
        onClose={() => setPhotoModalState((prev) => ({ ...prev, isOpen: false }))}
        currentImageUrl={photoModalState.currentImageUrl}
        optionLabel={photoModalState.optionText}
        onSelectPhoto={(url) => {
          const updated = [...questions];
          updated[photoModalState.questionIdx].options[photoModalState.optionIdx].imageUrl = url;
          setQuestions(updated);
        }}
        onRemovePhoto={() => {
          const updated = [...questions];
          delete updated[photoModalState.questionIdx].options[photoModalState.optionIdx].imageUrl;
          setQuestions(updated);
        }}
      />
    </div>
  );
};
