'use client';

import Image from 'next/image';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className="relative isolate overflow-hidden bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
          Plataforma IA para verificar <br />
          <span className="text-blue-600">noticias falsas sobre salud</span>
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
          Nuestra IA analiza artículos médicos para detectar desinformación. Protege tu salud con información precisa y verificada.
        </p>

        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 px-8 py-3 text-base font-medium text-white shadow-md hover:from-blue-600 hover:to-indigo-600 transition"
        >
          <span>Comenzar ahora</span>
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

      {/* Planet with rotating rings */}
      <div className="relative mt-16 flex justify-center items-center">
        {/* Animated SVG rings */}
        <div className="absolute w-[500px] h-[500px] animate-slow-spin">
          <Image
            src="/assets/orbits.svg"
            alt="Órbitas concéntricas"
            fill
            className="object-contain opacity-60"
            priority
          />
        </div>

        {/* Planet */}
        <div className="relative w-[200px] h-[200px] z-10">
          <Image
            src="/assets/planet.png"
            alt="Planeta salud"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
