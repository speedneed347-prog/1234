import React from 'react';
import { BoyCatSticker, GirlCatSticker } from '../components/CatMascots.tsx';
import { ArrowLeft } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
      <div className="flex items-center justify-center gap-3">
        <BoyCatSticker size="md" mood="curious" animated />
        <GirlCatSticker size="md" mood="curious" animated />
      </div>

      <div>
        <span className="text-xs font-black text-[#0798FF] uppercase tracking-wider block">
          🐾 Error 404 · Lost In Play
        </span>
        <h1 className="text-3xl font-black text-[#202B49] font-display mt-1">Page Not Found</h1>
        <p className="text-sm text-slate-500 font-semibold mt-2">
          The friendship quiz or destination you were looking for doesn&apos;t seem to exist or has moved.
        </p>
      </div>

      <button
        onClick={() => onNavigate('/')}
        className="px-7 py-3.5 bg-[#0798FF] hover:bg-[#0086e6] text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-[0_3px_0_#006fc5] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer inline-flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4 stroke-[3]" />
        <span>Return to Homepage</span>
      </button>
    </div>
  );
};
