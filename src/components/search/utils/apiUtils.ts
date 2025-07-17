import { MevzuatResult } from '../types';

export const PRIMARY_API_URL = 'https://mevzuat-mcp-2z26.onrender.com/webhook/search';
export const FALLBACK_JSON_URL = 'https://raw.githubusercontent.com/botfusions/mevzuat-mcp/main/public/mevzuat-data.json';

export const fetchPrimaryAPI = async (query: string, timeout: number = 5000): Promise<MevzuatResult[]> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(PRIMARY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: query.trim() }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return normalizeResults(data.results || []);
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

export const fetchFallbackJSON = async (): Promise<MevzuatResult[]> => {
  try {
    const response = await fetch(FALLBACK_JSON_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return normalizeResults(data);
  } catch (error) {
    throw error;
  }
};

export const searchInFallbackData = (data: MevzuatResult[], query: string, maxResults: number = 10): MevzuatResult[] => {
  const searchTerm = query.trim().toLowerCase();
  
  const filteredResults = data.filter(item => 
    item.title.toLowerCase().includes(searchTerm) ||
    item.content.toLowerCase().includes(searchTerm)
  );
  
  // Relevance skorunu hesapla
  const scoredResults = filteredResults.map(item => {
    let score = 0;
    
    // Başlıkta geçen kelimeler daha yüksek puan
    if (item.title.toLowerCase().includes(searchTerm)) {
      score += 2;
    }
    
    // İçerikte geçen kelimeler
    if (item.content.toLowerCase().includes(searchTerm)) {
      score += 1;
    }
    
    return {
      ...item,
      relevance: score
    };
  });
  
  // Relevance skoruna göre sırala ve limitle
  return scoredResults
    .sort((a, b) => (b.relevance || 0) - (a.relevance || 0))
    .slice(0, maxResults);
};

const normalizeResults = (results: any[]): MevzuatResult[] => {
  return Array.isArray(results) 
    ? results.map((item: any, index: number) => ({
        id: item.id || `result-${index}`,
        title: item.title || item.name || 'Başlık bulunamadı',
        content: item.content || item.description || item.summary || '',
        date: item.date || item.publication_date || '',
        type: item.type || 'mevzuat',
        url: item.url || item.link || '',
        relevance: item.relevance || item.score || 0
      }))
    : [];
};