'use client';

import React from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableRow,
    TableCell,
    Paper,
} from '@mui/material';

interface Specification {
    label: string;
    value: string | number | null | undefined;
}

interface ProductSpecificationsProps {
    specifications: Specification[];
}

export default function ProductSpecifications({ specifications }: ProductSpecificationsProps) {
    const validSpecs = specifications.filter((spec) => spec.value);

    if (validSpecs.length === 0) {
        return null;
    }

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
                    Especificações
                </Typography>
            </Box>

            <Table>
                <TableBody>
                    {validSpecs.map((spec, index) => (
                        <TableRow
                            key={index}
                            sx={{
                                '&:nth-of-type(odd)': { bgcolor: '#fafafa' },
                                '&:last-child td': { borderBottom: 0 },
                            }}
                        >
                            <TableCell
                                sx={{
                                    fontWeight: 600,
                                    color: '#555',
                                    width: '40%',
                                    py: 1.5,
                                    borderBottom: '1px solid #f0f0f0',
                                }}
                            >
                                {spec.label}
                            </TableCell>
                            <TableCell
                                sx={{
                                    color: '#333',
                                    py: 1.5,
                                    borderBottom: '1px solid #f0f0f0',
                                }}
                            >
                                {spec.value}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}

