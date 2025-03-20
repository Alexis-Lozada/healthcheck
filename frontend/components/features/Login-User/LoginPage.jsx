"use client"

import { ArrowLeft, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { signIn } from "next-auth/react";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Verificar si viene desde registro exitoso o hay algún error
  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccess('Registro exitoso. Ahora puedes iniciar sesión.');
    }
    
    // Verificar errores específicos
    const errorType = searchParams.get('error');
    if (errorType) {
      if (errorType === 'OAuthAccountNotLinked') {
        setError('Esta cuenta de correo ya está registrada con otro método de inicio de sesión. Por favor, usa el método con el que te registraste originalmente.');
      } else if (errorType === 'Callback') {
        setError('Hubo un problema al procesar tu solicitud de inicio de sesión. Por favor, intenta de nuevo.');
      } else {
        setError(`Error al iniciar sesión: ${errorType}`);
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!email || !password) {
      setError('Por favor complete todos los campos');
      setLoading(false);
      return;
    }

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        // Manejar diferentes errores basados en el mensaje
        if (result.error.includes("no encontrado")) {
          setError('Usuario no encontrado. ¿Deseas registrarte?');
        } else if (result.error.includes("contraseña")) {
          setError('Contraseña incorrecta. Por favor intenta nuevamente.');
        } else {
          setError('Error al iniciar sesión. ' + result.error);
        }
        setLoading(false);
        return;
      }

      router.push('/healthcheckhome');
    } catch (err) {
      setError('Error al iniciar sesión. Por favor intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    
    try {
      // Primero, intentar iniciar sesión con Google a través de NextAuth
      const result = await signIn('google', {
        redirect: false, // Importante: no redirigir automáticamente
        callbackUrl: '/healthcheckhome',
      });
  
      if (result?.error === "AccessDenied") {
        // Si hay un error de acceso denegado, puede ser por el problema con el enum
        console.log("Error de AccessDenied, intentando ruta alternativa");
        
        // Obtener el token y perfil de Google directamente (aquí deberías implementar
        // la lógica para obtener el perfil de Google usando el Google SDK u OAuth)
        
        // Para efectos de demostración, asumimos que obtenemos un perfil así:
        const googleProfile = {
          email: "usuario@gmail.com", // Esto vendría del login de Google
          name: "Nombre Usuario", // Esto vendría del login de Google
          id: "12345678" // Esto vendría del login de Google
        };
        
        // Enviar el perfil a nuestra API personalizada
        const registerResponse = await fetch('/api/auth/google-register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ profile: googleProfile }),
        });
        
        const registerData = await registerResponse.json();
        
        if (registerData.success) {
          // Usuario registrado o encontrado, ahora intentar iniciar sesión nuevamente
          await signIn('google', {
            callbackUrl: '/healthcheckhome',
          });
        } else {
          setError('Error al registrar usuario con Google: ' + registerData.error);
          setLoading(false);
        }
      } else if (result?.error) {
        // Otro error diferente
        setError('Error al iniciar sesión con Google: ' + result.error);
        setLoading(false);
      } else if (result?.url) {
        // Éxito, redireccionar
        router.push(result.url);
      }
    } catch (err) {
      console.error("Error en el proceso:", err);
      setError('Error al registrar con Google.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
        {/* Columna izquierda */}
        <div className="bg-blue-600 md:w-2/5 hidden md:flex flex-col justify-between relative p-6">
          <div>
            <Link href="/" className="text-white flex items-center hover:underline">
              <ArrowLeft size={16} className="mr-2" />
              Volver al inicio
            </Link>
            
            <div className="mt-8">
              <h2 className="text-white text-2xl font-bold">Bienvenido</h2>
              <p className="text-blue-100 text-sm mt-2">
                Inicia sesión para acceder a información verificada sobre salud.
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
            <div className="mb-4 bg-red-50 text-red-600 p-2 rounded-lg text-sm flex flex-col">
              <p>{error}</p>
              {error.includes("no encontrado") && (
                <Link href="/register" className="text-blue-600 text-xs mt-1 font-medium">
                  Ir a la página de registro →
                </Link>
              )}
            </div>
          )}
          
          {success && (
            <div className="mb-4 bg-green-50 text-green-600 p-2 rounded-lg text-sm">
              {success}
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
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
            
            <div className="text-right">
              <Link href="/forgot-password" className="text-xs text-blue-600 hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            
            <button
              type="submit"
              className={`w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm ${loading ? 'opacity-70 cursor-wait' : ''}`}
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
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
                disabled={loading}
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

export default LoginPage;