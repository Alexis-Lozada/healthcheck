"use client";

import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Logout = ({ className, variant = "default", showIcon = true }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await signOut({ redirect: false });
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Diferentes variantes de estilo
  const variants = {
    default: "flex items-center text-red-600 hover:text-red-700 font-medium",
    button: "flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors",
    subtle: "flex items-center text-gray-600 hover:text-red-600 transition-colors",
    dropdown: "flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={className || variants[variant]}
    >
      {showIcon && <LogOut size={16} className="mr-2" />}
      {isLoading ? "Cerrando sesión..." : "Cerrar sesión"}
    </button>
  );
};

export default Logout;