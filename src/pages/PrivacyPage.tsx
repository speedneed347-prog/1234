import React from 'react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6 animate-in fade-in duration-200">
      <div>
        <span className="text-xs font-black text-[#0798FF] uppercase tracking-wider block">
          🐾 Legal &amp; Privacy
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#202B49] font-display">Privacy Policy</h1>
        <p className="text-xs text-slate-500 font-semibold mt-1">Last updated: October 2026</p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border-4 border-white shadow-xl space-y-6 text-sm text-slate-600 font-medium leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-black text-[#202B49] font-display">1. Information We Collect</h2>
          <p>
            BFFMeter is designed as a lightweight social entertainment quiz. We do not require passwords or sensitive identity documents to use our service. We only collect the display nicknames you voluntarily choose to enter when creating or playing a quiz, along with your chosen cat mascot gender, submitted responses, time elapsed, and timestamps.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-[#202B49] font-display">2. How Your Answers Are Handled</h2>
          <p>
            When you create a quiz, your designated correct answers are encrypted and held on our server. We never expose your answer key through public API endpoints prior to a friend submitting their answers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-[#202B49] font-display">3. Public Scoreboards</h2>
          <p>
            Scores, cat mascots, and nicknames submitted to a quiz are displayed on that quiz&apos;s public scoreboard for participants who have the direct link. Please do not submit real passwords, confidential phone numbers, or private personal data as your nickname or question text.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-[#202B49] font-display">4. Creator Data Rights &amp; Deletion</h2>
          <p>
            Quiz creators possess a secret edit token that permits them to modify or permanently delete their quiz and all associated participant records from our databases at any time.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-[#202B49] font-display">5. Contact Information</h2>
          <p>
            If you have questions regarding this privacy policy or wish to report content, please use our Contact page or email privacy@bffmeter.example.
          </p>
        </section>
      </div>
    </div>
  );
};
