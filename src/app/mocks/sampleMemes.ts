import { useEffect, useState } from 'react';

export interface Meme {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  creator: string;
  currentBets: number;
  totalPot: number;
  createdAt?: string; // Fecha de creación como string ISO
}

// No hay memes de ejemplo predeterminados
export const sampleMemes: Meme[] = [];

// Crear un evento personalizado para notificar cambios en los memes
export const MEME_UPDATE_EVENT = 'memex_memes_updated';

// Función para disparar actualización de memes
export function triggerMemesUpdate() {
  if (typeof window !== 'undefined') {
    // Disparar evento personalizado para actualizar los memes en todos los componentes
    window.dispatchEvent(new CustomEvent(MEME_UPDATE_EVENT));
  }
}

// Hook para obtener memes guardados localmente
export function useAllMemes() {
  const [allMemes, setAllMemes] = useState<Meme[]>([]);
  
  // Función para cargar memes del almacenamiento local
  const loadMemes = () => {
    if (typeof window !== 'undefined') {
      try {
        const savedMemesJson = localStorage.getItem('memex_uploaded_memes');
        if (savedMemesJson) {
          const savedMemes = JSON.parse(savedMemesJson);
          setAllMemes(savedMemes);
        }
      } catch (error) {
        console.error('Error al cargar memes locales:', error);
      }
    }
  };
  
  // Cargar memes al montar el componente
  useEffect(() => {
    loadMemes();
    
    // Escuchar el evento personalizado para actualizar los memes
    const handleMemesUpdate = () => loadMemes();
    window.addEventListener(MEME_UPDATE_EVENT, handleMemesUpdate);
    
    // Limpiar listener al desmontar
    return () => {
      window.removeEventListener(MEME_UPDATE_EVENT, handleMemesUpdate);
    };
  }, []);
  
  return allMemes;
}

export default sampleMemes; 