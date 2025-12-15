'use client';

import React from 'react';
import Link from 'next/link';
import {
    List,
    ListItemButton,
    ListItemText,
    Collapse,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useMenu } from './MenuContext';
import { Category } from '../../../api/categories/types/category';

const THEME_COLOR = '#252d5f';

interface NestedMenuItemProps {
    category: Category;
    level?: number;
    parentPath?: string;
}

export default function NestedMenuItem({ category, level = 0, parentPath = '' }: NestedMenuItemProps) {
    const { openMenus, toggleMenu } = useMenu();
    const menuId = parentPath ? `${parentPath}-${category.id}` : `${category.id}`;
    const isOpen = openMenus.has(menuId);
    const hasSubcategories = category.children && category.children.length > 0;

    const handleToggle = (e: React.MouseEvent) => {
        if (hasSubcategories) {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu(menuId, level);
        }
    };

    const paddingLeft = 1.5 + level * 1.5;

    if (hasSubcategories) {
        return (
            <>
                <ListItemButton
                    onClick={handleToggle}
                    sx={{
                        pl: paddingLeft,
                        pr: 1.5,
                        py: 0.75,
                        minHeight: 36,
                        '&:hover': {
                            bgcolor: 'rgba(37, 45, 95, 0.04)',
                        },
                    }}
                >
                    <ListItemText
                        primary={category.name}
                        primaryTypographyProps={{
                            fontSize: '0.85rem',
                            fontWeight: level === 0 ? 500 : 400,
                            color: '#333',
                        }}
                    />
                    {isOpen ? (
                        <ExpandLess sx={{ color: '#999', fontSize: 18 }} />
                    ) : (
                        <ExpandMore sx={{ color: '#999', fontSize: 18 }} />
                    )}
                </ListItemButton>

                <Collapse in={isOpen} timeout={150} unmountOnExit>
                    <List component="div" disablePadding>
                        {category.children!.map((subcategory) => (
                            <NestedMenuItem
                                key={subcategory.id}
                                category={subcategory}
                                level={level + 1}
                                parentPath={menuId}
                            />
                        ))}
                    </List>
                </Collapse>
            </>
        );
    }

    return (
        <ListItemButton
            component={Link}
            href={`/produtos?categoria=${category.id}&page=1`}
            sx={{
                pl: paddingLeft,
                pr: 1.5,
                py: 0.75,
                minHeight: 36,
                '&:hover': {
                    bgcolor: 'rgba(37, 45, 95, 0.04)',
                    '& .MuiListItemText-primary': {
                        color: THEME_COLOR,
                    },
                },
            }}
        >
            <ListItemText
                primary={category.name}
                primaryTypographyProps={{
                    fontSize: '0.85rem',
                    fontWeight: level === 0 ? 500 : 400,
                    color: '#444',
                    transition: 'color 0.15s ease',
                }}
            />
        </ListItemButton>
    );
}
