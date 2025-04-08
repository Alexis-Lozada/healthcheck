'use client';

import Image from 'next/image';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className="relative isolate overflow-hidden py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6 text-center">
          Plataforma IA para verificar <br />
          <span className="text-blue-600">noticias falsas sobre salud</span>
        </h1>

        <p className="text-lg text-gray-700 max-w-2xl mx-auto text-center mb-8">
          Nuestra IA analiza artículos médicos para detectar desinformación. Protege tu salud con información precisa y verificada.
        </p>

        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium text-base shadow-md hover:from-blue-600 hover:to-indigo-600 transition duration-300 z-10"
        >
          <Image
            src="/assets/logo-mobile-white.png"
            alt="Icono de acceso"
            width={20}
            height={20}
            className="w-5 h-5"
          />
          Comenzar ahora
        </Link>
      </div>

      {/* Planet with rotating rings */}
      <div className="relative mt-26 flex justify-center items-center">
        {/* Animated SVG rings */}
        <div className="absolute w-[600px] h-[600px] animate-slow-spin z-0 pointer-events-none">
          <Image
            src="/assets/orbits.svg"
            alt="Órbitas concéntricas"
            fill
            className="object-contain opacity-60"
            priority
          />
        </div>

        {/* Planet */}
        <div className="relative w-[365px] h-[282px] z-10 pointer-events-none">
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
