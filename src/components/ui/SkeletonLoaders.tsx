
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const AuthSkeleton: React.FC = () => (
  <div className="max-w-md mx-auto space-y-6">
    <Skeleton className="h-8 w-48 mx-auto" />
    <Skeleton className="h-32 w-full" />
    <div className="flex justify-center gap-4">
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-10 w-24" />
    </div>
  </div>
);

export const SearchSkeleton: React.FC = () => (
  <div className="space-y-4">
    <Skeleton className="h-12 w-full" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-4 space-y-3">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
    <Skeleton className="h-64 w-full" />
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  </div>
);

export const ProfileSkeleton: React.FC = () => (
  <div className="max-w-2xl mx-auto space-y-6">
    <div className="flex items-center space-x-4">
      <Skeleton className="h-20 w-20 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  </div>
);

export const ContentSkeleton: React.FC = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-3/4" />
    <div className="space-y-2">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
    </div>
    <Skeleton className="h-4 w-2/3" />
  </div>
);
