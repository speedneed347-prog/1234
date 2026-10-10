import React, { useState, useEffect } from 'react';
import { api } from '../api/client.ts';
import { useStoredQuizzes } from '../hooks/useStoredQuizzes.ts';
import { OptionPhotoModal } from '../components/OptionPhotoModal.tsx';
import { ArrowLeft, Save, Plus, Trash2, CheckCircle2, Camera } from 'lucide-react';

interface EditQuizPageProps {
  quizCode: string;
  onNavigate: (path: string) => void;
}

export const EditQuizPage: React.FC<EditQuizPageProps> = ({
  quizCode,
  onNavigate,
}) => {
  const { getTokenForQuiz } = useStoredQuizzes();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [allowMultipleAttempts, setAllowMultipleAttempts] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [token, setToken] = useState<string>('');

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

  useEffect(() => {
    let t = getTokenForQuiz(quizCode);
    if (!t && quizCode === 'bm-maya26') t = 'token-maya-secret-demo';
    if (!t && quizCode === 'bm-leo99') t = 'token-leo-secret-demo';
    if (!t && quizCode === 'bm-zoe01') t = 'token-zoe-secret-demo';

    if (!t) {
      setError('Missing creator edit token. Please access edit mode from the dashboard.');
      setLoading(false);
      return;
    }

    setToken(t);
    api
      .getQuizAdmin(quizCode, t)
      .then((res) => {
        if (res.quiz) {
          setTitle(res.quiz.title);
          setDescription(res.quiz.description || '');
          setAllowMultipleAttempts(res.quiz.settings?.allowMultipleAttempts ?? false);
          setQuestions(res.quiz.questions || []);
        }
      })
      .catch((err) => setError(err.message || 'Could not load quiz for editing.'))
      .finally(() => setLoading(false));
  }, [quizCode]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Quiz title is required');
      return;
    }

    setIsSaving(true);
    setSuccessMsg('');
    setError('');

    try {
      await api.updateQuiz(quizCode, token, {
        title: title.trim(),
        description: description.trim(),
        settings: { allowMultipleAttempts },
        questions,
      });

      setSuccessMsg('Quiz updated successfully!');
      setTimeout(() => {
        onNavigate(`/dashboard?code=${quizCode}`);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to update quiz');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#59B9EF]/40 border-t-[#0798FF] rounded-full animate-spin mx-auto" />
        <p className="text-sm font-bold text-slate-600">Loading quiz settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate(`/dashboard?code=${quizCode}`)}
          className="text-xs font-black text-[#0798FF] hover:text-[#0070c0] flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 stroke-[3]" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-white shadow-xl space-y-6">
        <div>
          <span className="text-xs font-black text-[#0798FF] uppercase tracking-wider block">🐾 Edit Quiz</span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#202B49] font-display">Update Questions &amp; Settings</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">Changes are saved immediately and update future friend attempts.</p>
        </div>

        {successMsg && (
          <div className="p-4 rounded-2xl bg-[#e6faf2] border-2 border-[#55D9AD] text-[#059669] text-xs font-black flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#55D9AD]" />
            <span>{successMsg}</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-[#FFE4EF] border-2 border-[#FF5793] text-[#FF5793] text-xs font-black">
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-black text-[#202B49] uppercase block mb-1">Quiz Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-[#DFE8F2] text-sm font-bold text-[#202B49] outline-none focus:border-[#0798FF] focus:ring-2 focus:ring-[#59B9EF]/30"
              />
            </div>

            <div>
              <label className="text-xs font-black text-[#202B49] uppercase block mb-1">Challenge Note</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-4 py-2.5 text-xs font-bold rounded-2xl border-2 border-[#DFE8F2] outline-none focus:border-[#0798FF] focus:ring-2 focus:ring-[#59B9EF]/30"
              />
            </div>

            <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#EDF6FF] border-2 border-[#DFE8F2] cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={allowMultipleAttempts}
                onChange={(e) => setAllowMultipleAttempts(e.target.checked)}
                className="w-4 h-4 text-[#0798FF] rounded"
              />
              <span className="font-bold text-[#202B49]">Allow multiple attempts from the same friend name</span>
            </label>
          </div>

          {/* Questions list */}
          <div className="space-y-4 pt-4 border-t border-[#DFE8F2]">
            <h3 className="text-sm font-black text-[#202B49] uppercase tracking-wider">
              Questions ({questions.length})
            </h3>

            {questions.map((q, idx) => (
              <div key={q.id} className="p-4 rounded-2xl bg-[#EDF6FF]/50 border-2 border-[#DFE8F2] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#0798FF]">Question #{idx + 1}</span>
                  <span className="text-[10px] text-[#FF5793] font-black uppercase">Target Correct Answer Marked</span>
                </div>

                <input
                  type="text"
                  value={q.text}
                  onChange={(e) => {
                    const copy = [...questions];
                    copy[idx].text = e.target.value;
                    setQuestions(copy);
                  }}
                  className="w-full px-4 py-2.5 text-xs font-bold rounded-xl border-2 border-[#DFE8F2] bg-white outline-none focus:border-[#0798FF]"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt: any, oIdx: number) => {
                    const isCorrect = q.correctOptionId === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => {
                          const copy = [...questions];
                          copy[idx].correctOptionId = opt.id;
                          setQuestions(copy);
                        }}
                        className={`p-3 rounded-xl border-2 flex items-center gap-2 cursor-pointer text-xs ${
                          isCorrect
                            ? 'bg-[#e6faf2] border-[#55D9AD] font-black text-[#059669]'
                            : 'bg-white border-[#DFE8F2]'
                        }`}
                      >
                        <span className="font-black shrink-0">{isCorrect ? '✓' : '○'}</span>

                        {/* Photo Attachment Thumbnail or Button */}
                        {opt.imageUrl ? (
                          <div
                            className="relative group shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPhotoModalState({
                                isOpen: true,
                                questionIdx: idx,
                                optionIdx: oIdx,
                                currentImageUrl: opt.imageUrl,
                                optionText: opt.text,
                              });
                            }}
                            title="Click to edit or remove photo"
                          >
                            <img
                              src={opt.imageUrl}
                              alt="Option"
                              className="w-8 h-8 rounded-lg object-cover border border-[#DFE8F2] shadow-2xs"
                            />
                            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#0798FF] text-white text-[8px] flex items-center justify-center font-bold">
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
                                questionIdx: idx,
                                optionIdx: oIdx,
                                currentImageUrl: '',
                                optionText: opt.text,
                              });
                            }}
                            className="p-1 rounded-lg border border-dashed border-[#59B9EF] hover:bg-[#EDF6FF] text-[#0798FF] text-[10px] font-black flex items-center gap-0.5 shrink-0"
                            title="Attach Photo"
                          >
                            <Camera className="w-3 h-3" />
                            <span>+ Photo</span>
                          </button>
                        )}

                        <input
                          type="text"
                          value={opt.text}
                          onChange={(e) => {
                            e.stopPropagation();
                            const copy = [...questions];
                            copy[idx].options[oIdx].text = e.target.value;
                            setQuestions(copy);
                          }}
                          className="flex-1 bg-transparent font-bold outline-none min-w-0"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#DFE8F2]">
            <button
              type="button"
              onClick={() => onNavigate(`/dashboard?code=${quizCode}`)}
              className="px-5 py-2.5 rounded-2xl border-2 border-[#DFE8F2] text-xs font-black text-[#202B49] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-7 py-3 rounded-2xl bg-[#0798FF] hover:bg-[#0086e6] text-white font-black text-xs flex items-center gap-2 shadow-[0_3px_0_#006fc5] active:translate-y-0.5 active:shadow-none cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Option Photo Attachment Modal */}
      <OptionPhotoModal
        isOpen={photoModalState.isOpen}
        onClose={() => setPhotoModalState((prev) => ({ ...prev, isOpen: false }))}
        currentImageUrl={photoModalState.currentImageUrl}
        optionLabel={photoModalState.optionText}
        onSelectPhoto={(url) => {
          const copy = [...questions];
          copy[photoModalState.questionIdx].options[photoModalState.optionIdx].imageUrl = url;
          setQuestions(copy);
        }}
        onRemovePhoto={() => {
          const copy = [...questions];
          delete copy[photoModalState.questionIdx].options[photoModalState.optionIdx].imageUrl;
          setQuestions(copy);
        }}
      />
    </div>
  );
};
