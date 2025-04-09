'use client';

import { ArrowLeft, Eye, EyeOff, Lock, Mail, Phone, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { register } from '@/services/authService';
import { useAuth } from '@/context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const RegisterForm = () => {
  const router = useRouter();
  const { login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await register(email, name, password, phone);

      if (response.data && response.data.token && response.data.user) {
        login(response.data.user, response.data.token);
        router.push('/');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error durante el registro');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div className="mt-6 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
        
        {/* Columna izquierda con degradado */}
        <div className="bg-gradient-to-b from-blue-500 to-indigo-500 md:w-2/5 hidden md:flex flex-col justify-between relative p-6 text-white">
          <div>
            <Link href="/" className="flex items-center hover:underline text-white">
              <ArrowLeft size={16} className="mr-2" />
              Volver al inicio
            </Link>
            <div className="mt-8">
              <h2 className="text-2xl font-bold">¡Únete ahora!</h2>
              <p className="text-sm mt-2">
                Crea una cuenta para empezar a verificar noticias de salud.
              </p>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-600 rounded-full -mb-16 -mr-16 opacity-50"></div>
          <div className="text-xs mt-auto text-white/70">© 2025 Health Check</div>
        </div>

        {/* Columna derecha */}
        <div className="p-6 md:p-8 md:w-3/5">
          <div className="md:hidden mb-4">
            <Link href="/" className="text-blue-600 flex items-center hover:underline text-sm">
              <ArrowLeft size={16} className="mr-1" />
              Volver
            </Link>
          </div>

          <div className="text-center mb-5">
            <h1 className="text-xl font-bold text-gray-900">Crear cuenta</h1>
            <p className="text-gray-600 text-sm mt-1">Regístrate para empezar</p>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 text-red-600 p-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-1">
                Nombre completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={16} className="text-gray-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Tu nombre"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">
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
                  placeholder="tu@ejemplo.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-1">
                Teléfono (opcional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone size={16} className="text-gray-400" />
                </div>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="+52 123 456 7890"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-1">
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
                  placeholder="Al menos 6 caracteres"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff size={16} className="text-gray-400" />
                  ) : (
                    <Eye size={16} className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 text-white font-medium rounded-lg text-sm 
                bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600
                transition-all duration-300 ease-in-out 
                ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Registrando...' : 'Registrarme'}
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
                Registrarme con Google
              </button>
            </div>
          </div>

          <p className="mt-4 text-center text-gray-600 text-xs">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
