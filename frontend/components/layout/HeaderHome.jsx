"use client";

import { ChevronDown, LogOut, User } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const HeaderHome = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { data: session, status } = useSession();
    const router = useRouter();
    
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };
    
    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.push('/login');
    };
    
    const handleProfileClick = () => {
        router.push('/profile');
        setDropdownOpen(false);
    };
    
    return (
        <header className="bg-white shadow-sm py-4">
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center">
                    <Image 
                        src="/images/HealthCheck.png" 
                        alt="Logo" 
                        width={180} 
                        height={40} 
                    />
                </div>
                
                {/* Espacio vacío donde estaba la navegación */}
                <div className="flex-grow"></div>
                
                {/* Perfil de usuario - Modificado para mostrar solo icono y nombre */}
                <div className="relative">
                    <button 
                        onClick={toggleDropdown}
                        className="flex items-center text-gray-700 hover:text-blue-600 focus:outline-none"
                    >
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                            <User size={18} className="text-blue-600" />
                        </div>
                        <span className="font-medium mr-1">
                            {status === "authenticated" 
                                ? (session?.user?.name || session?.user?.email || "Mi cuenta")
                                : "Mi cuenta"}
                        </span>
                        <ChevronDown size={16} />
                    </button>
                    
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                            {status === "authenticated" && (
                                <div className="px-4 py-2 border-b border-gray-100">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {session?.user?.name || "Usuario"}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {session?.user?.email}
                                    </p>
                                </div>
                            )}
                            
                            <div onClick={handleProfileClick} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                                Mi perfil
                            </div>
                            <div className="border-t border-gray-100 my-1"></div>
                            <button 
                                onClick={handleSignOut}
                                className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                                <LogOut size={16} className="mr-2" />
                                Cerrar sesión
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default HeaderHome;