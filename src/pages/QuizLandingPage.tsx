import React, { useState, useEffect } from 'react';
import { api } from '../api/client.ts';
import { PublicQuiz, ScoreboardResponse } from '../types.ts';
import {
  GenderSelectorWithCats,
  BoyCatSticker,
  GirlCatSticker,
} from '../components/CatMascots.tsx';
import { Trophy, Users, Shield, ArrowRight, Flag, AlertCircle } from 'lucide-react';

interface QuizLandingPageProps {
  quizCode: string;
  onNavigate: (path: string) => void;
  onStartQuiz: (participantName: string, participantGender: 'male' | 'female') => void;
}

export const QuizLandingPage: React.FC<QuizLandingPageProps> = ({
  quizCode,
  onNavigate,
  onStartQuiz,
}) => {
  const [quiz, setQuiz] = useState<PublicQuiz | null>(null);
  const [scoreboard, setScoreboard] = useState<ScoreboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [gender, setGender] = useState<'male' | 'female' | undefined>(undefined);
  const [genderError, setGenderError] = useState('');
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');

  // Report modal
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState<'inappropriate' | 'spam' | 'harassment' | 'other'>('inappropriate');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSuccess, setReportSuccess] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getPublicQuiz(quizCode),
      api.getScoreboard(quizCode, { limit: 3 }).catch(() => null),
    ])
      .then(([qRes, sRes]) => {
        if (qRes.quiz) {
          setQuiz(qRes.quiz);
        }
        if (sRes && sRes.scoreboard) {
          setScoreboard(sRes.scoreboard);
        }
      })
      .catch((err) => {
        setError(err.message || 'Quiz not found');
      })
      .finally(() => setLoading(false));
  }, [quizCode]);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gender) {
      setGenderError('কুইজে অংশ নেওয়ার আগে অবশ্যই জেন্ডার (ছেলে অথবা মেয়ে বিড়াল) সিলেক্ট করুন!');
      return;
    }
    const clean = name.trim();
    if (!clean) {
      setNameError('Please enter your nickname or name to start.');
      return;
    }
    if (clean.length > 30) {
      setNameError('Nickname must be 30 characters or fewer.');
      return;
    }
    setNameError('');
    onStartQuiz(clean, gender);
  };

  const handleSendReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportDetails.trim()) return;
    try {
      await api.reportQuiz(quizCode, reportReason, reportDetails);
      setReportSuccess('Thank you. This report has been submitted to moderators.');
      setTimeout(() => {
        setIsReportOpen(false);
        setReportSuccess('');
      }, 2000);
    } catch {
      alert('Could not submit report.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-amber-600 rounded-full animate-spin mx-auto" />
        <p className="text-sm font-bold text-slate-600">Loading friendship challenge...</p>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-2xl mx-auto">
          ⚠️
        </div>
        <h2 className="text-2xl font-black text-slate-900 font-display">Quiz Not Found</h2>
        <p className="text-sm text-slate-500">
          The quiz code <span className="font-mono font-bold text-slate-800">{quizCode}</span> does not exist or was deleted by the creator.
        </p>
        <button
          onClick={() => onNavigate('/')}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs"
        >
          Return to Homepage
        </button>
      </div>
    );
  }

  if (!quiz.isActive) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-2xl mx-auto">
          🔒
        </div>
        <h2 className="text-2xl font-black text-slate-900 font-display">Quiz is Closed</h2>
        <p className="text-sm text-slate-500">
          {quiz.creatorName} has closed this quiz to new submissions. You can still view the final scoreboard!
        </p>
        <button
          onClick={() => onNavigate(`/quiz/${quiz.code}/scoreboard`)}
          className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs"
        >
          View Scoreboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Quiz Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-white shadow-xl text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-[#EDF6FF] text-[#0798FF] border-2 border-[#DFE8F2] text-4xl flex items-center justify-center mx-auto shadow-xs">
          {quiz.coverEmoji || '💖'}
        </div>

        <div>
          <span className="text-xs font-black text-[#FF5793] uppercase tracking-wider block">
            🐾 Friendship Challenge
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#202B49] font-display mt-1 text-balance">
            {quiz.title}
          </h1>
          <p className="text-sm text-slate-600 font-semibold mt-2 max-w-sm mx-auto leading-relaxed">
            {quiz.description || `Prove how well you know ${quiz.creatorName}! Answer ${quiz.totalQuestions} questions and see your rank.`}
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 text-xs font-black text-slate-400 pt-2 border-t border-[#DFE8F2]">
          <span>🐾 {quiz.totalQuestions} Questions</span>
          <span aria-hidden="true">·</span>
          <span>👥 {quiz.attemptsCount} Friends Played</span>
          <span aria-hidden="true">·</span>
          <span>⏱️ ~2 min</span>
        </div>

        {/* Participant Name & Gender Form */}
        <form onSubmit={handleStart} className="space-y-5 pt-2">
          {/* CUTE CAT GENDER SELECTOR */}
          <div className="p-4 sm:p-5 rounded-3xl bg-[#EDF6FF] border-2 border-[#DFE8F2] text-left">
            <GenderSelectorWithCats
              selectedGender={gender}
              onChange={(g) => {
                setGender(g);
                setGenderError('');
              }}
              error={genderError}
              label="কুইজে অংশ নিতে নিজের জেন্ডার সিলেক্ট করো (Select Your Gender First)"
            />
          </div>

          <div className="space-y-1.5 text-left">
            <label className="text-xs font-black text-[#202B49] uppercase tracking-wider block">
              Enter Your Name / Nickname <span className="text-[#FF5793]">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError('');
              }}
              placeholder="e.g. Alex, Sam, Bestie Chris"
              className="w-full px-4 py-3 rounded-2xl border-2 border-[#DFE8F2] focus:border-[#0798FF] focus:ring-2 focus:ring-[#59B9EF]/30 outline-none text-base font-bold text-[#202B49] bg-white"
            />
            {nameError && (
              <div className="flex items-center gap-1.5 text-xs text-[#FF5793] font-black mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{nameError}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-[#0798FF] hover:bg-[#0086e6] active:translate-y-0.5 active:shadow-none text-white font-black text-base rounded-2xl shadow-[0_4px_0_#006fc5] flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Start Challenge With Cat Mascot</span>
            <ArrowRight className="w-5 h-5 stroke-[3]" />
          </button>
        </form>
      </div>

      {/* Top 3 Scoreboard Preview */}
      {scoreboard && scoreboard.items && scoreboard.items.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border-4 border-white shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#FFE779] fill-[#FFE779]" />
              <h3 className="text-sm font-black text-[#202B49] font-display">Current Top Friends</h3>
            </div>
            <button
              onClick={() => onNavigate(`/quiz/${quiz.code}/scoreboard`)}
              className="text-xs font-black text-[#0798FF] hover:text-[#0070c0] cursor-pointer"
            >
              Full Scoreboard ({scoreboard.total}) →
            </button>
          </div>

          <div className="space-y-2">
            {scoreboard.items.slice(0, 3).map((item, idx) => {
              const medals = ['🥇', '🥈', '🥉'];
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#EDF6FF] border border-[#DFE8F2] text-xs font-bold"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{medals[idx]}</span>
                    <span className="text-[#202B49]">{item.participantName}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-[#0798FF]">{item.score}/{item.maxScore}</span>
                    <span className="text-slate-400">({item.percentage}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer controls & Report */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-bold pt-2 px-2">
        <button
          onClick={() => onNavigate('/')}
          className="hover:text-[#0798FF] transition-colors cursor-pointer"
        >
          ← Back to Home
        </button>

        <button
          onClick={() => setIsReportOpen(true)}
          className="hover:text-[#FF5793] transition-colors flex items-center gap-1 cursor-pointer"
        >
          <Flag className="w-3.5 h-3.5" />
          <span>Report inappropriate quiz</span>
        </button>
      </div>

      {/* Report Modal */}
      {isReportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 border border-amber-100 shadow-xl">
            <h3 className="text-base font-black text-slate-900 font-display">Report this Quiz</h3>
            <p className="text-xs text-slate-500">
              Help us maintain a safe community. Report quizzes containing spam, harassment, or inappropriate content.
            </p>

            {reportSuccess ? (
              <p className="text-xs font-bold text-emerald-600">{reportSuccess}</p>
            ) : (
              <form onSubmit={handleSendReport} className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">Reason</label>
                  <select
                    value={reportReason}
                    onChange={(e: any) => setReportReason(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none"
                  >
                    <option value="inappropriate">Inappropriate Content</option>
                    <option value="harassment">Harassment or Bullying</option>
                    <option value="spam">Spam or Commercial Promo</option>
                    <option value="other">Other Violation</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">Details</label>
                  <textarea
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Describe the issue..."
                    rows={3}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none"
                    required
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsReportOpen(false)}
                    className="flex-1 py-2 text-xs font-bold text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl cursor-pointer"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
