"use client";
import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Chip
} from '@mui/material';
import {
  Store,
  Payment,
  LocalShipping,
  Notifications,
  Security,
  Email,
  Receipt,
  Api,
  Language,
  Group
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function ConfiguracoesPage() {
  const router = useRouter();

  const configSections = [
    {
      title: 'Configurações da Loja',
      items: [
        {
          name: 'Informações da Loja',
          icon: <Store />,
          description: 'Nome da loja, CNPJ, endereço, contatos',
          path: '/informacoes-loja'
        },
        {
          name: 'Pagamentos',
          icon: <Payment />,
          description: 'Métodos de pagamento, taxas, parcelas',
          path: '/pagamentos',
          chip: 'Importante'
        },
        {
          name: 'Entrega',
          icon: <LocalShipping />,
          description: 'Transportadoras, frete, regiões atendidas',
          path: '/entrega'
        }
      ]
    },
    {
      title: 'Notificações e Comunicação',
      items: [
        {
          name: 'Notificações',
          icon: <Notifications />,
          description: 'Alertas de pedidos, estoque e vendas',
          path: '/notificacoes'
        },
        {
          name: 'E-mails Automáticos',
          icon: <Email />,
          description: 'Templates de e-mail, gatilhos automáticos',
          path: '/emails'
        },
        {
          name: 'Notas Fiscais',
          icon: <Receipt />,
          description: 'Configuração de emissão de NF-e',
          path: '/notas-fiscais',
          chip: 'Importante'
        }
      ]
    },
    {
      title: 'Integrações e Segurança',
      items: [
        {
          name: 'Integrações',
          icon: <Api />,
          description: 'APIs, marketplaces, ERP',
          path: '/integracoes'
        },
        {
          name: 'Segurança',
          icon: <Security />,
          description: 'Senhas, autenticação em 2 fatores',
          path: '/seguranca',
          chip: 'Importante'
        }
      ]
    },
    {
      title: 'Personalização',
      items: [
        {
          name: 'Idiomas e Moedas',
          icon: <Language />,
          description: 'Configurações regionais da loja',
          path: '/idiomas-moedas'
        },
        {
          name: 'Usuários e Permissões',
          icon: <Group />,
          description: 'Gerenciar equipe e níveis de acesso',
          path: '/usuarios'
        }
      ]
    }
  ];

  return (
    <Box className="animate-fadeIn p-6">
      <Typography 
        variant="h5" 
        className="text-gray-800 font-medium"
        sx={{ mb: 10 }}
      >
        Configurações da Conta
      </Typography>

      <div className="space-y-12">
        {configSections.map((section, index) => (
          <div key={index}>
            <Typography 
              variant="subtitle1" 
              className="text-gray-700 font-medium px-1 mb-6"
              sx={{
                mt: index !== 0 ? 4 : 0,
                fontSize: '1.1rem'
              }}
            >
              {section.title}
            </Typography>

            <div className="grid gap-x-8 gap-y-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {section.items.map((item, itemIndex) => (
                <Paper 
                  key={itemIndex}
                  elevation={0}
                  className="border border-gray-100 overflow-hidden hover:border-gray-200 transition-colors"
                  sx={{ 
                    borderRadius: '12px',
                    height: '100%',
                    mb: 1
                  }}
                >
                  <ListItemButton 
                    onClick={() => router.push(item.path)}
                    sx={{ 
                      py: 2.5,
                      px: 3,
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.02)'
                      }
                    }}
                  >
                    <ListItemIcon 
                      sx={{ 
                        color: '#691111', 
                        minWidth: '42px',
                        '& .MuiSvgIcon-root': {
                          fontSize: '1.3rem'
                        }
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        <Box className="flex items-center gap-2">
                          <span className="font-medium text-gray-800 text-[0.95rem]">
                            {item.name}
                          </span>
                          {item.chip && (
                            <Chip 
                              label={item.chip} 
                              size="small"
                              color="error"
                              sx={{ 
                                height: '20px',
                                '& .MuiChip-label': {
                                  fontSize: '0.7rem',
                                  px: 1
                                }
                              }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Typography 
                          variant="body2" 
                          className="text-gray-500"
                          sx={{ fontSize: '0.8rem', mt: 0.5 }}
                        >
                          {item.description}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </Paper>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Box>
  );
} 