import React, { useState } from 'react';
import { useCustomization } from '../context/CustomizationContext.tsx';
import { ElementEditorModal } from './ElementEditorModal.tsx';
import { PageSettingsModal } from './PageSettingsModal.tsx';
import {
  Sparkles,
  Plus,
  Settings,
  Shield,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';

interface AdminLiveEditorBarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const AdminLiveEditorBar: React.FC<AdminLiveEditorBarProps> = ({
  currentPath,
  onNavigate,
}) => {
  const { isAdmin, isEditMode, setIsEditMode, resetPage } = useCustomization();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // If not logged in as admin, this bar is completely hidden!
  if (!isAdmin) return null;

  // Determine current pageId based on route
  const getPageIdFromPath = (path: string): string => {
    if (path === '/') return 'home';
    if (path.startsWith('/create')) return 'create';
    if (path.startsWith('/contact')) return 'contact';
    if (path.startsWith('/privacy')) return 'privacy';
    if (path.startsWith('/terms')) return 'terms';
    if (path.startsWith('/dashboard')) return 'dashboard';
    if (path.includes('/play')) return 'quiz-play';
    if (path.includes('/scoreboard')) return 'quiz-scoreboard';
    if (path.includes('/result')) return 'quiz-result';
    if (path.startsWith('/quiz/')) return 'quiz-landing';
    return 'global';
  };

  const currentPageId = getPageIdFromPath(currentPath);

  return (
    <>
      <aside
        aria-label="Admin Customizer Bar"
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9990] flex flex-col items-center max-w-[95vw] pointer-events-auto"
      >
        <div className="bg-[#202B49]/95 backdrop-blur-md text-white rounded-3xl p-1.5 sm:p-2 border-2 border-white/20 shadow-2xl flex items-center gap-1 sm:gap-2 text-xs">
          {/* Admin Tag */}
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-2xl bg-amber-400/20 text-amber-300 font-black">
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin Mode:</span>
            <span className="text-white capitalize font-mono text-[11px]">{currentPageId}</span>
          </div>

          {!isCollapsed && (
            <>
              {/* Toggle Live Edit Mode */}
              <button
                type="button"
                onClick={() => setIsEditMode(!isEditMode)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl font-bold transition-all ${
                  isEditMode
                    ? 'bg-amber-400 text-slate-900 shadow-md ring-2 ring-amber-300'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                title="Enable dragging and on-page element repositioning"
              >
                {isEditMode ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{isEditMode ? 'Editing ON (ড্র্যাগ চালু)' : 'Turn Edit ON'}</span>
              </button>

              {/* Add Element */}
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-[#0798FF] hover:bg-[#0080DF] text-white font-black shadow-md transition-all"
                title="Add custom text, image, GIF or banner to this page"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden md:inline">+ Add Element</span>
                <span className="md:hidden">+ Element</span>
              </button>

              {/* Page Settings */}
              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all"
                title="Customize page headline, banner notice, background"
              >
                <Settings className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Page UI</span>
              </button>

              {/* Reset Page */}
              <button
                type="button"
                onClick={async () => {
                  if (confirm(`Reset all customizations on "${currentPageId}"?`)) {
                    await resetPage(currentPageId);
                  }
                }}
                className="p-1.5 rounded-2xl bg-white/10 hover:bg-red-500/30 text-slate-300 hover:text-red-300 transition-colors"
                title="Reset this page to default"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Full Admin Link */}
              <button
                type="button"
                onClick={() => onNavigate('/admin')}
                className="px-2.5 py-1.5 rounded-2xl bg-white/10 hover:bg-white/20 text-sky-300 font-bold hidden sm:flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                <span>Admin Panel</span>
              </button>
            </>
          )}

          {/* Collapse/Expand Toggle */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-2xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title={isCollapsed ? 'Expand Customizer' : 'Collapse Customizer'}
          >
            {isCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </aside>

      {/* Add Element Modal */}
      <ElementEditorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        pageId={currentPageId}
      />

      {/* Page Settings Modal */}
      <PageSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        pageId={currentPageId}
      />
    </>
  );
};
