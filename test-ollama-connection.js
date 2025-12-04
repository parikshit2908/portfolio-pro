// Quick test to check Ollama connection
const OLLAMA_URL = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';

console.log('🔍 Testing Ollama connection...');
console.log('URL:', OLLAMA_URL);
console.log('');

async function testConnection() {
  try {
    // Test 1: Check if Ollama is responding
    console.log('Test 1: Checking if Ollama is running...');
    const tagsRes = await fetch(`${OLLAMA_URL}/api/tags`);
    
    if (!tagsRes.ok) {
      console.error(`❌ Ollama returned HTTP ${tagsRes.status}`);
      console.error('Response:', await tagsRes.text());
      return;
    }
    
    const tagsData = await tagsRes.json();
    console.log('✅ Ollama is running!');
    console.log('Available models:', tagsData.models?.map(m => m.name) || []);
    console.log('');
    
    // Test 2: Try a simple generate request
    if (tagsData.models && tagsData.models.length > 0) {
      const testModel = tagsData.models[0].name;
      console.log(`Test 2: Testing model "${testModel}"...`);
      
      const generateRes = await fetch(`${OLLAMA_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: testModel,
          prompt: 'Say "Hello" in one word.',
          stream: false
        })
      });
      
      if (!generateRes.ok) {
        console.error(`❌ Generate request failed: ${generateRes.status}`);
        return;
      }
      
      const generateData = await generateRes.json();
      console.log('✅ Model is working!');
      console.log('Response:', generateData.response?.substring(0, 50) || 'No response');
    } else {
      console.log('⚠️  No models found. Pull a model with: ollama pull mistral');
    }
    
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    console.error('');
    console.error('💡 Solutions:');
    console.error('   1. Start Ollama: ollama serve');
    console.error('   2. Check if Ollama is installed: ollama --version');
    console.error('   3. Verify port 11434 is not blocked');
    console.error('   4. Check OLLAMA_BASE_URL env var if using remote Ollama');
  }
}

testConnection();

