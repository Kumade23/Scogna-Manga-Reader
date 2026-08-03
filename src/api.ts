const API_BASE = '/api';

export interface MangaResult {
  id: string;
  linkId: number;
  slug: string;
  slugFolder: string;
  title: string;
  image: string;
  description: string;
  genres: Array<{ name: string }>;
  status: string;
  chaptersCount: number;
}

export interface Chapter {
  _id: string;
  id?: string;
  name: string;
  slugFolder: string;
  pages: string[];
  createdAtTWithYear: string;
  volume?: Volume;
}

export interface Volume {
  _id: string;
  id?: string;
  name: string;
  slugFolder: string;
}

export interface MangaInfo {
  manga: MangaResult;
  pages: {
    volumes: Array<{ volume: Volume; chapters: Chapter[] }>;
    singleChapters: Chapter[];
  };
}

export async function searchManga(keyword: string): Promise<MangaResult[]> {
  const res = await fetch(`${API_BASE}/advanced_search?keyword=${encodeURIComponent(keyword)}`, {
    headers: {
      'x-email': 'null'
    }
  });
  if (!res.ok) throw new Error('Failed to fetch search results');
  const data = await res.json();
  return data.list || [];
}

export async function getMangaInfo(linkId: string | number, slug: string): Promise<MangaInfo> {
  const res = await fetch(`${API_BASE}/info/${linkId}/${slug}`, {
    headers: {
      'x-email': 'null'
    }
  });
  if (!res.ok) throw new Error('Failed to fetch manga info');
  const data = await res.json();
  
  // Ensure volumes and chapters are ordered chronologically (oldest first)
  if (data.pages) {
    if (data.pages.volumes && Array.isArray(data.pages.volumes)) {
      data.pages.volumes.reverse();
      data.pages.volumes.forEach((vol: any) => {
        if (vol.chapters && Array.isArray(vol.chapters)) {
          vol.chapters.reverse();
          vol.chapters.forEach((ch: any) => {
            ch.volume = vol.volume;
          });
        }
      });
    }
    if (data.pages.singleChapters && Array.isArray(data.pages.singleChapters)) {
      data.pages.singleChapters.reverse();
    }
  }

  return data;
}

export function getPageImageUrl(manga: MangaResult, chapter: Chapter, pageFileName: string): string {
  const mangaPart = `${manga.slugFolder}-${manga.id}`;
  const chapterPart = `${chapter.slugFolder}-${chapter._id || chapter.id}`;
  
  if (chapter.volume) {
    const volId = chapter.volume._id || chapter.volume.id;
    const volPart = `${chapter.volume.slugFolder}-${volId}`;
    return `https://cdn.mangaworld.mx/chapters/${mangaPart}/${volPart}/${chapterPart}/${pageFileName}`;
  }
  
  // Fallback for single chapters (guessing structure)
  return `https://cdn.mangaworld.mx/chapters/${mangaPart}/${chapterPart}/${pageFileName}`;
}
