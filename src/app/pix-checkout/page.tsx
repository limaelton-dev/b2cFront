"use client"
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Box, Button, Container, Typography, Paper, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthProvider';
import { useToastSide } from '../context/ToastSideProvider';
import '../assets/css/checkout.css';

const PixCheckoutPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { showToast } = useToastSide();
    const { user } = useAuth();
    
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [qrCodeImage, setQrCodeImage] = useState('');
    const [pixKey, setPixKey] = useState('');
    
    useEffect(() => {
        // Obter parâmetros da URL
        const orderParam = searchParams.get('pedido');
        const qrCodeParam = searchParams.get('qrcode');
        const keyParam = searchParams.get('key');
        
        if (!orderParam || (!qrCodeParam && !keyParam)) {
            showToast('Informações de pagamento PIX não encontradas', 'error');
            router.push('/');
            return;
        }
        
        setOrderId(orderParam);
        if (qrCodeParam) setQrCodeImage(qrCodeParam);
        if (keyParam) setPixKey(keyParam);
    }, [searchParams, router, showToast]);
    
    const handleCopyPixKey = () => {
        if (pixKey) {
            navigator.clipboard.writeText(pixKey)
                .then(() => {
                    showToast('Chave PIX copiada com sucesso!', 'success');
                })
                .catch(err => {
                    console.error('Erro ao copiar chave PIX:', err);
                    showToast('Erro ao copiar chave PIX', 'error');
                });
        }
    };
    
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
                    <Typography variant="h4" gutterBottom>
                        Pagamento PIX
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Pedido #{orderId}
                    </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                    {qrCodeImage ? (
                        <Box sx={{ mb: 2, p: 3, border: '1px solid #ddd', borderRadius: 2 }}>
                            <Image
                                src={qrCodeImage}
                                alt="QR Code PIX"
                                width={200}
                                height={200}
                                style={{ maxWidth: '100%', height: 'auto' }}
                            />
                        </Box>
                    ) : (
                        <Typography variant="body1" color="error" sx={{ mb: 2 }}>
                            QR Code não disponível
                        </Typography>
                    )}
                    
                    {pixKey && (
                        <Box sx={{ width: '100%', mb: 3 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Chave PIX
                            </Typography>
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                p: 2, 
                                border: '1px solid #ddd', 
                                borderRadius: 1,
                                bgcolor: '#f5f5f5'
                            }}>
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        flex: 1, 
                                        fontFamily: 'monospace', 
                                        wordBreak: 'break-all' 
                                    }}
                                >
                                    {pixKey}
                                </Typography>
                                <Button 
                                    variant="contained" 
                                    size="small" 
                                    onClick={handleCopyPixKey}
                                    sx={{ ml: 1 }}
                                >
                                    Copiar
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Box>
                
                <Box sx={{ bgcolor: '#f9f9f9', p: 3, borderRadius: 2, mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Instruções
                    </Typography>
                    <Typography variant="body2" paragraph>
                        1. Abra o aplicativo do seu banco
                    </Typography>
                    <Typography variant="body2" paragraph>
                        2. Escolha a opção de pagamento via PIX
                    </Typography>
                    <Typography variant="body2" paragraph>
                        3. Escaneie o QR Code ou copie e cole a chave PIX
                    </Typography>
                    <Typography variant="body2" paragraph>
                        4. Confirme os dados e finalize o pagamento
                    </Typography>
                    <Typography variant="body2" color="primary">
                        O pagamento será processado em instantes e você receberá a confirmação por e-mail.
                    </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button 
                        variant="outlined" 
                        onClick={handleBackToHome}
                    >
                        Voltar à loja
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

export default PixCheckoutPage; 