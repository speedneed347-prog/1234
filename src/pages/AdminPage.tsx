import React, { useState, useEffect } from 'react';
import { api } from '../api/client.ts';
import { BankQuestion, QuizOption } from '../types.ts';
import { OptionPhotoModal } from '../components/OptionPhotoModal.tsx';
import { AdminPageCustomizerPanel } from '../components/AdminPageCustomizerPanel.tsx';
import { useTranslation } from '../i18n/LanguageContext.tsx';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Play,
  RotateCw,
  Trash2,
  Lock,
  Search,
  Flag,
  BarChart,
  LogOut,
  Plus,
  Edit3,
  Camera,
  Image as ImageIcon,
  Save,
  X,
  BookOpen,
  Check,
} from 'lucide-react';

export const AdminPage: React.FC<{ onNavigate?: (path: string) => void }> = ({ onNavigate }) => {
  const { t } = useTranslation();
  const [token, setToken] = useState<string>(() => localStorage.getItem('bffmeter_admin_token') || '');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [stats, setStats] = useState<any | null>(null);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [bankQuestions, setBankQuestions] = useState<BankQuestion[]>([]);
  const [tab, setTab] = useState<'quizzes' | 'bank' | 'customizer' | 'reports' | 'tests'>('quizzes');
  const [search, setSearch] = useState('');
  const [bankSearch, setBankSearch] = useState('');
  const [bankCategoryFilter, setBankCategoryFilter] = useState('All');

  // Question Bank Editor Modal state
  const [editingBankQuestion, setEditingBankQuestion] = useState<BankQuestion | null>(null);
  const [isNewQuestion, setIsNewQuestion] = useState(false);
  const [saveBankStatus, setSaveBankStatus] = useState('');

  // Live Quiz Questions Editor Modal state
  const [editingQuizData, setEditingQuizData] = useState<{
    code: string;
    title: string;
    creatorName: string;
    questions: any[];
  } | null>(null);
  const [saveQuizStatus, setSaveQuizStatus] = useState('');

  // Photo Attachment Modal state (reusable for both bank questions and quiz questions)
  const [photoModalState, setPhotoModalState] = useState<{
    isOpen: boolean;
    targetType: 'bank' | 'quiz';
    questionIdx?: number;
    optionIdx: number;
    currentImageUrl?: string;
    optionText: string;
  }>({
    isOpen: false,
    targetType: 'bank',
    optionIdx: 0,
    currentImageUrl: '',
    optionText: '',
  });

  // Automated test runner state
  const [testResults, setTestResults] = useState<any | null>(null);
  const [runningTests, setRunningTests] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await api.adminLogin(password);
      if (res.token) {
        setToken(res.token);
        localStorage.setItem('bffmeter_admin_token', res.token);
      }
    } catch (err: any) {
      setLoginError(err.message || 'Invalid admin credentials');
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('bffmeter_admin_token');
  };

  const loadAdminData = () => {
    if (!token) return;
    api
      .adminGetStats(token)
      .then((res) => setStats(res.stats))
      .catch((err) => {
        if (err.status === 403) handleLogout();
      });

    api
      .adminGetQuizzes(token)
      .then((res) => setQuizzes(res.quizzes))
      .catch(() => {});

    api
      .adminGetReports(token)
      .then((res) => setReports(res.reports))
      .catch(() => {});

    api
      .adminGetBankQuestions(token)
      .then((res) => setBankQuestions(res.questions || []))
      .catch(() => {});
  };

  useEffect(() => {
    if (token) {
      loadAdminData();
    }
  }, [token]);

  const handleToggleStatus = async (code: string) => {
    try {
      await api.adminToggleStatus(code, token);
      loadAdminData();
    } catch {
      alert('Failed to toggle quiz status');
    }
  };

  const handleDelete = async (code: string) => {
    if (!confirm(`Are you sure you want to delete quiz ${code}?`)) return;
    try {
      await api.adminDeleteQuiz(code, token);
      loadAdminData();
    } catch {
      alert('Failed to delete quiz');
    }
  };

  const handleRunTests = async () => {
    setRunningTests(true);
    try {
      const res = await api.runServerTests();
      setTestResults(res);
    } catch (err: any) {
      alert('Test suite execution failed: ' + err.message);
    } finally {
      setRunningTests(false);
    }
  };

  const handleDismissReport = async (id: string) => {
    try {
      await api.adminUpdateReport(id, 'dismissed', token);
      loadAdminData();
    } catch {
      alert('Failed to dismiss report');
    }
  };

  // --- Question Bank Actions ---
  const handleOpenNewBankQuestion = () => {
    setIsNewQuestion(true);
    setSaveBankStatus('');
    setEditingBankQuestion({
      id: '',
      category: 'Food & Snacking',
      categoryBn: 'খাবার ও নাস্তা',
      text: '',
      textBn: '',
      emoji: '🍕',
      options: [
        { id: 'opt-1', text: 'Option A', textBn: '', emoji: '🍜', imageUrl: '' },
        { id: 'opt-2', text: 'Option B', textBn: '', emoji: '🌶️', imageUrl: '' },
        { id: 'opt-3', text: 'Option C', textBn: '', emoji: '🍨', imageUrl: '' },
        { id: 'opt-4', text: 'Option D', textBn: '', emoji: '🍕', imageUrl: '' },
      ],
    });
  };

  const handleOpenEditBankQuestion = (q: BankQuestion) => {
    setIsNewQuestion(false);
    setSaveBankStatus('');
    setEditingBankQuestion(JSON.parse(JSON.stringify(q)));
  };

  const handleSaveBankQuestion = async () => {
    if (!editingBankQuestion) return;
    if (!editingBankQuestion.text.trim()) {
      alert('Question text is required');
      return;
    }

    try {
      setSaveBankStatus('Saving...');
      if (isNewQuestion) {
        await api.adminAddBankQuestion(token, {
          category: editingBankQuestion.category,
          categoryBn: editingBankQuestion.categoryBn,
          text: editingBankQuestion.text,
          textBn: editingBankQuestion.textBn,
          emoji: editingBankQuestion.emoji,
          options: editingBankQuestion.options,
        });
      } else {
        await api.adminUpdateBankQuestion(token, editingBankQuestion.id, {
          category: editingBankQuestion.category,
          categoryBn: editingBankQuestion.categoryBn,
          text: editingBankQuestion.text,
          textBn: editingBankQuestion.textBn,
          emoji: editingBankQuestion.emoji,
          options: editingBankQuestion.options,
        });
      }
      setSaveBankStatus('Saved successfully!');
      setTimeout(() => {
        setEditingBankQuestion(null);
        setSaveBankStatus('');
        loadAdminData();
      }, 700);
    } catch (err: any) {
      setSaveBankStatus('Error: ' + err.message);
    }
  };

  const handleDeleteBankQuestion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question from the bank?')) return;
    try {
      await api.adminDeleteBankQuestion(token, id);
      loadAdminData();
    } catch (err: any) {
      alert('Failed to delete question: ' + err.message);
    }
  };

  // --- Live Quiz Questions Editor Actions ---
  const handleOpenEditQuiz = async (code: string) => {
    try {
      setSaveQuizStatus('Loading quiz questions...');
      const res = await api.adminGetQuizFull(token, code);
      if (res.quiz) {
        setEditingQuizData({
          code: res.quiz.code,
          title: res.quiz.title,
          creatorName: res.quiz.creatorName,
          questions: JSON.parse(JSON.stringify(res.quiz.questions || [])),
        });
        setSaveQuizStatus('');
      }
    } catch (err: any) {
      alert('Could not load quiz questions: ' + err.message);
    }
  };

  const handleSaveQuizQuestions = async () => {
    if (!editingQuizData) return;
    try {
      setSaveQuizStatus('Saving quiz questions...');
      await api.adminUpdateQuizQuestions(token, editingQuizData.code, editingQuizData.questions);
      setSaveQuizStatus('Saved successfully!');
      setTimeout(() => {
        setEditingQuizData(null);
        setSaveQuizStatus('');
        loadAdminData();
      }, 700);
    } catch (err: any) {
      setSaveQuizStatus('Error: ' + err.message);
    }
  };

  if (!token) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-white shadow-xl text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#EDF6FF] text-[#0798FF] border-2 border-[#DFE8F2] flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-xs font-black text-[#0798FF] uppercase tracking-wider block">🐾 Staff Access</span>
            <h2 className="text-xl font-black text-[#202B49] font-display mt-1">Moderator Portal Login</h2>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Authorized access for platform governance, content moderation, and verification.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3 pt-2">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin passcode (manojit12#@)"
              className="w-full px-4 py-3 rounded-2xl border-2 border-[#DFE8F2] text-xs font-mono font-bold text-[#202B49] outline-none focus:border-[#0798FF] focus:ring-2 focus:ring-[#59B9EF]/30"
              autoFocus
            />
            {loginError && <p className="text-xs text-[#FF5793] font-black">{loginError}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-[#0798FF] hover:bg-[#0086e6] text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-[0_3px_0_#006fc5] active:translate-y-0.5 active:shadow-none cursor-pointer transition-all"
            >
              Sign In
            </button>
            <p className="text-[11px] text-slate-400 font-medium">Admin Master Passcode: <code className="font-mono font-bold text-[#0798FF]">manojit12#@</code></p>
          </form>
        </div>
      </div>
    );
  }

  const filteredQuizzes = quizzes.filter(
    (q) =>
      q.code.toLowerCase().includes(search.toLowerCase()) ||
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.creatorName.toLowerCase().includes(search.toLowerCase())
  );

  const bankCategories = ['All', ...Array.from(new Set(bankQuestions.map((q) => q.category)))];
  const filteredBankQuestions = bankQuestions.filter((q) => {
    const matchesCategory = bankCategoryFilter === 'All' || q.category === bankCategoryFilter;
    const matchesSearch =
      !bankSearch ||
      q.text.toLowerCase().includes(bankSearch.toLowerCase()) ||
      (q.textBn && q.textBn.includes(bankSearch)) ||
      q.category.toLowerCase().includes(bankSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black text-[#0798FF] uppercase tracking-wider block">🐾 System Administration</span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#202B49] font-display">Moderation &amp; Question Console</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAdminData}
            className="px-4 py-2.5 rounded-2xl bg-white border-2 border-[#DFE8F2] text-[#202B49] hover:bg-[#EDF6FF] text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-2xl bg-white border-2 border-[#FFE4EF] text-[#FF5793] hover:bg-[#FFE4EF] text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Stats KPI */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl p-5 border-4 border-white shadow-md">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">Total Quizzes</span>
            <p className="text-2xl font-black text-[#202B49] mt-1 font-display">{stats.totalQuizzes}</p>
          </div>
          <div className="bg-white rounded-3xl p-5 border-4 border-white shadow-md">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">Question Bank Items</span>
            <p className="text-2xl font-black text-[#0798FF] mt-1 font-display">{bankQuestions.length}</p>
          </div>
          <div className="bg-white rounded-3xl p-5 border-4 border-white shadow-md">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">Total Attempts</span>
            <p className="text-2xl font-black text-[#059669] mt-1 font-display">{stats.totalAttempts}</p>
          </div>
          <div className="bg-white rounded-3xl p-5 border-4 border-white shadow-md">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">Pending Reports</span>
            <p className={`text-2xl font-black mt-1 font-display ${stats.pendingReports > 0 ? 'text-[#FF5793]' : 'text-slate-400'}`}>
              {stats.pendingReports}
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b-2 border-[#DFE8F2] pb-3 overflow-x-auto">
        <button
          onClick={() => setTab('quizzes')}
          className={`px-5 py-2.5 text-xs font-black rounded-2xl transition-all cursor-pointer whitespace-nowrap border-2 ${
            tab === 'quizzes'
              ? 'bg-[#0798FF] text-white border-[#0798FF] shadow-xs'
              : 'bg-white text-slate-700 border-[#DFE8F2] hover:bg-[#EDF6FF]'
          }`}
        >
          All Quizzes ({quizzes.length})
        </button>

        <button
          onClick={() => setTab('bank')}
          className={`px-5 py-2.5 text-xs font-black rounded-2xl transition-all cursor-pointer whitespace-nowrap border-2 ${
            tab === 'bank'
              ? 'bg-[#0798FF] text-white border-[#0798FF] shadow-xs'
              : 'bg-white text-slate-700 border-[#DFE8F2] hover:bg-[#EDF6FF]'
          }`}
        >
          📚 Question Bank &amp; Options ({bankQuestions.length})
        </button>

        <button
          onClick={() => setTab('customizer')}
          className={`px-5 py-2.5 text-xs font-black rounded-2xl transition-all cursor-pointer whitespace-nowrap border-2 ${
            tab === 'customizer'
              ? 'bg-[#0798FF] text-white border-[#0798FF] shadow-xs'
              : 'bg-white text-slate-700 border-[#DFE8F2] hover:bg-[#EDF6FF]'
          }`}
        >
          🎨 Live Site Customizer &amp; Drag Builder
        </button>

        <button
          onClick={() => setTab('reports')}
          className={`px-5 py-2.5 text-xs font-black rounded-2xl transition-all cursor-pointer whitespace-nowrap border-2 ${
            tab === 'reports'
              ? 'bg-[#0798FF] text-white border-[#0798FF] shadow-xs'
              : 'bg-white text-slate-700 border-[#DFE8F2] hover:bg-[#EDF6FF]'
          }`}
        >
          Content Reports ({reports.length})
        </button>

        <button
          onClick={() => setTab('tests')}
          className={`px-5 py-2.5 text-xs font-black rounded-2xl transition-all cursor-pointer whitespace-nowrap border-2 ${
            tab === 'tests'
              ? 'bg-[#FF5793] text-white border-[#FF5793] shadow-xs'
              : 'bg-white text-slate-700 border-[#DFE8F2] hover:bg-[#FFE4EF]'
          }`}
        >
          Automated Verification Tests
        </button>
      </div>

      {/* TAB 1: Quizzes Management Tab */}
      {tab === 'quizzes' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-white shadow-xl space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search code, title, creator..."
                className="w-full pl-8 pr-3 py-2.5 text-xs font-bold rounded-2xl border-2 border-[#DFE8F2] text-[#202B49] outline-none focus:border-[#0798FF]"
              />
            </div>
            <span className="text-xs text-slate-400 font-mono font-bold">
              Showing {filteredQuizzes.length} records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b-2 border-[#DFE8F2] text-[11px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Code</th>
                  <th className="py-2.5 px-3">Title &amp; Creator</th>
                  <th className="py-2.5 px-3">Questions</th>
                  <th className="py-2.5 px-3">Attempts</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DFE8F2]">
                {filteredQuizzes.map((q) => (
                  <tr key={q.code} className="hover:bg-[#EDF6FF]/40 transition-colors">
                    <td className="py-3 px-3 font-mono font-black text-[#0798FF]">{q.code}</td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-[#202B49]">{q.title}</p>
                      <p className="text-[11px] text-slate-400 font-semibold">{q.creatorName}</p>
                    </td>
                    <td className="py-3 px-3 font-black text-[#202B49]">{q.questionsCount}</td>
                    <td className="py-3 px-3 font-mono font-bold">{q.attemptsCount}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        q.isActive ? 'bg-[#e6faf2] text-[#059669]' : 'bg-[#FFE4EF] text-[#FF5793]'
                      }`}>
                        {q.isActive ? 'Active' : 'Closed'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEditQuiz(q.code)}
                        className="px-3 py-1.5 rounded-xl bg-[#EDF6FF] hover:bg-[#dfe8f2] text-[#0798FF] text-[11px] font-black cursor-pointer shadow-2xs"
                        title="Customize questions, options, and photos for this quiz"
                      >
                        ✏️ Edit Questions &amp; Photos
                      </button>
                      <button
                        onClick={() => handleToggleStatus(q.code)}
                        className="px-2.5 py-1 rounded-xl border border-[#DFE8F2] text-[11px] font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                      >
                        {q.isActive ? 'Pause' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(q.code)}
                        className="px-2.5 py-1 rounded-xl text-[#FF5793] hover:bg-[#FFE4EF] text-[11px] font-bold cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Question Bank & Options Manager */}
      {tab === 'bank' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-white shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-[#202B49] font-display flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#0798FF]" />
                <span>Question Bank &amp; Options Customizer</span>
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Manage global question templates. Customize option text, emojis, and attach custom photos for options.
              </p>
            </div>

            <button
              onClick={handleOpenNewBankQuestion}
              className="px-5 py-2.5 bg-[#0798FF] hover:bg-[#0086e6] text-white font-black text-xs rounded-2xl shadow-[0_2px_0_#006fc5] flex items-center gap-1.5 cursor-pointer whitespace-nowrap self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Add New Bank Question</span>
            </button>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={bankSearch}
                onChange={(e) => setBankSearch(e.target.value)}
                placeholder="Search question text or options..."
                className="w-full pl-8 pr-3 py-2.5 text-xs font-bold rounded-2xl border-2 border-[#DFE8F2] text-[#202B49] outline-none focus:border-[#0798FF]"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {bankCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setBankCategoryFilter(cat)}
                  className={`px-3 py-2 rounded-xl text-xs font-black transition-colors cursor-pointer whitespace-nowrap border ${
                    bankCategoryFilter === cat
                      ? 'bg-[#0798FF] text-white border-[#0798FF]'
                      : 'bg-[#EDF6FF] text-[#202B49] border-[#DFE8F2] hover:bg-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Question Bank Items List */}
          <div className="space-y-4">
            {filteredBankQuestions.length === 0 ? (
              <div className="p-12 text-center text-slate-400 font-bold text-xs space-y-2">
                <p>No questions found matching your filter.</p>
              </div>
            ) : (
              filteredBankQuestions.map((bq, bqIdx) => (
                <div
                  key={bq.id}
                  className="p-5 rounded-3xl bg-[#EDF6FF]/40 border-2 border-[#DFE8F2] hover:border-[#59B9EF] transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{bq.emoji}</span>
                        <h4 className="font-black text-sm text-[#202B49]">{bq.text}</h4>
                        {bq.textBn && (
                          <span className="text-xs text-slate-400 font-semibold">({bq.textBn})</span>
                        )}
                      </div>
                      <span className="inline-block text-[10px] font-black uppercase text-[#0798FF] bg-white px-2.5 py-0.5 rounded-full border border-[#DFE8F2]">
                        {bq.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleOpenEditBankQuestion(bq)}
                        className="px-3.5 py-1.5 rounded-xl bg-white border border-[#DFE8F2] hover:border-[#0798FF] text-[#0798FF] text-xs font-black flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Options &amp; Photos</span>
                      </button>

                      <button
                        onClick={() => handleDeleteBankQuestion(bq.id)}
                        className="p-1.5 rounded-xl bg-white border border-[#FFE4EF] text-[#FF5793] hover:bg-[#FFE4EF] cursor-pointer shadow-xs"
                        title="Delete question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Options List Preview with Photo Badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-2 border-t border-[#DFE8F2]/60">
                    {bq.options.map((opt, optIdx) => (
                      <div
                        key={opt.id}
                        className="p-2.5 rounded-2xl bg-white border border-[#DFE8F2] flex items-center gap-2 text-xs"
                      >
                        {opt.imageUrl ? (
                          <img
                            src={opt.imageUrl}
                            alt={opt.text}
                            className="w-8 h-8 rounded-lg object-cover border border-[#DFE8F2] shrink-0"
                          />
                        ) : (
                          <span className="text-base shrink-0">{opt.emoji || '✨'}</span>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-[#202B49] truncate">{opt.text}</p>
                          {opt.textBn && (
                            <p className="text-[10px] text-slate-400 truncate">{opt.textBn}</p>
                          )}
                        </div>
                        {opt.imageUrl && (
                          <span className="text-[9px] font-black text-[#0798FF] bg-[#EDF6FF] px-1 py-0.5 rounded">
                            Photo
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB: Visual Site Customizer & Drag Builder */}
      {tab === 'customizer' && <AdminPageCustomizerPanel onNavigate={onNavigate} />}

      {/* TAB 3: Content Reports Tab */}
      {tab === 'reports' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-white shadow-xl space-y-4">
          <h3 className="text-base font-black text-[#202B49] font-display">User Flagged Quizzes</h3>
          {reports.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center font-bold">No pending abuse reports.</p>
          ) : (
            <div className="space-y-3">
              {reports.map((rep) => (
                <div key={rep.id} className="p-4 rounded-2xl bg-[#EDF6FF]/60 border-2 border-[#DFE8F2] flex items-start justify-between text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#202B49]">{rep.quizTitle}</span>
                      <span className="font-mono text-slate-400">({rep.quizCode})</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#FFE4EF] text-[#FF5793] border border-[#FF5793]/30">
                        {rep.reason}
                      </span>
                    </div>
                    <p className="text-slate-600 italic">&ldquo;{rep.details}&rdquo;</p>
                    <p className="text-[10px] text-slate-400">{new Date(rep.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDismissReport(rep.id)}
                      className="px-3.5 py-2 rounded-xl border-2 border-[#DFE8F2] text-[#202B49] hover:bg-white text-xs font-black cursor-pointer"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() => handleDelete(rep.quizCode)}
                      className="px-3.5 py-2 rounded-xl bg-[#FF5793] hover:bg-[#e0457f] text-white text-xs font-black cursor-pointer shadow-xs"
                    >
                      Remove Quiz
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Automated Tests Tab */}
      {tab === 'tests' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-white shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-[#202B49] font-display">System Automated Verification Suite</h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Execute live programmatic tests directly against server scoring, security invariants, and ranking policies.
              </p>
            </div>
            <button
              onClick={handleRunTests}
              disabled={runningTests}
              className="px-6 py-3 rounded-2xl bg-[#0798FF] hover:bg-[#0086e6] text-white text-xs font-black flex items-center gap-2 shadow-[0_3px_0_#006fc5] active:translate-y-0.5 active:shadow-none cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 stroke-[3]" />
              <span>{runningTests ? 'Running Assertions...' : 'Run All Tests Now'}</span>
            </button>
          </div>

          {testResults && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#EDF6FF] border-2 border-[#DFE8F2] flex items-center justify-between text-xs">
                <span className="font-bold text-[#202B49]">
                  Overall Status: {testResults.allPassed ? 'ALL PASSED ✅' : 'FAILURES DETECTED ❌'}
                </span>
                <span className="font-mono text-slate-500 font-bold">
                  {testResults.passedCount} / {testResults.totalTests} tests passed
                </span>
              </div>

              <div className="space-y-2">
                {testResults.results.map((r: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border-2 text-xs flex items-start gap-3 ${
                      r.passed
                        ? 'bg-[#e6faf2] border-[#55D9AD] text-[#059669]'
                        : 'bg-[#FFE4EF] border-[#FF5793] text-[#FF5793]'
                    }`}
                  >
                    {r.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-[#FF5793] shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-black">{r.test}</p>
                      <p className="text-[11px] opacity-80 mt-0.5 font-semibold">{r.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: Edit Question Bank Question & Options */}
      {editingBankQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full border-4 border-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-[#59B9EF] p-5 text-white flex items-center justify-between border-b-2 border-[#0798FF]/30">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-white text-[#0798FF] flex items-center justify-center text-lg font-black shadow-xs">
                  📝
                </div>
                <div>
                  <h3 className="text-base font-black font-display text-white">
                    {isNewQuestion ? 'Add Question to Bank' : 'Customize Question & Options'}
                  </h3>
                  <p className="text-[11px] text-white/90 font-bold">
                    Configure question text, answers, emojis, and attach custom photos
                  </p>
                </div>
              </div>

              <button
                onClick={() => setEditingBankQuestion(null)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {saveBankStatus && (
                <div className="p-3 rounded-2xl bg-[#EDF6FF] border border-[#0798FF] text-[#0798FF] text-xs font-black">
                  {saveBankStatus}
                </div>
              )}

              {/* Question Text & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-black text-[#202B49] uppercase">Question Text (English)</label>
                  <input
                    type="text"
                    value={editingBankQuestion.text}
                    onChange={(e) => setEditingBankQuestion({ ...editingBankQuestion, text: e.target.value })}
                    placeholder="e.g. What is my comfort midnight snack?"
                    className="w-full px-4 py-2.5 text-xs font-bold rounded-2xl border-2 border-[#DFE8F2] outline-none focus:border-[#0798FF]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-[#202B49] uppercase">Category</label>
                  <input
                    type="text"
                    value={editingBankQuestion.category}
                    onChange={(e) => setEditingBankQuestion({ ...editingBankQuestion, category: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs font-bold rounded-2xl border-2 border-[#DFE8F2] outline-none focus:border-[#0798FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-black text-[#202B49] uppercase">Bengali Question (বাংলা)</label>
                  <input
                    type="text"
                    value={editingBankQuestion.textBn || ''}
                    onChange={(e) => setEditingBankQuestion({ ...editingBankQuestion, textBn: e.target.value })}
                    placeholder="যেমন: মধ্যরাতে আমার সেরা খাবার কোনটা?"
                    className="w-full px-4 py-2.5 text-xs font-bold rounded-2xl border-2 border-[#DFE8F2] outline-none focus:border-[#0798FF]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-[#202B49] uppercase">Emoji Icon</label>
                  <input
                    type="text"
                    value={editingBankQuestion.emoji}
                    onChange={(e) => setEditingBankQuestion({ ...editingBankQuestion, emoji: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs font-bold rounded-2xl border-2 border-[#DFE8F2] outline-none focus:border-[#0798FF]"
                  />
                </div>
              </div>

              {/* Options Section */}
              <div className="space-y-3 pt-3 border-t border-[#DFE8F2]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-[#202B49] uppercase tracking-wider">
                    Question Options ({editingBankQuestion.options.length})
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const copy = [...editingBankQuestion.options];
                      copy.push({
                        id: `opt-${Date.now()}`,
                        text: `New Option ${copy.length + 1}`,
                        textBn: '',
                        emoji: '✨',
                        imageUrl: '',
                      });
                      setEditingBankQuestion({ ...editingBankQuestion, options: copy });
                    }}
                    className="px-3 py-1 bg-[#EDF6FF] hover:bg-[#dfe8f2] text-[#0798FF] font-black text-xs rounded-xl border border-[#DFE8F2] cursor-pointer"
                  >
                    + Add Option
                  </button>
                </div>

                <div className="space-y-2.5">
                  {editingBankQuestion.options.map((opt, oIdx) => (
                    <div
                      key={opt.id || oIdx}
                      className="p-3.5 rounded-2xl bg-[#EDF6FF]/50 border-2 border-[#DFE8F2] flex flex-col sm:flex-row items-center gap-3"
                    >
                      <span className="text-xs font-black text-slate-400 shrink-0">
                        #{oIdx + 1}
                      </span>

                      {/* Photo Thumbnail or Attach Button */}
                      {opt.imageUrl ? (
                        <div
                          className="relative group shrink-0 cursor-pointer"
                          onClick={() => {
                            setPhotoModalState({
                              isOpen: true,
                              targetType: 'bank',
                              optionIdx: oIdx,
                              currentImageUrl: opt.imageUrl,
                              optionText: opt.text,
                            });
                          }}
                          title="Click to edit/replace photo"
                        >
                          <img
                            src={opt.imageUrl}
                            alt="Option photo"
                            className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-xs"
                          />
                          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#0798FF] text-white text-[9px] flex items-center justify-center font-bold">
                            📷
                          </span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setPhotoModalState({
                              isOpen: true,
                              targetType: 'bank',
                              optionIdx: oIdx,
                              currentImageUrl: '',
                              optionText: opt.text,
                            });
                          }}
                          className="px-2.5 py-1.5 rounded-xl border border-dashed border-[#59B9EF] hover:bg-white text-[#0798FF] text-[11px] font-black flex items-center gap-1 cursor-pointer shrink-0"
                          title="Attach custom photo"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>+ Photo</span>
                        </button>
                      )}

                      <input
                        type="text"
                        value={opt.emoji || ''}
                        onChange={(e) => {
                          const copy = [...editingBankQuestion.options];
                          copy[oIdx].emoji = e.target.value;
                          setEditingBankQuestion({ ...editingBankQuestion, options: copy });
                        }}
                        className="w-9 text-center text-base bg-white rounded-xl border border-[#DFE8F2] py-1 shrink-0 outline-none"
                        title="Option Emoji"
                      />

                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => {
                          const copy = [...editingBankQuestion.options];
                          copy[oIdx].text = e.target.value;
                          setEditingBankQuestion({ ...editingBankQuestion, options: copy });
                        }}
                        placeholder="Option text (English)"
                        className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-[#DFE8F2] text-xs font-bold text-[#202B49] outline-none"
                      />

                      <input
                        type="text"
                        value={opt.textBn || ''}
                        onChange={(e) => {
                          const copy = [...editingBankQuestion.options];
                          copy[oIdx].textBn = e.target.value;
                          setEditingBankQuestion({ ...editingBankQuestion, options: copy });
                        }}
                        placeholder="অপশন টেক্সট (বাংলা)"
                        className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-[#DFE8F2] text-xs font-bold text-[#202B49] outline-none"
                      />

                      {editingBankQuestion.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => {
                            const copy = [...editingBankQuestion.options];
                            copy.splice(oIdx, 1);
                            setEditingBankQuestion({ ...editingBankQuestion, options: copy });
                          }}
                          className="text-[#FF5793] hover:text-rose-700 p-1 cursor-pointer shrink-0"
                          title="Delete option"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-[#DFE8F2] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingBankQuestion(null)}
                className="px-4 py-2.5 rounded-2xl border-2 border-[#DFE8F2] text-[#202B49] hover:bg-slate-100 text-xs font-black cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveBankQuestion}
                className="px-6 py-2.5 rounded-2xl bg-[#0798FF] hover:bg-[#0086e6] text-white font-black text-xs shadow-[0_3px_0_#006fc5] active:translate-y-0.5 active:shadow-none flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Question &amp; Options</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Edit Live Quiz Questions & Options */}
      {editingQuizData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-3xl w-full border-4 border-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-[#0798FF] p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-black font-display text-white">
                  Customize Quiz Questions: {editingQuizData.title}
                </h3>
                <p className="text-[11px] text-white/90 font-bold">
                  Code: <code className="font-mono bg-white/20 px-1.5 py-0.5 rounded">{editingQuizData.code}</code> · Creator: {editingQuizData.creatorName}
                </p>
              </div>

              <button
                onClick={() => setEditingQuizData(null)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {saveQuizStatus && (
                <div className="p-3 rounded-2xl bg-[#EDF6FF] border border-[#0798FF] text-[#0798FF] text-xs font-black">
                  {saveQuizStatus}
                </div>
              )}

              {editingQuizData.questions.map((q, qIdx) => (
                <div
                  key={q.id || qIdx}
                  className="p-4 rounded-3xl bg-[#EDF6FF]/40 border-2 border-[#DFE8F2] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#0798FF]">
                      Question #{qIdx + 1}
                    </span>
                    <span className="text-[10px] uppercase font-black text-[#FF5793] bg-[#FFE4EF] px-2 py-0.5 rounded-lg">
                      Correct Answer Marked
                    </span>
                  </div>

                  <input
                    type="text"
                    value={q.text}
                    onChange={(e) => {
                      const copy = [...editingQuizData.questions];
                      copy[qIdx].text = e.target.value;
                      setEditingQuizData({ ...editingQuizData, questions: copy });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DFE8F2] text-xs font-bold text-[#202B49] outline-none"
                  />

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {q.options.map((opt: QuizOption, oIdx: number) => {
                      const isCorrect = q.correctOptionId === opt.id;
                      return (
                        <div
                          key={opt.id || oIdx}
                          className={`p-2.5 rounded-2xl border-2 flex items-center gap-2 text-xs ${
                            isCorrect
                              ? 'bg-[#e6faf2] border-[#55D9AD]'
                              : 'bg-white border-[#DFE8F2]'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              const copy = [...editingQuizData.questions];
                              copy[qIdx].correctOptionId = opt.id;
                              setEditingQuizData({ ...editingQuizData, questions: copy });
                            }}
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 cursor-pointer ${
                              isCorrect ? 'bg-[#55D9AD] text-white' : 'border border-slate-300 text-transparent'
                            }`}
                          >
                            ✓
                          </button>

                          {/* Photo */}
                          {opt.imageUrl ? (
                            <img
                              src={opt.imageUrl}
                              alt="Option"
                              onClick={() => {
                                setPhotoModalState({
                                  isOpen: true,
                                  targetType: 'quiz',
                                  questionIdx: qIdx,
                                  optionIdx: oIdx,
                                  currentImageUrl: opt.imageUrl,
                                  optionText: opt.text,
                                });
                              }}
                              className="w-8 h-8 rounded-lg object-cover border border-[#DFE8F2] shrink-0 cursor-pointer"
                            />
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setPhotoModalState({
                                  isOpen: true,
                                  targetType: 'quiz',
                                  questionIdx: qIdx,
                                  optionIdx: oIdx,
                                  currentImageUrl: '',
                                  optionText: opt.text,
                                });
                              }}
                              className="px-2 py-1 rounded-lg border border-dashed border-[#59B9EF] text-[#0798FF] text-[10px] font-black shrink-0 cursor-pointer"
                            >
                              + Photo
                            </button>
                          )}

                          <input
                            type="text"
                            value={opt.text}
                            onChange={(e) => {
                              const copy = [...editingQuizData.questions];
                              copy[qIdx].options[oIdx].text = e.target.value;
                              setEditingQuizData({ ...editingQuizData, questions: copy });
                            }}
                            className="flex-1 bg-transparent font-bold outline-none text-[#202B49]"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-50 border-t border-[#DFE8F2] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingQuizData(null)}
                className="px-4 py-2.5 rounded-2xl border-2 border-[#DFE8F2] text-[#202B49] text-xs font-black cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveQuizQuestions}
                className="px-6 py-2.5 rounded-2xl bg-[#0798FF] hover:bg-[#0086e6] text-white font-black text-xs shadow-[0_3px_0_#006fc5] active:translate-y-0.5 active:shadow-none cursor-pointer"
              >
                Save All Quiz Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REUSABLE OPTION PHOTO MODAL FOR ADMIN */}
      <OptionPhotoModal
        isOpen={photoModalState.isOpen}
        onClose={() => setPhotoModalState((prev) => ({ ...prev, isOpen: false }))}
        currentImageUrl={photoModalState.currentImageUrl}
        optionLabel={photoModalState.optionText}
        onSelectPhoto={(url) => {
          if (photoModalState.targetType === 'bank' && editingBankQuestion) {
            const copy = [...editingBankQuestion.options];
            copy[photoModalState.optionIdx].imageUrl = url;
            setEditingBankQuestion({ ...editingBankQuestion, options: copy });
          } else if (photoModalState.targetType === 'quiz' && editingQuizData && photoModalState.questionIdx !== undefined) {
            const copy = [...editingQuizData.questions];
            copy[photoModalState.questionIdx].options[photoModalState.optionIdx].imageUrl = url;
            setEditingQuizData({ ...editingQuizData, questions: copy });
          }
        }}
        onRemovePhoto={() => {
          if (photoModalState.targetType === 'bank' && editingBankQuestion) {
            const copy = [...editingBankQuestion.options];
            delete copy[photoModalState.optionIdx].imageUrl;
            setEditingBankQuestion({ ...editingBankQuestion, options: copy });
          } else if (photoModalState.targetType === 'quiz' && editingQuizData && photoModalState.questionIdx !== undefined) {
            const copy = [...editingQuizData.questions];
            delete copy[photoModalState.questionIdx].options[photoModalState.optionIdx].imageUrl;
            setEditingQuizData({ ...editingQuizData, questions: copy });
          }
        }}
      />
    </div>
  );
};
