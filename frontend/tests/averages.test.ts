import { fetchAverages, saveSnapshotToCanister } from '../lib/aptosAgent.js';

(async function(){
  try {
    const before = await fetchAverages();
    await saveSnapshotToCanister({
      timestamp: BigInt(Date.now()),
      deviceId: 'AVG-TEST',
      location: 'Lab',
      tds: { value: 42, unit: 'ppm' },
      ph: { value: 7.1, unit: '' },
      turbidity: { value: 0.7, unit: 'NTU' }
    });
    const after = await fetchAverages();
    if (after.count < before.count + 1) throw new Error('Averages count did not increase');
    if (after.avgTds === before.avgTds && after.count === before.count) throw new Error('Averages not updated');
    console.log('averages.test.ts passed', { before, after });
  } catch(e) {
    console.error('averages test failed', e);
    process.exit(1);
  }
})();
