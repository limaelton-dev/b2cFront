'use client';

import React from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Typography,
    FormGroup,
    FormControlLabel,
    Switch,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { Filters } from '../../../../types/filters';

const THEME_COLOR = '#252d5f';

interface OthersListProps {
    filters: Filters;
    setFilters: (filters: Filters) => void;
}

export default function OthersList({ filters, setFilters }: OthersListProps) {
    return (
        <Accordion defaultExpanded disableGutters elevation={0}>
            <AccordionSummary
                expandIcon={<ExpandMore />}
                sx={{
                    minHeight: 48,
                    '& .MuiAccordionSummary-content': { my: 1 },
                }}
            >
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#333' }}>
                    Mais Opções
                </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0, pb: 1 }}>
                <FormGroup>
                    <FormControlLabel
                        sx={{
                            ml: 0,
                            justifyContent: 'space-between',
                            '& .MuiFormControlLabel-label': {
                                fontSize: '0.875rem',
                                color: '#444',
                            },
                        }}
                        control={
                            <Switch
                                size="small"
                                sx={{
                                    '& .Mui-checked': {
                                        color: THEME_COLOR,
                                    },
                                    '& .Mui-checked + .MuiSwitch-track': {
                                        backgroundColor: THEME_COLOR,
                                    },
                                }}
                            />
                        }
                        labelPlacement="start"
                        label="Frete Grátis"
                    />
                    <FormControlLabel
                        sx={{
                            ml: 0,
                            justifyContent: 'space-between',
                            '& .MuiFormControlLabel-label': {
                                fontSize: '0.875rem',
                                color: '#444',
                            },
                        }}
                        control={
                            <Switch
                                size="small"
                                defaultChecked
                                sx={{
                                    '& .Mui-checked': {
                                        color: THEME_COLOR,
                                    },
                                    '& .Mui-checked + .MuiSwitch-track': {
                                        backgroundColor: THEME_COLOR,
                                    },
                                }}
                            />
                        }
                        labelPlacement="start"
                        label="Promoção"
                    />
                </FormGroup>
            </AccordionDetails>
        </Accordion>
    );
}
