import React, { useState, useRef, useEffect } from 'react';
import { CloudDoodle, StarDoodle } from './CuteDoodles.tsx';
import { useTranslation } from '../i18n/LanguageContext.tsx';
import { SupportedLang } from '../i18n/translations.ts';
import { Globe, Menu, X, Sparkles, ChevronDown } from 'lucide-react';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  lang?: SupportedLang;
  onToggleLang?: (lang: SupportedLang) => void;
}

const LANGUAGES: Array<{ code: SupportedLang; label: string; flag: string }> = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'bn', label: 'বাংলা', flag: '🇧🇩' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
];

export const Header: React.FC<HeaderProps> = ({
  currentPath,
  onNavigate,
}) => {
  const { lang, setLang, t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { path: '/', label: t.navHome },
    { path: '/create', label: t.navCreate },
    { path: '/dashboard', label: t.navDashboard },
    { path: '/contact', label: t.navContact },
  ];

  const currentLangObj = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 bg-[#59B9EF] border-b-3 border-[#0798FF]/30 shadow-md relative overflow-visible select-none">
      {/* Soft Background Cloud Decorations */}
      <div className="absolute -top-3 left-6 pointer-events-none opacity-80">
        <CloudDoodle className="w-20 h-10 animate-gentle-float" />
      </div>
      <div className="absolute -top-2 right-12 pointer-events-none opacity-75">
        <CloudDoodle className="w-16 h-8" />
      </div>
      <div className="absolute top-1 left-1/3 pointer-events-none opacity-60 hidden sm:block">
        <StarDoodle className="w-4 h-4 animate-wiggle" color="#FFE779" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 relative z-10">
        {/* Brand Logo */}
        <button
          onClick={() => {
            onNavigate('/');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-2.5 text-white font-black text-xl sm:text-2xl font-display tracking-wide drop-shadow-sm hover:scale-105 transition-transform cursor-pointer"
        >
          <div className="w-9 h-9 rounded-2xl bg-white border-2 border-[#DFE8F2] shadow-xs flex items-center justify-center text-lg">
            🐱
          </div>
          <span className="text-white drop-shadow-[0_2px_0_#0798FF]">
            BFF<span className="text-[#FFE779]">Meter</span>
          </span>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-2.5 text-xs sm:text-sm font-bold">
          {navItems.map((item) => {
            const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
            return (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-[#0798FF] shadow-xs border-2 border-white'
                    : 'text-white/95 hover:bg-white/20 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Zone: Multi-Language Selector & CTA Button */}
        <div className="flex items-center gap-2.5">
          {/* Multi-Language Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="px-2.5 py-1.5 rounded-2xl bg-white/95 hover:bg-white text-[#202B49] border-2 border-[#DFE8F2] shadow-xs text-xs font-black flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
              title="Select Language (English / বাংলা / हिन्दी / Español)"
            >
              <Globe className="w-3.5 h-3.5 text-[#0798FF]" />
              <span>{currentLangObj.flag} {currentLangObj.label}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 stroke-[3]" />
            </button>

            {/* Dropdown Menu */}
            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-white border-3 border-white shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  Select Language
                </div>
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                      lang === l.code
                        ? 'bg-[#EDF6FF] text-[#0798FF] font-black'
                        : 'text-[#202B49] hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{l.flag}</span>
                      <span>{l.label}</span>
                    </span>
                    {lang === l.code && <span className="text-[#0798FF] font-black">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Create CTA Button */}
          <button
            onClick={() => onNavigate('/create')}
            className="px-4 py-2 rounded-2xl bg-[#FF5793] hover:bg-[#ff3d83] text-white font-black text-xs sm:text-sm shadow-[0_3px_0_#d93872] active:translate-y-0.5 active:shadow-[0_1px_0_#d93872] transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FFE779]" />
            <span>{t.btnCreateQuiz}</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-2xl bg-white/90 text-[#0798FF] flex items-center justify-center border-2 border-white cursor-pointer shadow-xs"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#59B9EF] border-t-2 border-[#0798FF]/30 p-4 space-y-2 animate-in slide-in-from-top-2 duration-150">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                onNavigate(item.path);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2.5 px-4 rounded-2xl bg-white/95 text-[#202B49] font-bold text-sm shadow-xs flex items-center justify-between"
            >
              <span>{item.label}</span>
              <span>→</span>
            </button>
          ))}
          <button
            onClick={() => {
              onNavigate('/admin');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-4 rounded-2xl bg-[#EDF6FF] text-[#0798FF] font-black text-xs shadow-xs flex items-center justify-between"
          >
            <span>🐾 {t.navAdmin}</span>
            <span>→</span>
          </button>
        </div>
      )}
    </header>
  );
};
