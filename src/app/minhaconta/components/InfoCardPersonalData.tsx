import React from 'react';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';

interface InfoCardProps {
  label: string;
  description: string;
}

const InfoCardPersonalData: React.FC<InfoCardProps> = ({ label, description }) => {
  return (
    <Card sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
      <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <Box component="div">
          <Typography 
            sx={{ fontSize: '0.7rem' }}
          >
            {label} <VerifiedIcon fontSize="small" sx={{color: 'green', marginLeft: '2px'}}/>
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ fontSize: '0.9rem' }}
          >
            {description}
          </Typography>
        </Box>
        <Box component="div">
          <Button 
            variant="text"
            sx={{ 
              fontSize: '0.75rem', 
              padding: '8px 16px', 
              minWidth: '75px', 
              height: '40px'
            }}
          >Alterar</Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default InfoCardPersonalData;
