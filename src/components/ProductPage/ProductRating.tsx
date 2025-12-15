'use client';

import React from 'react';
import { Box, Rating, Typography } from '@mui/material';

const STAR_COLOR = '#faaf00';

interface ProductRatingProps {
    rating: number;
    reviewCount?: number;
    size?: 'small' | 'medium' | 'large';
    showCount?: boolean;
}

export default function ProductRating({
    rating,
    reviewCount = 0,
    size = 'medium',
    showCount = true,
}: ProductRatingProps) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Rating
                value={rating}
                precision={0.5}
                readOnly
                size={size}
                sx={{
                    '& .MuiRating-iconFilled': {
                        color: STAR_COLOR,
                    },
                    '& .MuiRating-iconEmpty': {
                        color: '#e0e0e0',
                    },
                }}
            />
            {showCount && reviewCount > 0 && (
                <Typography
                    variant="body2"
                    sx={{
                        color: '#666',
                        fontSize: size === 'small' ? '0.75rem' : '0.875rem',
                    }}
                >
                    ({reviewCount})
                </Typography>
            )}
        </Box>
    );
}

