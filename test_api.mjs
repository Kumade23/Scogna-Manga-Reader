import { getMangaInfo, searchManga, getPageImageUrl } from './src/api.js';

async function testManga(keyword) {
  try {
    const list = await searchManga(keyword);
    const manga = list.find(x => x.title.toLowerCase().includes(keyword.toLowerCase())) || list[0];
    if (!manga) return console.log('Not found:', keyword);
    
    console.log(`\n--- ${manga.title} ---`);
    const info = await getMangaInfo(manga.linkId, manga.slug);
    
    let sampleChapter;
    if (info.pages.volumes && info.pages.volumes.length > 0) {
      console.log('Uses Volumes');
      sampleChapter = info.pages.volumes[0].chapters[0];
    } else if (info.pages.singleChapters && info.pages.singleChapters.length > 0) {
      console.log('Uses Single Chapters');
      sampleChapter = info.pages.singleChapters[0];
    }
    
    if (sampleChapter) {
      const url = getPageImageUrl(info.manga, sampleChapter, sampleChapter.pages[0]);
      console.log('Sample URL:', url);
      
      const res = await fetch(url, { method: 'HEAD', headers: { 'referer': 'https://www.mangaworld.mx/' } });
      console.log('Status:', res.status);
    }
  } catch (err) {
    console.error(err);
  }
}

async function run() {
  await testManga('aku no hana');
  await testManga('solo leveling');
}
run();
