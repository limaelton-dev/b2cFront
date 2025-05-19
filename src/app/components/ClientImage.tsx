'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function ClientImage(props) {
  const [hasMounted, setHasMounted] = useState(false);
  
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Extrair propriedades específicas do Next.js Image
  const { width, height, style, src, alt, priority, ...otherProps } = props;
  
  // Remova o prop layout se existir
  const safeProps = { ...otherProps };
  if ('layout' in safeProps) {
    delete safeProps.layout;
  }

  // Sempre renderiza a Image com unoptimized=true
  // Isso garante o mesmo output no servidor e no cliente
  return (
    <div style={{ 
      position: 'relative',
      width: width || '100%', 
      height: height || 'auto',
      overflow: 'hidden',
      ...style
    }}>
      <Image
        src={src}
        alt={alt || "Imagem"}
        fill={!width || !height}
        width={width}
        height={height}
        unoptimized={true}
        priority={priority || false}
        loading={priority ? "eager" : "lazy"}
        style={{ 
          objectFit: 'contain',
          opacity: hasMounted ? 1 : 0,
          transition: 'opacity 0.2s'
        }}
        {...safeProps}
      />
    </div>
  );
} 