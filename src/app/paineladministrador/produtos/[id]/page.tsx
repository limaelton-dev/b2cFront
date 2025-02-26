"use client";
import React, { useState } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';

export default function ProdutoDetalhes() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [formData, setFormData] = useState({
    name: "Nobreak 1200VA",
    brand: "Coletek",
    basePrice: 899.99,
    sitePrice: 899.99,
    quantity: 15,
    sku: "COL-NB-1200",
    emanagerRef: "EMG-123456",
    siteRef: "SITE-001",
    category: "Energia",
    subcategory: "Nobreaks",
    description: "Descrição detalhada do produto...",
    status: "active",
    cartQuantity: 2,
    attributes: {
      colors: ["Preto", "Branco"],
      sizes: [],
      models: ["1200VA", "1400VA"],
    },
    tags: ["Energia", "Nobreak", "Proteção"],
    seo: {
      metaTitle: "Nobreak 1200VA Coletek - Proteção Completa",
      metaDescription: "Nobreak 1200VA com proteção contra surtos e autonomia estendida. Ideal para computadores e equipamentos sensíveis.",
      keywords: "nobreak, proteção elétrica, energia estável, coletek"
    }
  });

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleCancel = () => {
    router.push('/paineladministrador/produtos');
  };

  const handleSave = async () => {
    try {
      // Aqui você implementará a chamada à API
      console.log('Dados a serem salvos:', formData);
      
      // Simular sucesso
      alert('Produto atualizado com sucesso!');
      router.push('/paineladministrador/produtos');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar as alterações');
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <img 
            src="https://via.placeholder.com/200" 
            alt={formData.name}
            style={{ 
              width: '100%', 
              height: 'auto',
              objectFit: 'contain',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px'
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Typography 
            variant="h6"
            gutterBottom
            sx={{ 
              fontWeight: 500,
              color: '#0C114E',
              mb: 2,
              fontSize: '1.1rem'
            }}
          >
            {formData.name}
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nome do Produto"
                value={formData.name}
                onChange={handleChange('name')}
                size="small"
                margin="dense"
                InputLabelProps={{ sx: { fontSize: '0.85rem' } }}
                InputProps={{ sx: { fontSize: '0.85rem' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small" margin="dense">
                <InputLabel sx={{ fontSize: '0.85rem' }}>Marca</InputLabel>
                <Select
                  value={formData.brand}
                  label="Marca"
                  disabled
                  sx={{ 
                    height: '36px',
                    fontSize: '0.85rem'
                  }}
                >
                  <MenuItem value="Coletek" sx={{ fontSize: '0.85rem' }}>Coletek</MenuItem>
                  <MenuItem value="StarCharge" sx={{ fontSize: '0.85rem' }}>StarCharge</MenuItem>
                  <MenuItem value="HP" sx={{ fontSize: '0.85rem' }}>HP</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Preço Base"
                value={formData.basePrice}
                type="number"
                disabled
                size="small"
                margin="dense"
                InputLabelProps={{ sx: { fontSize: '0.85rem' } }}
                InputProps={{ 
                  sx: { fontSize: '0.85rem' },
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Preço Site"
                value={formData.sitePrice}
                type="number"
                onChange={handleChange('sitePrice')}
                size="small"
                margin="dense"
                InputLabelProps={{ sx: { fontSize: '0.85rem' } }}
                InputProps={{ 
                  sx: { fontSize: '0.85rem' },
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quantidade em Estoque"
                value={formData.quantity}
                type="number"
                disabled
                size="small"
                margin="dense"
                InputLabelProps={{ sx: { fontSize: '0.85rem' } }}
                InputProps={{ sx: { fontSize: '0.85rem' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="SKU"
                value={formData.sku}
                disabled
                size="small"
                margin="dense"
                InputLabelProps={{ sx: { fontSize: '0.85rem' } }}
                InputProps={{ sx: { fontSize: '0.85rem' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Referência Emanager"
                value={formData.emanagerRef}
                disabled
                size="small"
                margin="dense"
                InputLabelProps={{ sx: { fontSize: '0.85rem' } }}
                InputProps={{ sx: { fontSize: '0.85rem' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Referência Site"
                value={formData.siteRef}
                onChange={handleChange('siteRef')}
                size="small"
                margin="dense"
                InputLabelProps={{ sx: { fontSize: '0.85rem' } }}
                InputProps={{ sx: { fontSize: '0.85rem' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small" margin="dense">
                <InputLabel sx={{ fontSize: '0.85rem' }}>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={handleChange('status')}
                  sx={{ 
                    height: '36px',
                    fontSize: '0.85rem'
                  }}
                >
                  <MenuItem value="active" sx={{ fontSize: '0.85rem' }}>Ativo</MenuItem>
                  <MenuItem value="inactive" sx={{ fontSize: '0.85rem' }}>Inativo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontSize: '0.9rem', color: '#666' }}>
                Categorização
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth size="small" margin="dense">
                    <InputLabel sx={{ fontSize: '0.85rem' }}>Categoria</InputLabel>
                    <Select
                      value={formData.category}
                      label="Categoria"
                      onChange={handleChange('category')}
                      sx={{ height: '36px', fontSize: '0.85rem' }}
                    >
                      <MenuItem value="Energia" sx={{ fontSize: '0.85rem' }}>Energia</MenuItem>
                      <MenuItem value="Informática" sx={{ fontSize: '0.85rem' }}>Informática</MenuItem>
                      {/* Adicione mais categorias */}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth size="small" margin="dense">
                    <InputLabel sx={{ fontSize: '0.85rem' }}>Subcategoria</InputLabel>
                    <Select
                      value={formData.subcategory}
                      label="Subcategoria"
                      onChange={handleChange('subcategory')}
                      sx={{ height: '36px', fontSize: '0.85rem' }}
                    >
                      <MenuItem value="Nobreaks" sx={{ fontSize: '0.85rem' }}>Nobreaks</MenuItem>
                      <MenuItem value="Estabilizadores" sx={{ fontSize: '0.85rem' }}>Estabilizadores</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Tags (separadas por vírgula)"
                    value={formData.tags.join(', ')}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      tags: e.target.value.split(',').map(tag => tag.trim())
                    }))}
                    size="small"
                    margin="dense"
                    InputLabelProps={{ sx: { fontSize: '0.85rem' } }}
                    InputProps={{ sx: { fontSize: '0.85rem' } }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontSize: '0.9rem', color: '#666' }}>
                Atributos do Produto
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Cores (separadas por vírgula)"
                    value={formData.attributes.colors.join(', ')}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      attributes: {
                        ...prev.attributes,
                        colors: e.target.value.split(',').map(color => color.trim())
                      }
                    }))}
                    size="small"
                    margin="dense"
                    InputLabelProps={{ sx: { fontSize: '0.85rem' } }}
                    InputProps={{ sx: { fontSize: '0.85rem' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Modelos (separados por vírgula)"
                    value={formData.attributes.models.join(', ')}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      attributes: {
                        ...prev.attributes,
                        models: e.target.value.split(',').map(model => model.trim())
                      }
                    }))}
                    size="small"
                    margin="dense"
                    InputLabelProps={{ sx: { fontSize: '0.85rem' } }}
                    InputProps={{ sx: { fontSize: '0.85rem' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Quantidade em Carrinhos"
                    value={formData.cartQuantity}
                    type="number"
                    disabled
                    size="small"
                    margin="dense"
                    InputLabelProps={{ sx: { fontSize: '0.85rem' } }}
                    InputProps={{ sx: { fontSize: '0.85rem' } }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontSize: '0.9rem', color: '#666' }}>
                SEO e Metadados
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Meta Title"
                    value={formData.seo.metaTitle}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      seo: { ...prev.seo, metaTitle: e.target.value }
                    }))}
                    size="small"
                    margin="dense"
                    InputLabelProps={{ sx: { fontSize: '0.85rem' } }}
                    InputProps={{ sx: { fontSize: '0.85rem' } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Meta Description"
                    value={formData.seo.metaDescription}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      seo: { ...prev.seo, metaDescription: e.target.value }
                    }))}
                    multiline
                    rows={2}
                    size="small"
                    margin="dense"
                    InputLabelProps={{ sx: { fontSize: '0.85rem' } }}
                    InputProps={{ sx: { fontSize: '0.85rem' } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Palavras-chave (separadas por vírgula)"
                    value={formData.seo.keywords}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      seo: { ...prev.seo, keywords: e.target.value }
                    }))}
                    size="small"
                    margin="dense"
                    InputLabelProps={{ sx: { fontSize: '0.85rem' } }}
                    InputProps={{ sx: { fontSize: '0.85rem' } }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button 
              variant="outlined" 
              size="small"
              onClick={handleCancel}
              sx={{ 
                color: '#691111',
                borderColor: '#691111',
                fontSize: '0.85rem',
                '&:hover': {
                  borderColor: '#691111',
                  backgroundColor: 'rgba(105, 17, 17, 0.04)'
                }
              }}
            >
              Cancelar
            </Button>
            <Button 
              variant="contained" 
              size="small"
              onClick={handleSave}
              sx={{ 
                backgroundColor: '#691111',
                fontSize: '0.85rem',
                '&:hover': {
                  backgroundColor: '#590e0e'
                }
              }}
            >
              Salvar Alterações
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
} 