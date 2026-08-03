import { useState, useEffect } from 'react';

export interface SavedManga {
  id: string;
  linkId: number | string;
  slugFolder: string;
  title: string;
  image: string;
  addedAt: number;
}

export interface HistoryEntry {
  mangaId: string;
  linkId: number | string;
  slugFolder: string;
  title: string;
  image: string;
  chapterId: string;
  chapterName: string;
  page: number;
  readAt: number;
}

export interface DownloadedItem {
  id: string; // chapterId or volumeId or mangaId
  type: 'chapter' | 'volume' | 'manga';
  title: string;
  mangaTitle: string;
  progress: number;
}

export const useStore = () => {
  const [library, setLibrary] = useState<SavedManga[]>(() => {
    try { return JSON.parse(localStorage.getItem('manga-library') || '[]'); } catch { return []; }
  });
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    try { return JSON.parse(localStorage.getItem('manga-history') || '[]'); } catch { return []; }
  });
  const [downloads, setDownloads] = useState<DownloadedItem[]>(() => {
    try { return JSON.parse(localStorage.getItem('manga-downloads') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('manga-library', JSON.stringify(library));
  }, [library]);

  useEffect(() => {
    localStorage.setItem('manga-history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('manga-downloads', JSON.stringify(downloads));
  }, [downloads]);

  const toggleLibrary = (manga: Omit<SavedManga, 'addedAt'>) => {
    setLibrary(prev => {
      const exists = prev.find(m => m.id === manga.id);
      if (exists) return prev.filter(m => m.id !== manga.id);
      return [{ ...manga, addedAt: Date.now() }, ...prev];
    });
  };

  const isInLibrary = (id: string) => library.some(m => m.id === id);

  const saveHistory = (entry: Omit<HistoryEntry, 'readAt'>) => {
    setHistory(prev => {
      const filtered = prev.filter(h => h.mangaId !== entry.mangaId);
      return [{ ...entry, readAt: Date.now() }, ...filtered].slice(0, 100);
    });
  };

  const getHistory = (mangaId: string) => history.find(h => h.mangaId === mangaId);

  const removeHistory = (mangaId: string) => {
    setHistory(prev => prev.filter(h => h.mangaId !== mangaId));
  };

  const addDownload = (item: DownloadedItem) => {
    setDownloads(prev => {
      if (prev.find(d => d.id === item.id)) return prev;
      return [...prev, item];
    });
    // Simulate download progress
    setTimeout(() => {
      setDownloads(prev => prev.map(d => d.id === item.id ? { ...d, progress: 100 } : d));
    }, 2000);
  };
  
  const removeDownload = (id: string) => {
    setDownloads(prev => prev.filter(d => d.id !== id));
  };

  const isDownloaded = (id: string) => downloads.some(d => d.id === id);

  return { library, toggleLibrary, isInLibrary, history, saveHistory, getHistory, removeHistory, downloads, addDownload, removeDownload, isDownloaded };
};
