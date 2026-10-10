import React, { useState, useEffect } from 'react';
import { api } from '../api/client.ts';
import { useTranslation } from '../i18n/LanguageContext.tsx';
import { useCustomization } from '../context/CustomizationContext.tsx';
import { HeroIllustration } from '../components/QuizIllustrations.tsx';
import { BoyCatSticker, GirlCatSticker } from '../components/CatMascots.tsx';
import { CloudDoodle, StarDoodle, HeartDoodle, SparkleDoodle } from '../components/CuteDoodles.tsx';
import { EditableItem } from '../components/EditableItem.tsx';
import { ArrowRight, Sparkles, Trophy, Users, ShieldCheck, Heart, Star, CheckCircle2 } from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string) => void;
  lang?: string;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { t, lang } = useTranslation();
  const { getPageSettings } = useCustomization();
  const settings = getPageSettings('home');

  const [codeQuery, setCodeQuery] = useState('');
  const [codeError, setCodeError] = useState('');
  const [featuredQuizzes, setFeaturedQuizzes] = useState<any[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [activeCatMood, setActiveCatMood] = useState<'milo' | 'luna' | null>(null);

  const isBn = lang === 'bn';

  useEffect(() => {
    api
      .getFeaturedQuizzes()
      .then((res) => {
        if (res.quizzes) setFeaturedQuizzes(res.quizzes);
      })
      .catch((err) => console.warn('Could not load featured quizzes:', err))
      .finally(() => setLoadingFeatured(false));
  }, []);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = codeQuery.trim().toLowerCase();
    if (!clean) {
      setCodeError(isBn ? 'অনুগ্রহ করে কুইজ কোড দিন।' : 'Please enter a quiz code.');
      return;
    }
    setCodeError('');
    onNavigate(`/quiz/${clean}`);
  };

  return (
    <div className="space-y-12 sm:space-y-16 py-4 sm:py-8 overflow-hidden select-none">
      {/* ------------------------------------------------------------- */}
      {/* HERO SECTION */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        {/* Floating background decorative doodles */}
        {settings.showDoodles !== false && (
          <>
            <div className="absolute -top-4 left-4 pointer-events-none opacity-80 hidden sm:block">
              <CloudDoodle className="w-24 h-12 animate-gentle-float" />
            </div>
            <div className="absolute top-12 right-6 pointer-events-none opacity-75 hidden sm:block">
              <StarDoodle className="w-8 h-8 animate-wiggle" color="#FFE779" />
            </div>
            <div className="absolute top-1/2 left-2 pointer-events-none opacity-60 hidden md:block">
              <HeartDoodle className="w-6 h-6 animate-pulse" color="#FF5793" />
            </div>
          </>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Cute Badge */}
            <EditableItem
              pageId="home"
              elementKey="hero_badge"
              type="text"
              label="Hero Badge"
              defaultText={isBn ? 'সেরা কিউট ফ্রেন্ডশিপ কুইজ চ্যালেঞ্জ 🐾' : 'The Cutest Friendship Quiz Challenge 🐾'}
            >
              <div className="inline-flex items-center gap-2 text-xs font-black text-[#0798FF] bg-white border-2 border-[#DFE8F2] px-4 py-1.5 rounded-full shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#FFE779] fill-[#FFE779]" />
                <span>
                  {isBn
                    ? 'সেরা কিউট ফ্রেন্ডশিপ কুইজ চ্যালেঞ্জ 🐾'
                    : 'The Cutest Friendship Quiz Challenge 🐾'}
                </span>
              </div>
            </EditableItem>

            {/* Main Headline */}
            <EditableItem
              pageId="home"
              elementKey="hero_headline"
              type="text"
              label="Main Headline"
              defaultText={settings.heroHeadlineOverride || t.heroTitle}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#202B49] tracking-tight leading-[1.12] font-display">
                {settings.heroHeadlineOverride || t.heroTitle}
              </h1>
            </EditableItem>

            {/* Subtitle */}
            <EditableItem
              pageId="home"
              elementKey="hero_subtitle"
              type="text"
              label="Hero Subtitle"
              defaultText={settings.heroSubheadlineOverride || t.heroSubtitle}
            >
              <p className="text-base sm:text-lg text-[#202B49]/80 font-semibold leading-relaxed max-w-xl mx-auto lg:mx-0">
                {settings.heroSubheadlineOverride || t.heroSubtitle}
              </p>
            </EditableItem>

            {/* Quick CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <EditableItem
                pageId="home"
                elementKey="hero_cta_btn"
                type="text"
                label="Create Button"
                defaultText={t.btnCreateQuiz}
              >
                <button
                  onClick={() => onNavigate('/create')}
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-[#0798FF] hover:bg-[#0086e6] text-white font-black text-base shadow-[0_4px_0_#006fc5] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <span>{t.btnCreateQuiz}</span>
                  <ArrowRight className="w-5 h-5 stroke-[3]" />
                </button>
              </EditableItem>

              <button
                onClick={() => onNavigate('/quiz/bm-maya26')}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-[#FFE4EF]/50 border-2 border-[#DFE8F2] text-[#202B49] font-black text-sm flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer shadow-xs whitespace-nowrap"
              >
                <span>{t.btnTryDemo}</span>
                <span className="text-[#0798FF] text-xs font-mono bg-[#EDF6FF] px-2 py-0.5 rounded-lg border border-[#DFE8F2]">
                  bm-maya26
                </span>
              </button>
            </div>

            {/* Code Search Input Form */}
            <div className="pt-2 max-w-md mx-auto lg:mx-0">
              <form onSubmit={handleLookup} className="space-y-1.5">
                <div className="flex items-center gap-2 p-1.5 bg-white border-2 border-[#DFE8F2] rounded-2xl shadow-sm focus-within:border-[#0798FF] focus-within:ring-2 focus-within:ring-[#59B9EF]/30 transition-all">
                  <span className="pl-3 text-base">🐾</span>
                  <input
                    type="text"
                    value={codeQuery}
                    onChange={(e) => {
                      setCodeQuery(e.target.value);
                      setCodeError('');
                    }}
                    placeholder={
                      isBn ? "বন্ধুর কুইজ কোড লিখুন (যেমন bm-maya26)" : "Enter friend's code (e.g. bm-maya26)"
                    }
                    className="flex-1 px-2 py-2 text-sm text-[#202B49] font-bold placeholder:text-slate-400 outline-none font-mono"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#59B9EF] hover:bg-[#0798FF] text-white font-black text-xs rounded-xl shadow-xs transition-colors cursor-pointer shrink-0 active:scale-95"
                  >
                    {isBn ? 'খেলো' : 'Open Quiz'}
                  </button>
                </div>
                {codeError && (
                  <p className="text-xs text-[#FF5793] font-black px-2">{codeError}</p>
                )}
              </form>
            </div>

            {/* Interactive Boy Cat & Girl Cat Showcase Bar */}
            <div className="pt-1 max-w-lg mx-auto lg:mx-0">
              <div className="p-4 rounded-3xl bg-white border-3 border-white shadow-md flex items-center justify-between gap-3 relative overflow-hidden group">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveCatMood(activeCatMood === 'milo' ? null : 'milo')}
                    title="Click Milo (Boy Cat)"
                    className="cursor-pointer hover:scale-110 transition-transform active:scale-95"
                  >
                    <BoyCatSticker size="sm" mood={activeCatMood === 'milo' ? 'winking' : 'happy'} animated />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCatMood(activeCatMood === 'luna' ? null : 'luna')}
                    title="Click Luna (Girl Cat)"
                    className="cursor-pointer hover:scale-110 transition-transform active:scale-95"
                  >
                    <GirlCatSticker size="sm" mood={activeCatMood === 'luna' ? 'winking' : 'happy'} animated />
                  </button>
                </div>

                <div className="flex-1 text-left">
                  <span className="text-[11px] font-black uppercase text-[#FF5793] tracking-wider block">
                    {isBn ? '🐱 কিউট ক্যাট স্টিকার মাসকট' : '🐱 Cute Cat Mascot Friends'}
                  </span>
                  <p className="text-xs text-[#202B49] font-bold leading-tight mt-0.5">
                    {activeCatMood === 'milo'
                      ? 'টম বিড়াল (Milo): "মিয়াও! আমি সবসময় সাথে আছি! 🐾"'
                      : activeCatMood === 'luna'
                      ? 'মিমি বিড়াল (Luna): "চলো খেলি আর বন্ধু মেপে দেখি! 💖"'
                      : isBn
                      ? 'ছেলে বিড়াল ও মেয়ে বিড়াল দিয়ে তোমার জেন্ডার সিলেক্ট করো!'
                      : 'Boy Cat (Milo) & Girl Cat (Luna) guide your friendship quest!'}
                  </p>
                </div>

                <button
                  onClick={() => onNavigate('/create')}
                  className="px-3.5 py-1.5 bg-[#FFE4EF] hover:bg-[#FF5793] text-[#FF5793] hover:text-white font-black text-xs rounded-xl cursor-pointer shrink-0 transition-colors border border-[#FF5793]/30"
                >
                  {isBn ? 'সিলেক্ট করো' : 'Try Now'}
                </button>
              </div>
            </div>
          </div>

          {/* Hero Right: Cartoon Illustration Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-white rounded-3xl p-5 border-4 border-white shadow-xl relative">
              {/* Cute Washi Tape or Sticker at top */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FFE779] text-[#202B49] text-[11px] font-black px-4 py-0.5 rounded-full border-2 border-white shadow-xs">
                ⭐ BEST FRIENDS ONLY ⭐
              </div>

              <div className="rounded-2xl overflow-hidden bg-gradient-to-b from-[#EDF6FF] to-white p-2 border border-[#DFE8F2]">
                <HeroIllustration className="w-full h-auto drop-shadow-sm" />
              </div>

              {/* Cute Bottom Stickers */}
              <div className="mt-4 flex items-center justify-around text-xs font-black text-[#202B49] pt-2 border-t border-[#DFE8F2]">
                <span className="flex items-center gap-1">
                  <span>🐾</span> 100% Fun
                </span>
                <span className="flex items-center gap-1">
                  <span>🔒</span> Safe & Secret
                </span>
                <span className="flex items-center gap-1">
                  <span>🏆</span> Live Ranks
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 3.C: FEATURE CARD */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-4 border-white shadow-lg relative overflow-hidden">
          {/* Subtle decorative background shapes */}
          <div className="absolute top-2 right-4 pointer-events-none opacity-40">
            <SparkleDoodle className="w-8 h-8" color="#FF5793" />
          </div>
          <div className="absolute bottom-2 left-6 pointer-events-none opacity-40">
            <StarDoodle className="w-6 h-6" color="#FFE779" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Mascot illustrations */}
            <div className="md:col-span-5 flex items-center justify-center gap-4 bg-[#EDF6FF] rounded-3xl p-6 border-2 border-[#DFE8F2]">
              <div className="text-center space-y-2">
                <BoyCatSticker size="lg" mood="winking" animated />
                <span className="block text-xs font-black text-[#0798FF]">Milo (Boy Cat)</span>
              </div>
              <div className="text-2xl font-black text-[#FF5793] animate-pulse">❤️</div>
              <div className="text-center space-y-2">
                <GirlCatSticker size="lg" mood="happy" animated />
                <span className="block text-xs font-black text-[#FF5793]">Luna (Girl Cat)</span>
              </div>
            </div>

            {/* Description & Badges */}
            <div className="md:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 bg-[#FFE4EF] text-[#FF5793] text-xs font-black px-3 py-1 rounded-full border border-[#FF5793]/20">
                <span>🎀</span>
                <span>{isBn ? 'কিভাবে কাজ করে' : 'Friendship Tested Accurately'}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-[#202B49] font-display">
                {isBn
                  ? 'বন্ধুত্ব মাপার সবচেয়ে মিষ্টি ও মজার ওয়েবসাইট!'
                  : 'The Most Playful Way To Find Out Who Really Cares'}
              </h2>

              <p className="text-sm sm:text-base text-slate-600 font-semibold leading-relaxed">
                {isBn
                  ? 'কোনো বিরক্তিকর রেজিস্ট্রেশন নেই! শুধু নিজের নাম ও জেন্ডার সিলেক্ট করে প্রশ্নগুলো সেট করো। বন্ধুরা উত্তর দিলে আমাদের সার্ভার অটোমেটিক পয়েন্ট হিসেব করে রিয়েল-টাইম পোডিয়াম সাজিয়ে দেবে।'
                  : 'No complicated registration required! Select your cat mascot gender, set 10 questions about your real life, and let friends guess. Answers stay strictly secret on our server until submitted.'}
              </p>

              {/* Badges / Labels */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="px-3 py-1.5 rounded-xl bg-[#EDF6FF] text-[#0798FF] font-black text-xs border border-[#59B9EF]/30 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isBn ? 'জিরো-লিক সার্ভার স্কোর' : 'Zero-Cheat Backend'}
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-[#FFE4EF] text-[#FF5793] font-black text-xs border border-[#FF5793]/30 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 fill-[#FF5793]" />
                  {isBn ? 'সোশ্যাল শেয়ারিং রেডি' : 'Instant WhatsApp Share'}
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-[#FFF9D6] text-[#b38600] font-black text-xs border border-[#FFE779] flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-[#FFE779]" />
                  {isBn ? 'লাইভ চ্যাম্পিয়ন ট্রফি' : 'Real-time Leaderboard'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* HOW IT WORKS SECTION (3 Easy Steps) */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <span className="text-xs font-black text-[#0798FF] uppercase tracking-wider block">
            {isBn ? 'সহজ ৩টি ধাপ' : 'Easy 3 Steps'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#202B49] font-display mt-1">
            {isBn ? 'কীভাবে খেলবে BFFMeter?' : 'How BFFMeter Works'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1.5">
            {isBn
              ? 'মাত্র ২ মিনিটে কুইজ তৈরি করে বন্ধুদের তাক লাগিয়ে দাও।'
              : 'Create your quiz in 2 minutes and let the friendly competition begin!'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white rounded-3xl p-6 border-4 border-white shadow-md space-y-3 relative overflow-hidden group hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-[#59B9EF] text-white font-black flex items-center justify-center font-display text-xl shadow-[0_3px_0_#0798FF]">
              1
            </div>
            <h3 className="text-lg font-black text-[#202B49] font-display">
              {isBn ? '১. প্রশ্ন নির্বাচন করো' : '1. Pick Fun Questions'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed">
              {isBn
                ? 'আমাদের কিউট কোশ্চেন ব্যাংক থেকে বেছে নাও ১০টি প্রশ্ন অথবা নিজে বানাও, আর সঠিক উত্তর মার্ক করো।'
                : 'Choose 10 questions from our question bank or write custom questions. Mark your true answers.'}
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-3xl p-6 border-4 border-white shadow-md space-y-3 relative overflow-hidden group hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-[#FF5793] text-white font-black flex items-center justify-center font-display text-xl shadow-[0_3px_0_#d93872]">
              2
            </div>
            <h3 className="text-lg font-black text-[#202B49] font-display">
              {isBn ? '২. সিক্রেট লিংক শেয়ার করো' : '2. Share Secret Link'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed">
              {isBn
                ? 'ইউনিক কুইজ লিংক কপি করে WhatsApp, Instagram স্টোরি, মেসেঞ্জার বা বন্ধুদের গ্রুপে পাঠিয়ে দাও।'
                : 'Copy your unique quiz URL and drop it on WhatsApp, Telegram, or group chats for friends to take.'}
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-3xl p-6 border-4 border-white shadow-md space-y-3 relative overflow-hidden group hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-[#FFE779] text-[#202B49] font-black flex items-center justify-center font-display text-xl shadow-[0_3px_0_#e6cb45]">
              3
            </div>
            <h3 className="text-lg font-black text-[#202B49] font-display">
              {isBn ? '৩. স্কোরবোর্ডে বেস্টি দেখো' : '3. Watch The Live Podium'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed">
              {isBn
                ? 'বন্ধুরা উত্তর দেওয়া মাত্রই লাইভ লিডারবোর্ডে তাদের র‍্যাংক আর স্কোর দেখতে পাবে!'
                : 'Server calculates points instantly. Watch real-time leaderboard ranks and crown your #1 true bestie!'}
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* FEATURED COMMUNITY QUIZZES */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
          <div>
            <span className="text-xs font-black text-[#0798FF] uppercase tracking-wider block">
              {isBn ? 'সবার জন্য উন্মুক্ত' : 'Ready To Play'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#202B49] font-display">
              {isBn ? 'ফিচার্ড ফ্রেন্ডশিপ টেস্ট' : 'Featured Friendship Tests'}
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/create')}
            className="text-xs font-black text-[#FF5793] hover:text-[#d93872] flex items-center gap-1 cursor-pointer"
          >
            <span>{isBn ? '+ নিজের কুইজ বানাও' : '+ Make your own quiz'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loadingFeatured ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-44 bg-white/60 rounded-3xl border-2 border-[#DFE8F2] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredQuizzes.map((quiz) => (
              <div
                key={quiz.code}
                className="bg-white rounded-3xl p-6 border-4 border-white shadow-md hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-12 h-12 rounded-2xl bg-[#EDF6FF] text-2xl flex items-center justify-center border-2 border-[#DFE8F2] shadow-xs">
                      {quiz.coverEmoji || '✨'}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#0798FF] bg-[#EDF6FF] px-2.5 py-1 rounded-xl border border-[#DFE8F2]">
                      {quiz.code}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-[#202B49] group-hover:text-[#0798FF] transition-colors font-display line-clamp-1">
                    {quiz.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold mt-1 line-clamp-2 leading-relaxed">
                    {quiz.description || `Created by ${quiz.creatorName}. Prove how well you know them!`}
                  </p>

                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mt-4 pt-3 border-t border-[#DFE8F2]">
                    <span>🐾 {quiz.totalQuestions} Questions</span>
                    <span aria-hidden="true">·</span>
                    <span>👥 {quiz.attemptsCount} Friends Played</span>
                  </div>
                </div>

                <div className="mt-5 pt-1 flex items-center gap-2">
                  <button
                    onClick={() => onNavigate(`/quiz/${quiz.code}`)}
                    className="flex-1 py-3 bg-[#0798FF] hover:bg-[#0086e6] text-white font-black text-xs rounded-2xl shadow-[0_3px_0_#006fc5] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                  >
                    {isBn ? 'কুইজ খেলো' : 'Play Quiz'}
                  </button>
                  <button
                    onClick={() => onNavigate(`/quiz/${quiz.code}/scoreboard`)}
                    className="px-4 py-3 bg-[#EDF6FF] hover:bg-[#dfe8f2] text-[#202B49] font-black text-xs rounded-2xl border-2 border-[#DFE8F2] transition-colors cursor-pointer"
                    title="View Scoreboard"
                  >
                    <Trophy className="w-4 h-4 text-[#FFE779] fill-[#FFE779]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ------------------------------------------------------------- */}
      {/* FRIENDSHIP TIERS SHOWCASE */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-black text-[#FF5793] uppercase tracking-wider block">
            {isBn ? 'স্কোর ব্যাজ' : 'Friendship Tiers'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#202B49] font-display mt-1">
            {isBn ? 'তোমার বন্ধুরা কী ব্যাজ পাবে?' : 'What Tier Will Friends Unlock?'}
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="bg-white rounded-3xl p-4 border-4 border-white shadow-md text-center space-y-1">
            <span className="text-3xl block">🏆</span>
            <div className="text-xs font-black text-[#202B49]">Soulmate Status</div>
            <div className="text-[11px] font-mono font-black text-[#0798FF]">90% – 100%</div>
            <p className="text-[10px] text-slate-500 font-bold">Practically telepathic!</p>
          </div>

          <div className="bg-white rounded-3xl p-4 border-4 border-white shadow-md text-center space-y-1">
            <span className="text-3xl block">💖</span>
            <div className="text-xs font-black text-[#202B49]">Ride-or-Die</div>
            <div className="text-[11px] font-mono font-black text-[#FF5793]">70% – 89%</div>
            <p className="text-[10px] text-slate-500 font-bold">Knows the real tea!</p>
          </div>

          <div className="bg-white rounded-3xl p-4 border-4 border-white shadow-md text-center space-y-1">
            <span className="text-3xl block">🤝</span>
            <div className="text-xs font-black text-[#202B49]">Solid Bestie</div>
            <div className="text-[11px] font-mono font-black text-[#59B9EF]">50% – 69%</div>
            <p className="text-[10px] text-slate-500 font-bold">True buddy vibes.</p>
          </div>

          <div className="bg-white rounded-3xl p-4 border-4 border-white shadow-md text-center space-y-1">
            <span className="text-3xl block">👀</span>
            <div className="text-xs font-black text-[#202B49]">Casual Buddy</div>
            <div className="text-[11px] font-mono font-black text-[#55D9AD]">30% – 49%</div>
            <p className="text-[10px] text-slate-500 font-bold">Time to talk more!</p>
          </div>

          <div className="bg-white rounded-3xl p-4 border-4 border-white shadow-md text-center space-y-1 col-span-2 sm:col-span-1">
            <span className="text-3xl block">🕵️</span>
            <div className="text-xs font-black text-[#202B49]">Stranger Alert</div>
            <div className="text-[11px] font-mono font-black text-slate-400">0% – 29%</div>
            <p className="text-[10px] text-slate-500 font-bold">Did we just meet?</p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* ZERO-CHEAT SECURITY BANNER */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-4 border-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
            <div className="w-14 h-14 rounded-2xl bg-[#EDF6FF] text-[#0798FF] flex items-center justify-center shrink-0 border-2 border-[#DFE8F2] shadow-xs">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-lg font-black text-[#202B49] font-display">
                {isBn ? 'জিরো-লিক সিকিউর গ্রেডিং' : 'Zero-Leak Server Grading'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-0.5 max-w-xl">
                {isBn
                  ? 'সঠিক উত্তরগুলো সার্ভারেই সুরক্ষিত থাকে, ব্রাউজারে কখনো আগে থেকে পাঠানো হয় না। তাই ইনস্পেক্ট এলিমেন্ট দিয়ে চিট করা অসম্ভব!'
                  : 'Answers are strictly evaluated on our backend server. No devtools tampering or inspecting HTML to cheat!'}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('/create')}
            className="px-7 py-3.5 rounded-2xl bg-[#0798FF] hover:bg-[#0086e6] text-white font-black text-sm shadow-[0_3px_0_#006fc5] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer whitespace-nowrap"
          >
            {isBn ? 'কুইজ শুরু করো' : 'Start My Quiz'}
          </button>
        </div>
      </section>
    </div>
  );
};
