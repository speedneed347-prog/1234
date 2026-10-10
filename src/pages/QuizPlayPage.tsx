import React, { useState, useEffect } from 'react';
import { api } from '../api/client.ts';
import { PublicQuiz, QuizOption } from '../types.ts';
import { useTranslation } from '../i18n/LanguageContext.tsx';
import {
  BoyCatSticker,
  GirlCatSticker,
  CatActivityCompanion,
} from '../components/CatMascots.tsx';
import { getOptionVisualGif } from '../data/presetAssets.ts';
import { ArrowLeft, ArrowRight, Clock, Sparkles, X, Maximize2 } from 'lucide-react';

interface QuizPlayPageProps {
  quizCode: string;
  participantName: string;
  participantGender?: 'male' | 'female';
  onNavigate: (path: string) => void;
  onFinished: (attemptId: string) => void;
}

export const QuizPlayPage: React.FC<QuizPlayPageProps> = ({
  quizCode,
  participantName,
  participantGender = 'male',
  onNavigate,
  onFinished,
}) => {
  const { t, lang } = useTranslation();
  const [quiz, setQuiz] = useState<PublicQuiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Player answers state: { [questionId]: selectedOptionId }
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime] = useState<number>(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [catCheer, setCatCheer] = useState<string>('');
  const [zoomImageUrl, setZoomImageUrl] = useState<string | null>(null);

  // Submitting state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Fetch quiz
  useEffect(() => {
    setLoading(true);
    api
      .getPublicQuiz(quizCode)
      .then((res) => {
        if (res.quiz) {
          setQuiz(res.quiz);
        }
      })
      .catch((err) => setError(err.message || 'Could not load quiz'))
      .finally(() => setLoading(false));
  }, [quizCode]);

  // Timer counter
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  // Option selection
  const handleSelectOption = (optionId: string) => {
    if (!quiz) return;
    const currentQuestion = quiz.questions[currentIndex];
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));

    // Trigger cute cat reaction message
    const cheers =
      participantGender === 'male'
        ? [
            'টম বিড়াল (Milo): দারুণ চয়েস! 🐾',
            'Milo: এই তো খাঁটি দোস্ত! ✨',
            'Milo: চলো পরেরটা দেখে নিই! 😼',
          ]
        : [
            'মিমি বিড়াল (Luna): অনেক কিউট পছন্দ! 💖',
            'Luna: ওয়াও! সেরা বন্ডিং! 🎀',
            'Luna: মিষ্টি চয়েস, চলো পরেরটা! 😻',
          ];
    setCatCheer(cheers[Math.floor(Math.random() * cheers.length)]);

    // Smooth tactile advance after delay
    if (currentIndex < quiz.questions.length - 1) {
      setTimeout(() => {
        setCurrentIndex((curr) => curr + 1);
      }, 350);
    }
  };

  // Submit attempt
  const handleSubmit = async () => {
    if (!quiz) return;

    // Check if any question was skipped
    const unansweredCount = quiz.questions.filter((q) => !answers[q.id]).length;
    if (unansweredCount > 0) {
      const confirmSubmit = window.confirm(
        `You have ${unansweredCount} unanswered questions. Are you sure you want to submit now?`
      );
      if (!confirmSubmit) return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const totalTime = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
      const res = await api.submitAttempt(quiz.code, {
        participantName,
        participantGender,
        answers,
        timeSpentSeconds: totalTime,
      });

      if (res.success && res.attempt) {
        onFinished(res.attempt.id);
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit answers.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl overflow-hidden border-3 border-white shadow-lg mx-auto">
          <img
            src="https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif"
            alt="Loading Cat"
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-sm font-bold text-slate-600">Preparing friendship challenge...</p>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="text-3xl">⚠️</div>
        <h2 className="text-xl font-bold text-slate-900">Quiz Unavailable</h2>
        <p className="text-sm text-slate-500">{error || 'Quiz not found.'}</p>
        <button
          onClick={() => onNavigate('/')}
          className="px-5 py-2.5 bg-amber-500 text-white font-bold text-xs rounded-xl cursor-pointer"
        >
          Return Home
        </button>
      </div>
    );
  }

  const totalQuestions = quiz.questions.length;
  const currentQuestion = quiz.questions[currentIndex];
  const selectedOptionId = currentQuestion ? answers[currentQuestion.id] : undefined;
  const answeredTotal = Object.keys(answers).length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  // Guarantee exactly TWO options presented to friends
  const displayOptions =
    currentQuestion.options.length > 2
      ? currentQuestion.options.slice(0, 2)
      : currentQuestion.options;

  // Minutes and seconds
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Bar Status with Cute Animated Mascot Companion */}
      <div className="bg-white rounded-3xl p-4 border-4 border-white shadow-md flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs">
          {/* Animated Cat GIF Mascot Avatar */}
          <div className="shrink-0">
            {participantGender === 'male' ? (
              <BoyCatSticker size="sm" mood="winking" animated />
            ) : (
              <GirlCatSticker size="sm" mood="winking" animated />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-black text-[#202B49]">
              <span>{participantName}</span>
              <span className="text-[10px] font-mono text-[#0798FF] bg-[#EDF6FF] px-2 py-0.5 rounded-full border border-[#DFE8F2]">
                {participantGender === 'male' ? 'ছেলে বিড়াল 🐾' : 'মেয়ে বিড়াল 🎀'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold">
              Testing bond with <span className="font-bold text-[#202B49]">{quiz.creatorName}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#0798FF] bg-[#EDF6FF] px-3 py-1.5 rounded-2xl border border-[#DFE8F2]">
          <Clock className="w-3.5 h-3.5 text-[#0798FF]" />
          <span>{formatTime(elapsedSeconds)}</span>
        </div>
      </div>

      {/* Cheer sticker bubble if active */}
      {catCheer && (
        <div className="flex justify-center animate-in fade-in zoom-in-95 duration-150">
          <CatActivityCompanion
            gender={participantGender}
            message={catCheer}
            floating
          />
        </div>
      )}

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-black text-[#202B49] uppercase tracking-wider">
          <span>Question {currentIndex + 1} of {totalQuestions}</span>
          <span className="text-[#0798FF]">{answeredTotal} / {totalQuestions} Answered</span>
        </div>
        <div className="w-full h-3 bg-white rounded-full overflow-hidden border-2 border-[#DFE8F2] p-0.5">
          <div
            className="h-full bg-[#0798FF] transition-all duration-300 rounded-full shadow-xs"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border-4 border-white shadow-xl space-y-6 relative overflow-hidden">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 text-xs font-black text-[#FF5793] uppercase tracking-wider bg-[#FFE4EF] px-3 py-1 rounded-full border border-[#FF5793]/30">
            <span>🐾</span>
            <span>{quiz.creatorName}&apos;s Question #{currentIndex + 1}</span>
            <span className="text-[#0798FF] bg-white px-2 py-0.2 rounded-full font-bold text-[10px]">
              দুটোর মধ্যে ১টি বেছে নাও!
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#202B49] font-display leading-tight">
            {currentQuestion.text}
          </h2>
          <p className="text-xs text-slate-500 font-semibold">
            {lang === 'bn'
              ? 'নিচের ২টি বড় অপশনের মধ্যে যেকোনো একটিতে ক্লিক করে সিলেক্ট করো:'
              : 'Pick one of the 2 options below by clicking on it:'}
          </p>
        </div>

        {/* 2 LARGE OPTION CARDS SHOWDOWN (THIS OR THAT) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 relative pt-2">
          {/* VS Badge in the center */}
          <div className="hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-[#FFE779] text-[#202B49] font-black text-xs items-center justify-center border-3 border-white shadow-md pointer-events-none">
            VS
          </div>

          {displayOptions.map((opt: QuizOption, optIdx: number) => {
            const isSelected = selectedOptionId === opt.id;
            const visualUrl =
              opt.imageUrl || getOptionVisualGif(opt.text, opt.emoji, optIdx + currentIndex);

            return (
              <div
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                className={`group rounded-3xl border-3 p-3.5 transition-all cursor-pointer flex flex-col justify-between text-left relative overflow-hidden select-none active:scale-[0.98] ${
                  isSelected
                    ? 'bg-[#EDF6FF] border-[#0798FF] ring-4 ring-[#0798FF]/25 shadow-xl scale-[1.01]'
                    : 'bg-white border-[#DFE8F2] hover:border-[#59B9EF] hover:shadow-md'
                }`}
              >
                {/* Selected Checkmark Badge */}
                {isSelected && (
                  <div className="absolute top-3 right-3 z-20 bg-[#0798FF] text-white text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md animate-in zoom-in-75 duration-150">
                    <span>✓</span>
                    <span>নির্বাচিত</span>
                  </div>
                )}

                {/* BIG PHOTO / GIF CONTAINER */}
                <div className="w-full h-48 sm:h-56 rounded-2xl overflow-hidden bg-slate-100 relative group/img border-2 border-white shadow-xs">
                  <img
                    src={visualUrl}
                    alt={opt.text}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 select-none pointer-events-none"
                    loading="lazy"
                  />

                  {/* Option Tag Badge */}
                  <div className="absolute top-2.5 left-2.5 px-3 py-1 rounded-full bg-black/65 backdrop-blur-xs text-white text-xs font-black flex items-center gap-1.5 shadow-sm">
                    <span className="text-sm">{opt.emoji || (optIdx === 0 ? '✨' : '🔥')}</span>
                    <span>{optIdx === 0 ? 'Option 1' : 'Option 2'}</span>
                  </div>

                  {/* Enlarge Zoom Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setZoomImageUrl(visualUrl);
                    }}
                    className="absolute bottom-2.5 right-2.5 p-2 rounded-xl bg-white/90 hover:bg-white text-slate-800 text-xs shadow-md transition-all hover:scale-110 cursor-pointer"
                    title="বড় করে দেখুন / Enlarge image"
                  >
                    <Maximize2 className="w-4 h-4 text-[#202B49]" />
                  </button>
                </div>

                {/* Option Text Label */}
                <div className="pt-3 pb-1 px-1 text-center space-y-1">
                  <span className="text-base sm:text-lg font-black text-[#202B49] leading-snug block">
                    {opt.text}
                  </span>
                  <p className="text-[11px] font-bold text-slate-400">
                    {isSelected ? '✓ তোমার নির্বাচিত পছন্দ' : 'ট্যাপ করে পছন্দ করো'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {submitError && (
          <div className="p-3.5 rounded-2xl bg-[#FFE4EF] border-2 border-[#FF5793] text-[#FF5793] text-xs font-black">
            {submitError}
          </div>
        )}

        {/* Card Navigation Footer */}
        <div className="pt-4 flex items-center justify-between border-t border-[#DFE8F2]">
          <button
            onClick={() => setCurrentIndex((curr) => Math.max(0, curr - 1))}
            disabled={currentIndex === 0}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-1.5 transition-colors ${
              currentIndex === 0
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-[#202B49] hover:bg-slate-100 cursor-pointer border-2 border-[#DFE8F2]'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.btnPrevQuestion}</span>
          </button>

          {currentIndex < totalQuestions - 1 ? (
            <button
              onClick={() => setCurrentIndex((curr) => Math.min(totalQuestions - 1, curr + 1))}
              className="px-6 py-2.5 rounded-2xl bg-[#0798FF] hover:bg-[#0086e6] text-white text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_2px_0_#006fc5] active:translate-y-0.5 active:shadow-none"
            >
              <span>{t.btnNextQuestionPlay}</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-6 py-3 rounded-2xl text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_3px_0_#d93872] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer ${
                isSubmitting
                  ? 'bg-slate-300 cursor-wait shadow-none'
                  : 'bg-[#FF5793] hover:bg-[#f14382]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FFE779]" />
              <span>{isSubmitting ? t.submittingAnswers : t.btnSubmitQuiz}</span>
            </button>
          )}
        </div>
      </div>

      {/* Mini Question Jump Dots */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap px-2">
        {quiz.questions.map((q, idx) => {
          const isAnswered = Boolean(answers[q.id]);
          const isCurrent = idx === currentIndex;
          return (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(idx)}
              className={`w-8 h-8 rounded-xl text-xs font-black transition-all cursor-pointer border-2 ${
                isCurrent
                  ? 'bg-[#0798FF] text-white border-[#0798FF] shadow-xs'
                  : isAnswered
                  ? 'bg-[#EDF6FF] text-[#0798FF] border-[#59B9EF]/40'
                  : 'bg-white text-slate-400 border-[#DFE8F2] hover:bg-slate-50'
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Image Full-Screen Zoom Modal */}
      {zoomImageUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setZoomImageUrl(null)}
        >
          <div
            className="max-w-2xl max-h-[85vh] bg-white rounded-3xl p-3 border-4 border-white shadow-2xl relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setZoomImageUrl(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center cursor-pointer shadow-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={zoomImageUrl}
              alt="Enlarged view"
              className="max-w-full max-h-[75vh] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
