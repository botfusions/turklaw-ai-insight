import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SimpleLoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const SimpleLoadingContext = createContext<SimpleLoadingContextType | undefined>(undefined);

interface SimpleLoadingProviderProps {
  children: ReactNode;
}

export const SimpleLoadingProvider = ({ children }: SimpleLoadingProviderProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const value: SimpleLoadingContextType = {
    isLoading,
    setLoading,
  };

  return (
    <SimpleLoadingContext.Provider value={value}>
      {children}
    </SimpleLoadingContext.Provider>
  );
};

export const useSimpleLoading = (): SimpleLoadingContextType => {
  const context = useContext(SimpleLoadingContext);
  if (context === undefined) {
    throw new Error('useSimpleLoading must be used within a SimpleLoadingProvider');
  }
  return context;
};