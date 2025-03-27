'use client';

import { useState, useEffect } from 'react';
import ChatWidget from './ChatWidget';
import { useAuth } from '@/context/AuthContext';

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  // Si el usuario no está autenticado, no mostrar el botón
  if (!user) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <ChatWidget onClose={() => setIsOpen(false)} />
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
          aria-label="Abrir chat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ChatButton;