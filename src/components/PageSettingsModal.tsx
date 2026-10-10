import React, { useState, useEffect } from 'react';
import { PageSettings } from '../types.ts';
import { useCustomization } from '../context/CustomizationContext.tsx';
import { X, Save, Palette, Bell, RotateCcw } from 'lucide-react';

interface PageSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageId: string;
}

export const PageSettingsModal: React.FC<PageSettingsModalProps> = ({
  isOpen,
  onClose,
  pageId,
}) => {
  const { getPageSettings, savePageSettings, resetPage } = useCustomization();

  const [settings, setSettings] = useState<PageSettings>({ pageId });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSettings(getPageSettings(pageId));
    }
  }, [isOpen, pageId, getPageSettings]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await savePageSettings(pageId, settings);
      onClose();
    } catch (err) {
      console.error('Failed to save page settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (confirm(`Reset all customizations for page "${pageId}" to default?`)) {
      await resetPage(pageId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-4 border-white max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FFE779]/30 text-amber-600 flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#202B49] font-display">
                Page Settings & UI Styling
              </h3>
              <p className="text-xs text-slate-500">
                Customizing: <span className="font-bold text-[#0798FF]">{pageId}</span>
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-5 py-4 text-xs pr-1">
          {/* Top Announcement Banner */}
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <Bell className="w-4 h-4 text-amber-600" />
                <span>Page Announcement Banner (নোটিশ ব্যানার)</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.bannerNotice?.enabled ?? false}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      bannerNotice: {
                        enabled: e.target.checked,
                        text: settings.bannerNotice?.text || '✨ Welcome to BFFMeter! Challenge your friends!',
                        bg: settings.bannerNotice?.bg || '#FFF9D6',
                        textColor: settings.bannerNotice?.textColor || '#202B49',
                        icon: settings.bannerNotice?.icon || '📢',
                      },
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0798FF]"></div>
              </label>
            </div>

            {settings.bannerNotice?.enabled && (
              <div className="space-y-2 pt-2 border-t border-amber-200/60">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Banner Text:</label>
                  <input
                    type="text"
                    value={settings.bannerNotice.text}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        bannerNotice: { ...settings.bannerNotice!, text: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:border-[#0798FF] outline-hidden bg-white text-xs"
                    placeholder="Enter announcement text..."
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Banner Background:</label>
                    <input
                      type="color"
                      value={settings.bannerNotice.bg || '#FFF9D6'}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          bannerNotice: { ...settings.bannerNotice!, bg: e.target.value },
                        })
                      }
                      className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Banner Text Color:</label>
                    <input
                      type="color"
                      value={settings.bannerNotice.textColor || '#202B49'}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          bannerNotice: { ...settings.bannerNotice!, textColor: e.target.value },
                        })
                      }
                      className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Title & Tagline Overrides */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-800 block text-sm">
              Custom Headline & Subtitle (হেডলাইন ও ট্যাগলাইন)
            </span>
            <div>
              <label className="font-bold text-slate-600 block mb-1">
                Custom Page / Hero Title (Leave blank for default):
              </label>
              <input
                type="text"
                value={settings.heroHeadlineOverride || ''}
                onChange={(e) => setSettings({ ...settings, heroHeadlineOverride: e.target.value })}
                placeholder="e.g. The Ultimate Friendship Meter 🐾"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#0798FF] outline-hidden bg-white text-xs"
              />
            </div>
            <div>
              <label className="font-bold text-slate-600 block mb-1">
                Custom Subtitle / Tagline:
              </label>
              <input
                type="text"
                value={settings.heroSubheadlineOverride || ''}
                onChange={(e) => setSettings({ ...settings, heroSubheadlineOverride: e.target.value })}
                placeholder="e.g. Find out who really knows your secret favorites!"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#0798FF] outline-hidden bg-white text-xs"
              />
            </div>
          </div>

          {/* Background Image / GIF */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-800 block text-sm">
              Custom Background Image or GIF (ব্যাকগ্রাউন্ড ছবি / জিআইএফ)
            </span>
            <div>
              <label className="font-bold text-slate-600 block mb-1">
                Background Image / GIF URL (Leave blank for pastel gradient):
              </label>
              <input
                type="text"
                value={settings.customBackgroundUrl || ''}
                onChange={(e) => setSettings({ ...settings, customBackgroundUrl: e.target.value })}
                placeholder="https://... (Optional background overlay)"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#0798FF] outline-hidden bg-white text-xs"
              />
            </div>
          </div>

          {/* Mascot & Doodle Visibility */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="font-bold text-slate-800 block text-sm">Visual Characters</span>
            <div className="flex items-center justify-between">
              <span className="text-slate-700">Display Cat Mascots (Milo & Luna)</span>
              <input
                type="checkbox"
                checked={settings.showMascots ?? true}
                onChange={(e) => setSettings({ ...settings, showMascots: e.target.checked })}
                className="w-4 h-4 rounded-sm text-[#0798FF] accent-[#0798FF]"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-700">Display Cute Floating Doodles</span>
              <input
                type="checkbox"
                checked={settings.showDoodles ?? true}
                onChange={(e) => setSettings({ ...settings, showDoodles: e.target.checked })}
                className="w-4 h-4 rounded-sm text-[#0798FF] accent-[#0798FF]"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Default
          </button>
          <div className="flex items-center gap-2">
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
              className="flex items-center gap-1.5 px-6 py-2 rounded-xl bg-[#0798FF] hover:bg-[#0080DF] text-white text-xs font-black shadow-md transition-all disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
