import React, { useState, useEffect } from 'react';
import { api } from '../api/client.ts';
import { useStoredQuizzes } from '../hooks/useStoredQuizzes.ts';
import { ScoreboardResponse } from '../types.ts';
import { ShareModal } from '../components/ShareModal.tsx';
import { PodiumTrophyIllustration } from '../components/QuizIllustrations.tsx';
import {
  BoyCatSticker,
  GirlCatSticker,
} from '../components/CatMascots.tsx';
import { Trophy, Search, Share2, ArrowRight, Clock, Calendar, Sparkles } from 'lucide-react';

interface ScoreboardPageProps {
  quizCode: string;
  onNavigate: (path: string) => void;
}

export const ScoreboardPage: React.FC<ScoreboardPageProps> = ({
  quizCode,
  onNavigate,
}) => {
  const { getTokenForQuiz } = useStoredQuizzes();
  const [scoreboardData, setScoreboardData] = useState<{
    quizTitle: string;
    creatorName: string;
    coverEmoji: string;
    scoreboard: ScoreboardResponse;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const editToken = getTokenForQuiz(quizCode);

  const fetchScoreboard = (p: number, q: string) => {
    setLoading(true);
    api
      .getScoreboard(quizCode, { page: p, limit: 10, search: q })
      .then((res) => {
        setScoreboardData(res);
      })
      .catch((err) => setError(err.message || 'Could not load scoreboard'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchScoreboard(page, search);
  }, [quizCode, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchScoreboard(1, search);
  };

  if (loading && !scoreboardData) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-amber-600 rounded-full animate-spin mx-auto" />
        <p className="text-sm font-bold text-slate-600">Loading friend scoreboard...</p>
      </div>
    );
  }

  if (error || !scoreboardData) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="text-3xl">⚠️</div>
        <h2 className="text-xl font-bold text-slate-900">Scoreboard Unavailable</h2>
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

  const { quizTitle, creatorName, coverEmoji, scoreboard } = scoreboardData;
  const topThree = scoreboard.items.slice(0, 3);

  // Time formatter
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 text-xs font-black text-[#0798FF] bg-[#EDF6FF] border-2 border-[#DFE8F2] px-3.5 py-1 rounded-full shadow-xs">
            <span>{coverEmoji}</span>
            <span>Live Scoreboard 🏆</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#202B49] font-display">
            {quizTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold">
            Friend rankings for <span className="font-bold text-[#202B49]">{creatorName}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate(`/quiz/${quizCode}`)}
            className="px-6 py-3.5 rounded-2xl bg-[#0798FF] hover:bg-[#0086e6] active:translate-y-0.5 active:shadow-none text-white font-black text-xs uppercase tracking-wider shadow-[0_3px_0_#006fc5] flex items-center gap-2 cursor-pointer transition-all"
          >
            <span>Take This Quiz</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
          </button>

          <button
            onClick={() => setIsShareModalOpen(true)}
            className="p-3.5 rounded-2xl bg-white hover:bg-slate-50 text-[#202B49] border-2 border-[#DFE8F2] shadow-xs transition-colors cursor-pointer"
            title="Share Quiz Link"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top 3 Podium (If enough participants) */}
      {topThree.length > 0 && !search && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-white shadow-xl space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-black text-[#202B49] font-display flex items-center justify-center gap-2">
              <Trophy className="w-6 h-6 text-[#FFE779] fill-[#FFE779]" />
              <span>Podium of Honor</span>
            </h2>
            <p className="text-xs text-slate-500 font-semibold">
              The closest friends leading the pack!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end pt-4 max-w-2xl mx-auto">
            {/* 2nd Place */}
            {topThree[1] ? (
              <div className="bg-[#EDF6FF] rounded-3xl p-4 border-2 border-[#DFE8F2] shadow-xs text-center order-2 sm:order-1 sm:h-56 flex flex-col justify-end items-center space-y-2">
                <div className="flex items-center gap-1.5 justify-center">
                  <span className="text-2xl">🥈</span>
                  {topThree[1].participantGender === 'male' ? (
                    <BoyCatSticker size="sm" animated={false} />
                  ) : (
                    <GirlCatSticker size="sm" animated={false} />
                  )}
                </div>
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">2nd Place</span>
                <p className="font-black text-[#202B49] text-sm truncate w-full">{topThree[1].participantName}</p>
                <div className="p-2 rounded-2xl bg-white font-mono text-xs w-full border border-[#DFE8F2]">
                  <span className="font-black text-[#0798FF]">{topThree[1].percentage}%</span>
                  <span className="text-slate-400 block text-[10px]">({topThree[1].score}/{topThree[1].maxScore})</span>
                </div>
              </div>
            ) : (
              <div className="hidden sm:block order-1 h-56 bg-slate-50 rounded-3xl border-2 border-dashed border-[#DFE8F2]" />
            )}

            {/* 1st Place (Center and elevated) */}
            {topThree[0] && (
              <div className="bg-[#FFF9D6] rounded-3xl p-5 border-4 border-[#FFE779] shadow-lg text-center order-1 sm:order-2 sm:h-64 flex flex-col justify-end items-center space-y-2 relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FF5793] text-white text-[10px] uppercase font-black px-3.5 py-0.5 rounded-full shadow-xs border border-white">
                  Champion 👑
                </div>
                <div className="flex items-center gap-1.5 justify-center">
                  <span className="text-3xl">🏆</span>
                  {topThree[0].participantGender === 'male' ? (
                    <BoyCatSticker size="md" mood="happy" animated />
                  ) : (
                    <GirlCatSticker size="md" mood="happy" animated />
                  )}
                </div>
                <span className="text-xs font-black text-[#b38600] uppercase tracking-wider block">1st Place</span>
                <p className="font-black text-[#202B49] text-base truncate w-full">{topThree[0].participantName}</p>
                <div className="p-2.5 rounded-2xl bg-white font-mono text-xs border border-[#FFE779] w-full">
                  <span className="font-black text-[#202B49] text-base">{topThree[0].percentage}%</span>
                  <span className="text-[#b38600] font-bold block text-[10px]">({topThree[0].score}/{topThree[0].maxScore})</span>
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {topThree[2] ? (
              <div className="bg-[#FFE4EF]/40 rounded-3xl p-4 border-2 border-[#FF5793]/30 shadow-xs text-center order-3 sm:order-3 sm:h-52 flex flex-col justify-end items-center space-y-2">
                <div className="flex items-center gap-1.5 justify-center">
                  <span className="text-2xl">🥉</span>
                  {topThree[2].participantGender === 'male' ? (
                    <BoyCatSticker size="sm" animated={false} />
                  ) : (
                    <GirlCatSticker size="sm" animated={false} />
                  )}
                </div>
                <span className="text-xs font-black text-[#FF5793] uppercase tracking-wider block">3rd Place</span>
                <p className="font-black text-[#202B49] text-sm truncate w-full">{topThree[2].participantName}</p>
                <div className="p-2 rounded-2xl bg-white font-mono text-xs w-full border border-[#DFE8F2]">
                  <span className="font-black text-[#FF5793]">{topThree[2].percentage}%</span>
                  <span className="text-slate-400 block text-[10px]">({topThree[2].score}/{topThree[2].maxScore})</span>
                </div>
              </div>
            ) : (
              <div className="hidden sm:block order-3 h-52 bg-slate-50 rounded-3xl border-2 border-dashed border-[#DFE8F2]" />
            )}
          </div>
        </div>
      )}

      {/* Main Leaderboard Table Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-white shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-[#202B49] font-display">All Participants ({scoreboard.total})</h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">{scoreboard.tieBreakRule}</p>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search friend name..."
                className="w-full pl-8 pr-3 py-2.5 text-xs rounded-2xl border-2 border-[#DFE8F2] outline-none focus:border-[#0798FF] font-bold text-[#202B49]"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 bg-[#0798FF] hover:bg-[#0086e6] text-white font-black text-xs rounded-2xl shadow-xs cursor-pointer active:scale-95"
            >
              Filter
            </button>
          </form>
        </div>

        {scoreboard.items.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <div className="text-4xl">🐱</div>
            <p className="text-sm font-black text-[#202B49]">No participants found yet.</p>
            <p className="text-xs font-semibold">Be the very first friend to take the challenge!</p>
            <button
              onClick={() => onNavigate(`/quiz/${quizCode}`)}
              className="mt-3 px-6 py-3 bg-[#0798FF] hover:bg-[#0086e6] text-white font-black text-xs rounded-2xl shadow-[0_2px_0_#006fc5] cursor-pointer"
            >
              Take Quiz Now
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b-2 border-[#DFE8F2] text-[11px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Rank</th>
                  <th className="py-3 px-3">Friend</th>
                  <th className="py-3 px-3 font-mono">Score</th>
                  <th className="py-3 px-3 font-mono">Accuracy</th>
                  <th className="py-3 px-3 font-mono">Speed</th>
                  <th className="py-3 px-3">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DFE8F2]">
                {scoreboard.items.map((item) => {
                  const isTop = item.rank <= 3;
                  return (
                    <tr key={item.id} className="hover:bg-[#EDF6FF]/50 transition-colors">
                      <td className="py-3.5 px-3 font-black font-mono">
                        {item.rank === 1 ? '🥇 #1' : item.rank === 2 ? '🥈 #2' : item.rank === 3 ? '🥉 #3' : `#${item.rank}`}
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          {item.participantGender === 'male' ? (
                            <BoyCatSticker size="sm" animated={false} />
                          ) : (
                            <GirlCatSticker size="sm" animated={false} />
                          )}
                          <span className={`font-bold ${isTop ? 'text-[#0798FF]' : 'text-[#202B49]'}`}>
                            {item.participantName}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 font-mono font-black text-[#202B49]">
                        {item.score} / {item.maxScore}
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          item.percentage >= 80
                            ? 'bg-[#e6faf2] text-[#059669] border border-[#55D9AD]/30'
                            : item.percentage >= 50
                            ? 'bg-[#EDF6FF] text-[#0798FF] border border-[#59B9EF]/30'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {item.percentage}%
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-slate-500 font-semibold">
                        {formatTime(item.timeSpentSeconds)}
                      </td>
                      <td className="py-3.5 px-3 text-slate-400 font-semibold text-[11px]">
                        {new Date(item.submittedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination controls */}
        {scoreboard.totalPages > 1 && (
          <div className="pt-4 flex items-center justify-between border-t border-slate-100 text-xs">
            <span className="text-slate-400 font-mono">
              Page {scoreboard.page} of {scoreboard.totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={scoreboard.page <= 1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 font-semibold cursor-pointer"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(scoreboard.totalPages, p + 1))}
                disabled={scoreboard.page >= scoreboard.totalPages}
                className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 font-semibold cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Creator Dashboard quick entry if creator created this quiz */}
      {editToken && (
        <div className="p-4.5 rounded-3xl bg-[#FFF9D6] border-2 border-[#FFE779] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-lg">👑</span>
            <span className="font-black text-[#202B49]">You are recognized as the creator of this quiz.</span>
          </div>
          <button
            onClick={() => onNavigate(`/dashboard?code=${quizCode}`)}
            className="px-5 py-2.5 bg-[#0798FF] hover:bg-[#0086e6] text-white font-black rounded-2xl shadow-[0_2px_0_#006fc5] cursor-pointer transition-all active:scale-95"
          >
            Open Creator Dashboard →
          </button>
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        quizCode={quizCode}
        quizTitle={quizTitle}
        creatorName={creatorName}
      />
    </div>
  );
};
