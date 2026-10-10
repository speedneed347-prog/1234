import React, { useState } from 'react';

export type CatMood = 'idle' | 'happy' | 'winking' | 'cheering' | 'curious';

interface CatProps {
  mood?: CatMood;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}

const sizeMap = {
  xs: 'w-8 h-8',
  sm: 'w-12 h-12',
  md: 'w-20 h-20',
  lg: 'w-32 h-32',
  xl: 'w-44 h-44',
};

// -------------------------------------------------------------
// BOY CAT (ছেলে বিড়াল - Milo / টম বিড়াল)
// Uses Animated Cat GIFs with die-cut sticker borders!
// -------------------------------------------------------------
export const BoyCatSticker: React.FC<CatProps> = ({
  mood = 'happy',
  className = '',
  size = 'lg',
  animated = true,
}) => {
  const gifUrl =
    mood === 'cheering'
      ? 'https://media.giphy.com/media/111ebonMs90YLu/giphy.gif'
      : mood === 'winking'
      ? 'https://media.giphy.com/media/jpbnoe3UIa8TU8LM13/giphy.gif'
      : 'https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif';

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${sizeMap[size]} ${className} ${
        animated ? 'transition-transform duration-300 hover:scale-110 active:scale-95' : ''
      }`}
    >
      <div className="w-full h-full rounded-2xl overflow-hidden border-3 border-white shadow-md bg-sky-50 relative group">
        <img
          src={gifUrl}
          alt="Milo Boy Cat GIF"
          className="w-full h-full object-cover select-none pointer-events-none"
          loading="lazy"
        />
        <span className="absolute bottom-0 right-0 bg-[#0798FF] text-white text-[9px] font-black px-1.5 py-0.5 rounded-tl-lg shadow-xs pointer-events-none">
          🐾 Milo
        </span>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// GIRL CAT (মেয়ে বিড়াল - Luna / মিমি বিড়াল)
// Uses Animated Cat GIFs with die-cut sticker borders!
// -------------------------------------------------------------
export const GirlCatSticker: React.FC<CatProps> = ({
  mood = 'happy',
  className = '',
  size = 'lg',
  animated = true,
}) => {
  const gifUrl =
    mood === 'cheering'
      ? 'https://media.giphy.com/media/vFKqnCdLPNOKc/giphy.gif'
      : mood === 'winking'
      ? 'https://media.giphy.com/media/M90mJvfWfd5mbUuULX/giphy.gif'
      : 'https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif';

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${sizeMap[size]} ${className} ${
        animated ? 'transition-transform duration-300 hover:scale-110 active:scale-95' : ''
      }`}
    >
      <div className="w-full h-full rounded-2xl overflow-hidden border-3 border-white shadow-md bg-pink-50 relative group">
        <img
          src={gifUrl}
          alt="Luna Girl Cat GIF"
          className="w-full h-full object-cover select-none pointer-events-none"
          loading="lazy"
        />
        <span className="absolute bottom-0 right-0 bg-[#FF5793] text-white text-[9px] font-black px-1.5 py-0.5 rounded-tl-lg shadow-xs pointer-events-none">
          🎀 Luna
        </span>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Interactive Gender Selector with Animated Cat GIFs
// -------------------------------------------------------------
interface GenderSelectorProps {
  selectedGender?: 'male' | 'female';
  onChange: (gender: 'male' | 'female') => void;
  label?: string;
  error?: string;
  required?: boolean;
}

export const GenderSelectorWithCats: React.FC<GenderSelectorProps> = ({
  selectedGender,
  onChange,
  label = 'নিজের জেন্ডার নির্বাচন করুন (Select Your Gender)',
  error,
  required = true,
}) => {
  const handleSelect = (gender: 'male' | 'female') => {
    onChange(gender);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs sm:text-sm font-black text-[#202B49] flex items-center gap-1.5 font-display">
          <span>🐾</span>
          <span>{label}</span>
          {required && <span className="text-[#FF5793] font-bold">*</span>}
        </label>
        <span className="text-[11px] font-bold text-[#0798FF] bg-[#EDF6FF] px-2.5 py-0.5 rounded-full border border-[#DFE8F2]">
          অবশ্যই আবশ্যক
        </span>
      </div>

      {/* Two Cute Cat GIF Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* BOY CAT CARD */}
        <button
          type="button"
          onClick={() => handleSelect('male')}
          className={`p-4 sm:p-5 rounded-3xl border-3 transition-all cursor-pointer flex flex-row sm:flex-col items-center justify-between sm:justify-center text-center gap-3 relative overflow-hidden group active:scale-98 ${
            selectedGender === 'male'
              ? 'bg-[#EDF6FF] border-[#0798FF] ring-4 ring-[#0798FF]/20 shadow-md'
              : 'bg-white hover:bg-sky-50/40 border-[#DFE8F2] hover:border-sky-300 shadow-xs'
          }`}
        >
          {selectedGender === 'male' && (
            <div className="absolute top-2.5 right-2.5 bg-[#0798FF] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
              <span>✓</span>
              <span>নির্বাচিত</span>
            </div>
          )}

          <div className="shrink-0 flex items-center justify-center">
            <BoyCatSticker
              mood={selectedGender === 'male' ? 'winking' : 'happy'}
              size="lg"
              animated={selectedGender === 'male'}
            />
          </div>

          <div className="flex-1 text-left sm:text-center space-y-1">
            <div className="flex items-center gap-1.5 sm:justify-center">
              <span className="text-lg">🎩</span>
              <span className="text-base sm:text-lg font-black text-[#202B49] font-display">
                ছেলে (Boy Cat · Milo)
              </span>
            </div>
            <p className="text-xs text-slate-500 font-semibold leading-snug">
              স্মার্ট ও কিউট টম বিড়াল · Milo
            </p>
            {selectedGender === 'male' && (
              <p className="text-[11px] font-black text-[#0798FF] pt-1 animate-in fade-in duration-150">
                &ldquo;মিয়াও! আমি প্রস্তুত! 🐾&rdquo;
              </p>
            )}
          </div>
        </button>

        {/* GIRL CAT CARD */}
        <button
          type="button"
          onClick={() => handleSelect('female')}
          className={`p-4 sm:p-5 rounded-3xl border-3 transition-all cursor-pointer flex flex-row sm:flex-col items-center justify-between sm:justify-center text-center gap-3 relative overflow-hidden group active:scale-98 ${
            selectedGender === 'female'
              ? 'bg-[#FFE4EF] border-[#FF5793] ring-4 ring-[#FF5793]/20 shadow-md'
              : 'bg-white hover:bg-pink-50/40 border-[#DFE8F2] hover:border-pink-300 shadow-xs'
          }`}
        >
          {selectedGender === 'female' && (
            <div className="absolute top-2.5 right-2.5 bg-[#FF5793] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
              <span>✓</span>
              <span>নির্বাচিত</span>
            </div>
          )}

          <div className="shrink-0 flex items-center justify-center">
            <GirlCatSticker
              mood={selectedGender === 'female' ? 'winking' : 'happy'}
              size="lg"
              animated={selectedGender === 'female'}
            />
          </div>

          <div className="flex-1 text-left sm:text-center space-y-1">
            <div className="flex items-center gap-1.5 sm:justify-center">
              <span className="text-lg">🎀</span>
              <span className="text-base sm:text-lg font-black text-[#202B49] font-display">
                মেয়ে (Girl Cat · Luna)
              </span>
            </div>
            <p className="text-xs text-slate-500 font-semibold leading-snug">
              মিষ্টি ও কিউট মিমি বিড়াল · Luna
            </p>
            {selectedGender === 'female' && (
              <p className="text-[11px] font-black text-[#FF5793] pt-1 animate-in fade-in duration-150">
                &ldquo;পারফেক্ট! চলো খেলি! 💖&rdquo;
              </p>
            )}
          </div>
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-2xl bg-rose-50 border-2 border-rose-200 flex items-center gap-2 text-xs font-black text-rose-700 animate-in shake duration-200">
          <span className="text-base">😿</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// Interactive Cat Activity Companion with Animated GIFs
// -------------------------------------------------------------
export const CatActivityCompanion: React.FC<{
  gender?: 'male' | 'female';
  message?: string;
  floating?: boolean;
}> = ({ gender = 'female', message, floating = false }) => {
  const isBoy = gender === 'male';

  const defaultMsg = isBoy
    ? 'টম বিড়াল চিয়ার করছে: এগিয়ে যাও বন্ধু! 🐾'
    : 'মিমি বিড়াল চিয়ার করছে: তুমি দারুন পারছ! 💖';

  return (
    <div
      className={`inline-flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-white border-2 shadow-sm transition-all ${
        isBoy ? 'border-sky-200 text-sky-950' : 'border-pink-200 text-pink-950'
      } ${floating ? 'animate-bounce' : ''}`}
    >
      <div className="w-9 h-9 rounded-xl overflow-hidden border-2 border-white shadow-xs shrink-0">
        <img
          src={
            isBoy
              ? 'https://media.giphy.com/media/jpbnoe3UIa8TU8LM13/giphy.gif'
              : 'https://media.giphy.com/media/vFKqnCdLPNOKc/giphy.gif'
          }
          alt="Cheering cat GIF"
          className="w-full h-full object-cover"
        />
      </div>
      <span className="text-xs font-black">{message || defaultMsg}</span>
    </div>
  );
};
