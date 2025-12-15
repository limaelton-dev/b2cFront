'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
    Typography,
    Paper,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { MainItemType } from '../../types';

const THEME_COLOR = '#252d5f';

interface SideBarProps {
    items: MainItemType[];
    onSectionChange: (section: string) => void;
    activeSection: string;
}

export default function SideBar({ items, onSectionChange, activeSection }: SideBarProps) {
    const [openIndexes, setOpenIndexes] = useState<number[]>([0]);

    useEffect(() => {
        items.forEach((item, index) => {
            if (item.label === activeSection) {
                setOpenIndexes((prev) => (prev.includes(index) ? prev : [...prev, index]));
            } else if (item.subItems?.some((subItem) => subItem.label === activeSection)) {
                setOpenIndexes((prev) => (prev.includes(index) ? prev : [...prev, index]));
            }
        });
    }, [activeSection, items]);

    const handleListItemClick = (index: number, item: MainItemType) => {
        if (item.subItems) {
            setOpenIndexes((prev) =>
                prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
            );

            if (!openIndexes.includes(index) && item.subItems.length > 0) {
                onSectionChange(item.subItems[0].label);
            }
        } else {
            onSectionChange(item.label);
        }
    };

    const handleSubItemClick = (label: string) => {
        onSectionChange(label);
    };

    const isItemActive = (item: MainItemType) => {
        return (
            activeSection === item.label ||
            item.subItems?.some((subItem) => subItem.label === activeSection)
        );
    };

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 2,
                border: '1px solid #e8e8e8',
                overflow: 'hidden',
            }}
        >
            <Box
                sx={{
                    px: 2.5,
                    py: 2,
                    borderBottom: '1px solid #e8e8e8',
                    bgcolor: '#fafafa',
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 600,
                        color: THEME_COLOR,
                        fontSize: '1rem',
                    }}
                >
                    Minha Conta
                </Typography>
            </Box>

            <List component="nav" sx={{ py: 1 }}>
                {items.map((item, index) => (
                    <React.Fragment key={`main-item-${index}`}>
                        <ListItemButton
                            onClick={() => handleListItemClick(index, item)}
                            sx={{
                                mx: 1,
                                borderRadius: 1.5,
                                mb: 0.5,
                                position: 'relative',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    left: 0,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: 3,
                                    height: isItemActive(item) ? '60%' : 0,
                                    bgcolor: THEME_COLOR,
                                    borderRadius: 1,
                                    transition: 'height 0.2s ease',
                                },
                                bgcolor: isItemActive(item) ? 'rgba(37, 45, 95, 0.06)' : 'transparent',
                                '&:hover': {
                                    bgcolor: 'rgba(37, 45, 95, 0.06)',
                                },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 36 }}>
                                {React.cloneElement(item.icon as React.ReactElement, {
                                    sx: { color: THEME_COLOR, fontSize: 20 },
                                })}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.label}
                                primaryTypographyProps={{
                                    fontSize: '0.875rem',
                                    fontWeight: isItemActive(item) ? 600 : 500,
                                    color: isItemActive(item) ? THEME_COLOR : '#444',
                                }}
                            />
                            {item.subItems &&
                                (openIndexes.includes(index) ? (
                                    <ExpandLess sx={{ fontSize: 18, color: '#999' }} />
                                ) : (
                                    <ExpandMore sx={{ fontSize: 18, color: '#999' }} />
                                ))}
                        </ListItemButton>

                        {item.subItems && (
                            <Collapse in={openIndexes.includes(index)} timeout={200} unmountOnExit>
                                <List component="div" disablePadding>
                                    {item.subItems.map((subItem, subIndex) => {
                                        const isSubItemActive = activeSection === subItem.label;

                                        return (
                                            <ListItemButton
                                                key={`sub-item-${index}-${subIndex}`}
                                                onClick={() => handleSubItemClick(subItem.label)}
                                                sx={{
                                                    mx: 1,
                                                    pl: 5,
                                                    borderRadius: 1.5,
                                                    mb: 0.5,
                                                    '&:hover': {
                                                        bgcolor: 'rgba(37, 45, 95, 0.04)',
                                                    },
                                                }}
                                            >
                                                <ListItemIcon sx={{ minWidth: 32 }}>
                                                    {React.cloneElement(subItem.icon as React.ReactElement, {
                                                        sx: {
                                                            color: isSubItemActive ? THEME_COLOR : '#888',
                                                            fontSize: 18,
                                                        },
                                                    })}
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={subItem.label}
                                                    primaryTypographyProps={{
                                                        fontSize: '0.8125rem',
                                                        fontWeight: isSubItemActive ? 600 : 400,
                                                        color: isSubItemActive ? THEME_COLOR : '#555',
                                                    }}
                                                />
                                            </ListItemButton>
                                        );
                                    })}
                                </List>
                            </Collapse>
                        )}
                    </React.Fragment>
                ))}
            </List>
        </Paper>
    );
}
