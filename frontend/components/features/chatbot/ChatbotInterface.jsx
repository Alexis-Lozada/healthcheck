// src/components/features/Chatbot/ChatbotInterface.jsx
import { AlertCircle, Send, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const ChatbotInterface = ({ userId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [conversationId, setConversationId] = useState(null);
    
    const messagesEndRef = useRef(null);
    useEffect(() => {
        if (isOpen && !conversationId && messages.length === 0) {
            startNewConversation();
        }
    }, [isOpen]);
    
    // Scroll automático al último mensaje
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);
    
    const startNewConversation = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`/api/chatbot?userId=${userId || ''}`);
            const data = await response.json();
            
            if (data.success) {
                setConversationId(data.data.conversacionId);
                setMessages([
                    {
                        id: Date.now(),
                        text: data.data.mensaje,
                        isUser: false,
                        timestamp: data.data.timestamp
                    }
                ]);
            } else {
                throw new Error(data.error || 'Error iniciando conversación');
            }
        } catch (err) {
            console.error('Error iniciando chatbot:', err);
            setError('No pudimos iniciar el asistente. Por favor, intenta de nuevo más tarde.');
            
            // Mensaje de fallback si falla la conexión
            setMessages([
                {
                    id: Date.now(),
                    text: "¡Hola! Soy el asistente de HealthCheck. Parece que hay un problema de conexión, pero intentaré ayudarte de todos modos.",
                    isUser: false,
                    timestamp: new Date().toISOString()
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!newMessage.trim() || isLoading) return;
        
        const messageText = newMessage.trim();
        setNewMessage('');
        
        // Agregar mensaje del usuario al chat
        const userMessage = {
            id: Date.now(),
            text: messageText,
            isUser: true,
            timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        
        try {
            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mensaje: messageText,
                    userId: userId,
                    conversacionId: conversationId
                }),
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Agregar respuesta del asistente
                const botMessage = {
                    id: Date.now() + 1,
                    text: data.data.mensaje,
                    isUser: false,
                    timestamp: data.data.timestamp,
                    categoria: data.data.categoria
                };
                
                setMessages(prev => [...prev, botMessage]);
            } else {
                throw new Error(data.error || 'Error en la respuesta');
            }
        } catch (err) {
            console.error('Error en chatbot:', err);
            
            // Mensaje de error genérico
            const errorMessage = {
                id: Date.now() + 1,
                text: "Lo siento, tuve un problema al procesar tu mensaje. ¿Podrías intentarlo de nuevo?",
                isUser: false,
                timestamp: new Date().toISOString(),
                isError: true
            };
            
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    // Formatear la hora del mensaje
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    
    return (
        <>
            {/* Botón flotante para abrir el chat */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors z-50"
                    aria-label="Abrir asistente de HealthCheck"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                </button>
            )}
            
            {/* Interfaz de chatbot */}
            {isOpen && (
                <div className="fixed bottom-0 right-0 w-full sm:w-96 h-[30rem] sm:h-[32rem] bg-white shadow-xl rounded-t-xl sm:rounded-xl sm:bottom-6 sm:right-6 flex flex-col overflow-hidden z-50 transition-all duration-300 border border-gray-200">
                    {/* Cabecera */}
                    <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
                        <div className="flex items-center">
                            <span className="h-2 w-2 bg-green-400 rounded-full mr-2"></span>
                            <div>
                                <h3 className="font-bold">Asistente HealthCheck</h3>
                                <p className="text-xs text-blue-100">Resolviendo dudas sobre salud</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:text-gray-200 focus:outline-none"
                            aria-label="Cerrar chat"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    
                    {/* Mensajes */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-start">
                                <AlertCircle className="mr-2 flex-shrink-0" size={16} />
                                <span>{error}</span>
                            </div>
                        )}
                        
                        <div className="space-y-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                            message.isUser
                                                ? 'bg-blue-600 text-white'
                                                : message.isError
                                                    ? 'bg-red-50 text-red-800 border border-red-200'
                                                    : 'bg-white text-gray-800 border border-gray-200'
                                        }`}
                                    >
                                        <div className="mb-1 text-sm">{message.text}</div>
                                        <div
                                            className={`text-xs ${
                                                message.isUser ? 'text-blue-200' : 'text-gray-500'
                                            } text-right`}
                                        >
                                            {formatTime(message.timestamp)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white text-gray-500 rounded-lg px-4 py-2 border border-gray-200">
                                        <div className="flex space-x-1">
                                            <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                                            <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                    
                    {/* Formulario de entrada */}
                    <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 bg-white">
                        <div className="flex">
                            <input
                                type="text"
                                placeholder="Escribe tu consulta sobre temas de salud..."
                                className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                className={`bg-blue-600 text-white p-2 rounded-r-lg ${
                                    isLoading || !newMessage.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                                }`}
                                disabled={isLoading || !newMessage.trim()}
                            >
                                <Send size={20} />
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">
                            Recuerda que este chatbot es solo para fines informativos y educativos. No reemplaza el consejo médico profesional.
                        </p>
                    </form>
                </div>
            )}
        </>
    );
};

export default ChatbotInterface;