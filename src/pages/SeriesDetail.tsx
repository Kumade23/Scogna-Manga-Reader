import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMangaInfo, type MangaInfo, type Chapter } from '../api';
import { useStore } from '../store';
import { Play, ArrowLeft, Bookmark, Check, Download } from 'lucide-react';
import './SeriesDetail.css';

const SeriesDetail = () => {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const [info, setInfo] = useState<MangaInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const { isInLibrary, toggleLibrary, addDownload, isDownloaded, getHistory } = useStore();
  const h = info ? getHistory(info.manga.id) : null;

  useEffect(() => {
    if (!id || !slug) return;
    setLoading(true);
    getMangaInfo(id, slug)
      .then(data => setInfo(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, slug]);

  if (loading) return (
    <div className="series-detail-page">
      <div className="series-hero skeleton-pulse"></div>
      <div className="page-container series-content">
        <div className="series-header">
          <div className="series-cover skeleton-pulse" style={{ borderRadius: '8px' }}></div>
          <div className="series-info" style={{ width: '100%' }}>
            <div className="skeleton-pulse skeleton-text title" style={{ height: '40px', marginBottom: '16px' }}></div>
            <div className="skeleton-pulse skeleton-text" style={{ width: '40%' }}></div>
            <div className="skeleton-pulse skeleton-text" style={{ width: '30%' }}></div>
            <div style={{ marginTop: '24px' }}></div>
            <div className="skeleton-pulse skeleton-text" style={{ width: '100%' }}></div>
            <div className="skeleton-pulse skeleton-text" style={{ width: '100%' }}></div>
            <div className="skeleton-pulse skeleton-text" style={{ width: '80%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
  if (!info) return <div className="page-container error">Series not found.</div>;

  const { manga, pages } = info;
  const allVolumes = pages.volumes || [];
  const singleChapters = pages.singleChapters || [];

  return (
    <div className="series-detail-page">
      <button className="back-button" onClick={() => {
        try {
          if (window.history.length > 2) {
            navigate(-1);
          } else {
            navigate('/');
          }
        } catch (e) {
          navigate('/');
        }
      }}>
        <ArrowLeft size={24} />
      </button>

      <div className="series-hero" style={{ backgroundImage: `url(${manga.image})` }}>
        <div className="hero-overlay"></div>
      </div>

      <div className="page-container series-content">
        <div className="series-header">
          <div className="series-cover">
            <img src={manga.image} alt={manga.title} loading="eager" decoding="async" fetchPriority="high" />
          </div>
          <div className="series-info">
            <h1>{manga.title}</h1>
            <div className="series-meta">
              <span className="status">{manga.status}</span>
              <span className="chapters">{manga.chaptersCount} Chapters</span>
            </div>
            <p className="description">{manga.description}</p>
            <div className="genres">
              {manga.genres.map(g => (
                <span key={g.name} className="genre-tag">{g.name}</span>
              ))}
            </div>
            <div className="actions">
              <button className="btn-primary" onClick={() => {
                if (h) {
                  navigate(`/read/${manga.linkId}/${manga.slugFolder}/${h.chapterId}`);
                } else {
                  const firstChapter = allVolumes.length > 0 ? allVolumes[0].chapters[0] : singleChapters[0];
                  if (firstChapter) {
                    navigate(`/read/${manga.linkId}/${manga.slugFolder}/${firstChapter._id || firstChapter.id}`);
                  }
                }
              }}>
                <Play size={18} fill="currentColor" />
                {h ? 'Continue Reading' : 'Start Reading'}
              </button>
              <button className={`btn-secondary ${isInLibrary(manga.id) ? 'active' : ''}`} onClick={() => toggleLibrary(manga)}>
                {isInLibrary(manga.id) ? <Check size={18} /> : <Bookmark size={18} />}
                {isInLibrary(manga.id) ? 'In Library' : 'Add to Library'}
              </button>
              <button 
                className={`btn-secondary ${isDownloaded(manga.id) ? 'active' : ''}`} 
                onClick={() => !isDownloaded(manga.id) && addDownload({ id: manga.id, type: 'manga', title: 'Entire Series', mangaTitle: manga.title, progress: 0 })}
                disabled={isDownloaded(manga.id)}
                style={isDownloaded(manga.id) ? { opacity: 0.7, cursor: 'default' } : {}}
              >
                {isDownloaded(manga.id) ? <Check size={18} /> : <Download size={18} />} 
                {isDownloaded(manga.id) ? 'Downloaded' : 'Download'}
              </button>
            </div>
          </div>
        </div>

        <div className="chapter-list-section">
          <h2>Chapters</h2>
          {allVolumes.map(({ volume, chapters }) => (
            <div key={volume._id} className="volume-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0 }}>{volume.name}</h3>
                <button 
                  className={`btn-secondary ${isDownloaded(volume._id) ? 'active' : ''}`} 
                  style={{ padding: '8px 16px', fontSize: '12px', opacity: isDownloaded(volume._id) ? 0.7 : 1, cursor: isDownloaded(volume._id) ? 'default' : 'pointer' }} 
                  onClick={() => !isDownloaded(volume._id) && addDownload({ id: volume._id, type: 'volume', title: volume.name, mangaTitle: manga.title, progress: 0 })}
                  disabled={isDownloaded(volume._id)}
                >
                  {isDownloaded(volume._id) ? <Check size={14} /> : <Download size={14} />} 
                  {isDownloaded(volume._id) ? 'Downloaded' : 'Download Volume'}
                </button>
              </div>
              <div className="chapter-grid">
                {chapters.map((ch: Chapter) => (
                  <div key={ch._id} className="chapter-item" onClick={() => navigate(`/read/${manga.linkId}/${manga.slugFolder}/${ch._id || ch.id}`)}>
                    <div className="chapter-content">
                      <span className="chapter-name">{ch.name}</span>
                      <span className="chapter-date">{ch.createdAtTWithYear}</span>
                    </div>
                    <button 
                      className="chapter-download-btn" 
                      style={isDownloaded(ch._id || ch.id || '') ? { cursor: 'default' } : {}}
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        if (!isDownloaded(ch._id || ch.id || '')) {
                          addDownload({ id: ch._id || ch.id || '', type: 'chapter', title: ch.name, mangaTitle: manga.title, progress: 0 }); 
                        }
                      }}
                      disabled={isDownloaded(ch._id || ch.id || '')}
                    >
                      {isDownloaded(ch._id || ch.id || '') ? <Check size={18} color="var(--accent-primary)" /> : <Download size={18} />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {singleChapters.length > 0 && (
            <div className="volume-group">
              <h3>Single Chapters</h3>
              <div className="chapter-grid">
                {singleChapters.map((ch: Chapter) => (
                  <div key={ch._id} className="chapter-item" onClick={() => navigate(`/read/${manga.linkId}/${manga.slugFolder}/${ch._id || ch.id}`)}>
                    <div className="chapter-content">
                      <span className="chapter-name">{ch.name}</span>
                      <span className="chapter-date">{ch.createdAtTWithYear}</span>
                    </div>
                    <button 
                      className="chapter-download-btn" 
                      style={isDownloaded(ch._id || ch.id || '') ? { cursor: 'default' } : {}}
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        if (!isDownloaded(ch._id || ch.id || '')) {
                          addDownload({ id: ch._id || ch.id || '', type: 'chapter', title: ch.name, mangaTitle: manga.title, progress: 0 }); 
                        }
                      }}
                      disabled={isDownloaded(ch._id || ch.id || '')}
                    >
                      {isDownloaded(ch._id || ch.id || '') ? <Check size={18} color="var(--accent-primary)" /> : <Download size={18} />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeriesDetail;
