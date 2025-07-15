import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const DirectMCPTest = () => {
  const [query, setQuery] = useState('iş kanunu');
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const testDirectMCP = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    const startTime = Date.now();
    const testResults: any = {};

    console.log('🚀 Doğrudan MCP Test başlatılıyor...');

    // Test 1: Mevzuat MCP
    try {
      console.log('📚 Testing Mevzuat MCP directly...');
      
      const mevzuatResponse = await fetch('https://mevzuat-mcp-2z26.onrender.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "tools/call",
          params: {
            name: "search_mevzuat",
            arguments: {
              query: query,
              limit: 5,
              detailed: true
            }
          },
          id: "mevzuat_test_1"
        })
      });

      testResults.mevzuat = {
        status: mevzuatResponse.status,
        statusText: mevzuatResponse.statusText,
        url: 'https://mevzuat-mcp-2z26.onrender.com'
      };

      if (mevzuatResponse.ok) {
        const data = await mevzuatResponse.json();
        testResults.mevzuat.data = data;
        console.log('✅ Mevzuat MCP Success:', data);
      } else {
        const errorText = await mevzuatResponse.text();
        testResults.mevzuat.error = errorText;
        console.log('❌ Mevzuat MCP Error:', errorText);
      }

    } catch (err: any) {
      testResults.mevzuat = {
        error: err.message,
        type: 'Network/CORS Error'
      };
      console.log('❌ Mevzuat MCP Network Error:', err);
    }

    // Test 2: Yargı MCP
    try {
      console.log('⚖️ Testing Yargı MCP directly...');
      
      const yargiResponse = await fetch('https://yargi-mcp-of8a.onrender.com', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "tools/call", 
          params: {
            name: "search_yargitay",
            arguments: {
              query: query,
              limit: 5,
              detailed: true
            }
          },
          id: "yargi_test_1"
        })
      });

      testResults.yargi = {
        status: yargiResponse.status,
        statusText: yargiResponse.statusText,
        url: 'https://yargi-mcp-of8a.onrender.com'
      };

      if (yargiResponse.ok) {
        const data = await yargiResponse.json();
        testResults.yargi.data = data;
        console.log('✅ Yargı MCP Success:', data);
      } else {
        const errorText = await yargiResponse.text();
        testResults.yargi.error = errorText;
        console.log('❌ Yargı MCP Error:', errorText);
      }

    } catch (err: any) {
      testResults.yargi = {
        error: err.message,
        type: 'Network/CORS Error'
      };
      console.log('❌ Yargı MCP Network Error:', err);
    }

    const endTime = Date.now();
    testResults.test_duration = `${endTime - startTime}ms`;
    testResults.timestamp = new Date().toISOString();

    setResults(testResults);
    setLoading(false);
  };

  const formatResults = (results: any) => {
    if (!results || Object.keys(results).length === 0) return '';

    return `🎯 DOĞRUDAN MCP TEST SONUÇLARI
Sorgu: "${query}"
Test Süresi: ${results.test_duration}
Zaman: ${new Date(results.timestamp).toLocaleString('tr-TR')}

📚 MEVZUAT MCP (${results.mevzuat?.url}):
Status: ${results.mevzuat?.status} ${results.mevzuat?.statusText}
${results.mevzuat?.data ? 
  `✅ BAŞARILI!\nSonuç: ${JSON.stringify(results.mevzuat.data, null, 2)}` : 
  `❌ HATA: ${results.mevzuat?.error || 'Bilinmeyen hata'}`
}

⚖️ YARGI MCP (${results.yargi?.url}):  
Status: ${results.yargi?.status} ${results.yargi?.statusText}
${results.yargi?.data ?
  `✅ BAŞARILI!\nSonuç: ${JSON.stringify(results.yargi.data, null, 2)}` :
  `❌ HATA: ${results.yargi?.error || 'Bilinmeyen hata'}`
}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎯 Doğrudan MCP Server Testi
          </CardTitle>
          <CardDescription>
            MCP serverlarını doğrudan test edin (n8n webhook'ları bypass edilir)
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Test Sorgusu:
              </label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Arama sorgusu girin..."
                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                onKeyPress={(e) => e.key === 'Enter' && testDirectMCP()}
              />
            </div>
            
            <Button
              onClick={testDirectMCP}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  MCP Serverları Test Ediliyor...
                </div>
              ) : (
                '🚀 Doğrudan MCP Test Başlat'
              )}
            </Button>
          </div>

          {Object.keys(results).length > 0 && (
            <Card className="bg-muted">
              <CardHeader>
                <CardTitle className="text-base">📊 Test Sonuçları</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap text-sm overflow-auto max-h-96 bg-background p-4 rounded border">
                  {formatResults(results)}
                </pre>
              </CardContent>
            </Card>
          )}

          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-base text-blue-800">ℹ️ Test Edilecekler</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1">
                <li>📚 <strong>Mevzuat MCP:</strong> https://mevzuat-mcp-2z26.onrender.com</li>
                <li>⚖️ <strong>Yargı MCP:</strong> https://yargi-mcp-of8a.onrender.com</li>
                <li>🔍 <strong>Method:</strong> tools/call → search_mevzuat / search_yargitay</li>
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default DirectMCPTest;