'use client';

import Link from 'next/link';
import { useCategoriesMenu } from '../../../hooks/useCategoriesMenu';
import NestedMenu from '../NestedMenu/NestedMenu';

export default function CategoriesNav() {
  const { tree, loading } = useCategoriesMenu();

  return (
    <nav className="categories d-flex justify-content-end" aria-label="Categorias">
      <ul>
        <li>{loading ? 'Carregando categorias…' : <NestedMenu />}</li>
        <li><Link href="/produtos?categoria=1&page=1">Gabinete</Link></li>
        <li><Link href="/produtos?categoria=2&page=1">Mouse</Link></li>
        <li><Link href="/produtos?categoria=7&page=1">Teclado</Link></li>
        <li><Link href="/produtos?categoria=6&page=1">Acessórios</Link></li>
        <li><Link href="/produtos?categoria=5&page=1">Fonte de Alimentação</Link></li>
        <li><Link className="btn-buy-primary ofertas-link" href="/produtos">Todos os produtos</Link></li>
      </ul>
    </nav>
  );
}
