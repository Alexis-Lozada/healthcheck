'use client';

import { Suspense } from 'react';
import HeroSection from '@/components/home/HeroSection';
import NewsVerifier from '@/components/home/NewsVerifier';
import NewsFeed from '@/components/news/NewsFeed';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - News Verifier */}
            <div className="lg:col-span-7">
              <Suspense fallback={
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              }>
                <NewsVerifier />
              </Suspense>
            </div>

            {/* Right Column - News Feed */}
            <div className="lg:col-span-5">
              <Suspense fallback={
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              }>
                <div className="lg:sticky lg:top-24">
                  <NewsFeed 
                    limit={6} 
                    showSearch={true}
                    title="Noticias Recientes"
                    subtitle="Últimas noticias verificadas"
                  />
                </div>
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}