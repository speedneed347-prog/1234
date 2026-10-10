import React, { useState, useRef } from 'react';
import { api } from '../api/client.ts';
import { useTranslation } from '../i18n/LanguageContext.tsx';
import { Upload, Link2, Sparkles, X, Check, Image as ImageIcon } from 'lucide-react';

interface OptionPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImageUrl?: string;
  optionLabel: string;
  onSelectPhoto: (imageUrl: string) => void;
  onRemovePhoto: () => void;
}

const CURATED_PHOTO_PRESETS = [
  // Foods
  { label: 'Ramen', url: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=300&auto=format&fit=crop&q=70' },
  { label: 'Pizza', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&auto=format&fit=crop&q=70' },
  { label: 'Ice Cream', url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&auto=format&fit=crop&q=70' },
  { label: 'Spicy Chips', url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300&auto=format&fit=crop&q=70' },
  { label: 'Boba Tea', url: 'https://images.unsplash.com/photo-1558857563-b37cf5a796b4?w=300&auto=format&fit=crop&q=70' },
  { label: 'Iced Coffee', url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=300&auto=format&fit=crop&q=70' },
  { label: 'Burger', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&auto=format&fit=crop&q=70' },
  { label: 'Sweet Dessert', url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=300&auto=format&fit=crop&q=70' },
  // Pets & Animals
  { label: 'Playful Kitten', url: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=300&auto=format&fit=crop&q=70' },
  { label: 'Cute Puppy', url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300&auto=format&fit=crop&q=70' },
  { label: 'Sleepy Cat', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&auto=format&fit=crop&q=70' },
  { label: 'Happy Dog', url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=300&auto=format&fit=crop&q=70' },
  // Places & Vibes
  { label: 'Tokyo Vibes', url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=300&auto=format&fit=crop&q=70' },
  { label: 'Tropical Beach', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&auto=format&fit=crop&q=70' },
  { label: 'Snowy Cabin', url: 'https://images.unsplash.com/photo-1517824806704-9040b037703b?w=300&auto=format&fit=crop&q=70' },
  { label: 'Party Confetti', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300&auto=format&fit=crop&q=70' },
  { label: 'Video Games', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&auto=format&fit=crop&q=70' },
  { label: 'Music Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=70' },
];

export const OptionPhotoModal: React.FC<OptionPhotoModalProps> = ({
  isOpen,
  onClose,
  currentImageUrl,
  optionLabel,
  onSelectPhoto,
  onRemovePhoto,
}) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'upload' | 'presets' | 'url'>('presets');
  const [urlInput, setUrlInput] = useState(currentImageUrl || '');
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl || '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, WebP, GIF)');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError('Image file is too large (max 8MB)');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        try {
          const res = await api.uploadPhoto(dataUrl, file.name);
          setPreviewUrl(res.url);
          setUrlInput(res.url);
        } catch {
          // Fallback to dataUrl directly if upload endpoint issues
          setPreviewUrl(dataUrl);
          setUrlInput(dataUrl);
        } finally {
          setUploading(false);
        }
      };
      reader.onerror = () => {
        setError('Failed to read file');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setError('Upload failed');
      setUploading(false);
    }
  };

  const handleSave = () => {
    if (!previewUrl.trim()) {
      onRemovePhoto();
    } else {
      onSelectPhoto(previewUrl.trim());
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full border-4 border-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-[#59B9EF] p-5 text-white flex items-center justify-between border-b-2 border-[#0798FF]/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white text-[#0798FF] flex items-center justify-center text-lg font-black shadow-xs">
              📷
            </div>
            <div>
              <h3 className="text-base font-black font-display text-white drop-shadow-xs">
                {t.photoModalTitle}
              </h3>
              <p className="text-[11px] text-white/90 font-bold">
                Option: &ldquo;{optionLabel || 'Option Text'}&rdquo;
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="bg-[#EDF6FF] p-2 flex items-center gap-1.5 border-b border-[#DFE8F2]">
          <button
            onClick={() => setTab('presets')}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'presets'
                ? 'bg-white text-[#0798FF] shadow-xs border border-[#DFE8F2]'
                : 'text-slate-600 hover:bg-white/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FFE779] fill-[#FFE779]" />
            <span>{t.curatedStickersTab}</span>
          </button>

          <button
            onClick={() => setTab('upload')}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'upload'
                ? 'bg-white text-[#0798FF] shadow-xs border border-[#DFE8F2]'
                : 'text-slate-600 hover:bg-white/50'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{t.uploadFromDeviceTab}</span>
          </button>

          <button
            onClick={() => setTab('url')}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'url'
                ? 'bg-white text-[#0798FF] shadow-xs border border-[#DFE8F2]'
                : 'text-slate-600 hover:bg-white/50'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>{t.pasteUrlTab}</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 rounded-2xl bg-[#FFE4EF] border-2 border-[#FF5793] text-[#FF5793] text-xs font-black">
              {error}
            </div>
          )}

          {/* TAB 1: PRESETS */}
          {tab === 'presets' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 font-bold">
                Pick from our cute high-res stickers and food &amp; lifestyle photos:
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {CURATED_PHOTO_PRESETS.map((p) => {
                  const isSelected = previewUrl === p.url;
                  return (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => {
                        setPreviewUrl(p.url);
                        setUrlInput(p.url);
                      }}
                      className={`group relative rounded-2xl overflow-hidden border-2 transition-all cursor-pointer aspect-square bg-[#EDF6FF] flex flex-col items-center justify-center p-1 ${
                        isSelected
                          ? 'border-[#0798FF] ring-3 ring-[#0798FF]/30 scale-95 shadow-md'
                          : 'border-[#DFE8F2] hover:border-[#59B9EF] hover:scale-102'
                      }`}
                    >
                      <img
                        src={p.url}
                        alt={p.label}
                        className="w-full h-full object-cover rounded-xl"
                        loading="lazy"
                      />
                      <span className="absolute bottom-0 inset-x-0 bg-slate-900/70 backdrop-blur-2xs text-[9px] text-white font-black text-center py-0.5 truncate px-1">
                        {p.label}
                      </span>
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#0798FF] text-white flex items-center justify-center text-[10px] font-black shadow-xs">
                          ✓
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: UPLOAD */}
          {tab === 'upload' && (
            <div className="space-y-4 text-center py-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-8 border-3 border-dashed border-[#59B9EF] rounded-3xl bg-[#EDF6FF]/50 hover:bg-[#EDF6FF] cursor-pointer transition-all flex flex-col items-center justify-center gap-3"
              >
                <div className="w-14 h-14 rounded-2xl bg-white text-[#0798FF] border-2 border-[#DFE8F2] flex items-center justify-center text-2xl shadow-xs">
                  {uploading ? '⏳' : '📁'}
                </div>
                <div>
                  <p className="text-sm font-black text-[#202B49]">
                    {uploading ? 'Uploading Photo...' : t.uploadDropText}
                  </p>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">
                    Supports JPG, PNG, WebP up to 8MB
                  </p>
                </div>
                <button
                  type="button"
                  className="px-5 py-2 rounded-2xl bg-[#0798FF] hover:bg-[#0086e6] text-white text-xs font-black shadow-[0_2px_0_#006fc5]"
                >
                  Choose Picture
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: URL */}
          {tab === 'url' && (
            <div className="space-y-3">
              <label className="text-xs font-black text-[#202B49] uppercase block">
                Direct Image URL
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value);
                    setPreviewUrl(e.target.value);
                  }}
                  placeholder={t.pasteUrlPlaceholder}
                  className="flex-1 px-4 py-3 rounded-2xl border-2 border-[#DFE8F2] text-xs font-bold text-[#202B49] outline-none focus:border-[#0798FF]"
                />
              </div>
              <p className="text-[11px] text-slate-400 font-semibold">
                Tip: Paste any public image URL from Unsplash, Imgur, or cloud storage.
              </p>
            </div>
          )}

          {/* Live Preview Box */}
          {previewUrl && (
            <div className="p-3.5 rounded-2xl bg-[#EDF6FF] border-2 border-[#DFE8F2] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={previewUrl}
                  alt="Selected Preview"
                  className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow-xs shrink-0"
                  onError={() => setError('Could not load image from this URL')}
                />
                <div className="min-w-0">
                  <span className="text-[10px] font-black text-[#0798FF] uppercase block">
                    Active Photo Attached
                  </span>
                  <p className="text-xs font-bold text-[#202B49] truncate max-w-xs">
                    {previewUrl}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setPreviewUrl('');
                  setUrlInput('');
                }}
                className="px-3 py-1.5 rounded-xl bg-white border border-[#FFE4EF] text-[#FF5793] hover:bg-[#FFE4EF] text-xs font-black cursor-pointer shadow-xs whitespace-nowrap"
              >
                {t.removePhotoBtn}
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-[#DFE8F2] flex items-center justify-between gap-3">
          {currentImageUrl ? (
            <button
              type="button"
              onClick={() => {
                onRemovePhoto();
                onClose();
              }}
              className="px-4 py-2.5 rounded-2xl border-2 border-[#FFE4EF] text-[#FF5793] hover:bg-[#FFE4EF] text-xs font-black cursor-pointer transition-colors"
            >
              {t.removePhotoBtn}
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl border-2 border-[#DFE8F2] text-[#202B49] hover:bg-slate-100 text-xs font-black cursor-pointer"
            >
              {t.cancelBtn}
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 rounded-2xl bg-[#0798FF] hover:bg-[#0086e6] text-white font-black text-xs shadow-[0_3px_0_#006fc5] active:translate-y-0.5 active:shadow-none flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>{t.applyPhotoBtn}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
