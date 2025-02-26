"use client";
import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, name, brand, price, quantity, imageUrl }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/paineladministrador/produtos/${id}`);
  };

  return (
    <Card 
      onClick={handleClick}
      sx={{ 
        maxWidth: 240,
        m: 1,
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        },
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <Box sx={{ 
        position: 'relative',
        paddingTop: '100%', // Aspect ratio 1:1
        backgroundColor: '#f5f5f5',
        width: '100%'
      }}>
        <CardMedia
          component="img"
          image={imageUrl}
          alt={name}
          sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            padding: '12px'
          }}
        />
      </Box>
      <CardContent sx={{ 
        py: '8px !important', 
        px: 1.5,
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div>
          <Typography 
            gutterBottom 
            variant="body2" 
            component="div" 
            noWrap
            sx={{ fontWeight: 500, mb: 0.5 }}
          >
            {name}
          </Typography>
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ 
              fontSize: '0.65rem',
              display: 'block',
              mb: 0.5
            }}
          >
            Marca: {brand}
          </Typography>
        </div>
        <div>
          <Typography 
            variant="caption" 
            sx={{ 
              fontSize: '0.65rem',
              color: quantity > 0 ? '#1b5e20' : '#d32f2f',
              fontWeight: 500,
              display: 'block',
              mb: 0.5
            }}
          >
            Estoque: {quantity}
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-start',
            alignItems: 'center',
            mt: 0.5
          }}>
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 600,
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                gap: '2px'
              }}
            >
              <span style={{ fontSize: '0.75rem' }}>R$</span>
              <span>{price.toFixed(2)}</span>
            </Typography>
          </Box>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard; 