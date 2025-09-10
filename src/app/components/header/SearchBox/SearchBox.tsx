"use client";

import { useRef } from "react";
import { useSearch } from "../../../hooks/useSearch";
import SearchResults from "./SearchResults";

type Props = {
  onSubmit: (term: string) => void;
};

export default function SearchBox({ onSubmit }: Props) {
  const { term, setTerm, results, loading, canSearch, clear } = useSearch(4);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSubmit(term);
  };

  return (
    <div className="search">
      <div className="content-search">
        <div role="search" className="d-flex">
          <select
            name="categorias"
            id="categorias-search"
            aria-label="Categorias"
          >
            <option value="all" defaultValue="all">
              Todas categorias
            </option>
          </select>
          <input 
            ref={inputRef}
            type="text"
            id="search"
            value={term}
            onKeyDown={handleEnter}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Buscar produtos"
            aria-autocomplete="list"
            aria-controls="search-results"
          />
          <button
            type="button"
            onClick={() => onSubmit(term)}
            aria-label="Buscar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#fff"
            >
              <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
            </svg>
          </button>
        </div>

        {canSearch && results.length > 0 && (
          <SearchResults
            id="search-results"
            results={results}
            onClose={clear}
          />
        )}

        {loading && <div className="result-search">Buscando…</div>}
      </div>
    </div>
  );
}
