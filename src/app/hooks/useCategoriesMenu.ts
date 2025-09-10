
import { useEffect, useRef, useState } from 'react';
import { fetchCategoryMenu } from '../services/category.service';
import { Category } from '../types/category';

export function useCategoriesMenu() {
  const [tree, setTree] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const ctrl = useRef<AbortController | null>(null);

  useEffect(() => {
    ctrl.current?.abort();
    const c = new AbortController();
    ctrl.current = c;
    setLoading(true);
    fetchCategoryMenu(c.signal)
      .then(setTree)
      .catch((e) => { if (e.name !== 'AbortError') console.error(e); })
      .finally(() => setLoading(false));
    return () => c.abort();
  }, []);

  return { tree, loading };
}
