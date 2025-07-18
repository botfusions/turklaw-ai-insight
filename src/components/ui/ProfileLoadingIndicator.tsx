
import React from 'react';

export const ProfileLoadingIndicator: React.FC = () => {
  return (
    <div className="inline-flex items-center text-xs text-muted-foreground">
      <div className="animate-spin rounded-full h-3 w-3 border border-current border-t-transparent mr-1" />
      Profil yükleniyor...
    </div>
  );
};
