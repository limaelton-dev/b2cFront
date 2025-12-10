'use client';

import { useEffect, useState } from 'react';

// Este componente garante que seu children só serão renderizados no lado cliente
// Isso evita erros de hidratação quando há diferenças entre o que é renderizado no servidor e no cliente
export default function ClientOnly({ children, ...delegated }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Não renderiza nada durante a primeira renderização no servidor
  if (!hasMounted) {
    return null;
  }

  // Após a montagem do componente no cliente, renderiza o conteúdo
  return <>{children}</>;
} 