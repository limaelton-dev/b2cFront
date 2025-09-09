
'use client';

import Link from 'next/link';
import Image from 'next/image';
import NoImage from '../../../assets/img/noimage.png';
import { SearchResult } from '../../../types/search';

type Props = {
  id?: string;
  results: SearchResult[];
  onClose: () => void;
};

export default function SearchResults({ id, results, onClose }: Props) {
  const base = process.env.NEXT_PUBLIC_URL || '';

  const resolveImage = (r: SearchResult) =>
    r.img || (r.imagens && r.imagens[0]?.url) || NoImage;

  return (
    <div className="result-search" id={id} role="listbox">
      <ul>
        {results.slice(0, 10).map((r) => (
          <li key={r.id} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: 50, height: 50, marginRight: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* ClientImage pode ser trocado por Image se preferir */}
              <Image
                src={resolveImage(r)}
                alt={r.pro_desc_tecnica}
                width={50}
                height={50}
                style={{ objectFit: 'contain' }}
              />
            </div>
            <Link
              className="search-product-link"
              href={`${base}/produto/${r.id}`}
              style={{ textDecoration: 'none', color: 'black', display: 'flex', flexGrow: 1, justifyContent: 'space-between', height: 50, alignItems: 'center' }}
              target="_blank"
            >
              {r.pro_desc_tecnica}
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
