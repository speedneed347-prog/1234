import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api/client.ts';
import { CustomPageElement, PageSettings, PageCustomizationStore } from '../types.ts';

interface CustomizationContextType {
  customizations: PageCustomizationStore;
  loading: boolean;
  isAdmin: boolean;
  isEditMode: boolean;
  activeElementId: string | null;
  setIsEditMode: (edit: boolean) => void;
  setActiveElementId: (id: string | null) => void;
  getPageSettings: (pageId: string) => PageSettings;
  getPageElements: (pageId: string) => CustomPageElement[];
  savePageSettings: (pageId: string, settings: Partial<PageSettings>) => Promise<boolean>;
  saveElement: (element: Partial<CustomPageElement> & { pageId: string }) => Promise<CustomPageElement | null>;
  updateElementPosition: (id: string, position: { x: number; y: number; unit?: '%' | 'px' }) => Promise<boolean>;
  updateElementOverride: (
    pageId: string,
    key: string,
    override: {
      text?: string;
      src?: string;
      color?: string;
      backgroundColor?: string;
      fontSize?: number;
      hidden?: boolean;
      emoji?: string;
      borderRadius?: number;
      boxShadow?: string;
      padding?: number;
    } | null
  ) => Promise<boolean>;
  deleteElement: (id: string) => Promise<boolean>;
  resetPage: (pageId?: string) => Promise<boolean>;
  refresh: () => Promise<void>;
}

const defaultStore: PageCustomizationStore = {
  pageSettings: {},
  elements: [],
};

const CustomizationContext = createContext<CustomizationContextType | undefined>(undefined);

export const CustomizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customizations, setCustomizations] = useState<PageCustomizationStore>(defaultStore);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeElementId, setActiveElementId] = useState<string | null>(null);

  const getAdminToken = useCallback(() => {
    return localStorage.getItem('bffmeter_admin_token') || '';
  }, []);

  const isAdmin = Boolean(getAdminToken());

  const refresh = useCallback(async () => {
    try {
      const res = await api.getCustomizations();
      if (res.success && res.customizations) {
        setCustomizations(res.customizations);
      }
    } catch (err) {
      console.error('Failed to load page customizations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const getPageSettings = useCallback(
    (pageId: string): PageSettings => {
      return (
        customizations.pageSettings[pageId] || {
          pageId,
          showMascots: true,
          showDoodles: true,
        }
      );
    },
    [customizations]
  );

  const getPageElements = useCallback(
    (pageId: string): CustomPageElement[] => {
      return (customizations.elements || []).filter(
        (el) => el.pageId === pageId || el.pageId === 'global'
      );
    },
    [customizations]
  );

  const savePageSettings = async (pageId: string, settings: Partial<PageSettings>): Promise<boolean> => {
    const token = getAdminToken();
    if (!token) return false;

    try {
      const res = await api.adminSavePageSettings(token, pageId, settings);
      if (res.success && res.settings) {
        setCustomizations((prev) => ({
          ...prev,
          pageSettings: {
            ...prev.pageSettings,
            [pageId]: res.settings,
          },
        }));
        return true;
      }
    } catch (err) {
      console.error('Failed to save page settings:', err);
    }
    return false;
  };

  const saveElement = async (
    elementData: Partial<CustomPageElement> & { pageId: string }
  ): Promise<CustomPageElement | null> => {
    const token = getAdminToken();
    if (!token) return null;

    try {
      const res = await api.adminSaveCustomElement(token, elementData);
      if (res.success && res.element) {
        setCustomizations((prev) => {
          const idx = prev.elements.findIndex((e) => e.id === res.element.id);
          const newElements = [...prev.elements];
          if (idx !== -1) {
            newElements[idx] = res.element;
          } else {
            newElements.push(res.element);
          }
          return {
            ...prev,
            elements: newElements,
          };
        });
        return res.element;
      }
    } catch (err) {
      console.error('Failed to save element:', err);
    }
    return null;
  };

  const updateElementPosition = async (
    id: string,
    position: { x: number; y: number; unit?: '%' | 'px' }
  ): Promise<boolean> => {
    // Optimistic update in state
    setCustomizations((prev) => {
      const newElements = prev.elements.map((e) =>
        e.id === id ? { ...e, position: { ...e.position, ...position } } : e
      );
      return { ...prev, elements: newElements };
    });

    const token = getAdminToken();
    if (!token) return true; // optimistic still works for preview

    try {
      const res = await api.adminUpdateElementPosition(token, id, position);
      return res.success;
    } catch (err) {
      console.error('Failed to update element position:', err);
      return false;
    }
  };

  const updateElementOverride = async (
    pageId: string,
    key: string,
    override: {
      text?: string;
      src?: string;
      color?: string;
      backgroundColor?: string;
      fontSize?: number;
      hidden?: boolean;
      emoji?: string;
      borderRadius?: number;
      boxShadow?: string;
      padding?: number;
    } | null
  ): Promise<boolean> => {
    const currentSettings = getPageSettings(pageId);
    const existingOverrides = { ...(currentSettings.elementOverrides || {}) };

    if (override === null) {
      delete existingOverrides[key];
    } else {
      existingOverrides[key] = {
        ...(existingOverrides[key] || {}),
        ...override,
      };
    }

    return await savePageSettings(pageId, {
      ...currentSettings,
      elementOverrides: existingOverrides,
    });
  };

  const deleteElement = async (id: string): Promise<boolean> => {
    const token = getAdminToken();
    if (!token) return false;

    try {
      const res = await api.adminDeleteCustomElement(token, id);
      if (res.success) {
        setCustomizations((prev) => ({
          ...prev,
          elements: prev.elements.filter((e) => e.id !== id),
        }));
        if (activeElementId === id) setActiveElementId(null);
        return true;
      }
    } catch (err) {
      console.error('Failed to delete element:', err);
    }
    return false;
  };

  const resetPage = async (pageId?: string): Promise<boolean> => {
    const token = getAdminToken();
    if (!token) return false;

    try {
      const res = await api.adminResetCustomizations(token, pageId);
      if (res.success) {
        await refresh();
        return true;
      }
    } catch (err) {
      console.error('Failed to reset customizations:', err);
    }
    return false;
  };

  return (
    <CustomizationContext.Provider
      value={{
        customizations,
        loading,
        isAdmin,
        isEditMode,
        activeElementId,
        setIsEditMode,
        setActiveElementId,
        getPageSettings,
        getPageElements,
        savePageSettings,
        saveElement,
        updateElementPosition,
        updateElementOverride,
        deleteElement,
        resetPage,
        refresh,
      }}
    >
      {children}
    </CustomizationContext.Provider>
  );
};

export const useCustomization = () => {
  const context = useContext(CustomizationContext);
  if (!context) {
    throw new Error('useCustomization must be used within a CustomizationProvider');
  }
  return context;
};
