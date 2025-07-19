import React, { useState, useEffect } from 'react';
import { Search, Download, Globe, Database } from 'lucide-react';

const SimpleLegalSearch = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('yargi');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState('');

  // Basit arama fonksiyonu
  const searchLegal = async (searchQuery, searchCategory) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setResults([]);
    
    try {
      // API URL'leri
      const apiUrls = {
        yargi: 'https://yargi-mcp-of8a.onrender.com/webhook/yargitay-search',
        mevzuat: 'https://mevzuat-mcp-2z26.onrender.com/webhook/search'
      };
      
      // API payload
      const payload = searchCategory === 'yargi' 
        ? { andKelimeler: searchQuery, page_size: 10 }
        : { query: searchQuery, page_size: 10 };
      
      console.log('API Call:', apiUrls[searchCategory], payload);
      
      const response = await fetch(apiUrls[searchCategory], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data);
        
        // Sonuçları işle
        const processedResults = data?.data?.results?.map((item, index) => ({
          id: item.id || `result-${index}`,
          title: item.title || 'Başlık Yok',
          summary: item.summary || 'Özet mevcut değil',
          court: item.court || item.daire || 'Mahkeme Bilgisi Yok',
          date: item.date || 'Tarih Yok',
          type: item.type || 'karar'
        })) || [];
        
        setResults(processedResults);
        setDataSource('API');
      } else {
        throw new Error('API çağrısı başarısız');
      }
    } catch (error) {
      console.error('Arama hatası:', error);
      
      // Fallback data
      setResults([
        {
          id: 'fallback-1',
          title: `${searchQuery} - Test Kararı`,
          summary: 'Bu bir test kararıdır. Gerçek API bağlantısı kurulamadığında gösterilir.',
          court: 'Test Mahkemesi',
          date: '2024-01-01',
          type: 'test'
        }
      ]);
      setDataSource('Fallback');
    } finally {
      setLoading(false);
    }
  };

  // Arama tetikleme
  const handleSearch = () => {
    searchLegal(query, category);
  };

  // Enter tuşu desteği
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // PDF indirme fonksiyonu
  const downloadPDF = (result) => {
    const content = `TÜRK HUKUK KARARI

Başlık: ${result.title}
Mahkeme: ${result.court}
Tarih: ${result.date}
Tür: ${result.type}

Özet:
${result.summary}

Bu belge TurkLaw AI sistemi tarafından oluşturulmuştur.`;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.id}-karar.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Sayfa yüklendiğinde test araması
  useEffect(() => {
    searchLegal('güncel kararlar', 'yargi');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sade Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">
            🏛️ TurkLaw AI
          </h1>
          <p className="text-gray-600 mt-1">
            Türk Hukuku Arama Sistemi
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Arama Bölümü */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          
          {/* Kategori Seçimi */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => setCategory('yargi')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                category === 'yargi'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📍 Yargı (Yargıtay, Danıştay)
            </button>
            <button
              onClick={() => setCategory('mevzuat')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                category === 'mevzuat'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📚 Mevzuat (Kanun, Yönetmelik)
            </button>
          </div>

          {/* Arama Input */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`${category === 'yargi' ? 'Yargı' : 'Mevzuat'} araması yapın...`}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              {loading ? '🔍 Arıyor...' : '🔍 Ara'}
            </button>
          </div>

          {/* Status Göstergesi */}
          {dataSource && (
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
              <Database className="w-4 h-4" />
              <span>Veri Kaynağı: <strong>{dataSource}</strong></span>
              <span>•</span>
              <span><strong>{results.length}</strong> sonuç bulundu</span>
            </div>
          )}
        </div>

        {/* Loading Durumu */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="text-lg">Arama yapılıyor...</span>
            </div>
            <p className="text-gray-600 mt-2">
              {category === 'yargi' ? 'Yargıtay ve Danıştay' : 'Mevzuat'} veritabanında aranıyor
            </p>
          </div>
        )}

        {/* Arama Sonuçları */}
        {!loading && results.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Arama Sonuçları ({results.length})
            </h2>
            
            {results.map((result) => (
              <div key={result.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                
                {/* Başlık */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3 leading-tight">
                  {result.title}
                </h3>
                
                {/* Meta Bilgiler */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    📍 {result.court}
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    📅 {result.date}
                  </span>
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                    📋 {result.type}
                  </span>
                </div>
                
                {/* Özet */}
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {result.summary}
                </p>
                
                {/* Action Butonlar */}
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => downloadPDF(result)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors font-medium"
                  >
                    <Download className="w-4 h-4" />
                    PDF İndir
                  </button>
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium">
                    <Globe className="w-4 h-4" />
                    Detayları Görüntüle
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sonuç Bulunamadı */}
        {!loading && results.length === 0 && query && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Sonuç Bulunamadı
            </h3>
            <p className="text-gray-600 mb-4">
              "{query}" için {category === 'yargi' ? 'yargı' : 'mevzuat'} araması sonuç vermedi.
            </p>
            <p className="text-sm text-gray-500">
              Farklı anahtar kelimeler veya kategori deneyin.
            </p>
          </div>
        )}

        {/* İlk Yükleme Mesajı */}
        {!loading && results.length === 0 && !query && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
            <div className="text-6xl mb-4">🏛️</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              TurkLaw AI'ya Hoş Geldiniz
            </h3>
            <p className="text-gray-600">
              Yukarıdaki arama kutusunu kullanarak Türk hukuku araştırması yapabilirsiniz.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleLegalSearch;