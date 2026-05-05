
const { fetchTrendingAniListManga } = require('./src/lib/anilist');

async function debug() {
  console.log('Testing fetchTrendingAniListManga...');
  try {
    const items = await fetchTrendingAniListManga(5);
    console.log('Success! Found items:', items.length);
    console.log('First item title:', items[0]?.title?.userPreferred);
  } catch (e) {
    console.error('Failed:', e);
  }
}

debug();
