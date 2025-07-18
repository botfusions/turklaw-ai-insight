
import React from 'react';

interface ActionLoadingIndicatorProps {
  message?: string;
}

export const ActionLoadingIndicator: React.FC<ActionLoadingIndicatorProps> = ({
  message = 'İşlem yapılıyor...'
}) => {
  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg">
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
        {message}
      </div>
    </div>
  );
};
