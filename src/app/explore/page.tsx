'use client'

import { useState, useEffect } from 'react'
import ConnectWallet from '../components/ConnectWallet'
import MemeCard from '../components/MemeCard'
import { useAllMemes, triggerMemesUpdate } from '../mocks/sampleMemes'
import { useTheme } from '../contexts/ThemeContext'
import { getTranslations } from '../contexts/translations'

export default function ExplorePage() {
  const [activeFilter, setActiveFilter] = useState<'trending' | 'latest'>('latest')
  const [displayMemes, setDisplayMemes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0) // Clave para forzar re-renderizado
  
  // Usar el contexto de tema
  const { language } = useTheme()
  
  // Obtener traducciones según el idioma actual
  const t = getTranslations(language)
  
  // Obtener todos los memes, incluidos los guardados localmente
  const allMemes = useAllMemes()
  
  // Función para actualizar manualmente
  const handleRefresh = () => {
    setIsLoading(true)
    triggerMemesUpdate()
    setRefreshKey(prevKey => prevKey + 1) // Forzar re-renderizado
  }
  
  // Actualizar los memes mostrados cuando cambien los memes o el filtro
  useEffect(() => {
    setIsLoading(true)
    
    // Simular carga de datos
    setTimeout(() => {
      if (allMemes && allMemes.length > 0) {
        // Convertir las fechas de creación a objetos Date para ordenar correctamente
        const memesWithParsedDates = allMemes.map(meme => {
          // Intentar parsear la fecha si existe
          const createdAt = meme.createdAt ? new Date(meme.createdAt) : new Date();
          return {
            ...meme,
            createdAt
          };
        });
        
        // Ordenar memes según el filtro seleccionado
        const sortedMemes = [...memesWithParsedDates].sort((a, b) => 
          activeFilter === 'trending' 
            ? b.currentBets - a.currentBets
            : b.createdAt.getTime() - a.createdAt.getTime() // Ordenar por los más recientes
        );
        
        setDisplayMemes(sortedMemes);
      } else {
        setDisplayMemes([]);
      }
      
      setIsLoading(false);
    }, 500);
  }, [allMemes, activeFilter, refreshKey]);

  return (
    <main className="min-h-screen bg-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-4 sm:mb-0">
            {activeFilter === 'trending' ? t.trending : t.exploreMore}
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleRefresh}
              className="p-2 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
              disabled={isLoading}
              title="Actualizar memes"
            >
              <svg 
                className={`w-6 h-6 text-blue-600 ${isLoading ? 'animate-spin' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                />
              </svg>
            </button>
            <ConnectWallet />
          </div>
        </div>
        
        <div className="mb-8">
          <div className="inline-flex border rounded-lg overflow-hidden shadow">
            <button
              onClick={() => setActiveFilter('trending')}
              className={`px-5 py-2.5 font-medium transition-colors ${
                activeFilter === 'trending' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Trending
            </button>
            <button
              onClick={() => setActiveFilter('latest')}
              className={`px-5 py-2.5 font-medium transition-colors ${
                activeFilter === 'latest' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Recientes
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow animate-pulse">
                <div className="h-64 bg-gray-200 rounded-t-lg"></div>
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {displayMemes.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayMemes.map((meme) => (
                  <MemeCard key={`${meme.id}-${refreshKey}`} {...meme} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-lg shadow">
                <p className="text-gray-500 mb-6">{t.noMemesFound}</p>
                <a 
                  href="/create" 
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  {t.createMeme}
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
} 