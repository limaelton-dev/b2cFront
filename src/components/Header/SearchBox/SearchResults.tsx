'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Box,
    Paper,
    List,
    ListItem,
    ListItemButton,
    Typography,
    Button,
    Divider,
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import NoImage from '../../../assets/img/noimage.png';
import { Product } from '../../../api/products/types/product';

const THEME_COLOR = '#252d5f';

interface SearchResultsProps {
    id?: string;
    results: Product[];
    onClose: () => void;
}

export default function SearchResults({ id, results, onClose }: SearchResultsProps) {
    const resolveImage = (product: Product) => {
        if (product.images && product.images.length > 0 && product.images[0].url) {
            return product.images[0].url;
        }
        return NoImage;
    };

    return (
        <Paper
            id={id}
            role="listbox"
            sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                mt: 0.5,
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                maxHeight: 400,
                overflowY: 'auto',
                zIndex: 1000,
            }}
        >
            <List disablePadding>
                {results.slice(0, 8).map((product, index) => (
                    <React.Fragment key={product.id}>
                        <ListItem disablePadding>
                            <ListItemButton
                                component={Link}
                                href={`/produto/${product.slug}`}
                                onClick={onClose}
                                sx={{
                                    py: 1.5,
                                    px: 2,
                                    gap: 2,
                                    '&:hover': {
                                        backgroundColor: 'rgba(37, 45, 95, 0.05)',
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 1,
                                        overflow: 'hidden',
                                        backgroundColor: '#f5f5f5',
                                        flexShrink: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Image
                                        src={resolveImage(product)}
                                        alt={product.title}
                                        width={50}
                                        height={50}
                                        style={{ objectFit: 'contain' }}
                                        unoptimized
                                    />
                                </Box>
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: 500,
                                            color: '#333',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {product.title}
                                    </Typography>
                                    {product.brand && (
                                        <Typography variant="caption" sx={{ color: '#666' }}>
                                            {product.brand.name}
                                        </Typography>
                                    )}
                                </Box>
                                <ArrowForward sx={{ color: '#ccc', fontSize: 18 }} />
                            </ListItemButton>
                        </ListItem>
                        {index < results.slice(0, 8).length - 1 && <Divider />}
                    </React.Fragment>
                ))}
            </List>

            {results.length > 8 && (
                <>
                    <Divider />
                    <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'center' }}>
                        <Button
                            onClick={onClose}
                            variant="text"
                            size="small"
                            sx={{
                                color: THEME_COLOR,
                                textTransform: 'none',
                                fontWeight: 600,
                            }}
                        >
                            Ver todos os resultados ({results.length})
                        </Button>
                    </Box>
                </>
            )}
        </Paper>
    );
}
