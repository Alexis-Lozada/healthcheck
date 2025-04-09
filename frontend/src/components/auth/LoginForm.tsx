'use client';

import { ArrowLeft, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const LoginForm = () => {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, contrasena: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      login(data.data.user, data.data.token);

      setTimeout(() => {
        router.push('/');
      }, 100);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error durante el inicio de sesión');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div className="mt-16 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
        
        {/* Columna izquierda con degradado */}
        <div className="bg-gradient-to-b from-blue-500 to-indigo-500 md:w-2/5 hidden md:flex flex-col justify-between relative p-6 text-white">
          <div>
            <Link href="/" className="flex items-center hover:underline text-white">
              <ArrowLeft size={16} className="mr-2" />
              Volver al inicio
            </Link>
            <div className="mt-8">
              <h2 className="text-2xl font-bold">Bienvenido</h2>
              <p className="text-sm mt-2">
                Inicia sesión para acceder a información verificada sobre salud.
              </p>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-600 rounded-full -mb-16 -mr-16 opacity-50"></div>
          <div className="text-xs mt-auto text-white/70">© 2025 Health Check</div>
        </div>

        {/* Columna derecha: formulario */}
        <div className="p-6 md:p-8 md:w-3/5">
          <div className="md:hidden mb-4">
            <Link href="/" className="text-blue-600 flex items-center hover:underline text-sm">
              <ArrowLeft size={16} className="mr-1" />
              Volver
            </Link>
          </div>

          <div className="text-center mb-5">
            <h1 className="text-xl font-bold text-gray-900">Iniciar sesión</h1>
            <p className="text-gray-600 text-sm mt-1">Ingresa tus credenciales</p>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 text-red-600 p-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="email">
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="password">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={16} className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? <EyeOff size={16} className="text-gray-400" /> : <Eye size={16} className="text-gray-400" />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <Link href="/forgot-password" className="text-xs text-blue-600 hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Botón de login actualizado */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 text-white font-medium rounded-lg text-sm 
                bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600
                transition-all duration-300 ease-in-out 
                ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-500">O continúa con</span>
              </div>
            </div>

            <div className="mt-3">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium bg-white hover:bg-gray-50 flex justify-center items-center transition-colors text-sm"
              >
                <Image src="/images/google.png" alt="Google logo" width={16} height={16} className="mr-2" />
                Iniciar sesión con Google
              </button>
            </div>
          </div>

          <p className="mt-4 text-center text-gray-600 text-xs">
            ¿No tienes una cuenta?{' '}
            <Link href="/register" className="text-blue-600 hover:underline font-medium">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
