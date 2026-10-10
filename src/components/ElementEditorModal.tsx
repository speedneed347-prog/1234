import React, { useState, useEffect } from 'react';
import { CustomPageElement } from '../types.ts';
import { useCustomization } from '../context/CustomizationContext.tsx';
import { PRESET_GIFS, PRESET_STICKERS } from '../data/presetAssets.ts';
import { X, Sparkles, Image, Type, Save, Link2, Upload, Smile, Flag } from 'lucide-react';

interface ElementEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageId: string;
  initialElement?: CustomPageElement | null;
}

export const ElementEditorModal: React.FC<ElementEditorModalProps> = ({
  isOpen,
  onClose,
  pageId,
  initialElement,
}) => {
  const { saveElement } = useCustomization();

  const [type, setType] = useState<CustomPageElement['type']>('gif');
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [styles, setStyles] = useState<{
    color?: string;
    backgroundColor?: string;
    fontSize?: number;
    fontWeight?: string;
    borderRadius?: number;
    padding?: number;
    width?: number;
    height?: number;
    borderColor?: string;
    borderWidth?: number;
    rotation?: number;
    boxShadow?: string;
  }>({
    color: '#202B49',
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    borderRadius: 20,
    padding: 10,
    width: 120,
    borderWidth: 2,
    borderColor: '#BAE6FD',
    rotation: 0,
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
  });

  const [activeTab, setActiveTab] = useState<'presets' | 'custom' | 'upload' | 'styles'>('presets');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialElement) {
      setType(initialElement.type);
      setContent(initialElement.content);
      setTitle(initialElement.title || '');
      setLinkUrl(initialElement.linkUrl || '');
      setStyles(initialElement.styles || {});
      setActiveTab('styles');
    } else {
      // Default to party gif
      setType('gif');
      setContent(PRESET_GIFS[0].url);
      setTitle(PRESET_GIFS[0].title);
      setLinkUrl('');
      setStyles({
        borderRadius: 20,
        width: 110,
        borderWidth: 3,
        borderColor: '#FFE779',
        rotation: 4,
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      });
      setActiveTab('presets');
    }
  }, [initialElement, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size too large (max 5MB)');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setContent(reader.result);
        setType(file.type.includes('gif') ? 'gif' : 'image');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!content.trim()) {
      alert('Content / Image / GIF URL is required');
      return;
    }

    setIsSaving(true);
    try {
      await saveElement({
        id: initialElement?.id,
        pageId,
        type,
        content: content.trim(),
        title: title.trim(),
        linkUrl: linkUrl.trim(),
        position: initialElement?.position || { x: 50, y: 35, unit: '%' },
        styles,
        visible: true,
      });
      onClose();
    } catch (err) {
      console.error('Failed to save element:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border-4 border-white max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#0798FF]/10 text-[#0798FF] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#202B49] font-display">
                {initialElement ? 'Edit Custom Element' : 'Add Custom Element to Page'}
              </h3>
              <p className="text-xs text-slate-500">
                Target Page: <span className="font-bold text-[#0798FF]">{pageId}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Element Type Selector */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl my-4 overflow-x-auto">
          {[
            { id: 'gif', label: 'GIF Animation', icon: Sparkles },
            { id: 'image', label: 'Photo / Image', icon: Image },
            { id: 'text', label: 'Text Badge', icon: Type },
            { id: 'sticker', label: 'Emoji Sticker', icon: Smile },
            { id: 'button', label: 'Button Link', icon: Link2 },
            { id: 'banner', label: 'Banner Alert', icon: Flag },
          ].map((item) => {
            const Icon = item.icon;
            const active = type === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setType(item.id as any);
                  if (item.id === 'text' && !content) setContent('✨ Best Friend Badge!');
                  if (item.id === 'sticker' && !content) setContent('💖');
                  if (item.id === 'button' && !content) setContent('Tap Here!');
                  if (item.id === 'banner' && !content) setContent('🎉 Special announcement!');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  active
                    ? 'bg-[#0798FF] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 mb-4 gap-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`pb-2 border-b-2 transition-colors ${
              activeTab === 'presets'
                ? 'border-[#0798FF] text-[#0798FF]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            🌟 Curated Presets
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`pb-2 border-b-2 transition-colors ${
              activeTab === 'custom'
                ? 'border-[#0798FF] text-[#0798FF]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            🔗 Custom URL / Text
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`pb-2 border-b-2 transition-colors ${
              activeTab === 'upload'
                ? 'border-[#0798FF] text-[#0798FF]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            📤 Upload File
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('styles')}
            className={`pb-2 border-b-2 transition-colors ${
              activeTab === 'styles'
                ? 'border-[#0798FF] text-[#0798FF]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            🎨 Styling & Size
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* TAB 1: Presets */}
          {activeTab === 'presets' && (
            <div className="space-y-4">
              {type === 'gif' && (
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-2">
                    Pick a Popular Animated GIF:
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                    {PRESET_GIFS.map((gif) => (
                      <div
                        key={gif.id}
                        onClick={() => {
                          setContent(gif.url);
                          setTitle(gif.title);
                        }}
                        className={`cursor-pointer rounded-2xl overflow-hidden border-2 transition-all p-1 text-center hover:scale-105 ${
                          content === gif.url
                            ? 'border-[#0798FF] ring-2 ring-[#0798FF]/30 bg-sky-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <img
                          src={gif.previewUrl}
                          alt={gif.title}
                          className="w-full h-16 object-cover rounded-xl mb-1"
                        />
                        <p className="text-[10px] font-bold text-slate-700 truncate">{gif.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {type === 'sticker' && (
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-2">
                    Choose Emoji Sticker:
                  </label>
                  <div className="grid grid-cols-5 gap-3 text-center">
                    {PRESET_STICKERS.map((stk) => (
                      <div
                        key={stk.id}
                        onClick={() => setContent(stk.emoji)}
                        className={`cursor-pointer p-3 rounded-2xl border-2 transition-transform hover:scale-110 ${
                          content === stk.emoji
                            ? 'border-[#0798FF] bg-sky-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="text-3xl mb-1">{stk.emoji}</div>
                        <div className="text-[9px] font-medium text-slate-600 truncate">{stk.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(type === 'text' || type === 'badge' || type === 'button' || type === 'banner') && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-600 block">
                    Quick Text Templates:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      '💖 Besties Forever!',
                      '⭐ Number 1 Friend!',
                      '🐱 Welcome Cat Lovers!',
                      '🔥 Super Streak!',
                      '🎉 BFF Quiz Challenge!',
                      '🐾 Luna & Milo Approved!',
                      '👑 Royalty Best Friend',
                    ].map((tpl) => (
                      <button
                        key={tpl}
                        type="button"
                        onClick={() => setContent(tpl)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:border-[#0798FF] hover:bg-sky-50"
                      >
                        {tpl}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Custom URL / Text */}
          {activeTab === 'custom' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {type === 'gif' || type === 'image' ? 'Image / GIF Web URL (https://...)' : 'Display Text Content:'}
                </label>
                <input
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={
                    type === 'gif'
                      ? 'https://media.giphy.com/media/.../giphy.gif'
                      : type === 'image'
                      ? 'https://example.com/photo.png'
                      : 'Type your custom message...'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 focus:border-[#0798FF] outline-hidden text-sm"
                />
              </div>

              {(type === 'gif' || type === 'image') && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Label / Title (Optional subtitle):
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Party Cat"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#0798FF] outline-hidden text-sm"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Click Link URL (Optional click target):
                </label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://... or /quiz/bm-maya26"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#0798FF] outline-hidden text-sm"
                />
              </div>
            </div>
          )}

          {/* TAB 3: File Upload */}
          {activeTab === 'upload' && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block">
                Upload image or GIF from device (Computer / Phone):
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-[#0798FF] bg-slate-50/50 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="custom-element-upload-input"
                />
                <label
                  htmlFor="custom-element-upload-input"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <div className="w-12 h-12 rounded-full bg-sky-100 text-[#0798FF] flex items-center justify-center">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">Click to choose image or GIF file</span>
                  <span className="text-[10px] text-slate-400">PNG, JPG, WEBP, GIF up to 5MB</span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 4: Styling */}
          {activeTab === 'styles' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {(type === 'gif' || type === 'image') && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Width: {styles.width || 120}px
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="300"
                    value={styles.width || 120}
                    onChange={(e) => setStyles({ ...styles, width: Number(e.target.value) })}
                    className="w-full accent-[#0798FF]"
                  />
                </div>
              )}

              {(type === 'text' || type === 'badge' || type === 'button' || type === 'banner') && (
                <>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Font Size: {styles.fontSize || 16}px
                    </label>
                    <input
                      type="range"
                      min="12"
                      max="36"
                      value={styles.fontSize || 16}
                      onChange={(e) => setStyles({ ...styles, fontSize: Number(e.target.value) })}
                      className="w-full accent-[#0798FF]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Text Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={styles.color || '#202B49'}
                        onChange={(e) => setStyles({ ...styles, color: e.target.value })}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200"
                      />
                      <span className="text-slate-600 font-mono">{styles.color || '#202B49'}</span>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Background Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={styles.backgroundColor || '#FFFFFF'}
                        onChange={(e) => setStyles({ ...styles, backgroundColor: e.target.value })}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200"
                      />
                      <span className="text-slate-600 font-mono">{styles.backgroundColor || '#FFFFFF'}</span>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Border Radius: {styles.borderRadius ?? 20}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={styles.borderRadius ?? 20}
                  onChange={(e) => setStyles({ ...styles, borderRadius: Number(e.target.value) })}
                  className="w-full accent-[#0798FF]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Rotation: {styles.rotation ?? 0}°
                </label>
                <input
                  type="range"
                  min="-30"
                  max="30"
                  value={styles.rotation ?? 0}
                  onChange={(e) => setStyles({ ...styles, rotation: Number(e.target.value) })}
                  className="w-full accent-[#0798FF]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Border Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={styles.borderColor || '#BAE6FD'}
                    onChange={(e) => setStyles({ ...styles, borderColor: e.target.value })}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200"
                  />
                  <span className="text-slate-600 font-mono">{styles.borderColor || '#BAE6FD'}</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Border Width: {styles.borderWidth ?? 2}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="8"
                  value={styles.borderWidth ?? 2}
                  onChange={(e) => setStyles({ ...styles, borderWidth: Number(e.target.value) })}
                  className="w-full accent-[#0798FF]"
                />
              </div>
            </div>
          )}

          {/* Live Preview Bar */}
          <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Element Preview (উপাদান প্রিভিউ):
            </span>
            <div className="flex justify-center items-center py-2">
              {type === 'gif' || type === 'image' ? (
                <div
                  style={{
                    transform: `rotate(${styles.rotation || 0}deg)`,
                    borderRadius: `${styles.borderRadius || 20}px`,
                    border: `${styles.borderWidth || 2}px solid ${styles.borderColor || '#BAE6FD'}`,
                  }}
                  className="overflow-hidden shadow-md inline-block bg-white"
                >
                  <img
                    src={content || PRESET_GIFS[0].url}
                    alt="Preview"
                    style={{ width: `${styles.width || 100}px` }}
                    className="max-h-36 object-cover"
                  />
                  {title && (
                    <div className="text-[10px] font-bold text-slate-700 bg-white/90 py-0.5 text-center">
                      {title}
                    </div>
                  )}
                </div>
              ) : type === 'sticker' ? (
                <div
                  style={{ transform: `rotate(${styles.rotation || 0}deg)` }}
                  className="text-5xl drop-shadow-md select-none"
                >
                  {content || '💖'}
                </div>
              ) : (
                <div
                  style={{
                    color: styles.color || '#202B49',
                    backgroundColor: styles.backgroundColor || '#FFFFFF',
                    fontSize: `${styles.fontSize || 16}px`,
                    borderRadius: `${styles.borderRadius || 20}px`,
                    padding: `${styles.padding || 10}px 16px`,
                    border: `${styles.borderWidth || 2}px solid ${styles.borderColor || '#BAE6FD'}`,
                    transform: `rotate(${styles.rotation || 0}deg)`,
                  }}
                  className="font-bold shadow-md inline-block select-none"
                >
                  {content || 'Preview Text'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-2xl bg-[#0798FF] hover:bg-[#0080DF] text-white text-xs font-black shadow-md transition-all disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {isSaving ? 'Saving...' : initialElement ? 'Save Changes' : 'Place on Page'}
          </button>
        </div>
      </div>
    </div>
  );
};
