import { addSurvey, getSurveys } from '../lib/aptosAgent.js';

(async function(){
  try {
    const before = await getSurveys(50);
    const idx = await addSurvey('neutral');
    const after = await getSurveys(50);
    if (after.length < before.length + 1) throw new Error('Survey not appended');
    console.log('Survey test passed. Count before/after:', before.length, after.length, 'lastIdx', idx);
  } catch(e) {
    console.error('Survey test failed', e);
    process.exit(1);
  }
})();
