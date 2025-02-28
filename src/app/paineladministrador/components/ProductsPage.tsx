import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Grid,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  OutlinedInput,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ProductCard from './ProductCard';
import ProductFilters from './ProductFilters';

// Interface para o tipo de produto
interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  imageUrl: string;
  category: string;
  subcategory: string;
  tags: string[];
}

// Dados mockados para exemplo
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Nobreak 1200VA",
    brand: "COLETEK",
    price: 899.99,
    quantity: 15,
    imageUrl: "https://m.media-amazon.com/images/I/61ny+WOhqML._AC_SL1500_.jpg",
    category: "Energia",
    subcategory: "Nobreak Ups",
    tags: ["Energia", "Proteção", "Nobreak"]
  },
  {
    id: "2",
    name: "Bateria para Nobreak 12V",
    brand: "COLETEK",
    price: 299.99,
    quantity: 12,
    imageUrl: "https://m.media-amazon.com/images/I/71dxKEXO5pL._AC_SL1500_.jpg",
    category: "Energia",
    subcategory: "Bateria",
    tags: ["Energia", "Bateria", "Nobreak"]
  },
  {
    id: "3",
    name: "Estabilizador 1000VA",
    brand: "COLETEK",
    price: 149.99,
    quantity: 30,
    imageUrl: "https://m.media-amazon.com/images/I/61F0CxvhabL._AC_SL1500_.jpg",
    category: "Energia",
    subcategory: "Estabilizador",
    tags: ["Energia", "Estabilizador", "Proteção"]
  },
  {
    id: "4",
    name: "Filtro de Linha 6 Tomadas",
    brand: "COLETEK",
    price: 89.99,
    quantity: 45,
    imageUrl: "https://m.media-amazon.com/images/I/51EPxZ0H0mL._AC_SL1000_.jpg",
    category: "Energia",
    subcategory: "Filtro De Linha",
    tags: ["Energia", "Proteção", "Filtro"]
  },
  {
    id: "5",
    name: "Notebook Acer Aspire 3",
    brand: "EMACHINES ACER GADGET",
    price: 3499.99,
    quantity: 8,
    imageUrl: "https://m.media-amazon.com/images/I/71DVgBTdyLL._AC_SL1500_.jpg",
    category: "Informática",
    subcategory: "Notebook Básico",
    tags: ["Notebook", "Acer", "Computador"]
  },
  {
    id: "6",
    name: "Notebook Acer Nitro 5",
    brand: "EMACHINES ACER GADGET",
    price: 4999.99,
    quantity: 5,
    imageUrl: "https://m.media-amazon.com/images/I/71ctRE34RuL._AC_SL1500_.jpg",
    category: "Informática",
    subcategory: "Notebook Gamer",
    tags: ["Notebook", "Acer", "Gamer"]
  },
  {
    id: "7",
    name: "Pilha Alcalina AA",
    brand: "ENERGIZER",
    price: 15.99,
    quantity: 100,
    imageUrl: "https://m.media-amazon.com/images/I/71H6TxqCkhL._AC_SL1500_.jpg",
    category: "Energia",
    subcategory: "Pilhas Comuns",
    tags: ["Pilha", "Alcalina", "AA"]
  },
  {
    id: "8",
    name: "Pilha Recarregável AAA",
    brand: "ENERGIZER",
    price: 45.99,
    quantity: 50,
    imageUrl: "https://m.media-amazon.com/images/I/71nDX36Y9UL._AC_SL1500_.jpg",
    category: "Energia",
    subcategory: "Pilhas Recarregáveis",
    tags: ["Pilha", "Recarregável", "AAA"]
  },
  {
    id: "9",
    name: "Impressora HP LaserJet",
    brand: "HP",
    price: 1299.99,
    quantity: 10,
    imageUrl: "https://m.media-amazon.com/images/I/61yqf6+K4YL._AC_SL1500_.jpg",
    category: "Informática",
    subcategory: "Impressora Laser",
    tags: ["Impressora", "Laser", "HP"]
  },
  {
    id: "10",
    name: "Mouse Gamer RGB",
    brand: "LECOO",
    price: 129.99,
    quantity: 25,
    imageUrl: "https://m.media-amazon.com/images/I/61E6pxiF8kL._AC_SL1500_.jpg",
    category: "Informática",
    subcategory: "Mouse Gamer",
    tags: ["Mouse", "Gamer", "RGB"]
  },
  {
    id: "11",
    name: "Monitor LED 24'",
    brand: "PHILIPS",
    price: 899.99,
    quantity: 15,
    imageUrl: "https://m.media-amazon.com/images/I/81+-5VZ9QgL._AC_SL1500_.jpg",
    category: "Informática",
    subcategory: "Monitor LED",
    tags: ["Monitor", "LED", "24"]
  },
  {
    id: "12",
    name: "Carregador Veicular EV",
    brand: "STARCHARGE",
    price: 2499.99,
    quantity: 3,
    imageUrl: "https://m.media-amazon.com/images/I/61vHgp5pCXL._AC_SL1500_.jpg",
    category: "Energia",
    subcategory: "Carregador Veicular",
    tags: ["Carregador", "Veicular", "EV"]
  }
];

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [quantityFilter, setQuantityFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [subcategoryFilter, setSubcategoryFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('');

  const itemsPerPage = 8;

  // Lista única de marcas para o filtro
  const brands = Array.from(new Set(products.map(product => product.brand)));

  // Lista única de categorias e subcategorias
  const categories = Array.from(new Set(products.map(product => product.category)));
  const subcategories = Array.from(new Set(products.map(product => product.subcategory)));
  
  // Lista única de todas as tags
  const allTags = Array.from(new Set(products.flatMap(product => product.tags)));

  useEffect(() => {
    let filtered = [...products];

    // Filtro de pesquisa
    if (search) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.brand.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filtro de quantidade
    if (quantityFilter !== 'all') {
      switch (quantityFilter) {
        case 'inStock':
          filtered = filtered.filter(product => product.quantity > 0);
          break;
        case 'outOfStock':
          filtered = filtered.filter(product => product.quantity === 0);
          break;
        case 'lowStock':
          filtered = filtered.filter(product => product.quantity > 0 && product.quantity <= 5);
          break;
      }
    }

    // Filtro de marca
    if (brandFilter !== 'all') {
      filtered = filtered.filter(product => product.brand === brandFilter);
    }

    // Novos filtros
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    if (subcategoryFilter !== 'all') {
      filtered = filtered.filter(product => product.subcategory === subcategoryFilter);
    }

    if (tagFilter) {
      filtered = filtered.filter(product => 
        product.tags.some(tag => 
          tag.toLowerCase().includes(tagFilter.toLowerCase())
        )
      );
    }

    setFilteredProducts(filtered);
    setPage(1);
  }, [search, quantityFilter, brandFilter, categoryFilter, subcategoryFilter, tagFilter, products]);

  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Box className="animate-fadeIn">
      <ProductFilters
        search={search}
        setSearch={setSearch}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        subcategoryFilter={subcategoryFilter}
        setSubcategoryFilter={setSubcategoryFilter}
        brandFilter={brandFilter}
        setBrandFilter={setBrandFilter}
        quantityFilter={quantityFilter}
        setQuantityFilter={setQuantityFilter}
        tagFilter={tagFilter}
        setTagFilter={setTagFilter}
        categories={categories}
        subcategories={subcategories}
        brands={brands}
        products={products}
      />

      <div className="mb-4">
        <Typography variant="body2" className="text-gray-500">
          {filteredProducts.length} produtos encontrados
        </Typography>
      </div>

      <Grid container spacing={2} className="mb-6">
        {displayedProducts.map((product) => (
          <Grid item xs={12} sm={6} md={3} key={product.id}>
            <ProductCard {...product} />
          </Grid>
        ))}
      </Grid>

      {pageCount > 1 && (
        <Box className="flex justify-center mt-8 mb-4">
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            size="small"
            className="bg-white px-4 py-2 rounded-full shadow-sm"
          />
        </Box>
      )}

      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <SearchIcon sx={{ fontSize: 48 }} className="mb-4 opacity-50" />
          <Typography variant="h6" className="mb-2">
            Nenhum produto encontrado
          </Typography>
          <Typography variant="body2">
            Tente ajustar seus filtros de busca
          </Typography>
        </div>
      )}
    </Box>
  );
};

export default ProductsPage; 