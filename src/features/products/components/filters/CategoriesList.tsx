'use client';

import React, { useState, useMemo } from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Typography,
    FormControlLabel,
    Checkbox,
    Skeleton,
    Box,
    Collapse,
    IconButton,
    InputBase,
} from '@mui/material';
import { ExpandMore, ExpandLess, Search, Close } from '@mui/icons-material';
import { Category } from '../../../../api/categories/types/category';

const THEME_COLOR = '#252d5f';
const MIN_ITEMS_FOR_SEARCH = 5;

interface CategoriesListProps {
    categories: Category[];
    filters: string[];
    setFilters: (filters: string[]) => void;
    isLoading?: boolean;
}

interface CategoryItemProps {
    category: Category;
    level: number;
    filters: string[];
    onToggle: (categoryId: string, checked: boolean) => void;
    expandedCategories: Set<string>;
    onExpand: (categoryId: string) => void;
    searchTerm: string;
}

function CategoryItem({
    category,
    level,
    filters,
    onToggle,
    expandedCategories,
    onExpand,
    searchTerm,
}: CategoryItemProps) {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category.id.toString());
    const isChecked = filters.includes(category.id.toString());

    const matchesSearch = searchTerm
        ? category.name.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

    const childrenMatchSearch = useMemo(() => {
        if (!searchTerm || !hasChildren) return false;
        const checkChildren = (cats: Category[]): boolean => {
            return cats.some(
                (c) =>
                    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (c.children && checkChildren(c.children))
            );
        };
        return checkChildren(category.children!);
    }, [searchTerm, hasChildren, category.children]);

    if (searchTerm && !matchesSearch && !childrenMatchSearch) {
        return null;
    }

    const shouldAutoExpand = searchTerm && childrenMatchSearch;

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    pl: level * 2,
                    '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.02)',
                    },
                }}
            >
                <FormControlLabel
                    sx={{
                        flex: 1,
                        ml: 0,
                        mr: 0,
                        '& .MuiFormControlLabel-label': {
                            fontSize: '0.875rem',
                            color: matchesSearch && searchTerm ? THEME_COLOR : '#444',
                            fontWeight: matchesSearch && searchTerm ? 600 : 400,
                        },
                    }}
                    control={
                        <Checkbox
                            size="small"
                            checked={isChecked}
                            onChange={(e) => onToggle(category.id.toString(), e.target.checked)}
                            sx={{
                                p: 0.5,
                                color: '#bbb',
                                '&.Mui-checked': { color: THEME_COLOR },
                            }}
                        />
                    }
                    label={category.name}
                />
                {hasChildren && (
                    <IconButton
                        size="small"
                        onClick={() => onExpand(category.id.toString())}
                        sx={{
                            p: 0.25,
                            mr: 0.5,
                            color: '#999',
                        }}
                    >
                        {isExpanded || shouldAutoExpand ? (
                            <ExpandLess sx={{ fontSize: 18 }} />
                        ) : (
                            <ExpandMore sx={{ fontSize: 18 }} />
                        )}
                    </IconButton>
                )}
            </Box>

            {hasChildren && (
                <Collapse in={isExpanded || shouldAutoExpand} timeout={150}>
                    {category.children!.map((child) => (
                        <CategoryItem
                            key={child.id}
                            category={child}
                            level={level + 1}
                            filters={filters}
                            onToggle={onToggle}
                            expandedCategories={expandedCategories}
                            onExpand={onExpand}
                            searchTerm={searchTerm}
                        />
                    ))}
                </Collapse>
            )}
        </>
    );
}

function countCategories(categories: Category[]): number {
    return categories.reduce((acc, cat) => {
        return acc + 1 + (cat.children ? countCategories(cat.children) : 0);
    }, 0);
}

export default function CategoriesList({ categories, filters, setFilters, isLoading = false }: CategoriesListProps) {
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState('');

    const hasCategories = Array.isArray(categories) && categories.length > 0;
    const totalCategories = useMemo(
        () => (hasCategories ? countCategories(categories) : 0),
        [categories, hasCategories]
    );
    const showSearch = totalCategories > MIN_ITEMS_FOR_SEARCH;

    const handleToggle = (categoryId: string, checked: boolean) => {
        if (checked) {
            setFilters([...filters, categoryId]);
        } else {
            setFilters(filters.filter((id) => id !== categoryId));
        }
    };

    const handleExpand = (categoryId: string) => {
        setExpandedCategories((prev) => {
            const next = new Set(prev);
            if (next.has(categoryId)) {
                next.delete(categoryId);
            } else {
                next.add(categoryId);
            }
            return next;
        });
    };

    const handleClearSearch = () => {
        setSearchTerm('');
    };

    return (
        <Accordion defaultExpanded disableGutters elevation={0}>
            <AccordionSummary
                expandIcon={<ExpandMore />}
                sx={{
                    minHeight: 48,
                    '& .MuiAccordionSummary-content': { my: 1 },
                }}
            >
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#333' }}>
                    Categorias
                </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0, pb: 1 }}>
                {showSearch && hasCategories && (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 1,
                            px: 1,
                            py: 0.5,
                            bgcolor: '#f5f5f5',
                            borderRadius: 1,
                        }}
                    >
                        <Search sx={{ fontSize: 18, color: '#999', mr: 0.5 }} />
                        <InputBase
                            placeholder="Buscar categoria..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{
                                flex: 1,
                                fontSize: '0.8rem',
                            }}
                        />
                        {searchTerm && (
                            <IconButton size="small" onClick={handleClearSearch} sx={{ p: 0.25 }}>
                                <Close sx={{ fontSize: 16 }} />
                            </IconButton>
                        )}
                    </Box>
                )}

                {isLoading ? (
                    <Box>
                        {[1, 2, 3, 4].map((i) => (
                            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <Skeleton variant="rectangular" width={18} height={18} sx={{ borderRadius: 0.5 }} />
                                <Skeleton variant="text" width={`${60 + Math.random() * 40}%`} height={22} />
                            </Box>
                        ))}
                    </Box>
                ) : (
                    <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                        {categories.map((category) => (
                            <CategoryItem
                                key={category.id}
                                category={category}
                                level={0}
                                filters={filters}
                                onToggle={handleToggle}
                                expandedCategories={expandedCategories}
                                onExpand={handleExpand}
                                searchTerm={searchTerm}
                            />
                        ))}
                    </Box>
                )}
            </AccordionDetails>
        </Accordion>
    );
}
