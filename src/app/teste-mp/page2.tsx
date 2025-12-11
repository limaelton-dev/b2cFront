"use client"

import React, { useState } from 'react';
import { Button, CircularProgress, Box, Typography, Paper } from '@mui/material';
import { loadMercadoPagoSDK, generateCardToken, prepareCardData } from '@/api/checkout/services/mercado-pago';

const TesteMercadoPago = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    try {
      await loadMercadoPagoSDK();
      const cardData = prepareCardData();
      const cardToken = await generateCardToken(cardData);
      
      setResult({
        success: true,
        cardToken,
        message: 'Token gerado com sucesso'
      });
    } catch (err) {
      console.error('Erro ao testar:', err);
      setError('Erro ao testar a integração. Verifique o console para mais detalhes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Teste de Integração com Mercado Pago
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="body1" paragraph>
          Esta página permite testar a integração com o Mercado Pago sem precisar passar por todo o fluxo de checkout.
        </Typography>
        
        <Typography variant="body1" paragraph>
          Ao clicar no botão abaixo, o sistema irá:
        </Typography>
        <ol>
          <li>Carregar o SDK do Mercado Pago</li>
          <li>Gerar um token para um cartão de teste</li>
        </ol>
        
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleTest}
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Testar Integração'}
        </Button>
      </Paper>
      
      {error && (
        <Paper sx={{ p: 3, mb: 3, bgcolor: '#ffebee' }}>
          <Typography variant="subtitle1" color="error">
            {error}
          </Typography>
        </Paper>
      )}
      
      {result && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Resultado do Teste:
          </Typography>
          
          <Typography variant="body2" component="pre" sx={{ 
            bgcolor: '#f5f5f5', 
            p: 2, 
            borderRadius: 1,
            overflow: 'auto',
            maxHeight: 400
          }}>
            {JSON.stringify(result, null, 2)}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default TesteMercadoPago;
