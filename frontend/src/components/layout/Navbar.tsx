'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import UserMenu from './UserMenu';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  const isAdmin = user && user.rol === 'admin';

  const isActive = (path: string) => pathname === path;

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 border-b ${
        isScrolled
          ? 'bg-white shadow-sm border-gray-200 backdrop-blur-md'
          : 'bg-transparent border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
  {/* Left: Logo */}
  <div className="flex-1">
    <Link href="/" className="flex items-center space-x-2">
      <img src="/assets/logo.svg" alt="Logo" className="h-6 w-auto" />
      <span className="text-lg font-semibold text-gray-800">HealthCheck</span>
    </Link>
  </div>

  {/* Center: Navigation links */}
  <div className="hidden sm:flex flex-[2] justify-center items-center space-x-6">
    <Link
      href="/"
      className={`text-sm font-medium ${
        isActive('/') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
      }`}
    >
      Inicio
    </Link>
    <Link
      href="/news"
      className={`text-sm font-medium ${
        pathname.startsWith('/news') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
      }`}
    >
      Noticias
    </Link>
    {isAdmin && (
      <Link
        href="/admin/dashboard"
        className={`text-sm font-medium ${
          pathname.startsWith('/admin')
            ? 'text-blue-600'
            : 'text-gray-700 hover:text-blue-600'
        }`}
      >
        Dashboard
      </Link>
    )}
  </div>

  {/* Right: User or auth */}
  <div className="hidden sm:flex items-center justify-end flex-1 space-x-4">
    {user ? (
      <UserMenu />
    ) : (
      <>
        <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-blue-600">
          Iniciar sesión
        </Link>
        <Link
          href="/register"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Registrarse
        </Link>
      </>
    )}
  </div>

  {/* Mobile Menu Button */}
  <div className="sm:hidden flex items-center">
    <button
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      className="p-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
    >
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {isMobileMenuOpen ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        )}
      </svg>
    </button>
  </div>
</div>

      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-white shadow-md border-t border-gray-100">
          <div className="pt-4 pb-3 px-4 space-y-2">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block text-base font-medium ${
                isActive('/') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Inicio
            </Link>
            <Link
              href="/news"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block text-base font-medium ${
                pathname.startsWith('/news') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Noticias
            </Link>
            {isAdmin && (
              <Link
                href="/admin/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block text-base font-medium ${
                  pathname.startsWith('/admin') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Dashboard
              </Link>
            )}
            {user ? (
              <UserMenu mobile onMobileMenuClose={() => setIsMobileMenuOpen(false)} />
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-base font-medium text-gray-700 hover:text-blue-600"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-base font-medium text-gray-700 hover:text-blue-600"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
