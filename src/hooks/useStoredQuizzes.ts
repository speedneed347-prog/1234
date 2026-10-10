import { useState, useEffect } from 'react';
import { StoredQuizRecord } from '../types.ts';

const STORAGE_KEY = 'bffmeter_saved_quizzes';

export function useStoredQuizzes() {
  const [quizzes, setQuizzes] = useState<StoredQuizRecord[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setQuizzes(JSON.parse(raw));
      }
    } catch (e) {
      console.warn('Failed reading stored quizzes:', e);
    }
  }, []);

  const saveQuiz = (item: StoredQuizRecord) => {
    try {
      const updated = [item, ...quizzes.filter((q) => q.code.toLowerCase() !== item.code.toLowerCase())];
      setQuizzes(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed writing stored quizzes:', e);
    }
  };

  const removeQuiz = (code: string) => {
    try {
      const updated = quizzes.filter((q) => q.code.toLowerCase() !== code.toLowerCase());
      setQuizzes(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed removing stored quiz:', e);
    }
  };

  const getTokenForQuiz = (code: string): string | null => {
    const found = quizzes.find((q) => q.code.toLowerCase() === code.toLowerCase());
    return found ? found.editToken : null;
  };

  return { quizzes, saveQuiz, removeQuiz, getTokenForQuiz };
}
