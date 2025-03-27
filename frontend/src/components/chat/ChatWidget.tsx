'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';

// Definimos la URL base de la API Gateway
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

interface Message {
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatWidgetProps {
  onClose: () => void;
}

const ChatWidget = ({ onClose }: ChatWidgetProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      content: 'Hola, soy el asistente de HealthCheck. ¿En qué puedo ayudarte a verificar información sobre salud?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Generar un ID de sesión único cuando se carga el componente
  useEffect(() => {
    // Usar el ID del usuario concatenado con un timestamp para crear un ID de sesión único
    const uniqueId = `${user?.id || 'guest'}_${Date.now()}`;
    setSessionId(uniqueId);
  }, [user]);

  // Scroll automático al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que hay texto en el input
    if (!input.trim()) return;
    
    // Obtener token de autenticación
    const token = localStorage.getItem('token');
    
    // Crear nuevo mensaje del usuario
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    // Actualizar estado
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    try {
      // Enviar mensaje al chatbot
      const response = await fetch(`${API_URL}/ml/chatbot/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: input,
          session_id: sessionId,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al comunicarse con el chatbot');
      }
      
      // Crear mensaje del bot
      const botMessage: Message = {
        role: 'bot',
        content: data.response || 'Lo siento, no pude procesar tu solicitud en este momento.',
        timestamp: new Date(),
      };
      
      // Actualizar estado con la respuesta del bot
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error en chatbot:', error);
      
      // Mensaje de error como respuesta del bot
      const errorMessage: Message = {
        role: 'bot',
        content: 'Lo siento, ocurrió un error al procesar tu mensaje. Por favor, intenta de nuevo más tarde.',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white rounded-lg shadow-xl w-80 sm:w-96 flex flex-col overflow-hidden max-h-[600px] border border-gray-200">
      {/* Cabecera */}
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h3 className="font-medium">Asistente HealthCheck</h3>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200"
          aria-label="Cerrar chat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <div>{message.content}</div>
              <div
                className={`text-xs mt-1 ${
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}
              >
                {formatTimestamp(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 rounded-lg p-3 max-w-[80%]">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Formulario de entrada */}
      <form onSubmit={handleSubmit} className="p-2 border-t border-gray-200">
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Escribe tu mensaje..."
            disabled={isTyping}
          />
          <button
            type="submit"
            className={`px-4 py-2 bg-blue-600 text-white rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isTyping ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
            disabled={isTyping}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWidget;