// Simple test script to verify backend connection
async function testBackendConnection() {
  try {
    console.log('Testing backend connection...');
    
    // Test health endpoint
    const response = await fetch('http://localhost:8000/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend connection successful!');
      console.log('Backend response:', data);
      return data;
    } else {
      console.error('❌ Backend connection failed:', response.status, response.statusText);
      return null;
    }
  } catch (error) {
    console.error('❌ Error connecting to backend:', error);
    return null;
  }
}

// Test CORS
async function testCORS() {
  try {
    console.log('Testing CORS...');
    
    const response = await fetch('http://localhost:8000/api/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3000'
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ CORS working properly!');
      console.log('Health check response:', data);
      return data;
    } else {
      console.error('❌ CORS test failed:', response.status);
      return null;
    }
  } catch (error) {
    console.error('❌ CORS error:', error);
    return null;
  }
}

// Run tests
testBackendConnection();
testCORS();
