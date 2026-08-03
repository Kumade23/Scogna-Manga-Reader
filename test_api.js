const fetch = require('node-fetch');

async function test() {
  const res = await fetch('http://backend.mangaio.it:9999/api/advanced_search?keyword=jujutsu', {
    headers: { 'x-email': 'null' }
  });
  const data = await res.json();
  const manga = data.list[0];
  console.log("Manga:", manga.id, manga.slugFolder, manga.linkId);

  const infoRes = await fetch(`http://backend.mangaio.it:9999/api/info/${manga.linkId}/${manga.slugFolder}`, {
    headers: { 'x-email': 'null' }
  });
  const infoData = await infoRes.json();
  
  const ch = infoData.pages.volumes[0].chapters[0];
  const vol = infoData.pages.volumes[0].volume;
  const page = ch.pages[0];
  
  const mangaPart = `${manga.slugFolder}-${manga.id}`;
  const chapterPart = `${ch.slugFolder}-${ch._id}`;
  const volPart = `${vol.slugFolder}-${vol._id}`;
  const url = `https://cdn.mangaworld.mx/chapters/${mangaPart}/${volPart}/${chapterPart}/${page}`;
  
  console.log("URL:", url);
  
  const imgRes = await fetch(url, { method: 'HEAD' });
  console.log("Image Status:", imgRes.status);
}
test().catch(console.error);
