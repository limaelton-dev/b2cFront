'use client';

import React from 'react';
import { Box, Skeleton } from '@mui/material';

export default function FiltersSkeleton() {
    return (
        <Box sx={{ p: 2 }}>
            <Skeleton variant="text" width={80} height={32} sx={{ mb: 2 }} />
            
            {[1, 2, 3].map((section) => (
                <Box key={section} sx={{ mb: 2 }}>
                    <Skeleton variant="text" width={100} height={28} sx={{ mb: 1 }} />
                    {[1, 2, 3, 4].map((item) => (
                        <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Skeleton variant="rectangular" width={18} height={18} sx={{ borderRadius: 0.5 }} />
                            <Skeleton variant="text" width={`${60 + Math.random() * 40}%`} height={22} />
                        </Box>
                    ))}
                </Box>
            ))}

            <Skeleton variant="rectangular" width="100%" height={36} sx={{ mt: 2, borderRadius: 1 }} />
        </Box>
    );
}

