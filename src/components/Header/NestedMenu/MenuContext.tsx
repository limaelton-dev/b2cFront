import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MenuContextType {
    openMenus: Set<string>;
    toggleMenu: (menuId: string, level: number) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: ReactNode }) {
    const [openMenus, setOpenMenus] = useState<Set<string>>(new Set());

    const toggleMenu = (menuId: string, level: number) => {
        setOpenMenus(prev => {
            const newOpenMenus = new Set(prev);

            // Se o menu já está aberto, fecha ele
            if (newOpenMenus.has(menuId)) {
                newOpenMenus.delete(menuId);
                // Fecha todos os submenus deste item
                Array.from(newOpenMenus).forEach(id => {
                    if (id.startsWith(menuId + '-')) {
                        newOpenMenus.delete(id);
                    }
                });
            } else {
                // Fecha todos os menus do mesmo nível
                Array.from(newOpenMenus).forEach(id => {
                    const idLevel = id.split('-').length - 1;
                    console.log('idLevel', idLevel);
                    console.log('level', level);
                    if (idLevel >= level) {
                        newOpenMenus.delete(id);
                    }
                });
                
                // Abre o menu atual(clicado)
                newOpenMenus.add(menuId);
            }
            return newOpenMenus;
        });
    };

    return (
        <MenuContext.Provider value={{ openMenus, toggleMenu }}>
            {children}
        </MenuContext.Provider>
    );
}

export function useMenu() {
    const context = useContext(MenuContext);
    if (!context) {
        throw new Error('useMenu deve ser usado dentro de um MenuProvider');
    }
    return context;
}
