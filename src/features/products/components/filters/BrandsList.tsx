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
import { Brand } from '../../../../api/brands/types/brand';

const THEME_COLOR = '#252d5f';

interface BrandsListProps {
    brands: Brand[];
    filters: string[];
    setFilters: (filters: string[]) => void;
}

export default function BrandsList({ brands, filters, setFilters }: BrandsListProps) {
    const isLoading = !Array.isArray(brands) || brands.length === 0;

    const handleChange = (brandId: string, checked: boolean) => {
        if (checked) {
            setFilters([...filters, brandId]);
        } else {
            setFilters(filters.filter((id) => id !== brandId));
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
                    Marcas
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
                        brands.map((brand) => (
                            <FormControlLabel
                                key={brand.id}
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
                </FormGroup>
            </AccordionDetails>
        </Accordion>
    );
}
