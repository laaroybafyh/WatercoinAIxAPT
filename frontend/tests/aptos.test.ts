// APTOS integration test for Watercoin project
import { saveSnapshotToCanister, getSnapshots, addSurvey, getSurveys } from '../lib/aptosAgent.js';

async function testAptosIntegration() {
  console.log('🚀 Testing APTOS Integration...');
  
  try {
    // Test snapshot saving
    console.log('📊 Testing snapshot saving...');
    const testSnapshot = {
      timestamp: BigInt(Date.now()),
      deviceId: 'TEST-APTOS-DEVICE',
      location: 'Test Location',
      tds: { value: 25, unit: 'ppm' },
      ph: { value: 7.6, unit: '' },
      turbidity: { value: 0.5, unit: 'NTU' }
    };
    
    await saveSnapshotToCanister(testSnapshot);
    console.log('✅ Snapshot saved successfully');
    
    // Test snapshot retrieval
    console.log('📋 Testing snapshot retrieval...');
    const snapshots = await getSnapshots(5);
    console.log(`✅ Retrieved ${snapshots.length} snapshots`);
    
    // Test survey saving
    console.log('📝 Testing survey saving...');
    await addSurvey('positive');
    console.log('✅ Survey saved successfully');
    
    // Test survey retrieval
    console.log('📊 Testing survey retrieval...');
    const surveys = await getSurveys(5);
    console.log(`✅ Retrieved ${surveys.length} surveys`);
    
    console.log('🎉 All APTOS integration tests passed!');
    
  } catch (error) {
    console.error('❌ APTOS test failed:', error);
    process.exit(1);
  }
}

// Run tests
testAptosIntegration().then(() => {
  console.log('🏁 APTOS integration test completed');
  process.exit(0);
}).catch(error => {
  console.error('💥 Test runner failed:', error);
  process.exit(1);
});
