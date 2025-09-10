// Price Display Test for APTOS Conversion
// Tests the IDR to APTOS conversion display functionality

import { idrToAptos } from '../lib/aptosAgent';

console.log('🧮 Testing price conversion display...');

const testPrices = [6000, 18000, 20000, 65000];

testPrices.forEach(priceIDR => {
  const aptosAmount = idrToAptos(priceIDR);
  const roundedUpAptos = Math.ceil(aptosAmount * 100) / 100; // Round up to 2 decimal places
  
  console.log(`💰 Rp ${priceIDR.toLocaleString('id-ID')} ~ ${roundedUpAptos.toFixed(2)} APTOS`);
});

// Test specific conversions
console.log('\n🔍 Detailed conversion test:');
console.log(`1 APTOS = Rp 65,000`);
console.log(`Rp 6,000 = ${idrToAptos(6000).toFixed(6)} APTOS (displayed as ${Math.ceil(idrToAptos(6000) * 100) / 100} APTOS)`);
console.log(`Rp 20,000 = ${idrToAptos(20000).toFixed(6)} APTOS (displayed as ${Math.ceil(idrToAptos(20000) * 100) / 100} APTOS)`);

console.log('✅ Price display test completed!');
