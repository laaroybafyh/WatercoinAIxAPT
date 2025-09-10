import { fetchHealth } from '../lib/aptosAgent.js';

(async function(){
  try {
    const h = await fetchHealth();
    if (!h.version) throw new Error('health missing version');
    if (!h.network) throw new Error('health missing network');
    if (!h.address) throw new Error('health missing address');
    console.log('health.test.ts passed', h);
  } catch(e){
    console.error('health test failed', e);
    process.exit(1);
  }
})();
