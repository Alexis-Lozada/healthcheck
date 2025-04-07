'use client';

import { Suspense } from 'react';
import HeroSection from '@/components/home/HeroSection';
import NewsVerifier from '@/components/home/NewsVerifier';
import NewsFeed from '@/components/news/NewsFeed';

export default function Home() {
  return (
    <div>
      <HeroSection />

      <Suspense fallback={<div className="text-center my-10">Cargando verificador...</div>}>
        <NewsVerifier />
      </Suspense>

      <Suspense fallback={<div className="text-center my-10">Cargando noticias...</div>}>
        <NewsFeed 
          limit={6} 
          showSearch={true}
          title="Últimas noticias verificadas"
          subtitle="Mantente informado con contenido verificado por nuestra plataforma"
        />
      </Suspense>
    </div>
  );
}
