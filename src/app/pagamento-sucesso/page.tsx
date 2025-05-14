"use client"
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Box, Button, Container, Typography, Paper, CircularProgress, Divider } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useAuth } from '../context/auth';
import { useToastSide } from '../context/toastSide';
import '../assets/css/checkout.css';

const PagamentoSucessoPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { showToast } = useToastSide();
    const { user } = useAuth();
    
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState('');
    
    useEffect(() => {
        // Obter parâmetros da URL
        const orderParam = searchParams.get('pedido');
        
        if (!orderParam) {
            showToast('Informações do pedido não encontradas', 'error');
            router.push('/');
            return;
        }
        
        setOrderId(orderParam);
    }, [searchParams, router, showToast]);
    
    const handleBackToHome = () => {
        router.push('/');
    };
    
    const handleCheckOrders = () => {
        router.push('/minhaconta/pedidos');
    };
    
    return (
        <Container maxWidth="md" sx={{ py: 5 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                    <Typography variant="h4" gutterBottom>
                        Pagamento Confirmado!
                    </Typography>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                        Pedido #{orderId}
                    </Typography>
                    <Typography variant="body1">
                        Obrigado pela sua compra! Seu pagamento foi processado com sucesso.
                    </Typography>
                </Box>
                
                <Divider sx={{ my: 3 }} />
                
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Próximos passos
                    </Typography>
                    <Box sx={{ pl: 2 }}>
                        <Typography variant="body1" paragraph>
                            • Você receberá um e-mail de confirmação com os detalhes do pedido.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            • Você pode acompanhar o status do seu pedido na seção "Meus Pedidos".
                        </Typography>
                        <Typography variant="body1" paragraph>
                            • Assim que seu pedido for enviado, você receberá outro e-mail com as informações de rastreamento.
                        </Typography>
                    </Box>
                </Box>
                
                {user && user.email && (
                    <Box sx={{ bgcolor: '#f9f9f9', p: 3, borderRadius: 2, mb: 4 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Informações da compra
                        </Typography>
                        <Typography variant="body2">
                            Um resumo da sua compra foi enviado para: <strong>{user.email}</strong>
                        </Typography>
                    </Box>
                )}
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button 
                        variant="outlined" 
                        onClick={handleBackToHome}
                    >
                        Continuar comprando
                    </Button>
                    <Button 
                        variant="contained" 
                        onClick={handleCheckOrders}
                    >
                        Meus pedidos
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default PagamentoSucessoPage; 