'use client';

import React, { useState, useMemo } from 'react';
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
    InputBase,
    IconButton,
} from '@mui/material';
import { ExpandMore, Search, Close } from '@mui/icons-material';
import { Brand } from '../../../../api/brands/types/brand';

const THEME_COLOR = '#252d5f';
const MIN_ITEMS_FOR_SEARCH = 5;

interface BrandsListProps {
    brands: Brand[];
    filters: string[];
    setFilters: (filters: string[]) => void;
    isLoading?: boolean;
}

export default function BrandsList({ brands, filters, setFilters, isLoading = false }: BrandsListProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const hasBrands = Array.isArray(brands) && brands.length > 0;
    const showSearch = hasBrands && brands.length > MIN_ITEMS_FOR_SEARCH;

    const filteredBrands = useMemo(() => {
        if (!searchTerm) return brands;
        return brands.filter((brand) =>
            brand.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [brands, searchTerm]);

    const handleChange = (brandId: string, checked: boolean) => {
        if (checked) {
            setFilters([...filters, brandId]);
        } else {
            setFilters(filters.filter((id) => id !== brandId));
        }
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
                    Marcas
                </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0, pb: 1 }}>
                {showSearch && (
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
                            placeholder="Buscar marca..."
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
                        <Box sx={{ maxHeight: 250, overflow: 'auto' }}>
                            {filteredBrands.length === 0 && searchTerm ? (
                                <Typography
                                    variant="body2"
                                    sx={{ color: '#999', fontSize: '0.8rem', textAlign: 'center', py: 2 }}
                                >
                                    Nenhuma marca encontrada
                                </Typography>
                            ) : (
                                filteredBrands.map((brand) => (
                                    <FormControlLabel
                                        key={brand.id}
                                        sx={{
                                            ml: 0,
                                            display: 'flex',
                                            '& .MuiFormControlLabel-label': {
                                                fontSize: '0.875rem',
                                                color:
                                                    searchTerm &&
                                                    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
                                                        ? THEME_COLOR
                                                        : '#444',
                                                fontWeight:
                                                    searchTerm &&
                                                    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
                                                        ? 600
                                                        : 400,
                                            },
                                        }}
                                        control={
                                            <Checkbox
                                                size="small"
                                                checked={filters.includes(brand.id.toString())}
                                                onChange={(e) => handleChange(brand.id.toString(), e.target.checked)}
                                                sx={{
                                                    p: 0.5,
                                                    color: '#bbb',
                                                    '&.Mui-checked': { color: THEME_COLOR },
                                                }}
                                            />
                                        }
                                        label={brand.name}
                                    />
                                ))
                            )}
                        </Box>
                    )}
                </FormGroup>
            </AccordionDetails>
        </Accordion>
    );
}
