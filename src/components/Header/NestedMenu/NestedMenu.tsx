'use client';

import React, { useState, useRef } from 'react';
import {
    Box,
    Button,
    Paper,
    List,
    Fade,
} from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';
import NestedMenuItem from './NestedMenuItem';
import { MenuProvider } from './MenuContext';
import { Category as CategoryType } from '../../../api/categories/types/category';

const THEME_COLOR = '#252d5f';

function RecursiveNestedMenu({ categories }: { categories: CategoryType[] }) {
    return (
        <>
            {categories.map((category) => (
                <NestedMenuItem key={category.id} category={category} />
            ))}
        </>
    );
}

interface NestedListProps {
    categories: CategoryType[];
}

export default function NestedList({ categories }: NestedListProps) {
    const [isOpen, setIsOpen] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleOpen = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setIsOpen(true);
    };

    const handleClose = () => {
        timeoutRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 150);
    };

    return (
        <Box
            ref={containerRef}
            sx={{ position: 'relative' }}
            onMouseEnter={handleOpen}
            onMouseLeave={handleClose}
        >
            <Button
                variant="text"
                endIcon={
                    <KeyboardArrowDown
                        sx={{
                            fontSize: 18,
                            transition: 'transform 0.2s ease',
                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        }}
                    />
                }
                sx={{
                    color: isOpen ? THEME_COLOR : '#555',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    textTransform: 'none',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1.5,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        bgcolor: 'transparent',
                        color: THEME_COLOR,
                    },
                }}
            >
                Categorias
            </Button>

            <Fade in={isOpen} timeout={150}>
                <Paper
                    onMouseEnter={handleOpen}
                    onMouseLeave={handleClose}
                    sx={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        width: 260,
                        maxHeight: 400,
                        overflow: 'auto',
                        zIndex: 1200,
                        borderRadius: 2,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                        bgcolor: '#fff',
                        display: isOpen ? 'block' : 'none',
                        mt: 0.5,
                        '&::-webkit-scrollbar': {
                            width: 4,
                        },
                        '&::-webkit-scrollbar-track': {
                            bgcolor: 'transparent',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            bgcolor: '#ddd',
                            borderRadius: 2,
                        },
                    }}
                >
                    <MenuProvider>
                        <List component="nav" sx={{ py: 0.5 }}>
                            <RecursiveNestedMenu categories={categories} />
                        </List>
                    </MenuProvider>
                </Paper>
            </Fade>
        </Box>
    );
}
