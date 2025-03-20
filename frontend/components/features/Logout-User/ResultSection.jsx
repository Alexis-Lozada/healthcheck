// src/components/features/Logout-user/ResultSection.jsx
import { AlertTriangle, Check, Info, Link, Share2, ThumbsDown, ThumbsUp, X } from 'lucide-react';
import { useState } from 'react';

const ResultSection = ({ resultData, onInteraction }) => {
    const [selectedTab, setSelectedTab] = useState('analysis');
    
    // Si no hay datos de resultado, mostrar un resultado de ejemplo o un mensaje
    const data = resultData || {
        noticia_id: 0,
        resultado: 'falsa',
        titulo: 'Las inyecciones de dióxido de cloro pueden eliminar el COVID-19 en pocas horas según un estudio reciente.',
        confianza: 5,
        explicacion: 'Esta información sobre el dióxido de cloro como tratamiento para COVID-19 ha sido desmentida por múltiples autoridades de salud. El dióxido de cloro no es un tratamiento aprobado y puede ser peligroso para la salud.',
        fuentes: [
            {
                id: 1,
                nombre: 'Administración de Alimentos y Medicamentos (FDA)',
                descripcion: 'Ha emitido advertencias contra el uso de dióxido de cloro como tratamiento para cualquier enfermedad.',
                url: 'https://www.fda.gov/consumers/articulos-en-espanol/peligro-no-beba-la-solucion-mineral-milagrosa-o-mms'
            },
            {
                id: 2,
                nombre: 'Organización Mundial de la Salud (OMS)',
                descripcion: 'No reconoce el dióxido de cloro como tratamiento para COVID-19 y advierte sobre sus riesgos.',
                url: 'https://www.who.int/es/emergencies/diseases/novel-coronavirus-2019/advice-for-public/myth-busters'
            },
            {
                id: 3,
                nombre: 'Secretaría de Salud de México',
                descripcion: 'Ha alertado sobre los peligros de este compuesto y su falta de eficacia contra COVID-19.',
                url: '#'
            }
        ],
        informacion_correcta: 'No existe evidencia científica que respalde el uso de dióxido de cloro como tratamiento para COVID-19. Los tratamientos aprobados incluyen antivirales específicos bajo supervisión médica y vacunas para la prevención.',
        informacion_adicional: [
            'Irritación severa del sistema digestivo',
            'Insuficiencia respiratoria',
            'Alteraciones en la actividad eléctrica del corazón',
            'Metahemoglobinemia (un trastorno de la sangre)',
            'Insuficiencia renal aguda'
        ]
    };

    // Asegurar que la confianza siempre esté entre 0 y 100
    const confianzaValue = Math.max(0, Math.min(100, data.confianza));

    // Determinar colores y estilos basados en el resultado
    const getResultStyles = () => {
        switch(data.resultado) {
            case 'verdadera':
                return {
                    color: 'green',
                    title: 'Información Verificada',
                    icon: <Check size={40} />,
                    gradientFrom: 'from-green-600',
                    gradientTo: 'to-green-500',
                    confidenceColor: 'bg-green-600',
                    labelBg: 'bg-green-50',
                    labelBorder: 'border-green-200',
                    labelIcon: <Check className="text-green-600 mr-2" size={20} />,
                    confidenceText: 'Información verificada'
                };
            case 'dudosa':
                return {
                    color: 'yellow',
                    title: 'Información Parcialmente Incorrecta',
                    icon: <AlertTriangle size={40} />,
                    gradientFrom: 'from-yellow-500',
                    gradientTo: 'to-yellow-400',
                    confidenceColor: 'bg-yellow-500',
                    labelBg: 'bg-yellow-50',
                    labelBorder: 'border-yellow-200',
                    labelIcon: <AlertTriangle className="text-yellow-600 mr-2" size={20} />,
                    confidenceText: 'Información parcialmente correcta'
                };
            case 'falsa':
            default:
                return {
                    color: 'red',
                    title: 'Información Potencialmente Peligrosa',
                    icon: <AlertTriangle size={40} />,
                    gradientFrom: 'from-red-600',
                    gradientTo: 'to-red-500',
                    confidenceColor: 'bg-red-600',
                    labelBg: 'bg-red-50',
                    labelBorder: 'border-red-200',
                    labelIcon: <X className="text-red-600 mr-2" size={20} />,
                    confidenceText: 'Información altamente cuestionable'
                };
        }
    };

    const styles = getResultStyles();

    const handleInteraction = (type) => {
        if (data.noticia_id && onInteraction) {
            let interactionType;
            switch (type) {
                case 'useful':
                    interactionType = 'marcar_confiable';
                    break;
                case 'notUseful':
                    interactionType = 'marcar_dudosa';
                    break;
                case 'share':
                    interactionType = 'compartir';
                    break;
                default:
                    return;
            }
            
            onInteraction(data.noticia_id, interactionType);
        }
    };

    const handleShare = () => {
        handleInteraction('share');
        
        if (navigator.share) {
            navigator.share({
                title: 'Verificación de Health Check',
                text: `"${data.titulo}" - Health Check ha verificado esta información y la ha clasificado como ${data.resultado}.`,
                url: window.location.href,
            }).catch(err => console.error('Error compartiendo:', err));
        } else {
            // Fallback para navegadores que no soportan Web Share API
            const shareText = `"${data.titulo}" - Health Check ha verificado esta información y la ha clasificado como ${data.resultado}.`;
            navigator.clipboard.writeText(shareText)
                .then(() => alert('Información copiada al portapapeles'))
                .catch(err => console.error('Error copiando al portapapeles:', err));
        }
    };

    return (
        <section className="bg-white rounded-xl shadow-lg overflow-hidden mb-12 transition-all duration-300 transform hover:shadow-xl">
            {/* Cabecera de resultado */}
            <div className={`bg-gradient-to-r ${styles.gradientFrom} ${styles.gradientTo} p-6 text-white`}>
                <div className="flex items-center">
                    <div className="w-20 h-20 rounded-full bg-white bg-opacity-20 text-white flex items-center justify-center text-3xl mr-4 shadow-lg">
                        {styles.icon}
                    </div>
                    <div>
                        <span className="text-sm font-medium inline-block bg-white bg-opacity-30 rounded-full px-3 py-1 mb-2">
                            Verificación completada
                        </span>
                        <h2 className="text-2xl md:text-3xl font-bold">{styles.title}</h2>
                    </div>
                </div>
            </div>
            
            {/* Navegación por pestañas */}
            <div className="border-b border-gray-200">
                <div className="flex overflow-x-auto">
                    <button 
                        className={`px-4 py-3 font-medium text-sm focus:outline-none ${
                            selectedTab === 'analysis' 
                            ? 'border-b-2 border-blue-600 text-blue-600' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setSelectedTab('analysis')}
                    >
                        Análisis
                    </button>
                    <button 
                        className={`px-4 py-3 font-medium text-sm focus:outline-none ${
                            selectedTab === 'sources' 
                            ? 'border-b-2 border-blue-600 text-blue-600' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setSelectedTab('sources')}
                    >
                        Fuentes
                    </button>
                    <button 
                        className={`px-4 py-3 font-medium text-sm focus:outline-none ${
                            selectedTab === 'facts' 
                            ? 'border-b-2 border-blue-600 text-blue-600' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setSelectedTab('facts')}
                    >
                        Información Correcta
                    </button>
                </div>
            </div>
            
            {/* Contenido de pestañas */}
            <div className="p-6">
                {selectedTab === 'analysis' && (
                    <div className="space-y-6">
                        <div className={`${styles.labelBg} border ${styles.labelBorder} rounded-lg p-4`}>
                            <div className="font-bold text-gray-800 mb-2 flex items-center">
                                {styles.labelIcon}
                                Análisis General:
                            </div>
                            <p className="text-gray-700">
                                {data.explicacion}
                            </p>
                        </div>

                        <div>
                            <div className="font-bold mb-2 text-gray-800">Nivel de Confiabilidad:</div>
                            <div className="bg-gray-100 p-4 rounded-lg">
                                <div className="flex justify-between mb-1">
                                    <span className="font-medium" style={{color: `var(--${styles.color}-700, #b91c1c)`}}>
                                        {confianzaValue}% - {styles.confidenceText}
                                    </span>
                                    <span className="text-gray-500 text-sm">{confianzaValue}/100</span>
                                </div>
                                <div className="h-3 bg-gray-300 rounded-full mt-2 overflow-hidden">
                                    <div className={`h-full ${styles.confidenceColor} rounded-full`} style={{ width: `${confianzaValue}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {selectedTab === 'sources' && (
                    <div className="space-y-4">
                        <div className="font-bold mb-2 text-gray-800">Fuentes Oficiales:</div>
                        <div className="space-y-3">
                            {data.fuentes && data.fuentes.map(fuente => (
                                <div key={fuente.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="font-medium text-blue-800">{fuente.nombre}</div>
                                    <p className="text-gray-700 mt-1">{fuente.descripcion}</p>
                                    {fuente.url && fuente.url !== '#' && (
                                        <a 
                                            href={fuente.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="text-blue-600 text-sm mt-2 inline-flex items-center hover:underline"
                                        >
                                            <Link size={14} className="mr-1" />
                                            Ver fuente
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {selectedTab === 'facts' && (
                    <div className="space-y-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="font-bold text-gray-800 mb-2 flex items-center">
                                <Check className="text-green-600 mr-2" size={20} />
                                Información Correcta:
                            </div>
                            <p className="text-gray-700">
                                {data.informacion_correcta}
                            </p>
                        </div>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start">
                                <Info className="text-blue-600 mr-2 mt-1" size={18} />
                                <div>
                                    <div className="font-medium text-gray-800">Información adicional</div>
                                    <p className="text-gray-700 mt-1 text-sm">
                                        El consumo de dióxido de cloro puede causar efectos secundarios graves, incluyendo:
                                    </p>
                                    <ul className="list-disc pl-5 mt-2 text-sm text-gray-700 space-y-1">
                                        {data.informacion_adicional && data.informacion_adicional.map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Acciones de usuario */}
            <div className="bg-gray-50 p-4 border-t border-gray-200 flex flex-wrap justify-between">
                <div className="flex space-x-2">
                    <button 
                        className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm rounded-full bg-white text-gray-700 hover:bg-gray-50"
                        onClick={() => handleInteraction('useful')}
                    >
                        <ThumbsUp size={16} className="mr-1" />
                        Útil
                    </button>
                    <button 
                        className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm rounded-full bg-white text-gray-700 hover:bg-gray-50"
                        onClick={() => handleInteraction('notUseful')}
                    >
                        <ThumbsDown size={16} className="mr-1" />
                        No útil
                    </button>
                </div>
                <button 
                    className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm rounded-full bg-white text-gray-700 hover:bg-gray-50"
                    onClick={handleShare}
                >
                    <Share2 size={16} className="mr-1" />
                    Compartir
                </button>
            </div>
        </section>
    );
};

export default ResultSection;