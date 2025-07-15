import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Activity, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import DirectMCPTest from '@/components/DirectMCPTest';

const APITestComponent = () => {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const testAPIs = async () => {
    setLoading(true);
    const testResults: any = {};

    // Test Mevzuat API
    try {
      console.log('Testing Mevzuat API...');
      const mevzuatResponse = await fetch('https://n8n.botfusions.com/webhook/mevzuat-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: "iş kanunu 2024" })
      });

      testResults.mevzuat = {
        status: mevzuatResponse.status,
        statusText: mevzuatResponse.statusText,
        data: await mevzuatResponse.json()
      };
      
      console.log('✅ Mevzuat Success:', testResults.mevzuat);
    } catch (err) {
      testResults.mevzuat = {
        error: err.message
      };
      console.log('❌ Mevzuat Error:', err);
    }

    // Test Yargı API
    try {
      console.log('Testing Yargı API...');
      const yargiResponse = await fetch('https://n8n.botfusions.com/webhook/yargi-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: "iş kanunu 2024" })
      });

      testResults.yargi = {
        status: yargiResponse.status,
        statusText: yargiResponse.statusText,
        data: await yargiResponse.json()
      };
      
      console.log('✅ Yargı Success:', testResults.yargi);
    } catch (err) {
      testResults.yargi = {
        error: err.message
      };
      console.log('❌ Yargı Error:', err);
    }

    setResults(testResults);
    setLoading(false);
  };

  const getStatusBadge = (result: any) => {
    if (result?.error) {
      return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Error</Badge>;
    }
    if (result?.status === 200) {
      return <Badge variant="default" className="gap-1 bg-green-600"><CheckCircle className="h-3 w-3" /> Online</Badge>;
    }
    if (result?.status === 404) {
      return <Badge variant="secondary" className="gap-1"><AlertCircle className="h-3 w-3" /> Offline</Badge>;
    }
    return <Badge variant="outline" className="gap-1"><Activity className="h-3 w-3" /> Unknown</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-6 w-6 text-primary" />
                🔧 API Test Console
              </CardTitle>
              <CardDescription>
                Test the status and connectivity of external APIs
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="webhooks" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="webhooks">🔗 Webhook Tests</TabsTrigger>
                  <TabsTrigger value="direct">🎯 Direct MCP Tests</TabsTrigger>
                </TabsList>
                
                <TabsContent value="webhooks" className="space-y-6">
                  <Button
                    onClick={testAPIs}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? 'Testing APIs...' : 'Test All Webhooks'}
                  </Button>

                  {Object.keys(results).length > 0 && (
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Mevzuat Results */}
                      <Card className="bg-blue-50 border-blue-200">
                        <CardHeader>
                          <CardTitle className="text-blue-800 flex items-center gap-2">
                            📚 Mevzuat API
                            {getStatusBadge(results.mevzuat)}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {results.mevzuat?.status && (
                            <div className="flex gap-2">
                              <span className="font-semibold">Status:</span>
                              <span className={results.mevzuat.status === 200 ? 'text-green-600' : 'text-red-600'}>
                                {results.mevzuat.status} {results.mevzuat.statusText}
                              </span>
                            </div>
                          )}
                          
                          <div className="bg-white rounded p-3 overflow-auto max-h-64">
                            <pre className="text-xs">
                              {JSON.stringify(results.mevzuat, null, 2)}
                            </pre>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Yargı Results */}
                      <Card className="bg-purple-50 border-purple-200">
                        <CardHeader>
                          <CardTitle className="text-purple-800 flex items-center gap-2">
                            ⚖️ Yargı API
                            {getStatusBadge(results.yargi)}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {results.yargi?.status && (
                            <div className="flex gap-2">
                              <span className="font-semibold">Status:</span>
                              <span className={results.yargi.status === 200 ? 'text-green-600' : 'text-red-600'}>
                                {results.yargi.status} {results.yargi.statusText}
                              </span>
                            </div>
                          )}
                          
                          <div className="bg-white rounded p-3 overflow-auto max-h-64">
                            <pre className="text-xs">
                              {JSON.stringify(results.yargi, null, 2)}
                            </pre>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Instructions */}
                  <Card className="bg-muted">
                    <CardHeader>
                      <CardTitle className="text-base">📋 Test Sonuçları</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <strong>Status 200:</strong> API çalışıyor
                        </li>
                        <li className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                          <strong>Status 404:</strong> Webhook bulunamadı (workflow pasif)
                        </li>
                        <li className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red-600" />
                          <strong>Status 500:</strong> MCP server hatası
                        </li>
                        <li className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-blue-600" />
                          <strong>Network Error:</strong> URL yanlış veya server down
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="direct">
                  <DirectMCPTest />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default APITestComponent;