
'use client';

import Link from 'next/link';
import Image from 'next/image';
import NoImage from '../../../assets/img/noimage.png';
import { Product } from '../../../api/products/types/product';

type Props = {
  id?: string;
  results: Product[];
  onClose: () => void;
};

export default function SearchResults({ id, results, onClose }: Props) {
  const base = process.env.NEXT_PUBLIC_URL || '';

  const resolveImage = (r: Product) => {
    if (r.images && r.images.length > 0 && r.images[0].url) {
      return r.images[0].url;
    }
    return NoImage;
  };

  return (
    <div className="result-search" id={id} role="listbox">
      <ul>
        {results.slice(0, 10).map((r) => (
          <li key={r.id} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: 50, height: 50, marginRight: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Image
                src={resolveImage(r)}
                alt={r.title}
                width={50}
                height={50}
                style={{ objectFit: 'contain' }}
                onError={(e) => {
                  e.currentTarget.src = NoImage.src;
                }}
              />
            </div>
            <Link
              className="search-product-link"
              href={`${base}/produto/${r.slug}`}
              style={{ textDecoration: 'none', color: 'black', display: 'flex', flexGrow: 1, justifyContent: 'space-between', height: 50, alignItems: 'center' }}
              target="_blank"
            >
              {r.title}
            </Link>
          </li>
        ))}

        {results.length > 10 && (
          <li>
            <button onClick={onClose} className="link-button">Fechar</button>
          </li>
        )}
      </ul>
    </div>
  );
}
