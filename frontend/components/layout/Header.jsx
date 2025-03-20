// src/components/layout/Header.jsx
import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
    // Función para manejar el scroll suave a las secciones
    const scrollToSection = (event, sectionId) => {
        // Previene la navegación predeterminada
        event.preventDefault();
        
        // Busca el elemento y hace scroll hacia él
        const section = document.getElementById(sectionId);
        if (section) {
            // Obtener la posición del elemento
            const sectionPosition = section.getBoundingClientRect().top;
            // Obtener la posición actual de scroll
            const offsetPosition = sectionPosition + window.pageYOffset - 80; // 80px es la altura del header
            
            // Hacer scroll a la posición calculada
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <header className="bg-[#DDE6EB] shadow fixed top-0 left-0 right-0 z-50 h-20">
            <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <nav className="navbar">
                        <Link href="/">
                            <Image
                                src="/images/HealthCheck.png"
                                alt="HealthCheck Logo"
                                width={140}
                                height={50}
                                priority
                            />
                        </Link>
                    </nav>
                    <nav className="mt-4 md:mt-0">
                        <ul className="flex flex-wrap">
                            <li className="mr-10 mb-2">
                                <a 
                                    href="#about-us" 
                                    onClick={(e) => scrollToSection(e, 'about-us')}
                                    className="text-gray-800 hover:text-blue-600 font-medium cursor-pointer"
                                >
                                    Quienes somos
                                </a>
                            </li>
                            <li className="mr-10 mb-2">
                                <a 
                                    href="#how-it-works" 
                                    onClick={(e) => scrollToSection(e, 'how-it-works')}
                                    className="text-gray-800 hover:text-blue-600 font-medium cursor-pointer"
                                >
                                    Cómo funciona
                                </a>
                            </li>
                            <li className="mr-10 mb-2">
                                <a 
                                    href="#benefits" 
                                    onClick={(e) => scrollToSection(e, 'benefits')}
                                    className="text-gray-800 hover:text-blue-600 font-medium cursor-pointer"
                                >
                                    Beneficios
                                </a>
                            </li>
                            <li className="mr-10 mb-2">
                                <Link href="/login" className="text-gray-800 hover:text-blue-600 font-medium">
                                    Iniciar sesión
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;