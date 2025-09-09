import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useCascadeMenu } from './CascadeMenuContext';

export interface Category {
  id: number;
  name: string;
  subcategories?: Category[];
}

interface Props {
  category: Category;
  level?: number;
  parentPath?: string;
  onLeafClick?: (cat: Category) => void;
  closeOnLeafClick?: boolean;
}

export function CascadingMenuItem({
  category,
  level = 0,
  parentPath = '',
  onLeafClick,
  closeOnLeafClick = true,
}: Props) {
  const { openMenus, anchors, toggleAt, closeFrom } = useCascadeMenu();
  const menuId = parentPath ? `${parentPath}-${category.id}` : `${category.id}`;
  const isOpen = openMenus.has(menuId);
  const hasChildren = !!category.subcategories?.length;

  const handleClickItem = (e: React.MouseEvent<HTMLElement>) => {
    if (hasChildren) {
      // Impede o Menu pai de fechar por causa do clique
      e.preventDefault();
      e.stopPropagation();
      toggleAt(menuId, level, e.currentTarget as HTMLElement);
    } else {
      onLeafClick?.(category);
      if (closeOnLeafClick) {
        // Fecha tudo ao clicar numa folha (opcional)
        // Fecha a partir da raiz do caminho atual:
        const rootId = menuId.split('-')[0];
        closeFrom(rootId);
      }
    }
  };

  return (
    <>
      <MenuItem
        onClick={handleClickItem}
        sx={{ pl: 1.5, pr: 1.5, minWidth: 220, justifyContent: 'space-between' }}
      >
        {category.name}
        {hasChildren && (
          <ListItemIcon sx={{ minWidth: 24 }}>
            <ChevronRightIcon fontSize="small" />
          </ListItemIcon>
        )}
      </MenuItem>

      {hasChildren && (
        <Menu
          anchorEl={anchors[menuId] ?? null}
          open={isOpen}
          onClose={() => closeFrom(menuId)}               // clique fora/ESC fecha este ramo
          // Sem hover: apenas clique
          MenuListProps={{ dense: true }}
          // Pop-out à direita do item
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          // Evita trocas de foco agressivas
          disableAutoFocus
          disableAutoFocusItem
          disableEnforceFocus
          disableRestoreFocus
        >
          {category.subcategories!.map((sub) => (
            <CascadingMenuItem
              key={sub.id}
              category={sub}
              level={level + 1}
              parentPath={menuId}
              onLeafClick={onLeafClick}
              closeOnLeafClick={closeOnLeafClick}
            />
          ))}
        </Menu>
      )}
    </>
  );
}
