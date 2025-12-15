'use client';

import React from 'react';
import { Box, Typography, Paper, LinearProgress, Divider } from '@mui/material';
import ProductRating from './ProductRating';
import { UserAvatar } from '@/components/common';

const STAR_COLOR = '#faaf00';

interface RatingDistribution {
    stars: number;
    percentage: number;
}

interface Review {
    id: number;
    author: string;
    rating: number;
    comment: string;
    date?: string;
}

interface ProductReviewsProps {
    averageRating: number;
    totalReviews: number;
    distribution: RatingDistribution[];
    reviews: Review[];
}

export default function ProductReviews({
    averageRating,
    totalReviews,
    distribution,
    reviews,
}: ProductReviewsProps) {
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
                    px: 3,
                    py: 2,
                    bgcolor: '#f8f9fa',
                    borderBottom: '1px solid #e8e8e8',
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#333' }}>
                    Avaliações
                </Typography>
            </Box>

            <Box sx={{ p: 3 }}>
                <Box
                    sx={{
                        display: 'flex',
                        gap: 4,
                        mb: 3,
                        flexDirection: { xs: 'column', sm: 'row' },
                    }}
                >
                    <Box sx={{ textAlign: 'center', minWidth: 120 }}>
                        <Typography
                            variant="h2"
                            sx={{ fontWeight: 700, color: '#333', lineHeight: 1 }}
                        >
                            {averageRating.toFixed(1)}
                        </Typography>
                        <ProductRating rating={averageRating} showCount={false} />
                        <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>
                            {totalReviews} avaliações
                        </Typography>
                    </Box>

                    <Box sx={{ flex: 1 }}>
                        {distribution.map((item) => (
                            <Box
                                key={item.stars}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    mb: 0.5,
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{ color: '#666', minWidth: 20 }}
                                >
                                    {item.stars}
                                </Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={item.percentage}
                                    sx={{
                                        flex: 1,
                                        height: 8,
                                        borderRadius: 4,
                                        bgcolor: '#f0f0f0',
                                        '& .MuiLinearProgress-bar': {
                                            bgcolor: STAR_COLOR,
                                            borderRadius: 4,
                                        },
                                    }}
                                />
                                <Typography
                                    variant="caption"
                                    sx={{ color: '#999', minWidth: 40 }}
                                >
                                    {item.percentage}%
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {reviews.map((review) => (
                        <Box key={review.id}>
                            <Box sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
                                <UserAvatar name={review.author} size={40} />
                                <Box sx={{ flex: 1 }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            mb: 0.5,
                                        }}
                                    >
                                        <Typography
                                            variant="subtitle2"
                                            sx={{ fontWeight: 600, color: '#333' }}
                                        >
                                            {review.author}
                                        </Typography>
                                        {review.date && (
                                            <Typography variant="caption" sx={{ color: '#999' }}>
                                                {review.date}
                                            </Typography>
                                        )}
                                    </Box>
                                    <ProductRating rating={review.rating} size="small" showCount={false} />
                                </Box>
                            </Box>
                            <Typography
                                variant="body2"
                                sx={{ color: '#555', lineHeight: 1.6, pl: 7 }}
                            >
                                {review.comment}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Paper>
    );
}

