import React from 'react';
import { Typography, Box, Button, SxProps, Theme, Divider } from '@mui/material';

interface InfoCardProps {
  label: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  contentSx?: SxProps<Theme>;
}

const InfoCard: React.FC<InfoCardProps> = ({ 
  label, 
  description, 
  icon, 
  actionLabel = 'Alterar',
  onAction,
  contentSx
}) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '12px 0',
        borderBottom: '1px solid #f0f0f0',
        '&:last-child': {
          borderBottom: 'none'
        },
        ...contentSx
      }}
    >
      <Box component="div" sx={{ display: 'flex', alignItems: 'center' }}>
        {icon && (
          <Box sx={{ marginRight: '12px', display: 'flex', alignItems: 'center' }}>
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
    </Box>
  );
};

export default InfoCard; 