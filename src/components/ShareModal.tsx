import React, { useState } from 'react';
import { Copy, Check, Share2, X, MessageCircle, Send, Twitter } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizCode: string;
  quizTitle: string;
  creatorName: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  quizCode,
  quizTitle,
  creatorName,
}) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!isOpen) return null;

  const origin = window.location.origin;
  const shareUrl = `${origin}/quiz/${quizCode}`;
  const shareText = `How well do you really know ${creatorName}? Take the "${quizTitle}" challenge and see where you rank on the scoreboard! 🔥👇\n${shareUrl}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(true);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: quizTitle,
          text: `How well do you really know ${creatorName}? Take the friendship quiz!`,
          url: shareUrl,
        });
      } catch {
        // Ignored or dismissed
      }
    } else {
      handleCopy();
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`How well do you know ${creatorName}? Take this quiz!`)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-amber-100 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50/50 border-b border-amber-100/60 flex items-start justify-between">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Share Challenge</span>
            <h3 className="text-xl font-black text-slate-900 font-display mt-0.5">Invite Your Friends</h3>
            <p className="text-xs text-slate-500 mt-1">Send this secret link to see who scores highest!</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white text-slate-400 hover:text-slate-700 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Share Link Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Quiz Direct Link
            </label>
            <div className="flex items-center gap-2 p-1.5 bg-slate-50 border border-slate-200 rounded-2xl">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-transparent px-3 py-1.5 text-xs font-mono text-slate-700 outline-hidden select-all"
              />
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Send via Chat &amp; Social
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold">WhatsApp</span>
              </a>

              <a
                href={telegramUrl}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-xs">
                  <Send className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold">Telegram</span>
              </a>

              <a
                href={twitterUrl}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-xs">
                  <Twitter className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold">X / Twitter</span>
              </a>
            </div>
          </div>

          {/* QR Code and Web Share */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => setShowQr(!showQr)}
              className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{showQr ? 'Hide QR Code' : '📷 Show QR Code'}</span>
            </button>
            {'share' in navigator && (
              <button
                onClick={handleNativeShare}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>More Apps...</span>
              </button>
            )}
          </div>

          {/* QR View */}
          {showQr && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-center space-y-2 animate-in zoom-in-95 duration-150">
              <div className="w-44 h-44 bg-white p-3 rounded-xl shadow-xs border border-slate-200 flex flex-col items-center justify-center relative">
                {/* Visual SVG QR Representation */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900">
                  {/* Outer corner finders */}
                  <rect x="5" y="5" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="12" y="12" width="11" height="11" fill="currentColor" />
                  
                  <rect x="70" y="5" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="77" y="12" width="11" height="11" fill="currentColor" />

                  <rect x="5" y="70" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="12" y="77" width="11" height="11" fill="currentColor" />

                  {/* High density data pixels */}
                  <rect x="36" y="10" width="6" height="6" fill="currentColor" />
                  <rect x="48" y="12" width="6" height="6" fill="currentColor" />
                  <rect x="58" y="8" width="6" height="6" fill="currentColor" />
                  <rect x="38" y="24" width="6" height="6" fill="currentColor" />
                  <rect x="50" y="22" width="6" height="6" fill="currentColor" />

                  <rect x="10" y="38" width="6" height="6" fill="currentColor" />
                  <rect x="22" y="48" width="6" height="6" fill="currentColor" />
                  <rect x="12" y="56" width="6" height="6" fill="currentColor" />

                  <rect x="74" y="38" width="6" height="6" fill="currentColor" />
                  <rect x="86" y="48" width="6" height="6" fill="currentColor" />
                  <rect x="78" y="58" width="6" height="6" fill="currentColor" />

                  <rect x="38" y="74" width="6" height="6" fill="currentColor" />
                  <rect x="48" y="84" width="6" height="6" fill="currentColor" />
                  <rect x="62" y="78" width="6" height="6" fill="currentColor" />
                  <rect x="78" y="74" width="6" height="6" fill="currentColor" />
                  <rect x="88" y="88" width="6" height="6" fill="currentColor" />

                  {/* Center badge */}
                  <circle cx="50" cy="50" r="14" fill="#f59e0b" />
                  <text x="50" y="55" fontSize="12" textAnchor="middle" fill="white" fontWeight="bold">✨</text>
                </svg>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">Code: {quizCode}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
