
import { searchComics } from './src/actions/comic';

async function testActions() {
  console.log('--- Testing searchComics ---');
  const results = await searchComics({ source: 'archive', query: 'spider-man' });
  console.log(`Archive search for "spider-man": ${results.items.length} items`);
  if (results.items.length > 0) {
    console.log(`First result: ${results.items[0].title}`);
    // Check if filtering worked (no Thesis/Journal)
    const noiseFound = results.items.some(i => i.title.toLowerCase().includes('thesis') || i.title.toLowerCase().includes('journal'));
    console.log(`Noise filtering check: ${noiseFound ? '❌ FAILED (Noise found)' : '✅ PASSED (Clean)'}`);
  }
}

testActions().catch(console.error);
