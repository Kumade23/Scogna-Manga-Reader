import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';

const Library = () => {
  const { library } = useStore();
  const navigate = useNavigate();

  return (
    <div className="page-container explore-page">
      <div className="explore-header">
        <h2>My Library</h2>
      </div>

      <div className="manga-grid">
        {library.map((manga) => (
          <div 
            key={manga.id} 
            className="manga-card"
            onClick={() => navigate(`/series/${manga.linkId}/${manga.slugFolder}`)}
          >
            <div className="manga-cover">
              <img src={manga.image} alt={manga.title} loading="lazy" decoding="async" />
            </div>
            <div className="manga-info">
              <h3>{manga.title}</h3>
            </div>
          </div>
        ))}
        {library.length === 0 && (
          <div className="empty-state">Your library is empty.</div>
        )}
      </div>
    </div>
  );
};

export default Library;
