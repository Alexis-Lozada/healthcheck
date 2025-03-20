"use client"

import { ArrowLeft, Eye, EyeOff, Lock, Mail, Phone, User } from 'lucide-react';
import { signIn } from "next-auth/react";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const RegisterPage = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Verificar si el correo electrónico ya está registrado
  const checkEmailExists = async (email) => {
    try {
      const response = await fetch(`/api/check-email?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      return data.exists;
    } catch (err) {
      console.error("Error verificando email:", err);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Por favor complete los campos requeridos');
      setLoading(false);
      return;
    }

    try {
      // Verificar si el correo ya está registrado
      const emailExists = await checkEmailExists(email);
      
      if (emailExists) {
        setError('Este correo electrónico ya está registrado. Por favor inicia sesión.');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, telefono, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400 && data.error === "El correo ya está registrado") {
          setError('Este correo electrónico ya está registrado. Por favor inicia sesión.');
        } else {
          throw new Error(data.error || 'Error al registrarse');
        }
      } else {
        router.push('/login?registered=true');
      }
    } catch (err) {
      setError(err.message || 'Error al registrarse. Por favor intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signIn('google', {
        callbackUrl: '/login',
      });
    } catch (err) {
      setError('Error al registrarse con Google.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
        {/* Columna izquierda */}
        <div className="bg-blue-600 md:w-2/5 hidden md:flex flex-col justify-between relative p-6">
          <div>
            <Link href="/login" className="text-white flex items-center hover:underline">
              <ArrowLeft size={16} className="mr-2" />
              Volver a inicio de sesión
            </Link>
            
            <div className="mt-8">
              <h2 className="text-white text-2xl font-bold">Bienvenido</h2>
              <p className="text-blue-100 text-sm mt-2">
                Regístrate para acceder a información verificada sobre salud.
              </p>
            </div>
          </div>
          
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500 rounded-full -mb-16 -mr-16 opacity-50"></div>
          <div className="text-blue-200 text-xs mt-auto">
            © 2025 Health Check
          </div>
        </div>
        
        {/* Columna derecha */}
        <div className="p-6 md:p-8 md:w-3/5">
          <div className="md:hidden mb-4">
            <Link href="/login" className="text-blue-600 flex items-center hover:underline text-sm">
              <ArrowLeft size={16} className="mr-1" />
              Volver
            </Link>
          </div>
          
          <div className="text-center mb-5">
            <h1 className="text-xl font-bold text-gray-900">Registro</h1>
          </div>
          
          {error && (
            <div className="mb-4 bg-red-50 text-red-600 p-2 rounded-lg text-sm flex flex-col">
              <p>{error}</p>
              {error.includes("ya está registrado") && (
                <Link href="/healthcheck" className="text-blue-600 text-xs mt-1 font-medium">
                  Ir a iniciar sesión →
                </Link>
              )}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Campo de nombre */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="nombre">
                Nombre
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={16} className="text-gray-400" />
                </div>
                <input
                  id="nombre"
                  type="text"
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Tu nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
            </div>
            
            {/* Campo de email */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="email">
                Correo electrónico *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Campo de teléfono */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="telefono">
                Teléfono
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone size={16} className="text-gray-400" />
                </div>
                <input
                  id="telefono"
                  type="tel"
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Tu número de teléfono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
              </div>
            </div>
            
            {/* Campo de contraseña */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="password">
                Contraseña *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={16} className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-9 pr-9 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 
                    <EyeOff size={16} className="text-gray-400" /> : 
                    <Eye size={16} className="text-gray-400" />
                  }
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              className={`w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm mt-3 ${loading ? 'opacity-70 cursor-wait' : ''}`}
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrar'}
            </button>
          </form>
          
          <div className="mt-3">
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
                disabled={loading}
              >
                <Image src="/images/google.png" alt="Google logo" width={16} height={16} className="mr-2" />
                Registrar con Google
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

export default RegisterPage;