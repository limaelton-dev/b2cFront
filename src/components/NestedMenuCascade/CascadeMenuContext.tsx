import React, { createContext, useContext, useMemo, useState } from 'react';

type AnchorMap = Record<string, HTMLElement | null>;

interface CascadeContextType {
  openMenus: Set<string>;
  anchors: AnchorMap;
  openAt: (menuId: string, level: number, anchorEl: HTMLElement) => void;
  toggleAt: (menuId: string, level: number, anchorEl: HTMLElement) => void;
  closeFrom: (menuId: string) => void;
  closeAll: () => void;
}

const CascadeMenuContext = createContext<CascadeContextType | undefined>(undefined);

function idLevel(id: string) {
  // nível = número de '-'. Topo = 0.
  return id.split('-').length - 1;
}

export function CascadeMenuProvider({ children }: { children: React.ReactNode }) {
  const [openMenus, setOpenMenus] = useState<Set<string>>(new Set());
  const [anchors, setAnchors] = useState<AnchorMap>({});

  const openAt = (menuId: string, level: number, anchorEl: HTMLElement) => {
    // MESMA REGRA que você já usa:
    // - fecha ids com idLevel >= level (irmãos do mesmo nível e níveis mais profundos)
    // - abre o menuId atual
    setOpenMenus(prev => {
      const next = new Set(prev);
      Array.from(next).forEach(id => {
        if (idLevel(id) >= level) next.delete(id);
      });
      next.add(menuId);
      return next;
    });

    // Anchors acompanham os abertos (limpa níveis >= level e define o atual)
    setAnchors(prev => {
      const next: AnchorMap = { ...prev };
      Object.keys(next).forEach(id => {
        if (idLevel(id) >= level) delete next[id];
      });
      next[menuId] = anchorEl;
      return next;
    });
  };

  const closeFrom = (menuId: string) => {
    // Fecha o próprio e TODOS os descendentes (prefixo)
    setOpenMenus(prev => {
      const next = new Set(prev);
      Array.from(next).forEach(id => {
        if (id === menuId || id.startsWith(menuId + '-')) next.delete(id);
      });
      return next;
    });
    setAnchors(prev => {
      const next: AnchorMap = { ...prev };
      Object.keys(next).forEach(id => {
        if (id === menuId || id.startsWith(menuId + '-')) delete next[id];
      });
      return next;
    });
  };

  const toggleAt = (menuId: string, level: number, anchorEl: HTMLElement) => {
    setOpenMenus(prev => {
      const isOpen = prev.has(menuId);
      if (isOpen) {
        // Toggle OFF mantém sua "poda de descendentes"
        const next = new Set(prev);
        Array.from(next).forEach(id => {
          if (id === menuId || id.startsWith(menuId + '-')) next.delete(id);
        });
        // limpa anchors respectivos
        setAnchors(prevA => {
          const na = { ...prevA };
          Object.keys(na).forEach(id => {
            if (id === menuId || id.startsWith(menuId + '-')) delete na[id];
          });
          return na;
        });
        return next;
      } else {
        // Toggle ON usa a mesma política do openAt
        const next = new Set(prev);
        Array.from(next).forEach(id => {
          if (idLevel(id) >= level) next.delete(id);
        });
        next.add(menuId);
        setAnchors(prevA => {
          const na: AnchorMap = { ...prevA };
          Object.keys(na).forEach(id => {
            if (idLevel(id) >= level) delete na[id];
          });
          na[menuId] = anchorEl;
          return na;
        });
        return next;
      }
    });
  };

  const value = useMemo(
    () => ({ openMenus, anchors, openAt, toggleAt, closeFrom, closeAll: () => { setOpenMenus(new Set()); setAnchors({}); } }),
    [openMenus, anchors]
  );

  return (
    <CascadeMenuContext.Provider value={value}>
      {children}
    </CascadeMenuContext.Provider>
  );
}

export function useCascadeMenu() {
  const ctx = useContext(CascadeMenuContext);
  if (!ctx) throw new Error('useCascadeMenu must be used within CascadeMenuProvider');
  return ctx;
}
