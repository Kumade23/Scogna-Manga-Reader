import { HardDrive, Trash2 } from 'lucide-react';
import { useStore } from '../store';

const Downloads = () => {
  const { downloads, removeDownload } = useStore();

  return (
    <div className="page-container explore-page">
      <div className="explore-header">
        <h2>Downloads</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Read your favorite manga offline without connection.</p>
      </div>

      {downloads.length === 0 ? (
        <div className="empty-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginTop: '64px' }}>
          <HardDrive size={64} color="var(--bg-hover)" />
          <p>No chapters downloaded yet.</p>
          <p style={{ fontSize: '14px', maxWidth: '400px', lineHeight: '1.6' }}>Downloads will be stored securely in your browser's local cache. You can manage your storage space from here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {downloads.map(item => (
            <div key={item.id} className="glass-panel" style={{ padding: '16px', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '16px' }}>{item.title}</h4>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>{item.mangaTitle} • {item.type}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {item.progress < 100 ? (
                  <span style={{ fontSize: '13px', color: 'var(--accent-primary)', fontWeight: 600 }}>Downloading...</span>
                ) : (
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Downloaded</span>
                )}
                <button onClick={() => removeDownload(item.id)} style={{ padding: '8px', color: 'var(--accent-primary)' }}>
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Downloads;
