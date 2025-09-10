// Combined APTOS integration runner with readiness wait & health check.
// Similar to icpAll.test.ts but for APTOS blockchain

import { saveSnapshotToCanister, getSnapshots, addSurvey, getSurveys } from '../lib/aptosAgent.js';

async function waitForAptosNetwork() {
  console.log('🔄 Waiting for APTOS network readiness...');
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    try {
      // Try to get snapshots as a health check
      await getSnapshots(1);
      console.log('✅ APTOS network is ready');
      return true;
    } catch (error) {
      attempts++;
      console.log(`❌ Attempt ${attempts}/${maxAttempts} failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      if (attempts < maxAttempts) {
        console.log('⏳ Waiting 3 seconds before retry...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
  }
  
  throw new Error('APTOS network not ready after maximum attempts');
}

async function runAllAptosTests() {
  console.log('🚀 Starting comprehensive APTOS tests...');
  
  try {
    // Wait for APTOS network
    await waitForAptosNetwork();
    
    // Test 1: Snapshot operations
    console.log('\n📊 Test 1: Snapshot Operations');
    const testSnapshot = {
      timestamp: BigInt(Date.now()),
      deviceId: 'COMPREHENSIVE-TEST-DEVICE',
      location: 'Comprehensive Test Location',
      tds: { value: 30, unit: 'ppm' },
      ph: { value: 7.8, unit: '' },
      turbidity: { value: 0.3, unit: 'NTU' }
    };
    
    await saveSnapshotToCanister(testSnapshot);
    console.log('✅ Snapshot saved');
    
    const snapshots = await getSnapshots(3);
    console.log(`✅ Retrieved ${snapshots.length} snapshots`);
    
    // Test 2: Survey operations
    console.log('\n📝 Test 2: Survey Operations');
    await addSurvey('positive');
    await addSurvey('neutral');
    await addSurvey('negative');
    console.log('✅ Multiple surveys saved');
    
    const surveys = await getSurveys(5);
    console.log(`✅ Retrieved ${surveys.length} surveys`);
    
    // Test 3: Data consistency
    console.log('\n🔍 Test 3: Data Consistency');
    const recentSnapshots = await getSnapshots(1);
    if (recentSnapshots.length > 0) {
      const recent = recentSnapshots[0];
      console.log(`✅ Latest snapshot: Device ${recent.deviceId} at ${recent.location}`);
    }
    
    console.log('\n🎉 All APTOS comprehensive tests passed!');
    
  } catch (error) {
    console.error('\n❌ Comprehensive APTOS test failed:', error);
    process.exit(1);
  }
}

// Run comprehensive tests
runAllAptosTests().then(() => {
  console.log('\n🏁 Comprehensive APTOS test suite completed successfully');
  process.exit(0);
}).catch(error => {
  console.error('\n💥 Test suite failed:', error);
  process.exit(1);
});
