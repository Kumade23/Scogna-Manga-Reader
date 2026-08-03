import { useState, useEffect } from 'react';

const Settings = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className="page-container explore-page">
      <div className="explore-header">
        <h2>Settings</h2>
      </div>

      <div className="settings-content" style={{ maxWidth: '600px' }}>
        <div className="setting-group" style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>App Theme</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '14px' }}>Choose your preferred color theme for the app.</p>
          <div className="btn-group" style={{ maxWidth: '300px', display: 'flex', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
            <button 
              style={{ flex: 1, padding: '12px', background: theme === 'dark' ? 'var(--accent-primary)' : 'transparent', color: theme === 'dark' ? 'white' : 'var(--text-secondary)', borderRadius: 'var(--radius-sm)' }} 
              onClick={() => setTheme('dark')}
            >
              Dark Mode
            </button>
            <button 
              style={{ flex: 1, padding: '12px', background: theme === 'light' ? 'var(--accent-primary)' : 'transparent', color: theme === 'light' ? 'white' : 'var(--text-secondary)', borderRadius: 'var(--radius-sm)' }} 
              onClick={() => setTheme('light')}
            >
              Light Mode
            </button>
          </div>
        </div>
        
        <div className="setting-group" style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Reader Preferences</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '14px' }}>Default settings for the reader (like Right-to-Left, Left-to-Right, or Scroll) can be adjusted directly within the reader menu by tapping the gear icon.</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
