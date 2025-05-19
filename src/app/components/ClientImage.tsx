'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function ClientImage(props) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Se ainda não montou no cliente, renderiza um espaço reservado
  if (!hasMounted) {
    return (
      <div 
        style={{ 
          width: props.width || '100%', 
          height: props.height || '100%',
          backgroundColor: '#f0f0f0'
        }}
      />
    );
  }

  // Após a montagem do componente no cliente, renderiza a imagem
  return <Image {...props} unoptimized={true} />;
} 