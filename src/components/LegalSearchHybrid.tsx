import React, { useState } from 'react';
import { Search, Download, Clock, Database, Github, Zap, AlertCircle } from 'lucide-react';
import { useLegalSearchHybrid } from '../hooks/useLegalSearchHybrid';
import jsPDF from 'jspdf';

const LegalSearchHybrid = () => {
  const {
    results,
    loading,
    error,
    dataSource,
    responseTime,
    searchHybrid,
    clearCache
  } = useLegalSearchHybrid();

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'yargi' | 'mevzuat'>('yargi');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      searchHybrid(query.trim(), category);
    }
  };

  const downloadPDF = (result: any) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(16);
    doc.text(result.title, 20, 30);
    
    // Details
    doc.setFontSize(12);
    doc.text(`Mahkeme: ${result.court}`, 20, 50);
    doc.text(`Tarih: ${result.date}`, 20, 65);
    doc.text(`Kaynak: ${dataSource.toUpperCase()}`, 20, 80);
    
    // Content
    doc.setFontSize(10);
    const splitText = doc.splitTextToSize(result.summary, 170);
    doc.text(splitText, 20, 100);
    
    doc.save(`${result.id}-karar.pdf`);
  };

  const getDataSourceIcon = () => {
    switch (dataSource) {
      case 'cache': return <Zap className="w-4 h-4 text-green-500" />;
      case 'api': return <Database className="w-4 h-4 text-blue-500" />;
      case 'github': return <Github className="w-4 h-4 text-purple-500" />;
      case 'fallback': return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default: return null;
    }
  };

  const getDataSourceText = () => {
    switch (dataSource) {
      case 'cache': return 'Önbellek';
      case 'api': return 'Canlı API';
      case 'github': return 'GitHub Static';
      case 'fallback': return 'Fallback';
      default: return 'Bilinmiyor';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🏛️ TurkLaw AI - Hibrit Arama
            </h1>
            
            {/* Status Bar */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                {getDataSourceIcon()}
                <span>{getDataSourceText()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span>{responseTime}ms</span>
              </div>
              <button 
                onClick={clearCache}
                className="text-gray-500 hover:text-gray-700"
                title="Önbelleği Temizle"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Form */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Category Selection */}
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setCategory('yargi')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  category === 'yargi'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🏛️ Yargı (Yargıtay, Danıştay)
              </button>
              <button
                type="button"
                onClick={() => setCategory('mevzuat')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  category === 'mevzuat'
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📚 Mevzuat (Kanunlar, Yönetmelikler)
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`${category === 'yargi' ? 'Yargı' : 'Mevzuat'} araması yapın...`}
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? '🔍 Arıyor...' : '🔍 Ara'}
              </button>
            </div>
          </form>

          {/* Data Source Info */}
          {results.length > 0 && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getDataSourceIcon()}
                  <span className="font-medium">Veri Kaynağı: {getDataSourceText()}</span>
                </div>
                <span className="text-gray-600">{results.length} sonuç • {responseTime}ms</span>
              </div>
              
              {dataSource === 'github' && (
                <p className="text-orange-600 mt-2">
                  ⚠️ GitHub static data kullanılıyor - son güncellenme: 6 saat önce
                </p>
              )}
              
              {dataSource === 'fallback' && (
                <p className="text-red-600 mt-2">
                  ⚠️ Tüm veri kaynakları başarısız - test verisi gösteriliyor
                </p>
              )}
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
              <span className="text-yellow-800">{error}</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="text-lg">Hibrit sistem arama yapıyor...</span>
            </div>
            <p className="text-gray-600 mt-2">
              Cache → Canlı API → GitHub Static → Fallback sırası deneniyor
            </p>
          </div>
        )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <div className="space-y-4">
            {results.map((result) => (
              <div key={result.id} className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all">
                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {result.title}
                </h3>
                
                {/* Meta Info */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    📍 {result.court}
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    📅 {result.date}
                  </span>
                  {result.type && (
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                      📋 {result.type}
                    </span>
                  )}
                  {result.status && result.status !== 'normal' && (
                    <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                      ⚡ {result.status.replace('_', ' ')}
                    </span>
                  )}
                </div>
                
                {/* Summary */}
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {result.summary}
                </p>
                
                {/* Case Numbers */}
                {(result.esas_no || result.karar_no) && (
                  <div className="flex gap-4 text-sm text-gray-600 mb-4">
                    {result.esas_no && <span>📋 Esas No: {result.esas_no}</span>}
                    {result.karar_no && <span>📋 Karar No: {result.karar_no}</span>}
                  </div>
                )}
                
                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  {result.url && result.url !== '#' && (
                    <a 
                      href={result.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      🔗 Kaynağı Görüntüle
                    </a>
                  )}
                  <button 
                    onClick={() => downloadPDF(result)}
                    className="inline-flex items-center gap-2 text-green-600 hover:text-green-800 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    PDF İndir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && results.length === 0 && query && (
          <div className="text-center py-12 bg-white/50 rounded-xl">
            <h3 className="text-xl font-medium text-gray-900 mb-2">Sonuç Bulunamadı</h3>
            <p className="text-gray-600">
              "{query}" için {category === 'yargi' ? 'yargı' : 'mevzuat'} araması sonuç vermedi.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LegalSearchHybrid;