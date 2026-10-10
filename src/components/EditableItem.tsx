import React, { useState } from 'react';
import { useCustomization } from '../context/CustomizationContext.tsx';
import { Edit2, Sparkles, X, Check, EyeOff } from 'lucide-react';

interface EditableItemProps {
  pageId: string;
  elementKey: string;
  type: 'text' | 'image' | 'gif' | 'emoji' | 'box';
  label: string;
  defaultText?: string;
  defaultSrc?: string;
  defaultEmoji?: string;
  className?: string;
  children?: React.ReactNode;
}

export const EditableItem: React.FC<EditableItemProps> = ({
  pageId,
  elementKey,
  type,
  label,
  defaultText = '',
  defaultSrc = '',
  defaultEmoji = '',
  className = '',
  children,
}) => {
  const { isEditMode, getPageSettings, updateElementOverride } = useCustomization();
  const settings = getPageSettings(pageId);
  const override = settings.elementOverrides?.[elementKey];

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(override?.text ?? defaultText);
  const [editSrc, setEditSrc] = useState(override?.src ?? defaultSrc);
  const [editEmoji, setEditEmoji] = useState(override?.emoji ?? defaultEmoji);
  const [editColor, setEditColor] = useState(override?.color || '');
  const [editBgColor, setEditBgColor] = useState(override?.backgroundColor || '');
  const [editFontSize, setEditFontSize] = useState<number | undefined>(override?.fontSize);

  // If set to hidden and not in edit mode, hide completely
  if (override?.hidden && !isEditMode) {
    return null;
  }

  const handleOpenEditor = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditText(override?.text ?? defaultText);
    setEditSrc(override?.src ?? defaultSrc);
    setEditEmoji(override?.emoji ?? defaultEmoji);
    setEditColor(override?.color || '');
    setEditBgColor(override?.backgroundColor || '');
    setEditFontSize(override?.fontSize);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    await updateElementOverride(pageId, elementKey, {
      text: type === 'text' || type === 'box' ? editText : undefined,
      src: type === 'image' || type === 'gif' ? editSrc : undefined,
      emoji: type === 'emoji' ? editEmoji : undefined,
      color: editColor || undefined,
      backgroundColor: editBgColor || undefined,
      fontSize: editFontSize,
      hidden: override?.hidden,
    });
    setIsEditing(false);
  };

  const handleToggleHide = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await updateElementOverride(pageId, elementKey, {
      ...override,
      hidden: !override?.hidden,
    });
  };

  const handleReset = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await updateElementOverride(pageId, elementKey, null);
    setIsEditing(false);
  };

  // Custom inline style dynamically computed from override
  const customStyles: React.CSSProperties = {
    color: override?.color || undefined,
    backgroundColor: override?.backgroundColor || undefined,
    fontSize: override?.fontSize ? `${override.fontSize}px` : undefined,
    opacity: override?.hidden && isEditMode ? 0.35 : undefined,
  };

  return (
    <div
      style={customStyles}
      className={`relative group/editable transition-all ${
        isEditMode
          ? 'cursor-pointer hover:ring-2 hover:ring-[#0798FF] hover:ring-offset-2 rounded-xl outline-1 outline-dashed outline-[#0798FF]/30'
          : ''
      } ${override?.hidden && isEditMode ? 'border-2 border-dashed border-rose-300' : ''} ${className}`}
      onClick={isEditMode ? handleOpenEditor : undefined}
    >
      {/* Visual Hover Badge in Edit Mode */}
      {isEditMode && (
        <div
          onClick={handleOpenEditor}
          className="absolute -top-3 -right-3 z-30 opacity-90 group-hover/editable:opacity-100 bg-[#0798FF] hover:bg-[#0080DF] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 cursor-pointer transition-transform hover:scale-105 pointer-events-auto"
          title={`Edit ${label}`}
        >
          <Edit2 className="w-2.5 h-2.5" />
          <span>{label}</span>
        </div>
      )}

      {/* Render element according to type & overrides */}
      {type === 'text' && (
        override?.text !== undefined ? override.text : children || defaultText
      )}

      {type === 'emoji' && (
        override?.emoji !== undefined ? override.emoji : children || defaultEmoji
      )}

      {type === 'image' || type === 'gif' ? (
        <img
          src={override?.src || defaultSrc}
          alt={label}
          className="w-full h-full object-cover rounded-inherit pointer-events-none"
        />
      ) : null}

      {type === 'box' && children}

      {/* Quick Edit Popup Modal */}
      {isEditing && (
        <div
          className="fixed inset-0 z-[10005] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(false);
          }}
        >
          <div
            className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl border-4 border-white space-y-4 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-[#0798FF] flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#202B49] font-display">
                    Edit {label}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {pageId} • {elementKey}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              {/* Text editing */}
              {(type === 'text' || type === 'box') && (
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    Text / Content (লেখা পরিবর্তন করুন)
                  </label>
                  <textarea
                    rows={3}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    placeholder="Enter updated text..."
                    className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-[#0798FF] outline-hidden text-sm font-bold text-slate-800"
                  />
                </div>
              )}

              {/* Emoji editing */}
              {type === 'emoji' && (
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    Emoji / Icon (ইমোজি পরিবর্তন করুন)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editEmoji}
                      onChange={(e) => setEditEmoji(e.target.value)}
                      placeholder="✨"
                      className="w-20 px-3 py-2 rounded-xl border-2 border-slate-200 text-center text-xl font-bold"
                    />
                    <div className="flex items-center gap-1 overflow-x-auto py-1">
                      {['🐾', '✨', '💖', '🔥', '👑', '🎉', '🚀', '🐱', '🎀', '💎', '🌈'].map((emo) => (
                        <button
                          key={emo}
                          type="button"
                          onClick={() => setEditEmoji(emo)}
                          className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-sky-100 text-sm flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
                        >
                          {emo}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Image / GIF URL */}
              {(type === 'image' || type === 'gif') && (
                <div className="space-y-2">
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    Image / GIF URL (ছবির লিঙ্ক বা জিআইএফ)
                  </label>
                  <input
                    type="text"
                    value={editSrc}
                    onChange={(e) => setEditSrc(e.target.value)}
                    placeholder="https://... (GIF or image URL)"
                    className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-[#0798FF] outline-hidden text-xs font-bold"
                  />
                  {editSrc && (
                    <div className="w-full h-28 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                      <img src={editSrc} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* Ready popular GIF buttons */}
                  <div className="pt-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                      Quick Select GIFs:
                    </span>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {[
                        { title: 'Cat Jam', url: 'https://media.giphy.com/media/jpbnoe3UIa8TU8LM13/giphy.gif' },
                        { title: 'Bongo Cat', url: 'https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif' },
                        { title: 'Party Kitty', url: 'https://media.giphy.com/media/111ebonMs90YLu/giphy.gif' },
                        { title: 'Cute Hug', url: 'https://media.giphy.com/media/vFKqnCdLPNOKc/giphy.gif' },
                        { title: 'Heart Cat', url: 'https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif' },
                      ].map((g) => (
                        <button
                          key={g.url}
                          type="button"
                          onClick={() => setEditSrc(g.url)}
                          className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-sky-100 text-[11px] font-bold text-slate-700 whitespace-nowrap cursor-pointer transition-colors"
                        >
                          {g.title}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Colors and styling */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Text Color:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={editColor || '#202B49'}
                      onChange={(e) => setEditColor(e.target.value)}
                      className="w-7 h-7 rounded-lg cursor-pointer border border-slate-200"
                    />
                    <input
                      type="text"
                      value={editColor}
                      onChange={(e) => setEditColor(e.target.value)}
                      placeholder="#202B49"
                      className="flex-1 px-2 py-1 rounded-lg border border-slate-200 text-[11px] font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Background:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={editBgColor || '#FFFFFF'}
                      onChange={(e) => setEditBgColor(e.target.value)}
                      className="w-7 h-7 rounded-lg cursor-pointer border border-slate-200"
                    />
                    <input
                      type="text"
                      value={editBgColor}
                      onChange={(e) => setEditBgColor(e.target.value)}
                      placeholder="transparent"
                      className="flex-1 px-2 py-1 rounded-lg border border-slate-200 text-[11px] font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleToggleHide}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                    title={override?.hidden ? 'Unhide' : 'Hide element'}
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>{override?.hidden ? 'Show' : 'Hide'}</span>
                  </button>
                  {override && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-600 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-2 rounded-xl text-slate-500 hover:bg-slate-100 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#0798FF] hover:bg-[#0080DF] text-white font-black shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save (সেভ করুন)</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
