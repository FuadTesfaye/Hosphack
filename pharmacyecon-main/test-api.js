// Simple test script to verify the prescriptions API
const fetch = require('node-fetch');

async function testPrescriptionsAPI() {
  try {
    console.log('Testing prescriptions API...');
    
    const response = await fetch('http://localhost:9002/api/prescriptions');
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers.raw());
    
    if (response.ok) {
      const data = await response.json();
      console.log('Success! Prescriptions data:', JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.log('Error response:', errorText);
    }
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testPrescriptionsAPI();