'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { Box, Button, Skeleton } from '@mui/material';
import { useCategoriesMenu } from '../../../hooks/useCategoriesMenu';
import NestedMenu from '../NestedMenu/NestedMenu';

const THEME_COLOR = '#252d5f';

const CategoriesNav = memo(function CategoriesNav() {
    const { tree, loading, error, isEmpty } = useCategoriesMenu({
        maxDepth: 3,
    });

    if (loading) {
        return (
            <Box
                component="nav"
                aria-label="Categorias"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    py: 1,
                }}
            >
                <Skeleton variant="rounded" width={130} height={32} sx={{ borderRadius: 2 }} />
                <Skeleton variant="rounded" width={150} height={32} sx={{ borderRadius: 2 }} />
            </Box>
        );
    }

    if (error || isEmpty) {
        return null;
    }

    return (
        <Box
            component="nav"
            aria-label="Categorias"
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                py: 1,
            }}
        >
            <NestedMenu categories={tree} />

            <Button
                component={Link}
                href="/produtos"
                variant="contained"
                size="small"
                sx={{
                    bgcolor: THEME_COLOR,
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    textTransform: 'none',
                    px: 2.5,
                    py: 0.75,
                    borderRadius: 2,
                    boxShadow: 'none',
                    '&:hover': {
                        bgcolor: '#1a2147',
                        boxShadow: 'none',
                    },
                }}
            >
                Ver todos os produtos
            </Button>
        </Box>
    );
});

export default CategoriesNav;
