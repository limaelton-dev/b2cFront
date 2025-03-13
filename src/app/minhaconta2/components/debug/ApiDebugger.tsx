import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { debugApiResponse } from '../../services/test';

// Este componente é apenas para desenvolvimento e deve ser removido em produção
const ApiDebugger: React.FC = () => {
  const [debugData, setDebugData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDebug = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await debugApiResponse();
      setDebugData(data);
      console.log('Dados de depuração:', data);
    } catch (err) {
      console.error('Erro na depuração:', err);
      setError('Erro ao depurar API');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 4, p: 2, border: '1px dashed #ccc', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Depurador de API (apenas desenvolvimento)
      </Typography>
      <Button 
        variant="outlined" 
        onClick={handleDebug}
        disabled={loading}
        sx={{ mb: 2 }}
      >
        {loading ? 'Depurando...' : 'Depurar API'}
      </Button>
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      {debugData && (
        <Paper sx={{ p: 2, maxHeight: 300, overflow: 'auto' }}>
          <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
            Verifique o console para detalhes completos
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default ApiDebugger; 