import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import LaunchIcon from '@mui/icons-material/Launch';
import Image from 'next/image';
import NoImage from '../../assets/img/noimage.png';
import { useSearch } from '../../hooks/useSearch';
import { useRouter } from 'next/navigation';

const URL = process.env.NEXT_PUBLIC_URL || '';

export default function SearchBar() {
  const router = useRouter();
  const { term, results, changeSearch, handleSearchSubmit } = useSearch();

  return (
    <div className="search">
      <div className="content-search">
        <form onSubmit={handleSearchSubmit}>
          <select name="categorias" id="categorias-search">
            <option value="1">Todas categorias</option>
            <option value="2">Categoria 1</option>
          </select>
          <input type="text" id="search" value={term} onChange={changeSearch} />
          <button type="submit">
            <SearchIcon />
          </button>
        </form>
        {results.length > 0 && (
          <div className="result-search">
            <ul>
              {results.map((result) => (
                <li key={result.id} style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '50px', height: '50px', marginRight: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                      src={result.img || (result.imagens && result.imagens.length > 0 ? result.imagens[0].url : NoImage)}
                      alt={result.pro_desc_tecnica || ''}
                      width={50}
                      height={50}
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <a target="_blank" className='search-product-link' style={{ textDecoration: 'none', color: 'black', flexGrow: '1', display: 'flex', justifyContent: 'space-between', height: '50px', alignItems: 'center' }} href={`${URL}/produto/${result.id}`}>
                    {result.pro_desc_tecnica || ''}
                    <LaunchIcon sx={{ width: '18px' }} />
                  </a>
                </li>
              ))}
              {results.length > 5 && (
                <li>
                  <a href={`/produtos?s=${term}`}>Veja mais resultados</a>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}