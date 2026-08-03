import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Clock, Trash2 } from 'lucide-react';

const History = () => {
  const { history, removeHistory } = useStore();
  const navigate = useNavigate();

  return (
    <div className="page-container explore-page">
      <div className="explore-header">
        <h2>Reading History</h2>
      </div>

      <div className="manga-grid">
        {history.map((entry) => (
          <div 
            key={entry.mangaId} 
            className="manga-card"
            onClick={() => navigate(`/read/${entry.linkId}/${entry.slugFolder}/${entry.chapterId}`)}
          >
            <div className="manga-cover">
              <img src={entry.image} alt={entry.title} loading="lazy" decoding="async" />
              <div className="manga-status" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <Clock size={12} />
                {new Date(entry.readAt).toLocaleDateString()}
              </div>
            </div>
            <div className="manga-info" style={{ position: 'relative' }}>
              <h3>{entry.title}</h3>
              <p>{entry.chapterName} - Page {entry.page + 1}</p>
              <button 
                onClick={(e) => { e.stopPropagation(); removeHistory(entry.mangaId); }} 
                style={{ position: 'absolute', top: 0, right: '8px', padding: '8px', color: 'var(--text-tertiary)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                title="Remove from history"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {history.length === 0 && (
          <div className="empty-state">Your history is empty.</div>
        )}
      </div>
    </div>
  );
};

export default History;
