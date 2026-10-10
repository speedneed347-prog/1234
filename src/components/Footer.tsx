import React from 'react';
import { CloudDoodle, HeartDoodle, StarDoodle } from './CuteDoodles.tsx';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#202B49] text-white/90 border-t-4 border-[#0798FF] mt-20 relative overflow-hidden select-none">
      {/* Decorative stars & clouds */}
      <div className="absolute top-4 left-10 pointer-events-none opacity-40">
        <StarDoodle className="w-5 h-5" color="#FFE779" />
      </div>
      <div className="absolute top-8 right-16 pointer-events-none opacity-40">
        <HeartDoodle className="w-5 h-5" color="#FF5793" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-2xl bg-white text-xl flex items-center justify-center shadow-xs">
                🐱
              </span>
              <span className="text-2xl font-black text-white font-display">
                BFF<span className="text-[#FFE779]">Meter</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-sm leading-relaxed font-medium">
              The super cute cartoon friendship quiz challenge! Make your quiz, test your true besties, and see who climbs the champion podium. 🐾
            </p>
          </div>

          <div>
            <h4 className="text-xs font-black text-[#FFE779] uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-xs sm:text-sm font-bold text-slate-200">
              <li>
                <button
                  onClick={() => onNavigate('/')}
                  className="hover:text-[#FFE779] transition-colors cursor-pointer"
                >
                  Featured Quizzes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/create')}
                  className="hover:text-[#FFE779] transition-colors cursor-pointer"
                >
                  Create Quiz Wizard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/dashboard')}
                  className="hover:text-[#FFE779] transition-colors cursor-pointer"
                >
                  Creator Dashboard
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black text-[#FFE779] uppercase tracking-wider mb-3">Community &amp; Safety</h4>
            <ul className="space-y-2 text-xs sm:text-sm font-bold text-slate-200">
              <li>
                <button
                  onClick={() => onNavigate('/privacy')}
                  className="hover:text-[#FFE779] transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/terms')}
                  className="hover:text-[#FFE779] transition-colors cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-[#FFE779] transition-colors cursor-pointer"
                >
                  Contact &amp; Support
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/admin')}
                  className="text-[#59B9EF] hover:text-[#FFE779] text-xs transition-colors cursor-pointer flex items-center gap-1.5 mt-2 font-bold"
                >
                  <span>🛡️</span> Moderator Portal
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4 font-semibold">
          <p>© {new Date().getFullYear()} BFFMeter. Playful cartoon friendship quiz experience.</p>
          <div className="flex items-center gap-3 text-[11px]">
            <span>✨ Zero Answer Leak Guarantee</span>
            <span aria-hidden="true">·</span>
            <span>🔒 Encrypted Server Scoring</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
