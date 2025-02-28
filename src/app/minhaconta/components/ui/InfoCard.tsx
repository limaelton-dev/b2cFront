import React from 'react';
import { Card, CardContent, Typography, Box, Button, SxProps, Theme } from '@mui/material';

interface InfoCardProps {
  label: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  cardSx?: SxProps<Theme>;
  contentSx?: SxProps<Theme>;
}

const InfoCard: React.FC<InfoCardProps> = ({ 
  label, 
  description, 
  icon, 
  actionLabel = 'Alterar',
  onAction,
  cardSx,
  contentSx
}) => {
  return (
    <Card 
      elevation={0}
      sx={{ 
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        },
        ...cardSx
      }}
    >
      <CardContent 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '16px',
          '&:last-child': { paddingBottom: '16px' },
          ...contentSx
        }}
      >
        <Box component="div" sx={{ display: 'flex', alignItems: 'center' }}>
          {icon && (
            <Box sx={{ marginRight: '8px', display: 'flex', alignItems: 'center' }}>
              {icon}
            </Box>
          )}
          <Box>
            <Typography 
              sx={{ 
                fontSize: '13px',
                color: '#666',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {label}
            </Typography>
            <Typography
              sx={{ 
                fontSize: '15px',
                fontWeight: 500,
                color: '#333'
              }}
            >
              {description}
            </Typography>
          </Box>
        </Box>
        {onAction && (
          <Button 
            variant="text"
            onClick={onAction}
            sx={{ 
              fontSize: '12px', 
              padding: '6px 12px', 
              minWidth: '75px', 
              height: '36px',
              color: '#102d57',
              '&:hover': {
                backgroundColor: 'rgba(16, 45, 87, 0.04)',
              }
            }}
          >
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default InfoCard; 