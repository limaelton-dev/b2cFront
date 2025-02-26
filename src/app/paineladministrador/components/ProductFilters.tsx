import React from 'react';
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  OutlinedInput,
  InputAdornment,
  TextField,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

interface ProductFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  subcategoryFilter: string;
  setSubcategoryFilter: (value: string) => void;
  brandFilter: string;
  setBrandFilter: (value: string) => void;
  quantityFilter: string;
  setQuantityFilter: (value: string) => void;
  tagFilter: string;
  setTagFilter: (value: string) => void;
  categories: string[];
  subcategories: string[];
  brands: string[];
  products: any[]; // Tipo any temporário, ajuste conforme sua interface Product
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
  subcategoryFilter,
  setSubcategoryFilter,
  brandFilter,
  setBrandFilter,
  quantityFilter,
  setQuantityFilter,
  tagFilter,
  setTagFilter,
  categories,
  subcategories,
  brands,
  products,
}) => {
  return (
    <Paper 
      elevation={0} 
      className="bg-white/50 backdrop-blur-sm border border-gray-100"
      sx={{ 
        p: '12px',
        mb: 3,
        borderRadius: '12px',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Typography 
          variant="subtitle2"
          className="text-gray-700 font-medium flex items-center gap-2"
          sx={{ fontSize: '0.85rem' }}
        >
          <FilterListIcon className="text-gray-500" sx={{ fontSize: '1rem' }} />
          Filtros de Busca
        </Typography>
      </div>

      <Grid container spacing={1.5} alignItems="center">
        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel sx={{ fontSize: '0.85rem' }}>Buscar</InputLabel>
            <OutlinedInput
              placeholder="Digite para buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'rgba(0, 0, 0, 0.54)', fontSize: '1rem' }} />
                </InputAdornment>
              }
              label="Buscar"
              sx={{ 
                height: '36px',
                backgroundColor: 'white',
                '& fieldset': {
                  borderColor: 'rgba(0, 0, 0, 0.15)',
                },
                '& input': {
                  fontSize: '0.85rem',
                }
              }}
            />
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel sx={{ fontSize: '0.85rem' }}>Marca</InputLabel>
            <Select
              value={brandFilter}
              label="Marca"
              onChange={(e) => setBrandFilter(e.target.value)}
              sx={{ 
                height: '36px',
                fontSize: '0.85rem'
              }}
            >
              <MenuItem value="all" sx={{ fontSize: '0.85rem' }}>Todas as marcas</MenuItem>
              <MenuItem value="COLETEK" sx={{ fontSize: '0.85rem' }}>COLETEK</MenuItem>
              <MenuItem value="EMACHINES ACER GADGET" sx={{ fontSize: '0.85rem' }}>EMACHINES ACER GADGET</MenuItem>
              <MenuItem value="ENERGIZER" sx={{ fontSize: '0.85rem' }}>ENERGIZER</MenuItem>
              <MenuItem value="HP" sx={{ fontSize: '0.85rem' }}>HP</MenuItem>
              <MenuItem value="LECOO" sx={{ fontSize: '0.85rem' }}>LECOO</MenuItem>
              <MenuItem value="PHILIPS" sx={{ fontSize: '0.85rem' }}>PHILIPS</MenuItem>
              <MenuItem value="STARCHARGE" sx={{ fontSize: '0.85rem' }}>STARCHARGE</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel sx={{ fontSize: '0.85rem' }}>Categoria</InputLabel>
            <Select
              value={categoryFilter}
              label="Categoria"
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setSubcategoryFilter('all');
              }}
              sx={{ 
                height: '36px',
                fontSize: '0.85rem'
              }}
            >
              <MenuItem value="all" sx={{ fontSize: '0.85rem' }}>Todas as categorias</MenuItem>
              <MenuItem value="Energia" sx={{ fontSize: '0.85rem' }}>Energia</MenuItem>
              <MenuItem value="Informática" sx={{ fontSize: '0.85rem' }}>Informática</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel sx={{ fontSize: '0.85rem' }}>Subcategoria</InputLabel>
            <Select
              value={subcategoryFilter}
              label="Subcategoria"
              onChange={(e) => setSubcategoryFilter(e.target.value)}
              sx={{ 
                height: '36px',
                fontSize: '0.85rem'
              }}
            >
              <MenuItem value="all" sx={{ fontSize: '0.85rem' }}>Todas as subcategorias</MenuItem>
              {categoryFilter === 'Energia' && [
                <MenuItem value="Nobreak Ups" sx={{ fontSize: '0.85rem' }}>Nobreak Ups</MenuItem>,
                <MenuItem value="Bateria" sx={{ fontSize: '0.85rem' }}>Bateria</MenuItem>,
                <MenuItem value="Estabilizador" sx={{ fontSize: '0.85rem' }}>Estabilizador</MenuItem>,
                <MenuItem value="Filtro De Linha" sx={{ fontSize: '0.85rem' }}>Filtro De Linha</MenuItem>,
                <MenuItem value="Pilhas Comuns" sx={{ fontSize: '0.85rem' }}>Pilhas Comuns</MenuItem>,
                <MenuItem value="Pilhas Recarregáveis" sx={{ fontSize: '0.85rem' }}>Pilhas Recarregáveis</MenuItem>,
                <MenuItem value="Carregador Veicular" sx={{ fontSize: '0.85rem' }}>Carregador Veicular</MenuItem>
              ]}
              {categoryFilter === 'Informática' && [
                <MenuItem value="Notebook Básico" sx={{ fontSize: '0.85rem' }}>Notebook Básico</MenuItem>,
                <MenuItem value="Notebook Gamer" sx={{ fontSize: '0.85rem' }}>Notebook Gamer</MenuItem>,
                <MenuItem value="Impressora Laser" sx={{ fontSize: '0.85rem' }}>Impressora Laser</MenuItem>,
                <MenuItem value="Mouse Gamer" sx={{ fontSize: '0.85rem' }}>Mouse Gamer</MenuItem>,
                <MenuItem value="Monitor LED" sx={{ fontSize: '0.85rem' }}>Monitor LED</MenuItem>
              ]}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Filtrar por Tags"
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            size="small"
            placeholder="Digite para filtrar por tags..."
            InputLabelProps={{ sx: { fontSize: '0.85rem' } }}
            InputProps={{ 
              sx: { fontSize: '0.85rem', height: '36px' }
            }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel sx={{ fontSize: '0.85rem' }}>Disponibilidade</InputLabel>
            <Select
              value={quantityFilter}
              label="Disponibilidade"
              onChange={(e) => setQuantityFilter(e.target.value)}
              sx={{ 
                height: '36px',
                fontSize: '0.85rem'
              }}
            >
              <MenuItem value="all" sx={{ fontSize: '0.85rem' }}>Todos os produtos</MenuItem>
              <MenuItem value="inStock" sx={{ fontSize: '0.85rem' }}>Produtos em estoque</MenuItem>
              <MenuItem value="outOfStock" sx={{ fontSize: '0.85rem' }}>Produtos esgotados</MenuItem>
              <MenuItem value="lowStock" sx={{ fontSize: '0.85rem' }}>Estoque baixo</MenuItem>
            </Select>
          </FormControl>
        </Grid>


      </Grid>
    </Paper>
  );
};

export default ProductFilters; 