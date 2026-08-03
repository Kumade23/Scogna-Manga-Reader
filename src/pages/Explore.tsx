import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { searchManga, type MangaResult } from '../api';
import './Explore.css';

const Explore = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MangaResult[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        setLoading(true);
        searchManga(query)
          .then(data => setResults(data))
          .catch(console.error)
          .finally(() => setLoading(false));
      } else {
        setResults([]);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="page-container explore-page">
      <div className="explore-header">
        <h2>Explore</h2>
        <form onSubmit={handleSearch} className="search-bar">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search manga, webtoons, comics..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      <div className="manga-grid">
        {loading ? (
          // Render skeleton cards while loading
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="manga-card skeleton-card">
              <div className="manga-cover skeleton-pulse"></div>
              <div className="manga-info">
                <div className="skeleton-pulse skeleton-text title"></div>
                <div className="skeleton-pulse skeleton-text genre"></div>
              </div>
            </div>
          ))
        ) : (
          results.map((manga) => (
            <div 
              key={manga.id} 
              className="manga-card"
              onClick={() => navigate(`/series/${manga.linkId}/${manga.slugFolder}`)}
            >
              <div className="manga-cover">
                <img src={manga.image} alt={manga.title} loading="lazy" decoding="async" />
                <div className="manga-status">{manga.status}</div>
              </div>
              <div className="manga-info">
                <h3>{manga.title}</h3>
                <p>{manga.genres.map(g => g.name).join(', ')}</p>
              </div>
            </div>
          ))
        )}
        {!loading && results.length === 0 && query && (
          <div className="empty-state">No results found for "{query}".</div>
        )}
        {!loading && results.length === 0 && !query && (
          <div className="empty-state">Search for manga, webtoons, or comics to get started!</div>
        )}
      </div>
    </div>
  );
};

export default Explore;
