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
      <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', py: 1 }}>
        <Box component="div">
          <Typography variant="subtitle1" component="div">
            {label} <VerifiedIcon fontSize="small" sx={{color: 'green', marginLeft: '2px'}}/>
          </Typography>
          <Typography variant="body2" component="div" color="text.secondary">
            {description}
          </Typography>
        </Box>
        <Box component="div">
          <Button variant="text" size="small">Alterar</Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default InfoCardPersonalData;
