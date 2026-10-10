import React, { useState, useRef, useEffect } from 'react';
import { CustomPageElement } from '../types.ts';
import { useCustomization } from '../context/CustomizationContext.tsx';
import { Move, Trash2, Edit3, ExternalLink } from 'lucide-react';

interface DraggableCustomElementProps {
  element: CustomPageElement;
  onEdit: (element: CustomPageElement) => void;
}

export const DraggableCustomElement: React.FC<DraggableCustomElementProps> = ({
  element,
  onEdit,
}) => {
  const { isEditMode, updateElementPosition, deleteElement, activeElementId, setActiveElementId } =
    useCustomization();

  const [isDragging, setIsDragging] = useState(false);
  const [currentPos, setCurrentPos] = useState({
    x: element.position?.x ?? 50,
    y: element.position?.y ?? 50,
  });

  const latestPosRef = useRef({
    x: element.position?.x ?? 50,
    y: element.position?.y ?? 50,
  });

  const dragStartRef = useRef<{ startX: number; startY: number; initX: number; initY: number }>({
    startX: 0,
    startY: 0,
    initX: element.position?.x ?? 50,
    initY: element.position?.y ?? 50,
  });

  // Sync external position updates when not dragging
  useEffect(() => {
    if (!isDragging) {
      const px = element.position?.x ?? 50;
      const py = element.position?.y ?? 50;
      setCurrentPos({ x: px, y: py });
      latestPosRef.current = { x: px, y: py };
    }
  }, [element.position?.x, element.position?.y, isDragging]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isEditMode) return;
    // Don't drag if clicking buttons
    if ((e.target as HTMLElement).closest('button')) return;

    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);
    setActiveElementId(element.id);

    const initX = latestPosRef.current.x;
    const initY = latestPosRef.current.y;

    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX,
      initY,
    };

    const handlePointerMove = (moveEvt: PointerEvent) => {
      moveEvt.preventDefault();
      const deltaX = moveEvt.clientX - dragStartRef.current.startX;
      const deltaY = moveEvt.clientY - dragStartRef.current.startY;

      // Convert delta to percentage of viewport
      const pctDeltaX = (deltaX / window.innerWidth) * 100;
      const pctDeltaY = (deltaY / window.innerHeight) * 100;

      const newX = Math.max(1, Math.min(94, Math.round(dragStartRef.current.initX + pctDeltaX)));
      const newY = Math.max(1, Math.min(94, Math.round(dragStartRef.current.initY + pctDeltaY)));

      latestPosRef.current = { x: newX, y: newY };
      setCurrentPos({ x: newX, y: newY });
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      setIsDragging(false);

      const finalPos = {
        x: latestPosRef.current.x,
        y: latestPosRef.current.y,
        unit: '%' as const,
      };

      // Keep local state locked to finalPos
      setCurrentPos({ x: finalPos.x, y: finalPos.y });

      // Persist new position to context & server
      updateElementPosition(element.id, finalPos);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: false });
    window.addEventListener('pointerup', handlePointerUp);
  };

  const isSelected = activeElementId === element.id;
  const s = element.styles || {};

  // Custom styles mapping
  const customInlineStyles: React.CSSProperties = {
    position: 'fixed',
    left: `${currentPos.x}%`,
    top: `${currentPos.y}%`,
    transform: `translate(-50%, -50%) rotate(${s.rotation || 0}deg)`,
    zIndex: isDragging ? 9999 : s.zIndex || 40,
    color: s.color,
    backgroundColor: s.backgroundColor,
    fontSize: s.fontSize ? `${s.fontSize}px` : undefined,
    fontWeight: s.fontWeight || undefined,
    padding: s.padding ? `${s.padding}px` : undefined,
    borderRadius: s.borderRadius ? `${s.borderRadius}px` : undefined,
    borderWidth: s.borderWidth ? `${s.borderWidth}px` : undefined,
    borderColor: s.borderColor,
    borderStyle: s.borderWidth ? 'solid' : undefined,
    boxShadow: s.boxShadow || (isDragging ? '0 20px 30px rgba(0,0,0,0.25)' : undefined),
    opacity: s.opacity ?? (element.visible ? 1 : 0.4),
    cursor: isEditMode ? 'grab' : element.linkUrl ? 'pointer' : 'default',
    userSelect: isEditMode ? 'none' : 'auto',
    touchAction: isEditMode ? 'none' : 'auto',
    transition: isDragging ? 'none' : 'transform 0.15s ease, box-shadow 0.15s ease',
  };

  const renderContent = () => {
    switch (element.type) {
      case 'gif':
      case 'image':
        return (
          <div className="relative group">
            <img
              src={element.content}
              alt={element.title || 'Custom element'}
              style={{
                width: s.width ? `${s.width}px` : '100px',
                height: s.height ? `${s.height}px` : 'auto',
                borderRadius: s.borderRadius ? `${s.borderRadius}px` : '16px',
                objectFit: 'cover',
              }}
              className="pointer-events-none select-none shadow-md"
              loading="lazy"
            />
            {element.title && (
              <div className="text-[10px] font-black text-center mt-1 text-slate-700 bg-white/90 backdrop-blur-xs px-1.5 py-0.5 rounded-full border border-slate-200">
                {element.title}
              </div>
            )}
          </div>
        );

      case 'sticker':
        return (
          <div className="text-4xl sm:text-5xl select-none filter drop-shadow-md animate-bounce-subtle">
            {element.content}
          </div>
        );

      case 'badge':
      case 'text':
        return (
          <div className="inline-flex items-center gap-1.5 font-bold tracking-tight select-none">
            {element.content}
            {element.linkUrl && !isEditMode && <ExternalLink className="w-3.5 h-3.5 opacity-60 ml-0.5" />}
          </div>
        );

      case 'button':
        return (
          <button
            type="button"
            onClick={() => {
              if (!isEditMode && element.linkUrl) {
                window.location.href = element.linkUrl;
              }
            }}
            className="px-4 py-2 font-black rounded-2xl bg-[#0798FF] text-white shadow-md hover:bg-[#0080DF] transition-all flex items-center gap-1.5 text-sm"
          >
            {element.content}
            {element.linkUrl && <ExternalLink className="w-3.5 h-3.5 ml-0.5" />}
          </button>
        );

      case 'banner':
        return (
          <div className="px-4 py-2.5 rounded-2xl shadow-md border flex items-center gap-2 max-w-sm font-medium text-xs sm:text-sm">
            <span>📢</span>
            <span className="truncate">{element.content}</span>
          </div>
        );

      default:
        return <div>{element.content}</div>;
    }
  };

  const handleElementClick = (e: React.MouseEvent) => {
    if (isEditMode) {
      e.stopPropagation();
      setActiveElementId(element.id);
    } else if (element.linkUrl) {
      if (element.linkUrl.startsWith('http')) {
        window.open(element.linkUrl, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = element.linkUrl;
      }
    }
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onClick={handleElementClick}
      style={customInlineStyles}
      className={`group ${
        isEditMode
          ? `outline-2 outline-dashed ${
              isSelected ? 'outline-[#0798FF] ring-4 ring-[#0798FF]/20' : 'outline-amber-400 hover:outline-[#0798FF]'
            }`
          : ''
      }`}
    >
      {/* Admin Floating Controls on Element */}
      {isEditMode && (
        <div
          className={`absolute -top-9 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900/95 text-white shadow-lg text-[10px] font-bold z-50 whitespace-nowrap transition-opacity ${
            isSelected || isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          <span className="flex items-center gap-0.5 text-slate-300 mr-1 cursor-grab">
            <Move className="w-2.5 h-2.5 text-amber-400" />
            <span>{currentPos.x}%, {currentPos.y}%</span>
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(element);
            }}
            className="p-1 hover:text-sky-300 transition-colors"
            title="Edit element styles and content"
          >
            <Edit3 className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('Delete this custom element? / এই উপাদানটি মুছে ফেলবেন?')) {
                deleteElement(element.id);
              }
            }}
            className="p-1 hover:text-red-400 transition-colors"
            title="Delete element"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}

      {renderContent()}
    </div>
  );
};
