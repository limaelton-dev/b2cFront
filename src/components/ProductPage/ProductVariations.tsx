'use client';

import React from 'react';
import { Box, Typography, Chip } from '@mui/material';

const THEME_COLOR = '#252d5f';

interface Variation {
    id: number;
    type: string;
    description: string;
}

interface Sku {
    id: number;
    variations?: Variation[];
}

interface ProductVariationsProps {
    skus: Sku[];
    selectedSku?: Sku;
    onVariationChange: (description: string) => void;
}

export default function ProductVariations({
    skus,
    selectedSku,
    onVariationChange,
}: ProductVariationsProps) {
    const variationTypes = new Map<string, Variation[]>();

    skus.forEach((sku) => {
        sku.variations?.forEach((variation) => {
            if (!variationTypes.has(variation.type)) {
                variationTypes.set(variation.type, []);
            }
            const existing = variationTypes.get(variation.type)!;
            if (!existing.some((v) => v.description === variation.description)) {
                existing.push(variation);
            }
        });
    });

    if (variationTypes.size === 0) {
        return null;
    }

    return (
        <Box sx={{ mb: 3 }}>
            {Array.from(variationTypes.entries()).map(([typeName, variations]) => (
                <Box key={typeName} sx={{ mb: 2 }}>
                    <Typography
                        variant="subtitle2"
                        sx={{
                            fontWeight: 600,
                            color: '#333',
                            mb: 1.5,
                        }}
                    >
                        {typeName}:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {variations.map((variation) => {
                            const isSelected = selectedSku?.variations?.some(
                                (v) => v.description === variation.description
                            );

                            return (
                                <Chip
                                    key={variation.id}
                                    label={variation.description}
                                    onClick={() => onVariationChange(variation.description)}
                                    sx={{
                                        fontWeight: isSelected ? 600 : 400,
                                        bgcolor: isSelected ? THEME_COLOR : '#fff',
                                        color: isSelected ? '#fff' : '#333',
                                        border: `1px solid ${isSelected ? THEME_COLOR : '#ddd'}`,
                                        borderRadius: 2,
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            bgcolor: isSelected ? '#1a2147' : 'rgba(37, 45, 95, 0.08)',
                                            borderColor: THEME_COLOR,
                                        },
                                    }}
                                />
                            );
                        })}
                    </Box>
                </Box>
            ))}
        </Box>
    );
}

