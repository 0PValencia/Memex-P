'use client'

import { useEffect } from 'react'

/**
 * Componente que maneja los errores de WebSocket globalmente
 * Este componente no renderiza nada visualmente
 */
export default function WebSocketErrorHandler() {
  useEffect(() => {
    // Función para interceptar y manejar errores de WebSocket
    const handleWebSocketError = (event: Event | ErrorEvent) => {
      if ('message' in event && typeof event.message === 'string') {
        // Si es un error de WebSocket, prevenimos su propagación
        if (
          event.message.includes('WebSocket') || 
          event.message.includes('walletlink') || 
          event.message.includes('WalletLink')
        ) {
          console.warn('WebSocket error interceptado:', event);
          
          // Evitar que el error se propague en la consola
          if (event.preventDefault) {
            event.preventDefault();
          }
          if (event.stopPropagation) {
            event.stopPropagation();
          }
          
          return true;
        }
      }
      return false;
    };
    
    // Función para manejar errores no capturados
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason && 
         (String(event.reason).includes('WebSocket') || 
          String(event.reason).includes('walletlink') ||
          String(event.reason).includes('WalletLink'))
      ) {
        console.warn('Promesa rechazada de WebSocket interceptada:', event.reason);
        event.preventDefault();
        return true;
      }
      return false;
    };
    
    // Registrar manejadores de errores
    window.addEventListener('error', handleWebSocketError, true);
    window.addEventListener('unhandledrejection', handleUnhandledRejection, true);
    
    // Monkey patch console.error para suprimir errores específicos de WebSocket
    const originalConsoleError = console.error;
    console.error = function(...args) {
      // Si el primer argumento es una cadena y contiene "WebSocket" o "WalletLink", no lo registramos
      if (
        args.length > 0 && 
        typeof args[0] === 'string' && 
        (args[0].includes('WebSocket') || 
         args[0].includes('walletlink') ||
         args[0].includes('WalletLink'))
      ) {
        return;
      }
      originalConsoleError.apply(console, args);
    };
    
    // Limpiar al desmontar
    return () => {
      window.removeEventListener('error', handleWebSocketError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      console.error = originalConsoleError;
    };
  }, []);
  
  // Este componente no renderiza ningún elemento visible
  return null;
} 