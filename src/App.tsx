import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './i18n/LanguageContext.tsx';
import { CustomizationProvider } from './context/CustomizationContext.tsx';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { AdminLiveEditorBar } from './components/AdminLiveEditorBar.tsx';
import { CustomElementsOverlay } from './components/CustomElementsOverlay.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { CreateQuizPage } from './pages/CreateQuizPage.tsx';
import { QuizLandingPage } from './pages/QuizLandingPage.tsx';
import { QuizPlayPage } from './pages/QuizPlayPage.tsx';
import { ResultPage } from './pages/ResultPage.tsx';
import { ScoreboardPage } from './pages/ScoreboardPage.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { EditQuizPage } from './pages/EditQuizPage.tsx';
import { AdminPage } from './pages/AdminPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { PrivacyPage } from './pages/PrivacyPage.tsx';
import { TermsPage } from './pages/TermsPage.tsx';
import { NotFoundPage } from './pages/NotFoundPage.tsx';

function getPageId(path: string): string {
  const clean = path.split('?')[0];
  if (clean === '/' || clean === '') return 'home';
  if (clean.startsWith('/create')) return 'create';
  if (clean.startsWith('/dashboard')) return 'dashboard';
  if (clean.startsWith('/admin')) return 'admin';
  if (clean.startsWith('/contact')) return 'contact';
  if (clean.startsWith('/privacy')) return 'privacy';
  if (clean.startsWith('/terms')) return 'terms';
  if (clean.includes('/play')) return 'quiz-play';
  if (clean.includes('/result')) return 'quiz-result';
  if (clean.includes('/scoreboard')) return 'quiz-scoreboard';
  if (clean.startsWith('/quiz/')) return 'quiz-landing';
  return 'not-found';
}

function MainApp() {
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');
  const [activeParticipantName, setActiveParticipantName] = useState<string>('');
  const [activeParticipantGender, setActiveParticipantGender] = useState<'male' | 'female'>('male');

  // Handle browser popstate
  useEffect(() => {
    const onPop = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentPageId = getPageId(currentPath);

  // Route matching logic
  const renderCurrentPage = () => {
    const url = new URL(window.location.href);
    const pathname = currentPath.split('?')[0];

    if (pathname === '/' || pathname === '') {
      return <HomePage onNavigate={navigate} />;
    }

    if (pathname === '/create') {
      return <CreateQuizPage onNavigate={navigate} />;
    }

    if (pathname === '/dashboard') {
      const codeParam = url.searchParams.get('code') || undefined;
      return <DashboardPage initialCode={codeParam} onNavigate={navigate} />;
    }

    if (pathname === '/admin') {
      return <AdminPage onNavigate={navigate} />;
    }

    if (pathname === '/contact') {
      return <ContactPage />;
    }

    if (pathname === '/privacy') {
      return <PrivacyPage />;
    }

    if (pathname === '/terms') {
      return <TermsPage />;
    }

    // Quiz subroutes: /quiz/:code/...
    const quizMatch = pathname.match(/^\/quiz\/([^/]+)(.*)$/);
    if (quizMatch) {
      const quizCode = quizMatch[1];
      const rest = quizMatch[2];

      if (rest === '' || rest === '/') {
        return (
          <QuizLandingPage
            quizCode={quizCode}
            onNavigate={navigate}
            onStartQuiz={(name, gender) => {
              setActiveParticipantName(name);
              setActiveParticipantGender(gender);
              navigate(`/quiz/${quizCode}/play`);
            }}
          />
        );
      }

      if (rest === '/play') {
        return (
          <QuizPlayPage
            quizCode={quizCode}
            participantName={activeParticipantName || 'Secret Friend'}
            participantGender={activeParticipantGender}
            onNavigate={navigate}
            onFinished={(attemptId) => {
              navigate(`/quiz/${quizCode}/result/${attemptId}`);
            }}
          />
        );
      }

      const resultMatch = rest.match(/^\/result\/([^/]+)$/);
      if (resultMatch) {
        const attemptId = resultMatch[1];
        return (
          <ResultPage
            quizCode={quizCode}
            attemptId={attemptId}
            onNavigate={navigate}
          />
        );
      }

      if (rest === '/scoreboard') {
        return <ScoreboardPage quizCode={quizCode} onNavigate={navigate} />;
      }

      if (rest === '/dashboard') {
        return <DashboardPage initialCode={quizCode} onNavigate={navigate} />;
      }

      if (rest === '/edit') {
        return <EditQuizPage quizCode={quizCode} onNavigate={navigate} />;
      }
    }

    return <NotFoundPage onNavigate={navigate} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#EDF6FF] text-[#202B49] relative">
      <Header
        currentPath={currentPath}
        onNavigate={navigate}
      />
      
      {/* Site-wide Page Customization Elements (Floating GIFs, Badges, Stickers, Banners) */}
      <CustomElementsOverlay pageId={currentPageId} />

      <main className="flex-1 relative z-10">
        {renderCurrentPage()}
      </main>

      <Footer onNavigate={navigate} />

      {/* Floating Admin Live Editor Bar (Only displayed for logged in admin) */}
      <AdminLiveEditorBar currentPath={currentPath} onNavigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <CustomizationProvider>
        <MainApp />
      </CustomizationProvider>
    </LanguageProvider>
  );
}
