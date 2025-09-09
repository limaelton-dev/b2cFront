import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useMenu } from "./MenuContext";

interface Category {
    id: number;
    name: string;
    subcategories?: Category[];
}

interface NestedMenuItemProps {
    category: Category;
    level?: number;
    parentPath?: string;
}

export default function NestedMenuItem({ category, level = 0, parentPath = "" }: NestedMenuItemProps) {
    const { openMenus, toggleMenu } = useMenu();
    const menuId = parentPath ? `${parentPath}-${category.id}` : `${category.id}`;
    const isOpen = openMenus.has(menuId);
    const hasSubcategories = category.subcategories && category.subcategories.length > 0;

    const handleClick = () => {
        if (hasSubcategories) {
            toggleMenu(menuId, level);
        } else {
            // Ação para categoria sem subcategorias
            alert(`Clicou em: ${category.name}`);
        }
    };

    const paddingLeft = 2 + (level * 2); // Aumenta o padding baseado no nível

    return (
        <>
            <ListItemButton onClick={handleClick} sx={{ pl: paddingLeft }}>
                <ListItemText 
                    primary={category.name}
                    primaryTypographyProps={{
                        fontSize: '13px', // Ajuste o tamanho aqui
                        fontWeight: level === 0 ? 500 : 400 // Categorias principais mais destacadas
                    }}
                />
                {hasSubcategories && (isOpen ? <ExpandLess /> : <ExpandMore />)}
            </ListItemButton>
            
            {hasSubcategories && (
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {category.subcategories!.map((subcategory) => (
                            <NestedMenuItem 
                                key={subcategory.id} 
                                category={subcategory}
                                level={level + 1}
                                parentPath={menuId}
                            />
                        ))}
                    </List>
                </Collapse>
            )}
        </>
    );
}