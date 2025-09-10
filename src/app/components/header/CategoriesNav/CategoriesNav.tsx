// src/app/components/header/CategoriesNav/CategoriesNav.tsx
'use client';

import { Link as MuiLink } from '@mui/material';
import { useCategoriesMenu } from '../../../hooks/useCategoriesMenu';
import NestedMenu from '../NestedMenu/NestedMenu';
import Link from 'next/link';
import { memo } from 'react';
import { getFirstLeafCategories } from '../../../utils/category-utils';

const CategoriesNav = memo(function CategoriesNav() {
  const { tree, loading, error, isEmpty } = useCategoriesMenu({
    preloadPopular: true,
    maxDepth: 3 // Limita a 3 níveis para performance
  });

  if (loading) {
    return (
      <nav className="categories d-flex justify-content-between" aria-label="Categorias">
        <div></div>
        <ul>
          <li className="loading-skeleton">Carregando categorias...</li>
        </ul>
      </nav>
    );
  }

  if (error) {
    return (
      <nav className="categories d-flex justify-content-between" aria-label="Categorias">
        <div></div>
        <ul>
          <li className="error-message">Erro ao carregar categorias</li>
        </ul>
      </nav>
    );
  }

  if (isEmpty) {
    return (
      <nav className="categories d-flex justify-content-between" aria-label="Categorias">
        <div></div>
        <ul>
          <li>Nenhuma categoria encontrada</li>
        </ul>
      </nav>
    );
  }

  // Pega as primeiras 4 categorias que não possuem subcategorias
  const mainCategories = getFirstLeafCategories(tree, 4);

  return (
    <nav className="categories d-flex justify-content-between" aria-label="Categorias">
      <div></div>
      <ul>
        <li>
          <NestedMenu categories={tree} />
        </li>
        {mainCategories.map(category => (
          <li key={category.id}>
            <MuiLink 
              underline="hover" 
              color="inherit" 
              component={Link} 
              href={`/produtos?categoria=${category.id}&page=1`}
              title={`${category.name} (${category.totalProducts} produtos)`}
            >
              {category.name}
            </MuiLink>
          </li>
        ))}
        <li>
          <MuiLink 
            className="btn-buy-primary ofertas-link" 
            component={Link}
            href="/produtos"
          >
            Todos os produtos
          </MuiLink>
        </li>
      </ul>
    </nav>
  );
});

export default CategoriesNav;