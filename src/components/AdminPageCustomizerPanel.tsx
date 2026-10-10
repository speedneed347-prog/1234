import React, { useState } from 'react';
import { useCustomization } from '../context/CustomizationContext.tsx';
import { SITE_PAGES, PRESET_GIFS, PRESET_STICKERS } from '../data/presetAssets.ts';
import { CustomPageElement } from '../types.ts';
import { ElementEditorModal } from './ElementEditorModal.tsx';
import { PageSettingsModal } from './PageSettingsModal.tsx';
import {
  Sparkles,
  Plus,
  Settings,
  ExternalLink,
  Move,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  RotateCcw,
  Sliders,
  Image as ImageIcon,
  Palette,
} from 'lucide-react';

interface AdminPageCustomizerPanelProps {
  onNavigate?: (path: string) => void;
}

export const AdminPageCustomizerPanel: React.FC<AdminPageCustomizerPanelProps> = ({
  onNavigate,
}) => {
  const {
    getPageElements,
    getPageSettings,
    saveElement,
    updateElementPosition,
    deleteElement,
    resetPage,
    setIsEditMode,
  } = useCustomization();

  const [selectedPageId, setSelectedPageId] = useState<string>('home');
  const [editingElement, setEditingElement] = useState<CustomPageElement | null>(null);
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const selectedPage = SITE_PAGES.find((p) => p.id === selectedPageId) || SITE_PAGES[0];
  const pageElements = getPageElements(selectedPageId);
  const pageSettings = getPageSettings(selectedPageId);

  const handleOpenLiveEditor = (path: string) => {
    setIsEditMode(true);
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.href = path;
    }
  };

  const handleQuickAddGif = async (gifUrl: string, gifTitle: string) => {
    await saveElement({
      pageId: selectedPageId,
      type: 'gif',
      content: gifUrl,
      title: gifTitle,
      position: { x: Math.floor(Math.random() * 50) + 25, y: Math.floor(Math.random() * 40) + 20, unit: '%' },
      styles: {
        width: 110,
        borderRadius: 20,
        borderColor: '#FFE779',
        borderWidth: 3,
        rotation: Math.floor(Math.random() * 10) - 5,
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      },
      visible: true,
    });
  };

  const handleQuickAddSticker = async (emoji: string) => {
    await saveElement({
      pageId: selectedPageId,
      type: 'sticker',
      content: emoji,
      position: { x: Math.floor(Math.random() * 60) + 20, y: Math.floor(Math.random() * 50) + 20, unit: '%' },
      styles: {
        fontSize: 32,
        rotation: Math.floor(Math.random() * 14) - 7,
      },
      visible: true,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Helper */}
      <div className="bg-gradient-to-r from-blue-500/10 via-sky-400/10 to-amber-400/10 rounded-3xl p-6 border-2 border-[#0798FF]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎨</span>
            <h3 className="text-base font-black text-[#202B49] font-display">
              Site-Wide Visual Page Customizer & Drag-and-Drop Builder
            </h3>
          </div>
          <p className="text-xs text-slate-600 max-w-2xl">
            You can customize <strong>any part of any page</strong> on the website! Add text, images, GIFs,
            announcements, floating mascots, and stickers. Drag them freely on the live screen to reposition them.
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleOpenLiveEditor(selectedPage.path)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#0798FF] hover:bg-[#0080DF] text-white font-black text-xs shadow-md transition-all whitespace-nowrap cursor-pointer hover:scale-102"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Launch Live Drag Editor on {selectedPage.name}</span>
        </button>
      </div>

      {/* Page Selector Grid */}
      <div className="bg-white rounded-3xl p-5 border-4 border-white shadow-xl space-y-3">
        <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
          1. Select Page to Customize (পৃষ্ঠা নির্বাচন করুন):
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {SITE_PAGES.map((page) => {
            const count = getPageElements(page.id).length;
            const isSelected = selectedPageId === page.id;
            return (
              <button
                key={page.id}
                type="button"
                onClick={() => setSelectedPageId(page.id)}
                className={`p-3 rounded-2xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#0798FF] bg-[#EDF6FF] ring-2 ring-[#0798FF]/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-white'
                }`}
              >
                <div>
                  <div className="text-xs font-black text-[#202B49] truncate">{page.name}</div>
                  <div className="text-[10px] text-slate-500 font-semibold truncate">{page.nameBn}</div>
                </div>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200/60">
                  <span className="text-[9px] font-mono text-slate-400 truncate">{page.path}</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      count > 0 ? 'bg-[#0798FF] text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Page Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Page Settings & Quick Presets */}
        <div className="space-y-6">
          {/* Page Details & Settings Card */}
          <div className="bg-white rounded-3xl p-6 border-4 border-white shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase text-[#0798FF] tracking-wider block">
                  Active Page
                </span>
                <h4 className="text-base font-black text-[#202B49] font-display">
                  {selectedPage.name}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-xs border border-amber-200 transition-colors cursor-pointer"
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Page UI Settings</span>
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Route Path:</span>
                <span className="font-mono font-bold text-slate-700">{selectedPage.path}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Top Announcement Banner:</span>
                <span className={`font-bold ${pageSettings.bannerNotice?.enabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {pageSettings.bannerNotice?.enabled ? 'Active (অন)' : 'Disabled'}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Custom Title:</span>
                <span className="font-bold text-slate-700 truncate max-w-[140px]">
                  {pageSettings.heroHeadlineOverride || 'Default'}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 font-medium">Custom Elements:</span>
                <span className="font-bold text-[#0798FF]">{pageElements.length} elements</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingElement(null);
                  setIsEditorModalOpen(true);
                }}
                className="flex-1 py-2.5 rounded-2xl bg-[#0798FF] hover:bg-[#0080DF] text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Custom Element</span>
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (confirm(`Reset all customizations on "${selectedPage.name}" to default?`)) {
                    await resetPage(selectedPageId);
                  }
                }}
                className="p-2.5 rounded-2xl border border-slate-200 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                title="Reset this page"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick GIF & Sticker Palette */}
          <div className="bg-white rounded-3xl p-6 border-4 border-white shadow-xl space-y-4">
            <div>
              <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider block">
                Quick Insert
              </span>
              <h4 className="text-sm font-black text-[#202B49] font-display">
                Insert Animated GIFs (১-ক্লিকে জিআইএফ যুক্ত করুন)
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {PRESET_GIFS.map((gif) => (
                <div
                  key={gif.id}
                  className="p-2 rounded-2xl border border-slate-200 hover:border-[#0798FF] bg-slate-50/50 hover:bg-white transition-all text-center flex flex-col justify-between"
                >
                  <img
                    src={gif.previewUrl}
                    alt={gif.title}
                    className="w-full h-16 object-cover rounded-xl mb-1.5"
                  />
                  <div className="text-[10px] font-bold text-slate-700 truncate">{gif.title}</div>
                  <button
                    type="button"
                    onClick={() => handleQuickAddGif(gif.url, gif.title)}
                    className="mt-2 w-full py-1 rounded-xl bg-sky-100 hover:bg-[#0798FF] text-[#0798FF] hover:text-white text-[10px] font-black transition-colors cursor-pointer"
                  >
                    + Add to {selectedPage.name}
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Stickers */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-700 block mb-2">
                Quick Emoji Stickers:
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESET_STICKERS.map((stk) => (
                  <button
                    key={stk.id}
                    type="button"
                    onClick={() => handleQuickAddSticker(stk.emoji)}
                    className="p-2 rounded-xl border border-slate-200 hover:border-[#0798FF] hover:bg-sky-50 text-lg transition-transform hover:scale-110 cursor-pointer"
                    title={`Add ${stk.label}`}
                  >
                    {stk.emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Active Elements on this Page */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 border-4 border-white shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                  Active Elements on Page ({pageElements.length})
                </span>
                <h4 className="text-base font-black text-[#202B49] font-display">
                  Custom Floating &amp; Positioned Elements
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenLiveEditor(selectedPage.path)}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Move className="w-3.5 h-3.5" />
                  <span>Interactive Drag Repositioning</span>
                </button>
              </div>
            </div>

            {pageElements.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-2xl">
                  ✨
                </div>
                <div className="text-sm font-bold text-slate-600">
                  No custom elements on "{selectedPage.name}" yet.
                </div>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Click "+ Add Custom Element" or pick any GIF or sticker from the left to place it on this page.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setEditingElement(null);
                    setIsEditorModalOpen(true);
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-[#0798FF] hover:bg-[#0080DF] text-white font-black text-xs shadow-md transition-all inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create First Custom Element</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {pageElements.map((elem) => {
                  const pos = elem.position || { x: 50, y: 50 };
                  const styles = elem.styles || {};
                  return (
                    <div
                      key={elem.id}
                      className="p-4 rounded-2xl border-2 border-slate-200 hover:border-[#0798FF] bg-slate-50/50 hover:bg-white transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      {/* Left: Preview thumbnail and info */}
                      <div className="flex items-center gap-3 min-w-0">
                        {elem.type === 'gif' || elem.type === 'image' ? (
                          <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 bg-white shrink-0 flex items-center justify-center shadow-xs">
                            <img
                              src={elem.content}
                              alt={elem.title || 'Custom'}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : elem.type === 'sticker' ? (
                          <div className="w-16 h-16 rounded-xl border border-slate-200 bg-white shrink-0 flex items-center justify-center text-3xl shadow-xs">
                            {elem.content}
                          </div>
                        ) : (
                          <div
                            style={{
                              backgroundColor: styles.backgroundColor || '#EFF6FF',
                              color: styles.color || '#0798FF',
                            }}
                            className="w-16 h-16 rounded-xl border border-slate-200 shrink-0 flex items-center justify-center text-xs font-bold text-center p-1 shadow-xs truncate"
                          >
                            {elem.content.substring(0, 15)}...
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#0798FF]/10 text-[#0798FF]">
                              {elem.type}
                            </span>
                            <span className="text-xs font-black text-[#202B49] truncate">
                              {elem.title || elem.content}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                            <span>Position: <strong className="text-slate-800">X: {pos.x}%, Y: {pos.y}%</strong></span>
                            <span>•</span>
                            <span>Size: <strong className="text-slate-800">{styles.width || styles.fontSize || 100}px</strong></span>
                            {styles.rotation ? (
                              <>
                                <span>•</span>
                                <span>Rot: <strong className="text-slate-800">{styles.rotation}°</strong></span>
                              </>
                            ) : null}
                          </div>
                          {elem.linkUrl && (
                            <div className="text-[10px] text-sky-600 truncate mt-0.5">
                              Link: {elem.linkUrl}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Middle: Live X and Y Position Quick Sliders */}
                      <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                          <span className="font-bold text-[10px] text-slate-400">X:</span>
                          <input
                            type="range"
                            min="2"
                            max="96"
                            value={pos.x}
                            onChange={(e) =>
                              updateElementPosition(elem.id, {
                                x: Number(e.target.value),
                                y: pos.y,
                                unit: '%',
                              })
                            }
                            className="w-20 accent-[#0798FF]"
                            title="Adjust horizontal position"
                          />
                          <span className="font-mono text-[10px] w-6 text-right">{pos.x}%</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                          <span className="font-bold text-[10px] text-slate-400">Y:</span>
                          <input
                            type="range"
                            min="2"
                            max="96"
                            value={pos.y}
                            onChange={(e) =>
                              updateElementPosition(elem.id, {
                                x: pos.x,
                                y: Number(e.target.value),
                                unit: '%',
                              })
                            }
                            className="w-20 accent-[#0798FF]"
                            title="Adjust vertical position"
                          />
                          <span className="font-mono text-[10px] w-6 text-right">{pos.y}%</span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 shrink-0 ml-auto md:ml-0">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingElement(elem);
                              setIsEditorModalOpen(true);
                            }}
                            className="p-2 rounded-xl bg-white border border-slate-200 hover:border-[#0798FF] hover:text-[#0798FF] text-slate-600 transition-colors cursor-pointer"
                            title="Edit styling & content"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm('Delete this custom element?')) {
                                deleteElement(elem.id);
                              }
                            }}
                            className="p-2 rounded-xl bg-white border border-slate-200 hover:border-red-400 hover:text-red-500 text-slate-400 transition-colors cursor-pointer"
                            title="Delete element"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ElementEditorModal
        isOpen={isEditorModalOpen}
        onClose={() => {
          setIsEditorModalOpen(false);
          setEditingElement(null);
        }}
        pageId={selectedPageId}
        initialElement={editingElement}
      />

      <PageSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        pageId={selectedPageId}
      />
    </div>
  );
};
