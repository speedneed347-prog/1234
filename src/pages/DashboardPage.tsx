import React, { useState, useEffect } from 'react';
import { api } from '../api/client.ts';
import { useStoredQuizzes } from '../hooks/useStoredQuizzes.ts';
import { ShareModal } from '../components/ShareModal.tsx';
import {
  Trophy,
  Share2,
  Settings,
  Download,
  Trash2,
  ExternalLink,
  Edit3,
  CheckCircle2,
  Clock,
  Eye,
  BarChart3,
  Plus,
  ShieldCheck,
} from 'lucide-react';

interface DashboardPageProps {
  initialCode?: string;
  onNavigate: (path: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  initialCode,
  onNavigate,
}) => {
  const { quizzes, removeQuiz, getTokenForQuiz } = useStoredQuizzes();

  const [selectedCode, setSelectedCode] = useState<string>(
    initialCode || (quizzes.length > 0 ? quizzes[0].code : 'bm-maya26')
  );

  // Manual token entry fallback
  const [customToken, setCustomToken] = useState<string>('');
  const [activeToken, setActiveToken] = useState<string>('');

  const [analytics, setAnalytics] = useState<any | null>(null);
  const [fullQuiz, setFullQuiz] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Determine token
  useEffect(() => {
    let token = getTokenForQuiz(selectedCode);
    if (!token && selectedCode === 'bm-maya26') {
      token = 'token-maya-secret-demo';
    } else if (!token && selectedCode === 'bm-leo99') {
      token = 'token-leo-secret-demo';
    } else if (!token && selectedCode === 'bm-zoe01') {
      token = 'token-zoe-secret-demo';
    }

    if (token) {
      setActiveToken(token);
    } else {
      setActiveToken(customToken);
    }
  }, [selectedCode, quizzes, customToken]);

  // Load analytics & quiz details
  const loadData = () => {
    if (!selectedCode || !activeToken) return;
    setLoading(true);
    setError('');

    Promise.all([
      api.getQuizAnalytics(selectedCode, activeToken),
      api.getQuizAdmin(selectedCode, activeToken),
    ])
      .then(([aRes, qRes]) => {
        if (aRes.analytics) setAnalytics(aRes.analytics);
        if (qRes.quiz) setFullQuiz(qRes.quiz);
      })
      .catch((err) => {
        setError(err.message || 'Unauthorized or quiz not found.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (activeToken) {
      loadData();
    }
  }, [selectedCode, activeToken]);

  // Toggle quiz active state
  const handleToggleStatus = async () => {
    if (!fullQuiz || !activeToken) return;
    try {
      await api.updateQuiz(selectedCode, activeToken, {
        isActive: !fullQuiz.isActive,
      });
      loadData();
    } catch (err: any) {
      alert('Error updating status: ' + err.message);
    }
  };

  // Delete quiz
  const handleDeleteQuiz = async () => {
    if (!activeToken) return;
    setIsDeleting(true);
    try {
      await api.deleteQuiz(selectedCode, activeToken);
      removeQuiz(selectedCode);
      setDeleteConfirmOpen(false);
      if (quizzes.length > 1) {
        setSelectedCode(quizzes[1].code);
      } else {
        onNavigate('/');
      }
    } catch (err: any) {
      alert('Error deleting quiz: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Download CSV export
  const handleExportCsv = async () => {
    try {
      const sRes = await api.getScoreboard(selectedCode, { limit: 1000 });
      if (!sRes.scoreboard || !sRes.scoreboard.items) {
        alert('No participants to export.');
        return;
      }

      const rows = [
        ['Rank', 'Participant Name', 'Score', 'Max Score', 'Percentage', 'Time (Seconds)', 'Submitted At'],
        ...sRes.scoreboard.items.map((i) => [
          i.rank,
          `"${i.participantName.replace(/"/g, '""')}"`,
          i.score,
          i.maxScore,
          `${i.percentage}%`,
          i.timeSpentSeconds,
          i.submittedAt,
        ]),
      ];

      const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `${selectedCode}_friends_scoreboard.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      alert('Failed to export CSV.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black text-[#0798FF] uppercase tracking-wider block">🐾 Creator Portal</span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#202B49] font-display">Quiz Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5">
            Manage your friendship quizzes, view answer analytics, and track fair play.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/create')}
          className="px-5 py-3 bg-[#0798FF] hover:bg-[#0086e6] text-white font-black text-xs rounded-2xl shadow-[0_3px_0_#006fc5] active:translate-y-0.5 active:shadow-none flex items-center gap-1.5 cursor-pointer whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Create Another Quiz</span>
        </button>
      </div>

      {/* Quiz Switcher Strip */}
      <div className="bg-white rounded-3xl p-4 border-4 border-white shadow-md flex items-center justify-between gap-4 overflow-x-auto">
        <div className="flex items-center gap-2">
          {quizzes.map((q) => (
            <button
              key={q.code}
              onClick={() => setSelectedCode(q.code)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer whitespace-nowrap border-2 ${
                selectedCode === q.code
                  ? 'bg-[#0798FF] text-white border-[#0798FF] shadow-xs'
                  : 'bg-white text-slate-700 border-[#DFE8F2] hover:bg-[#EDF6FF]'
              }`}
            >
              {q.title || q.code}
            </button>
          ))}
          {/* Demo quizzes option */}
          <button
            onClick={() => setSelectedCode('bm-maya26')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer whitespace-nowrap border-2 ${
              selectedCode === 'bm-maya26'
                ? 'bg-[#0798FF] text-white border-[#0798FF]'
                : 'bg-[#EDF6FF] text-[#0798FF] border-[#59B9EF]/40 hover:bg-[#dfe8f2]'
            }`}
          >
            Demo: Maya&apos;s Quiz
          </button>
        </div>

        <span className="text-[11px] font-mono font-bold text-[#0798FF] bg-[#EDF6FF] px-2.5 py-1 rounded-xl border border-[#DFE8F2] whitespace-nowrap shrink-0">
          Code: {selectedCode}
        </span>
      </div>

      {/* Token Verification Prompt if token not found */}
      {!activeToken && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-white shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#0798FF]" />
            <h3 className="text-lg font-black text-[#202B49] font-display">Enter Creator Edit Token</h3>
          </div>
          <p className="text-xs text-slate-500 font-semibold">
            To view analytics and manage this quiz, enter the secret edit token generated when the quiz was created.
          </p>
          <div className="flex items-center gap-2 max-w-md">
            <input
              type="text"
              value={customToken}
              onChange={(e) => setCustomToken(e.target.value)}
              placeholder="e.g. token-maya-secret-demo"
              className="flex-1 px-4 py-2.5 text-xs font-mono font-bold rounded-2xl border-2 border-[#DFE8F2] outline-none focus:border-[#0798FF]"
            />
            <button
              onClick={() => setActiveToken(customToken)}
              className="px-5 py-2.5 bg-[#0798FF] hover:bg-[#0086e6] text-white font-black text-xs rounded-2xl cursor-pointer"
            >
              Authorize
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="p-12 text-center text-slate-500 font-bold text-sm">
          Loading quiz analytics...
        </div>
      )}

      {error && (
        <div className="p-6 rounded-3xl bg-[#FFE4EF] border-2 border-[#FF5793] text-[#FF5793] text-xs font-black">
          {error}
        </div>
      )}

      {analytics && fullQuiz && !loading && (
        <div className="space-y-6">
          {/* Quick Metrics KPI cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-5 border-4 border-white shadow-md space-y-1">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                Total Attempts
              </span>
              <p className="text-2xl font-black font-display text-[#202B49]">
                {analytics.totalAttempts}
              </p>
              <span className="text-[10px] text-[#059669] font-bold">Friends scored</span>
            </div>

            <div className="bg-white rounded-3xl p-5 border-4 border-white shadow-md space-y-1">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                Average Score
              </span>
              <p className="text-2xl font-black font-display text-[#0798FF] font-mono">
                {analytics.avgScorePercentage}%
              </p>
              <span className="text-[10px] text-slate-500 font-semibold">Across all submissions</span>
            </div>

            <div className="bg-white rounded-3xl p-5 border-4 border-white shadow-md space-y-1">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                Total Views
              </span>
              <p className="text-2xl font-black font-display text-[#202B49]">
                {analytics.viewsCount}
              </p>
              <span className="text-[10px] text-slate-500 font-semibold">Landing visits</span>
            </div>

            <div className="bg-white rounded-3xl p-5 border-4 border-white shadow-md space-y-1">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                Quiz Status
              </span>
              <div className="flex items-center gap-2 pt-0.5">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    fullQuiz.isActive ? 'bg-[#55D9AD]' : 'bg-slate-400'
                  }`}
                />
                <span className="text-base font-black text-[#202B49]">
                  {fullQuiz.isActive ? 'Active' : 'Closed'}
                </span>
              </div>
              <button
                onClick={handleToggleStatus}
                className="text-[11px] font-black text-[#0798FF] hover:underline cursor-pointer"
              >
                {fullQuiz.isActive ? 'Pause Submissions' : 'Re-open Submissions'}
              </button>
            </div>
          </div>

          {/* Action Hub */}
          <div className="bg-white rounded-3xl p-6 border-4 border-white shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{fullQuiz.coverEmoji || '✨'}</span>
              <div>
                <h3 className="text-lg font-black text-[#202B49] font-display">{fullQuiz.title}</h3>
                <p className="text-xs text-slate-500 font-semibold">
                  Created {new Date(fullQuiz.createdAt).toLocaleDateString()} · {fullQuiz.questions.length} questions
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="px-5 py-2.5 rounded-2xl bg-[#FF5793] hover:bg-[#f14382] text-white font-black text-xs flex items-center gap-1.5 shadow-[0_2px_0_#d93872] active:translate-y-0.5 active:shadow-none cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Link</span>
              </button>

              <button
                onClick={() => onNavigate(`/quiz/${selectedCode}/scoreboard`)}
                className="px-4 py-2.5 rounded-2xl bg-[#EDF6FF] hover:bg-[#dfe8f2] text-[#0798FF] font-black text-xs border border-[#59B9EF]/30 flex items-center gap-1.5 cursor-pointer"
              >
                <Trophy className="w-3.5 h-3.5 text-[#FFE779] fill-[#FFE779]" />
                <span>Scoreboard</span>
              </button>

              <button
                onClick={handleExportCsv}
                className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-[#202B49] font-bold text-xs border-2 border-[#DFE8F2] flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => onNavigate(`/quiz/${selectedCode}/edit`)}
                className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-[#202B49] font-bold text-xs border-2 border-[#DFE8F2] flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Questions</span>
              </button>

              <button
                onClick={() => setDeleteConfirmOpen(true)}
                className="px-3 py-2.5 rounded-2xl text-[#FF5793] hover:bg-[#FFE4EF] text-xs font-black flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>

          {/* Question Accuracy Breakdown */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">Deep Insights</span>
              <h3 className="text-lg font-black text-slate-900 font-display">Friend Accuracy by Question</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                See which questions your friends nailed and which ones fooled everyone!
              </p>
            </div>

            <div className="space-y-4">
              {analytics.questionStats.map((qs: any, idx: number) => {
                const questionObj = fullQuiz.questions.find((q: any) => q.id === qs.questionId);
                const correctOpt = questionObj?.options.find((o: any) => o.id === qs.correctOptionId);

                return (
                  <div key={qs.questionId} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="font-bold text-slate-900 text-sm">
                          {idx + 1}. {qs.text}
                        </span>
                        <p className="text-[11px] text-amber-700 font-semibold mt-0.5">
                          Correct Answer: {correctOpt?.emoji} {correctOpt?.text}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-base font-black font-mono text-slate-900">{qs.accuracy}%</span>
                        <p className="text-[10px] text-slate-400">got it right</p>
                      </div>
                    </div>

                    {/* Progress Bar for Accuracy */}
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${qs.accuracy}%` }}
                      />
                    </div>

                    {/* Options Breakdown */}
                    {questionObj && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                        {questionObj.options.map((opt: any) => {
                          const count = qs.optionCounts[opt.id] || 0;
                          const isCorrect = opt.id === qs.correctOptionId;
                          return (
                            <div
                              key={opt.id}
                              className={`p-2 rounded-xl text-[11px] border ${
                                isCorrect
                                  ? 'bg-amber-100/50 border-amber-300 font-bold'
                                  : 'bg-white border-slate-200 text-slate-600'
                              }`}
                            >
                              <span className="block truncate">{opt.emoji} {opt.text}</span>
                              <span className="text-[10px] text-slate-400 block mt-0.5">
                                {count} choice{count === 1 ? '' : 's'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-rose-100">
            <h3 className="text-lg font-black text-rose-950 font-display">Delete Quiz Permanently?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              This will permanently delete this quiz and all its scoreboard attempts. This action cannot be undone.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteQuiz}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {fullQuiz && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          quizCode={selectedCode}
          quizTitle={fullQuiz.title}
          creatorName={fullQuiz.creatorName}
        />
      )}
    </div>
  );
};
