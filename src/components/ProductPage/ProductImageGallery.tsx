'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Box, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import NoImage from '@/assets/img/noimage.png';

interface ProductImage {
    id: number;
    url?: string;
    standardUrl?: string;
    originalImage?: string;
}

interface ProductImageGalleryProps {
    images: ProductImage[];
    selectedImageUrl?: string;
    onImageSelect: (imageId: number) => void;
    productTitle: string;
}

export default function ProductImageGallery({
    images,
    selectedImageUrl,
    onImageSelect,
    productTitle,
}: ProductImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const getImageUrl = (image: ProductImage) => {
        return image.url || image.standardUrl || image.originalImage || NoImage.src;
    };

    const displayedImage = selectedImageUrl || (images.length > 0 ? getImageUrl(images[0]) : NoImage.src);

    const handlePrevious = () => {
        const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
        setCurrentIndex(newIndex);
        if (images[newIndex]) {
            onImageSelect(images[newIndex].id);
        }
    };

    const handleNext = () => {
        const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
        setCurrentIndex(newIndex);
        if (images[newIndex]) {
            onImageSelect(images[newIndex].id);
        }
    };

    return (
        <Box>
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '1',
                    bgcolor: '#fafafa',
                    borderRadius: 3,
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #e8e8e8',
                }}
            >
                <Image
                    src={displayedImage}
                    alt={productTitle}
                    fill
                    unoptimized
                    style={{ objectFit: 'contain', padding: 16 }}
                />

                {images.length > 1 && (
                    <>
                        <IconButton
                            onClick={handlePrevious}
                            sx={{
                                position: 'absolute',
                                left: 8,
                                bgcolor: 'rgba(255,255,255,0.9)',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                '&:hover': { bgcolor: '#fff' },
                            }}
                        >
                            <ChevronLeft />
                        </IconButton>
                        <IconButton
                            onClick={handleNext}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                bgcolor: 'rgba(255,255,255,0.9)',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                '&:hover': { bgcolor: '#fff' },
                            }}
                        >
                            <ChevronRight />
                        </IconButton>
                    </>
                )}
            </Box>

            {images.length > 1 && (
                <Box
                    sx={{
                        display: 'flex',
                        gap: 1,
                        mt: 2,
                        overflowX: 'auto',
                        pb: 1,
                        '&::-webkit-scrollbar': {
                            height: 4,
                        },
                        '&::-webkit-scrollbar-thumb': {
                            bgcolor: '#ccc',
                            borderRadius: 2,
                        },
                    }}
                >
                    {images.map((image, index) => (
                        <Box
                            key={image.id}
                            onClick={() => {
                                setCurrentIndex(index);
                                onImageSelect(image.id);
                            }}
                            sx={{
                                width: 80,
                                height: 80,
                                flexShrink: 0,
                                borderRadius: 2,
                                overflow: 'hidden',
                                cursor: 'pointer',
                                border: selectedImageUrl === getImageUrl(image) ? '2px solid #252d5f' : '1px solid #e8e8e8',
                                bgcolor: '#fafafa',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    borderColor: '#252d5f',
                                },
                            }}
                        >
                            <Image
                                src={getImageUrl(image)}
                                alt={`${productTitle} - ${index + 1}`}
                                width={80}
                                height={80}
                                unoptimized
                                style={{ objectFit: 'contain' }}
                            />
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
}

