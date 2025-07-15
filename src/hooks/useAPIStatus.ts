import { useState, useEffect } from 'react';

export interface APIStatus {
  name: string;
  url: string;
  status: 'online' | 'offline' | 'unknown';
  responseTime?: number;
  lastChecked?: Date;
  error?: string;
}

export const useAPIStatus = () => {
  const [apiStatuses, setApiStatuses] = useState<APIStatus[]>([
    {
      name: 'Mevzuat API',
      url: 'https://n8n.botfusions.com/webhook/mevzuat-query',
      status: 'unknown'
    },
    {
      name: 'Yargı API',
      url: 'https://n8n.botfusions.com/webhook/yargi-search',
      status: 'unknown'
    }
  ]);

  const checkAPIStatus = async (api: APIStatus): Promise<APIStatus> => {
    const startTime = Date.now();
    
    try {
      const response = await fetch(api.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'test' })
      });

      const responseTime = Date.now() - startTime;

      return {
        ...api,
        status: response.status === 200 ? 'online' : 'offline',
        responseTime,
        lastChecked: new Date(),
        error: response.status !== 200 ? `HTTP ${response.status}` : undefined
      };
    } catch (error) {
      return {
        ...api,
        status: 'offline',
        responseTime: Date.now() - startTime,
        lastChecked: new Date(),
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  };

  const checkAllAPIs = async () => {
    const updatedStatuses = await Promise.all(
      apiStatuses.map(api => checkAPIStatus(api))
    );
    setApiStatuses(updatedStatuses);
  };

  useEffect(() => {
    // Check APIs on component mount
    checkAllAPIs();
    
    // Set up periodic checking every 5 minutes
    const interval = setInterval(checkAllAPIs, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    apiStatuses,
    checkAllAPIs,
    isAnyAPIOnline: apiStatuses.some(api => api.status === 'online'),
    allAPIsOffline: apiStatuses.every(api => api.status === 'offline')
  };
};