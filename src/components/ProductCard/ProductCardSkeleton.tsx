'use client';

import React from 'react';
import { Card, CardContent, CardActions, Skeleton, Box } from '@mui/material';

export default function ProductCardSkeleton() {
    return (
        <Card
            sx={{
                width: '100%',
                maxWidth: 280,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                border: '1px solid #e8e8e8',
                boxShadow: 'none',
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    paddingTop: '100%',
                    position: 'relative',
                    backgroundColor: '#fafafa',
                    borderRadius: '12px 12px 0 0',
                }}
            >
                <Skeleton
                    variant="rectangular"
                    sx={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        right: 16,
                        bottom: 16,
                        borderRadius: 1,
                    }}
                />
            </Box>

            <CardContent sx={{ flexGrow: 1, pb: 1, pt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Skeleton variant="text" width={100} height={20} />
                </Box>

                <Skeleton variant="text" width="100%" height={20} />
                <Skeleton variant="text" width="80%" height={20} />

                <Skeleton variant="text" width="50%" height={16} sx={{ mt: 0.5 }} />

                <Box sx={{ mt: 1.5 }}>
                    <Skeleton variant="text" width={60} height={16} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Skeleton variant="text" width={80} height={28} />
                        <Skeleton variant="rounded" width={50} height={20} />
                    </Box>
                </Box>
            </CardContent>

            <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                <Skeleton variant="rounded" width="100%" height={40} sx={{ borderRadius: 2 }} />
            </CardActions>
        </Card>
    );
}

