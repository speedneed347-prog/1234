import React, { useState } from 'react';
import { CustomPageElement } from '../types.ts';
import { useCustomization } from '../context/CustomizationContext.tsx';
import { DraggableCustomElement } from './DraggableCustomElement.tsx';
import { ElementEditorModal } from './ElementEditorModal.tsx';
import { PageSettingsModal } from './PageSettingsModal.tsx';

interface CustomElementsOverlayProps {
  pageId: string;
}

export const CustomElementsOverlay: React.FC<CustomElementsOverlayProps> = ({ pageId }) => {
  const { getPageElements, getPageSettings, isEditMode } = useCustomization();

  const [editingElement, setEditingElement] = useState<CustomPageElement | null>(null);
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const elements = getPageElements(pageId);
  const settings = getPageSettings(pageId);

  const handleEditElement = (element: CustomPageElement) => {
    setEditingElement(element);
    setIsEditorModalOpen(true);
  };

  return (
    <>
      {/* Optional Top Announcement Banner */}
      {settings.bannerNotice?.enabled && (
        <div
          style={{
            backgroundColor: settings.bannerNotice.bg || '#FFF9D6',
            color: settings.bannerNotice.textColor || '#202B49',
          }}
          className="w-full py-2 px-4 text-center text-xs sm:text-sm font-bold border-b border-black/5 shadow-xs flex items-center justify-center gap-2 relative z-30 transition-all"
        >
          <span>{settings.bannerNotice.icon || '📢'}</span>
          <span>{settings.bannerNotice.text}</span>
        </div>
      )}

      {/* Optional Custom Background Overlay */}
      {settings.customBackgroundUrl && (
        <div
          style={{
            backgroundImage: `url(${settings.customBackgroundUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.15,
          }}
          className="fixed inset-0 pointer-events-none z-0"
        />
      )}

      {/* Edit Mode Visual Indicator & Canvas Grid */}
      {isEditMode && (
        <div className="fixed inset-0 pointer-events-none z-30 border-4 border-dashed border-[#0798FF]/40 bg-[#0798FF]/[0.02]">
          <div className="absolute top-2 left-2 bg-[#0798FF] text-white px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md pointer-events-auto">
            ✏️ Live Page Customization Mode ({pageId})
          </div>
        </div>
      )}

      {/* All Draggable / Positioned Custom Elements */}
      {elements.map((element) => (
        <DraggableCustomElement
          key={element.id}
          element={element}
          onEdit={handleEditElement}
        />
      ))}

      {/* Modals */}
      <ElementEditorModal
        isOpen={isEditorModalOpen}
        onClose={() => {
          setIsEditorModalOpen(false);
          setEditingElement(null);
        }}
        pageId={pageId}
        initialElement={editingElement}
      />

      <PageSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        pageId={pageId}
      />
    </>
  );
};
