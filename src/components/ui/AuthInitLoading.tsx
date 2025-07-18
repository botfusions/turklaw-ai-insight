
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Skeleton } from '@/components/ui/skeleton';

export const AuthInitLoading: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Skeleton className="h-6 w-64 mx-auto" />
            <Skeleton className="h-12 w-full max-w-2xl mx-auto" />
            <Skeleton className="h-20 w-full max-w-3xl mx-auto" />
            <div className="flex justify-center gap-4">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};
