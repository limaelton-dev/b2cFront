'use client';

import React from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Typography,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Skeleton,
    Box,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { Category } from '../../../../api/categories/types/category';

const THEME_COLOR = '#252d5f';

interface CategoriesListProps {
    categories: Category[];
    filters: string[];
    setFilters: (filters: string[]) => void;
}

export default function CategoriesList({ categories, filters, setFilters }: CategoriesListProps) {
    const isLoading = !Array.isArray(categories) || categories.length === 0;

    const handleChange = (categoryId: string, checked: boolean) => {
        if (checked) {
            setFilters([...filters, categoryId]);
        } else {
            setFilters(filters.filter((id) => id !== categoryId));
        }
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
                <FormGroup>
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
                        categories.map((category) => (
                            <FormControlLabel
                                key={category.id}
                                sx={{
                                    ml: 0,
                                    '& .MuiFormControlLabel-label': {
                                        fontSize: '0.875rem',
                                        color: '#444',
                                    },
                                }}
                                control={
                                    <Checkbox
                                        size="small"
                                        checked={filters.includes(category.id.toString())}
                                        onChange={(e) => handleChange(category.id.toString(), e.target.checked)}
                                        sx={{
                                            p: 0.5,
                                            color: '#bbb',
                                            '&.Mui-checked': { color: THEME_COLOR },
                                        }}
                                    />
                                }
                                label={category.name}
                            />
                        ))
                    )}
                </FormGroup>
            </AccordionDetails>
        </Accordion>
    );
}
