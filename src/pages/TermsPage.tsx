import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6 animate-in fade-in duration-200">
      <div>
        <span className="text-xs font-black text-[#0798FF] uppercase tracking-wider block">
          🐾 Terms of Service
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#202B49] font-display">Terms of Service</h1>
        <p className="text-xs text-slate-500 font-semibold mt-1">Last updated: October 2026</p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border-4 border-white shadow-xl space-y-6 text-sm text-slate-600 font-medium leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-black text-[#202B49] font-display">1. Acceptance of Terms</h2>
          <p>
            By accessing or playing quizzes on BFFMeter, you agree to comply with and be bound by these Terms of Service. If you disagree with any part of these terms, please refrain from using the platform.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-[#202B49] font-display">2. Acceptable Use &amp; Content Guidelines</h2>
          <p>
            BFFMeter is built for friendly games and social connection. You agree not to post questions, nicknames, or answers containing:
          </p>
          <ul className="list-disc pl-5 space-y-1 font-semibold text-slate-700">
            <li>Harassment, threats, hate speech, or defamatory statements</li>
            <li>Inappropriate or non-consensual personal information of third parties</li>
            <li>Spam, commercial solicitations, or deceptive links</li>
            <li>Malicious code or automated bots</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-[#202B49] font-display">3. Content Moderation &amp; Termination</h2>
          <p>
            Our moderators review reported quizzes and reserve the right to remove any quiz or participant record that violates our community guidelines without prior notice.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-[#202B49] font-display">4. Disclaimer of Warranties</h2>
          <p>
            BFFMeter is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis for entertainment purposes. We make no warranty that the service will be uninterrupted, error-free, or meet your specific needs.
          </p>
        </section>
      </div>
    </div>
  );
};
