import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { api } from '../api/client.ts';
import { QuizAttempt, QuestionReviewItem } from '../types.ts';
import {
  BoyCatSticker,
  GirlCatSticker,
  CatActivityCompanion,
} from '../components/CatMascots.tsx';
import { Trophy, Share2, Check, X, ArrowRight, Sparkles, Copy, MessageCircle } from 'lucide-react';

interface ResultPageProps {
  quizCode: string;
  attemptId: string;
  onNavigate: (path: string) => void;
}

export const ResultPage: React.FC<ResultPageProps> = ({
  quizCode,
  attemptId,
  onNavigate,
}) => {
  const [data, setData] = useState<{
    quiz: any;
    attempt: QuizAttempt;
    review: QuestionReviewItem[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .getAttempt(quizCode, attemptId)
      .then((res) => {
        if (res.success && res.attempt) {
          setData({
            quiz: res.quiz,
            attempt: res.attempt,
            review: res.review,
          });

          // Trigger festive confetti if score is at least 60%
          if (res.attempt.percentage >= 60) {
            try {
              confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#f59e0b', '#ec4899', '#3b82f6', '#10b981'],
              });
            } catch {
              // ignore
            }
          }
        }
      })
      .catch((err) => setError(err.message || 'Could not load results'))
      .finally(() => setLoading(false));
  }, [quizCode, attemptId]);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-amber-600 rounded-full animate-spin mx-auto" />
        <p className="text-sm font-bold text-slate-600">Calculating your friendship tier...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="text-3xl">⚠️</div>
        <h2 className="text-xl font-bold text-slate-900">Result Not Found</h2>
        <p className="text-sm text-slate-500">{error || 'Unable to retrieve this submission.'}</p>
        <button
          onClick={() => onNavigate(`/quiz/${quizCode}`)}
          className="px-5 py-2.5 bg-amber-500 text-white font-bold text-xs rounded-xl cursor-pointer"
        >
          Back to Quiz
        </button>
      </div>
    );
  }

  const { quiz, attempt, review } = data;
  const p = attempt.percentage;

  // Tier info
  let tierTitle = 'Solid Bestie';
  let tierEmoji = '🤝';
  let tierDesc = 'Good friend! You know the real fundamentals.';
  let tierColor = 'text-sky-700 bg-sky-50 border-sky-200';

  if (p >= 90) {
    tierTitle = 'Soulmate Status';
    tierEmoji = '🏆';
    tierDesc = 'You two are practically telepathic! Almost 100% precision.';
    tierColor = 'text-amber-800 bg-amber-50 border-amber-200';
  } else if (p >= 70) {
    tierTitle = 'Ride-or-Die';
    tierEmoji = '💖';
    tierDesc = 'You know the secrets and true habits. An elite friendship!';
    tierColor = 'text-rose-700 bg-rose-50 border-rose-200';
  } else if (p >= 50) {
    tierTitle = 'Solid Bestie';
    tierEmoji = '🤝';
    tierDesc = 'Great bond! Time to catch up on the latest tea though.';
    tierColor = 'text-amber-800 bg-amber-50 border-amber-200';
  } else if (p >= 30) {
    tierTitle = 'Casual Buddy';
    tierEmoji = '👀';
    tierDesc = 'You know the surface facts. Definitely time to hang out more!';
    tierColor = 'text-emerald-800 bg-emerald-50 border-emerald-200';
  } else {
    tierTitle = 'Impostor Alert';
    tierEmoji = '🕵️';
    tierDesc = 'Did you two just meet in an elevator? Time to talk more!';
    tierColor = 'text-slate-800 bg-slate-50 border-slate-200';
  }

  const shareText = `I just scored ${attempt.score}/${attempt.maxScore} (${attempt.percentage}%) on ${quiz.creatorName}'s Friendship Quiz! Can you beat my score? 🔥\n${window.location.origin}/quiz/${quiz.code}`;

  const handleCopyShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-in fade-in duration-200">
      {/* Main Scorecard Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border-4 border-white shadow-xl text-center space-y-6">
        <div className="inline-flex items-center gap-2 text-xs font-black text-[#0798FF] bg-[#EDF6FF] border-2 border-[#DFE8F2] px-4 py-1.5 rounded-full shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#FFE779] fill-[#FFE779]" />
          <span>Official Friendship Grade 🐾</span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#202B49] font-display">
            {attempt.participantName}&apos;s Result
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
            Friendship challenge for <span className="font-bold text-[#202B49]">{quiz.creatorName}</span>
          </p>
        </div>

        {/* Big Score Display & Cat Mascot Celebrant */}
        <div className="py-2 flex flex-col sm:flex-row items-center justify-center gap-6">
          <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-[#0798FF] to-[#59B9EF] text-white flex flex-col items-center justify-center shadow-lg shadow-[#0798FF]/20 border-4 border-white shrink-0 relative">
            <span className="text-4xl font-black font-display tracking-tight leading-none">
              {attempt.percentage}%
            </span>
            <span className="text-xs font-black opacity-95 mt-1 font-mono">
              {attempt.score} / {attempt.maxScore} Correct
            </span>
          </div>

          <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2">
            <div className="flex items-center gap-3">
              {attempt.participantGender === 'male' ? (
                <BoyCatSticker size="md" mood={p >= 70 ? 'cheering' : 'happy'} animated />
              ) : (
                <GirlCatSticker size="md" mood={p >= 70 ? 'cheering' : 'happy'} animated />
              )}
              <div className="bg-[#EDF6FF] border-2 border-[#DFE8F2] rounded-2xl px-4 py-2.5 text-xs font-bold text-[#202B49] shadow-xs">
                {attempt.participantGender === 'male' ? (
                  <span>টম বিড়াল: &ldquo;ওয়াও! দারুণ খেললে বন্ধু! 🐾&rdquo;</span>
                ) : (
                  <span>মিমি বিড়াল: &ldquo;পারফেক্ট! তুমি সেরা ফ্রেন্ড! 💖&rdquo;</span>
                )}
              </div>
            </div>

            {/* Celebratory Animated GIF sticker */}
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-sm">
              <img
                src={
                  p >= 70
                    ? 'https://media.giphy.com/media/artj92V8o75VPL7AeQ/giphy.gif'
                    : p >= 40
                    ? 'https://media.giphy.com/media/111ebonMs90YLu/giphy.gif'
                    : 'https://media.giphy.com/media/3o7bu3XilJ5BOiSGic/giphy.gif'
                }
                alt="Celebration GIF"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Tier badge */}
        <div className={`p-4 rounded-3xl border-2 ${tierColor} max-w-md mx-auto space-y-1`}>
          <div className="flex items-center justify-center gap-2 font-black text-base font-display">
            <span>{tierEmoji}</span>
            <span>{tierTitle}</span>
          </div>
          <p className="text-xs text-slate-600 font-semibold leading-relaxed">{tierDesc}</p>
        </div>

        {/* Quick share actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <button
            onClick={handleCopyShare}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#0798FF] hover:bg-[#0086e6] active:translate-y-0.5 active:shadow-none text-white font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_3px_0_#006fc5]"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Share Text Copied!' : 'Copy Score to Share'}</span>
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] active:translate-y-0.5 active:shadow-none text-white font-black text-xs flex items-center justify-center gap-2 transition-all shadow-[0_3px_0_#1da851]"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Send to WhatsApp</span>
          </a>
        </div>

        {/* Navigation CTAs */}
        <div className="pt-4 border-t border-[#DFE8F2] flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-black">
          <button
            onClick={() => onNavigate(`/quiz/${quiz.code}/scoreboard`)}
            className="text-[#0798FF] hover:text-[#0070c0] flex items-center gap-1.5 cursor-pointer py-1"
          >
            <Trophy className="w-4 h-4 text-[#FFE779] fill-[#FFE779]" />
            <span>View Full Scoreboard Rankings</span>
          </button>
          <span className="hidden sm:inline text-slate-300">·</span>
          <button
            onClick={() => onNavigate('/create')}
            className="text-[#FF5793] hover:text-[#d93872] flex items-center gap-1.5 cursor-pointer py-1"
          >
            <span>Create Your Own Friendship Quiz</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Question Breakdown Review */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-white shadow-xl space-y-6">
        <div>
          <span className="text-xs font-black text-[#0798FF] uppercase tracking-wider block">Question Review</span>
          <h3 className="text-xl font-black text-[#202B49] font-display">What You Got Right &amp; Wrong</h3>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            Compare your selections with {quiz.creatorName}&apos;s revealed correct answers.
          </p>
        </div>

        <div className="space-y-4">
          {review.map((item, idx) => {
            const selectedOpt = item.options.find((o) => o.id === item.selectedOptionId);
            const correctOpt = item.options.find((o) => o.id === item.correctOptionId);

            return (
              <div
                key={item.questionId}
                className={`p-4 rounded-2xl border-2 text-xs space-y-2 transition-colors ${
                  item.isCorrect
                    ? 'bg-[#e6faf2] border-[#55D9AD]/60'
                    : 'bg-[#FFE4EF]/50 border-[#FF5793]/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0 ${
                        item.isCorrect ? 'bg-[#55D9AD]' : 'bg-[#FF5793]'
                      }`}
                    >
                      {item.isCorrect ? '✓' : '✕'}
                    </span>
                    <span className="font-black text-[#202B49] text-sm">
                      {idx + 1}. {item.questionText}
                    </span>
                  </div>

                  <span
                    className={`font-black px-2.5 py-0.5 rounded-full text-[10px] uppercase shrink-0 ${
                      item.isCorrect
                        ? 'bg-[#55D9AD] text-white'
                        : 'bg-[#FF5793] text-white'
                    }`}
                  >
                    {item.isCorrect ? '+1 Point' : '0 Points'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 pl-8">
                  <div className="p-3 rounded-xl bg-white border border-[#DFE8F2]">
                    <span className="text-[10px] text-slate-400 font-black uppercase block mb-0.5">
                      Your Answer
                    </span>
                    <span className={`font-bold ${item.isCorrect ? 'text-[#059669]' : 'text-[#FF5793]'}`}>
                      {selectedOpt ? `${selectedOpt.emoji} ${selectedOpt.text}` : 'No answer selected'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-[#DFE8F2]">
                    <span className="text-[10px] text-[#0798FF] font-black uppercase block mb-0.5">
                      {quiz.creatorName}&apos;s True Answer
                    </span>
                    <span className="font-bold text-[#0798FF]">
                      {correctOpt ? `${correctOpt.emoji} ${correctOpt.text}` : 'Not designated'}
                    </span>
                  </div>
                </div>

                {item.explanation && (
                  <p className="text-[11px] text-slate-500 font-medium italic pl-8 pt-1">
                    💡 &ldquo;{item.explanation}&rdquo;
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
