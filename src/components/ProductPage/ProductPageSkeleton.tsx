'use client';

import React from 'react';
import { Box, Container, Skeleton, Grid } from '@mui/material';

export default function ProductPageSkeleton() {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Skeleton variant="text" width={300} height={24} sx={{ mb: 2 }} />

            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={400}
                        sx={{ borderRadius: 2 }}
                    />
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton
                                key={i}
                                variant="rectangular"
                                width={80}
                                height={80}
                                sx={{ borderRadius: 1 }}
                            />
                        ))}
                    </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Skeleton variant="text" width="80%" height={40} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />

                    <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                        <Skeleton variant="rectangular" width={100} height={20} />
                        <Skeleton variant="text" width={60} />
                    </Box>

                    <Skeleton variant="text" width="60%" height={48} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="40%" height={24} sx={{ mb: 3 }} />

                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                        <Skeleton variant="rectangular" width={80} height={40} sx={{ borderRadius: 1 }} />
                        <Skeleton variant="rectangular" width={80} height={40} sx={{ borderRadius: 1 }} />
                        <Skeleton variant="rectangular" width={80} height={40} sx={{ borderRadius: 1 }} />
                    </Box>

                    <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={48}
                        sx={{ borderRadius: 2, mb: 3 }}
                    />

                    <Skeleton variant="text" width="100%" height={20} />
                    <Skeleton variant="text" width="100%" height={20} />
                    <Skeleton variant="text" width="80%" height={20} />
                </Grid>
            </Grid>
        </Container>
    );
}

