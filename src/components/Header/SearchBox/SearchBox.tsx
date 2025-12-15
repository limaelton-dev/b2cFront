'use client';

import React, { useRef } from 'react';
import {
    Box,
    InputBase,
    IconButton,
    Paper,
    CircularProgress,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useSearch } from '../../../hooks/useSearch';
import SearchResults from './SearchResults';

const THEME_COLOR = '#252d5f';

interface SearchBoxProps {
    onSubmit: (term: string) => void;
}

export default function SearchBox({ onSubmit }: SearchBoxProps) {
    const { term, setTerm, results, loading, canSearch, clear } = useSearch(4);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && term.trim()) {
            onSubmit(term);
            clear();
        }
    };

    const handleSearch = () => {
        if (term.trim()) {
            onSubmit(term);
            clear();
        }
    };

    return (
        <Box sx={{ position: 'relative', width: '100%', maxWidth: 600 }}>
            <Paper
                component="form"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch();
                }}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    overflow: 'hidden',
                    boxShadow: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    '&:focus-within': {
                        borderColor: THEME_COLOR,
                        boxShadow: `0 0 0 2px rgba(37, 45, 95, 0.1)`,
                    },
                }}
            >
                <InputBase
                    inputRef={inputRef}
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    onKeyDown={handleEnter}
                    placeholder="Buscar produtos..."
                    sx={{
                        flex: 1,
                        px: 2,
                        py: 1,
                        fontSize: '0.95rem',
                        '& input': {
                            padding: 0,
                        },
                    }}
                    inputProps={{
                        'aria-label': 'Buscar produtos',
                        'aria-autocomplete': 'list',
                        'aria-controls': 'search-results',
                    }}
                />
                {loading && (
                    <CircularProgress size={20} sx={{ mr: 1, color: THEME_COLOR }} />
                )}
                <IconButton
                    type="submit"
                    aria-label="Buscar"
                    sx={{
                        bgcolor: THEME_COLOR,
                        borderRadius: 0,
                        px: 2,
                        py: 1.25,
                        '&:hover': {
                            bgcolor: '#1a2147',
                        },
                    }}
                >
                    <Search sx={{ color: '#fff' }} />
                </IconButton>
            </Paper>

            {canSearch && results.length > 0 && (
                <SearchResults
                    id="search-results"
                    results={results}
                    onClose={clear}
                />
            )}
        </Box>
    );
}
