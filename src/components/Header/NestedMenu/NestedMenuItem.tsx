'use client';

import React from 'react';
import Link from 'next/link';
import {
    Box,
    List,
    ListItemButton,
    ListItemText,
    Collapse,
    IconButton,
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
        e.preventDefault();
        e.stopPropagation();
        toggleMenu(menuId, level);
    };

    const paddingLeft = 1.5 + level * 1.5;

    if (hasSubcategories) {
        return (
            <>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        '&:hover': {
                            bgcolor: 'rgba(37, 45, 95, 0.04)',
                        },
                    }}
                >
                    <ListItemButton
                        component={Link}
                        href={`/produtos?categoria=${category.id}&page=1`}
                        sx={{
                            flex: 1,
                            pl: paddingLeft,
                            pr: 0.5,
                            py: 0.75,
                            minHeight: 36,
                            '&:hover': {
                                bgcolor: 'transparent',
                                '& .MuiListItemText-primary': {
                                    color: THEME_COLOR,
                                },
                            },
                        }}
                    >
                        <ListItemText
                            primary={category.name}
                            primaryTypographyProps={{
                                sx: {
                                    fontSize: '0.85rem',
                                    fontWeight: level === 0 ? 500 : 400,
                                    color: '#333',
                                    transition: 'color 0.15s ease',
                                },
                            }}
                        />
                    </ListItemButton>
                    <IconButton
                        size="small"
                        onClick={handleToggle}
                        sx={{
                            mr: 1,
                            p: 0.5,
                            color: '#999',
                            '&:hover': {
                                bgcolor: 'rgba(37, 45, 95, 0.08)',
                                color: THEME_COLOR,
                            },
                        }}
                    >
                        {isOpen ? (
                            <ExpandLess sx={{ fontSize: 18 }} />
                        ) : (
                            <ExpandMore sx={{ fontSize: 18 }} />
                        )}
                    </IconButton>
                </Box>

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
                    sx: {
                        fontSize: '0.85rem',
                        fontWeight: level === 0 ? 500 : 400,
                        color: '#444',
                        transition: 'color 0.15s ease',
                    },
                }}
            />
        </ListItemButton>
    );
}
