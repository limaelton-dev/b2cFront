'use client';

import React from 'react';
import { Box, Paper, Typography, Button, Divider } from '@mui/material';
import { FilterAltOff } from '@mui/icons-material';
import { Brand } from '@/api/brands/types/brand';
import { Category } from '@/api/categories/types/category';
import { Filters } from '@/types/filters';
import BrandsList from './BrandsList';
import CategoriesList from './CategoriesList';
import OthersList from './OthersList';

const THEME_COLOR = '#252d5f';

export interface FiltersContainerProps {
    categories: Category[];
    brands: Brand[];
    filters: Filters;
    setFilters: (filters: Filters) => void;
    isLoadingCategories?: boolean;
    isLoadingBrands?: boolean;
}

export default function FiltersContainer({
    categories,
    brands,
    filters,
    setFilters,
    isLoadingCategories = false,
    isLoadingBrands = false,
}: FiltersContainerProps) {
    const handleCategoriesChange = (newCategories: string[]) => {
        setFilters({
            ...filters,
            categories: newCategories,
        });
    };

    const handleBrandsChange = (newBrands: string[]) => {
        setFilters({
            ...filters,
            brands: newBrands,
        });
    };

    const handleClearFilters = () => {
        setFilters({ categories: [], brands: [], term: '' });
    };

    const hasActiveFilters =
        filters.categories.length > 0 || filters.brands.length > 0 || !!filters.term;

    return (
        <Paper
            elevation={0}
            sx={{
                width: { xs: '100%', md: '20%' },
                minWidth: { md: 220 },
                maxWidth: { md: 280 },
                border: '1px solid #e8e8e8',
                borderRadius: 2,
                overflow: 'hidden',
                height: 'fit-content',
                position: { md: 'sticky' },
                top: { md: 100 },
            }}
        >
            <Box
                sx={{
                    p: 2,
                    borderBottom: '1px solid #e8e8e8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#333', fontSize: '1.1rem' }}>
                    Filtros
                </Typography>
                {hasActiveFilters && (
                    <Typography variant="caption" sx={{ color: THEME_COLOR, fontWeight: 600 }}>
                        {filters.categories.length + filters.brands.length} ativos
                    </Typography>
                )}
            </Box>

            <Box sx={{ px: 1 }}>
                <CategoriesList
                    categories={categories}
                    filters={filters.categories}
                    setFilters={handleCategoriesChange}
                    isLoading={isLoadingCategories}
                />
                <Divider />
                <BrandsList
                    brands={brands}
                    filters={filters.brands}
                    setFilters={handleBrandsChange}
                    isLoading={isLoadingBrands}
                />
                <Divider />
                <OthersList filters={filters} setFilters={setFilters} />
            </Box>

            <Box sx={{ p: 2, pt: 1 }}>
                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<FilterAltOff />}
                    onClick={handleClearFilters}
                    disabled={!hasActiveFilters}
                    sx={{
                        color: THEME_COLOR,
                        borderColor: THEME_COLOR,
                        fontWeight: 600,
                        textTransform: 'none',
                        '&:hover': {
                            backgroundColor: THEME_COLOR,
                            borderColor: THEME_COLOR,
                            color: '#fff',
                        },
                        '&.Mui-disabled': {
                            borderColor: '#e0e0e0',
                            color: '#bbb',
                        },
                    }}
                >
                    Limpar Filtros
                </Button>
            </Box>
        </Paper>
    );
}
