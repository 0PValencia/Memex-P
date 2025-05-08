'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { formatEther } from 'viem'
import { sampleMemes } from '../mocks/sampleMemes'
import ConnectWallet from '../components/ConnectWallet'

interface TrendingMeme {
  id: string
  title: string
  imageUrl: string
  description: string
  creator: string
  totalPot: number
  viralityScore: number
  apuestas: number
  createdAt: Date
}

export default function TrendingPage() {
  const [trendingMemes, setTrendingMemes] = useState<TrendingMeme[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'viralidad' | 'apuestas' | 'nuevos'>('viralidad')

  useEffect(() => {
    // Simulación de carga de datos de tendencias
    const fetchTrendingMemes = async () => {
      setTimeout(() => {
        // Generar datos de muestra basados en sampleMemes
        const memeData: TrendingMeme[] = sampleMemes.map(meme => ({
          id: meme.id,
          title: meme.title,
          imageUrl: meme.imageUrl,
          description: meme.description,
          creator: meme.creator,
          totalPot: meme.totalPot,
          viralityScore: Math.floor(Math.random() * 100),
          apuestas: Math.floor(Math.random() * 100) + 1,
          createdAt: new Date(Date.now() - Math.random() * 30 * 86400000)  // Últimos 30 días
        }));
        
        setTrendingMemes(memeData);
        setIsLoading(false);
      }, 1200);
    };

    fetchTrendingMemes();
  }, []);

  // Ordenar memes según el criterio seleccionado
  const sortedMemes = [...trendingMemes].sort((a, b) => {
    if (sortBy === 'viralidad') {
      return b.viralityScore - a.viralityScore;
    } else if (sortBy === 'apuestas') {
      return b.apuestas - a.apuestas;
    } else {
      // Nuevos (más recientes primero)
      return b.createdAt.getTime() - a.createdAt.getTime();
    }
  });

  return (
    <main className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-black">Memes en Tendencia</h1>
          <ConnectWallet />
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <p className="text-gray-600 mb-4">
            Descubre los memes más virales y con más apuestas de la plataforma. ¡Encuentra el próximo meme que generará recompensas!
          </p>
          
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setSortBy('viralidad')}
              className={`px-4 py-2 rounded-full ${
                sortBy === 'viralidad' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Más Virales
            </button>
            <button 
              onClick={() => setSortBy('apuestas')}
              className={`px-4 py-2 rounded-full ${
                sortBy === 'apuestas' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Más Apostados
            </button>
            <button 
              onClick={() => setSortBy('nuevos')}
              className={`px-4 py-2 rounded-full ${
                sortBy === 'nuevos' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Más Recientes
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedMemes.map(meme => (
              <div key={meme.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
                <Link href={`/meme/${meme.id}`} className="block">
                  <div className="relative h-48">
                    <Image
                      src={meme.imageUrl}
                      alt={meme.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {sortBy === 'viralidad' ? `${meme.viralityScore} puntos` : `${meme.apuestas} apuestas`}
                    </div>
                  </div>
                </Link>
                
                <div className="p-4">
                  <Link href={`/meme/${meme.id}`} className="block">
                    <h2 className="text-xl font-bold text-black mb-1 hover:text-blue-600">{meme.title}</h2>
                  </Link>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{meme.description}</p>
                  
                  <div className="flex justify-between text-sm text-gray-500 mb-3">
                    <span>Creado: {meme.createdAt.toLocaleDateString()}</span>
                    <span>Bote: {meme.totalPot} ETH</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 bg-gray-200 rounded-full w-24 overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 rounded-full" 
                          style={{ width: `${meme.viralityScore}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">Viralidad</span>
                    </div>
                    
                    <Link 
                      href={`/meme/${meme.id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Ver detalles →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
} 