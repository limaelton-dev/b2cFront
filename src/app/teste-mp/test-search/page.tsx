'use client';

import React from 'react';

/** Tipagem simples de produto */
type Product = {
  id: string;
  title: string;
  price: number;        // em centavos (boa prática pra evitar float)
  stock: number;
  brand?: string;
};

type ApiResponse = { items: Product[] };

export default function ProductSearch() {
  // -----------------------------
  // Estados controlados da tela
  // -----------------------------
  const [query, setQuery] = React.useState('');
  const [rawItems, setRawItems] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [sortBy, setSortBy] = React.useState<'relevance' | 'price' | 'stock'>('relevance');
  const [brandFilter, setBrandFilter] = React.useState<string>('all');

  // -----------------------------------------
  // useRef: refs que não disparam re-render
  // -----------------------------------------
  const inputRef = React.useRef<HTMLInputElement>(null);   // focar o input quando montar
  const debounceTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const controllerRef = React.useRef<AbortController | null>(null); // manter o AbortController atual
  const lastRequestIdRef = React.useRef(0); // para evitar race conditions (resposta antiga sobrescrevendo nova)

  // Focar o input ao montar (exemplo prático de useRef com DOM)
  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // ------------------------------------------------------
  // useCallback: handlers estáveis para evitar re-renders
  // ------------------------------------------------------
  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  const handleSortChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as 'relevance' | 'price' | 'stock');
  }, []);

  const handleBrandChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setBrandFilter(e.target.value);
  }, []);

  // -------------------------------------------------------
  // Função que executa o fetch com cancelamento (AbortController)
  // Mantida ESTÁVEL com useCallback (dependências explícitas)
  // -------------------------------------------------------
  const fetchProducts = React.useCallback(async (q: string) => {
    // aborta requisição anterior, se existir
    controllerRef.current?.abort();

    const controller = new AbortController();
    controllerRef.current = controller;

    // id local para essa request (mitigar corrida)
    const requestId = ++lastRequestIdRef.current;

    setLoading(true);
    setError(null);

    try {
      // 🔁 aponte para seu endpoint real no Nest (ex.: `${process.env.NEXT_PUBLIC_API}/products/search?q=${encodeURIComponent(q)}`)
      const res = await fetch(`teste-mp/api/products?q=${encodeURIComponent(q)}`, {
        signal: controller.signal,
        // cache: 'no-store'  // útil se quiser desabilitar cache do Next/edge
      });

      if (!res.ok) {
        throw new Error(`Erro ao buscar: ${res.status} ${res.statusText}`);
      }

      const data = (await res.json()) as ApiResponse;

      // Ignora se uma request mais nova já foi iniciada e respondeu
      if (requestId !== lastRequestIdRef.current) return;

      setRawItems(data.items);
    } catch (err: any) {
      // AbortError é esperado quando cancelamos a request anterior
      if (err?.name === 'AbortError') return;

      setError(err?.message ?? 'Erro inesperado.');
    } finally {
      // Só limpar o loading se essa ainda é a request ativa
      if (requestId === lastRequestIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  // -------------------------------------------------------
  // Debounce da busca (digitação do usuário)
  // - Cancela o timer anterior
  // - Opcionalmente, busca imediata quando query vazia
  // -------------------------------------------------------
  React.useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // regra: se query vazia, limpa lista e não chama API
    if (!query.trim()) {
      setRawItems([]);
      setError(null);
      setLoading(false);
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchProducts(query);
    }, 400); // 400~600ms é bom para busca

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [query]);

  // Cancela qualquer request ao desmontar o componente (boa prática)
  React.useEffect(() => {
    return () => controllerRef.current?.abort();
  }, []);

  // -------------------------------------------------------
  // useMemo: derivar lista final (filtrada/ordenada) sem recalcular sempre
  // -------------------------------------------------------
  const brands = React.useMemo(() => {
    // lista de marcas disponíveis (derivada dos itens crus)
    const set = new Set<string>();
    rawItems.forEach(p => p.brand && set.add(p.brand));
    return ['all', ...Array.from(set).sort()];
  }, [rawItems]);

  const visibleItems = React.useMemo(() => {
    let list = rawItems;

    // filtro por marca
    if (brandFilter !== 'all') {
      list = list.filter(p => (p.brand ?? '').toLowerCase() === brandFilter.toLowerCase());
    }

    // ordenações comuns
    if (sortBy === 'price') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'stock') {
      list = [...list].sort((a, b) => b.stock - a.stock);
    } else {
      // "relevance": exemplo simples — prioriza quem contém exatamente a query no título
      const q = query.trim().toLowerCase();
      list = [...list].sort((a, b) => {
        const aScore =
          Number(a.title.toLowerCase() === q) +
          Number(a.title.toLowerCase().includes(q));
        const bScore =
          Number(b.title.toLowerCase() === q) +
          Number(b.title.toLowerCase().includes(q));
        return bScore - aScore;
      });
    }

    return list;
  }, [rawItems, sortBy, brandFilter, query]);

  // -------------------------------------------------------
  // Callback estável para item (passado a filho memoizado)
  // -------------------------------------------------------
  const handleAddToCart = React.useCallback((p: Product) => {
    // aqui você chamaria seu contexto/carrinho
    console.log('add to cart:', p.id);
  }, []);

  return (
    <div style={{ maxWidth: 920, margin: '40px auto', padding: 16 }}>
      <h1>Busca de Produtos</h1>

      {/* Barra de busca */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
        <input
          ref={inputRef}
          value={query}
          onChange={handleChange}
          placeholder="Busque por título..."
          style={{ flex: 1, padding: '10px 12px' }}
        />

        <select value={sortBy} onChange={handleSortChange} aria-label="Ordenar por">
          <option value="relevance">Relevância</option>
          <option value="price">Preço (↑)</option>
          <option value="stock">Estoque (↓)</option>
        </select>

        <select value={brandFilter} onChange={handleBrandChange} aria-label="Marca">
          {brands.map(b => (
            <option key={b} value={b}>{b === 'all' ? 'Todas as marcas' : b}</option>
          ))}
        </select>
      </div>

      {/* Estados de UI */}
      {loading && <p>Carregando…</p>}
      {error && <p style={{ color: 'tomato' }}>Erro: {error}</p>}
      {!loading && !error && query && visibleItems.length === 0 && (
        <p>Nenhum produto encontrado para “{query}”.</p>
      )}

      {/* Lista */}
      <ul style={{ listStyle: 'none', padding: 0, marginTop: 16, display: 'grid', gap: 12 }}>
        {visibleItems.map(p => (
          <ProductRow key={p.id} product={p} onAdd={handleAddToCart} />
        ))}
      </ul>
    </div>
  );
}

/** Componente de item memoizado (evita re-render se props não mudarem) */
const ProductRow = React.memo(function ProductRow({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (p: Product) => void;
}) {
  // Exemplo: formatar preço (poderia ser um useMemo se complexificar)
  const priceBRL = (product.price / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return (
    <li
      style={{
        border: '1px solid #3333',
        borderRadius: 8,
        padding: 12,
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <div>
        <strong>{product.title}</strong>
        <div style={{ fontSize: 12, opacity: 0.8 }}>
          Marca: {product.brand ?? '—'} · Estoque: {product.stock}
        </div>
      </div>

      <div style={{ textAlign: 'right' }}>
        <div>{priceBRL}</div>
        <button style={{ marginTop: 6 }} onClick={() => onAdd(product)}>
          Adicionar
        </button>
      </div>
    </li>
  );
});
