import { useEffect, useMemo, useRef, useState } from 'react';
import { search } from '../services/search.service';
import { SearchResult } from '../types/search';

export function useSearch(minLength = 4) {
  const [term, setTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const ctrl = useRef<AbortController | null>(null);

  const canSearch = term.trim().length >= minLength;
  const debounced = useMemo(() => term.trim(), [term]); // junto com useDebouncedValue, se quiser

  useEffect(() => {
    if (!canSearch) { setResults([]); if (ctrl.current) ctrl.current.abort(); return; }
    ctrl.current?.abort();
    const c = new AbortController();
    ctrl.current = c;
    setLoading(true);
    search(debounced, c.signal)
      .then(setResults)
      .catch((e) => { if (e.name !== 'AbortError') console.error(e); })
      .finally(() => setLoading(false));
    return () => c.abort();
  }, [debounced, canSearch]);

  return { term, setTerm, results, loading, clear: () => setResults([]), canSearch };
}
