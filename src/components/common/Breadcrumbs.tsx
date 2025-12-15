'use client';

import React from 'react';
import Link from 'next/link';
import {
    Breadcrumbs as MuiBreadcrumbs,
    Typography,
    Box,
} from '@mui/material';
import { Home, NavigateNext } from '@mui/icons-material';

const THEME_COLOR = '#252d5f';

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    const allItems: BreadcrumbItem[] = [{ label: 'Home', href: '/' }, ...items];

    return (
        <Box sx={{ py: 2 }}>
            <MuiBreadcrumbs
                separator={<NavigateNext sx={{ fontSize: 18, color: '#bbb' }} />}
                aria-label="breadcrumb"
                sx={{
                    '& .MuiBreadcrumbs-ol': {
                        flexWrap: 'nowrap',
                    },
                }}
            >
                {allItems.map((item, index) => {
                    const isLast = index === allItems.length - 1;
                    const isHome = index === 0;

                    if (isLast) {
                        return (
                            <Typography
                                key={index}
                                variant="body2"
                                sx={{
                                    color: '#666',
                                    fontWeight: 500,
                                    maxWidth: { xs: 150, sm: 300 },
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {item.label}
                            </Typography>
                        );
                    }

                    return (
                        <Link
                            key={index}
                            href={item.href || '/'}
                            style={{ textDecoration: 'none' }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    color: '#999',
                                    transition: 'color 0.2s ease',
                                    '&:hover': {
                                        color: THEME_COLOR,
                                    },
                                }}
                            >
                                {isHome && <Home sx={{ fontSize: 18 }} />}
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'inherit',
                                        fontWeight: 400,
                                    }}
                                >
                                    {item.label}
                                </Typography>
                            </Box>
                        </Link>
                    );
                })}
            </MuiBreadcrumbs>
        </Box>
    );
}

