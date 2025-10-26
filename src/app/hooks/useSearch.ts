import { useEffect, useMemo, useRef, useState } from 'react';
import { fetchProductsByTerm } from '../api/products/services/product';
import { Product } from '../api/products/types/product';

export function useSearch(minLength = 4) {
  const [term, setTerm] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const ctrl = useRef<AbortController | null>(null);

  const canSearch = term.trim().length >= minLength;
  const debounced = useMemo(() => term.trim(), [term]);

  useEffect(() => {
    if (!canSearch) { setResults([]); if (ctrl.current) ctrl.current.abort(); return; }
    ctrl.current?.abort();
    const c = new AbortController();
    ctrl.current = c;
    setLoading(true);
    fetchProductsByTerm(debounced)
      .then((data) => {
        setResults(data.items);
      })
      .catch((e) => { if (e.name !== 'AbortError') console.error(e); })
      .finally(() => setLoading(false));
    return () => c.abort();
  }, [debounced, canSearch]);

  return { term, setTerm, results, loading, clear: () => setResults([]), canSearch };
}
