import React from 'react';
import { Box, CircularProgress, Typography, Button, SxProps, Theme } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

interface LoadingStateProps {
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
  loadingText?: string;
  containerSx?: SxProps<Theme>;
  children: React.ReactNode;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  loading,
  error,
  onRetry,
  loadingText = 'Carregando...',
  containerSx,
  children,
}) => {
  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '300px',
          ...containerSx
        }}
      >
        <CircularProgress sx={{ color: '#102d57', mb: 2 }} />
        <Typography variant="body2" color="textSecondary">
          {loadingText}
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        sx={{ 
          textAlign: 'center', 
          py: 4,
          ...containerSx
        }}
      >
        <Typography variant="body1" color="error" gutterBottom>
          {error}
        </Typography>
        {onRetry && (
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />}
            onClick={onRetry}
            sx={{ 
              mt: 2, 
              borderColor: '#102d57', 
              color: '#102d57',
              '&:hover': {
                backgroundColor: 'rgba(16, 45, 87, 0.04)',
                borderColor: '#0a1e3a',
              }
            }}
          >
            Tentar novamente
          </Button>
        )}
      </Box>
    );
  }

  return <>{children}</>;
};

export default LoadingState; 