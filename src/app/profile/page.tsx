'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import ProfileCard from '../components/ProfileCard'
import ConnectWallet from '../components/ConnectWallet'
import MemeCard from '../components/MemeCard'
import { sampleMemes } from '../mocks/sampleMemes'

export default function ProfilePage() {
  const { address, isConnected } = useAccount()
  const [mounted, setMounted] = useState(false)
  const [userMemes, setUserMemes] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('created')
  
  // Asegurar que el componente solo se monte en el cliente
  useEffect(() => {
    setMounted(true)
  }, [])

  // Cargar memes del usuario desde localStorage o mocks
  useEffect(() => {
    if (mounted && address) {
      // Intentar obtener memes de localStorage primero
      try {
        const savedMemesJson = localStorage.getItem('memex_uploaded_memes')
        if (savedMemesJson) {
          const savedMemes = JSON.parse(savedMemesJson)
          const filteredMemes = savedMemes.filter((meme: any) => 
            meme.creator.toLowerCase() === address.toLowerCase()
          )
          
          if (filteredMemes.length > 0) {
            setUserMemes(filteredMemes)
            return
          }
        }
      } catch (err) {
        console.error('Error al cargar memes de localStorage:', err)
      }
      
      // Usar datos de muestra si no hay datos en localStorage
      const mockUserMemes = sampleMemes.filter(meme => 
        // Simular que algunos memes pertenecen al usuario actual
        Math.random() > 0.7
      ).slice(0, 3)
      
      setUserMemes(mockUserMemes)
    }
  }, [mounted, address])

  if (!mounted) {
    return (
      <div className="min-h-screen p-4 md:p-8 animate-pulse">
        <div className="max-w-4xl mx-auto">
          <div className="h-40 bg-gray-100 rounded-lg mb-8"></div>
          <div className="h-10 bg-gray-100 rounded-lg mb-6 w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-64 bg-gray-100 rounded-lg"></div>
            <div className="h-64 bg-gray-100 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Cabecera del perfil */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>
          
          {!isConnected ? (
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Conecta tu wallet</h2>
              <p className="text-gray-600 mb-4">Para ver tu perfil y gestionar tus memes, necesitas conectar tu wallet.</p>
              <ConnectWallet />
            </div>
          ) : (
            <ProfileCard />
          )}
        </div>
        
        {/* Actividad del usuario, solo visible si está conectado */}
        {isConnected && (
          <div className="mb-8">
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('created')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'created'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Mis Memes
                </button>
                <button
                  onClick={() => setActiveTab('bets')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'bets'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Mis Apuestas
                </button>
                <button
                  onClick={() => setActiveTab('rewards')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'rewards'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Mis Recompensas
                </button>
              </nav>
            </div>

            {/* Lista de memes creados */}
            {activeTab === 'created' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Memes Creados</h2>
                  <a href="/create" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    + Crear Nuevo Meme
                  </a>
                </div>

                {userMemes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userMemes.map((meme) => (
                      <MemeCard
                        key={meme.id}
                        id={meme.id}
                        title={meme.title}
                        imageUrl={meme.imageUrl}
                        description={meme.description}
                        creator={meme.creator}
                        currentBets={meme.currentBets}
                        totalPot={meme.totalPot}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No has creado memes</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Comienza a crear y compartir tus propios memes.
                    </p>
                    <div className="mt-6">
                      <a
                        href="/create"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Crear Nuevo Meme
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Sección de apuestas */}
            {activeTab === 'bets' && (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No tienes apuestas activas</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Explora memes virales y apuesta por aquellos que crees que serán exitosos.
                </p>
                <div className="mt-6">
                  <a
                    href="/trending"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Explorar Memes Trending
                  </a>
                </div>
              </div>
            )}

            {/* Sección de recompensas */}
            {activeTab === 'rewards' && (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No tienes recompensas aún</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Crea memes virales o apuesta correctamente para ganar recompensas.
                </p>
                <div className="mt-6">
                  <a
                    href="/create"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Crear Nuevo Meme
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 