import { CacheEntry, MevzuatResult, DataSource } from '../types';

const CACHE_KEY_PREFIX = 'mevzuat_cache_';
const CACHE_TTL = 30 * 60 * 1000; // 30 dakika

export const getCacheKey = (query: string): string => {
  return `${CACHE_KEY_PREFIX}${query.trim().toLowerCase()}`;
};

export const getCacheEntry = (query: string): CacheEntry | null => {
  try {
    const key = getCacheKey(query);
    const cached = localStorage.getItem(key);
    
    if (!cached) return null;
    
    const entry: CacheEntry = JSON.parse(cached);
    
    // TTL kontrolü
    if (Date.now() > entry.expiresAt) {
      localStorage.removeItem(key);
      return null;
    }
    
    return entry;
  } catch (error) {
    console.error('Cache okuma hatası:', error);
    return null;
  }
};

export const setCacheEntry = (query: string, results: MevzuatResult[], dataSource: DataSource): void => {
  try {
    const key = getCacheKey(query);
    const entry: CacheEntry = {
      query: query.trim(),
      results,
      timestamp: Date.now(),
      dataSource,
      expiresAt: Date.now() + CACHE_TTL
    };
    
    localStorage.setItem(key, JSON.stringify(entry));
  } catch (error) {
    console.error('Cache yazma hatası:', error);
  }
};

export const clearCache = (): void => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Cache temizleme hatası:', error);
  }
};

export const getCacheSize = (): number => {
  try {
    const keys = Object.keys(localStorage);
    return keys.filter(key => key.startsWith(CACHE_KEY_PREFIX)).length;
  } catch (error) {
    console.error('Cache boyutu hesaplama hatası:', error);
    return 0;
  }
};

export const getCacheEntries = (): CacheEntry[] => {
  try {
    const keys = Object.keys(localStorage);
    const entries: CacheEntry[] = [];
    
    keys.forEach(key => {
      if (key.startsWith(CACHE_KEY_PREFIX)) {
        const cached = localStorage.getItem(key);
        if (cached) {
          const entry: CacheEntry = JSON.parse(cached);
          if (Date.now() <= entry.expiresAt) {
            entries.push(entry);
          } else {
            localStorage.removeItem(key);
          }
        }
      }
    });
    
    return entries.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Cache entries alma hatası:', error);
    return [];
  }
};