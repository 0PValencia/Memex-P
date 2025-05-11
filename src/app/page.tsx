'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import CreateMemeForm from './components/CreateMemeForm'
import MemeCard from './components/MemeCard'
import ConnectWallet from './components/ConnectWallet'
import { useAllMemes, triggerMemesUpdate } from './mocks/sampleMemes'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'trending' | 'latest'>('trending')
  const [displayMemes, setDisplayMemes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0) // Clave para forzar re-renderizado
  
  // Obtener todos los memes, incluidos los guardados localmente
  const allMemes = useAllMemes()
  
  // Función para actualizar manualmente
  const handleRefresh = () => {
    setIsLoading(true)
    triggerMemesUpdate()
    setRefreshKey(prevKey => prevKey + 1) // Forzar re-renderizado
  }
  
  // Actualizar los memes mostrados cuando cambien los memes o la pestaña
  useEffect(() => {
    setIsLoading(true)
    
    // Simular carga de datos
    setTimeout(() => {
      if (allMemes && allMemes.length > 0) {
        // Procesar memes para ordenarlos
        const memesWithParsedDates = allMemes.map(meme => {
          // Intentar parsear la fecha si existe
          const createdAt = meme.createdAt ? new Date(meme.createdAt) : new Date()
          return {
            ...meme,
            createdAt
          }
        })
        
        // Ordenar memes según la pestaña seleccionada
        const sortedMemes = [...memesWithParsedDates].sort((a, b) => 
          activeTab === 'trending' 
            ? b.currentBets - a.currentBets
            : b.createdAt.getTime() - a.createdAt.getTime() // Ordenar por más reciente
        ).slice(0, 6) // Mostrar solo 6 memes en la página principal
        
        setDisplayMemes(sortedMemes)
      } else {
        setDisplayMemes([])
      }
      
      setIsLoading(false)
    }, 300)
  }, [allMemes, activeTab, refreshKey])

  return (
    <main className="min-h-screen animate-fadeIn">
      {/* Hero Section - más compacto */}
      <section className="hero-gradient py-14">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2 z-10">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight text-white">
                Crea, Comparte y <span className="text-accent-color">Gana</span> con Memes
              </h1>
              <p className="text-lg mb-6 text-text-primary">
                La primera plataforma Web3 donde los memes virales generan recompensas para creadores y apostadores.
              </p>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <Link href="/explore" className="button secondary py-2 px-5 text-center">
                  Explorar Memes
                </Link>
                <Link href="/create" className="button primary py-2 px-5 text-center">
                  Crear Meme
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 relative z-10">
              <div className="glass-effect p-3 rounded-lg transform rotate-1 transition-transform hover:rotate-0 border-gradient">
                <div className="border-gradient-content">
                  <Image
                    src="/memes/meme1.jpg" 
                    alt="Meme Example" 
                    width={500} 
                    height={400} 
                    className="rounded"
                    priority
                  />
                  <div className="viral-badge">
                    +120 ETH
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section - más espacioso */}
      <section className="py-14">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">¿Cómo funciona Memex?</h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center transform transition-transform hover:-translate-y-2 content-card">
              <div className="icon-container">
                <span className="icon-number">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Conecta tu Wallet</h3>
              <p className="text-text-secondary text-sm">Conecta tu wallet de Coinbase u otra wallet compatible con la red Base.</p>
            </div>

            <div className="text-center transform transition-transform hover:-translate-y-2 content-card">
              <div className="icon-container">
                <span className="icon-number">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Crea un Meme NFT</h3>
              <p className="text-text-secondary text-sm">Sube una imagen, añade un título creativo y una descripción para convertirlo en NFT.</p>
            </div>
            
            <div className="text-center transform transition-transform hover:-translate-y-2 content-card">
              <div className="icon-container">
                <span className="icon-number">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Apuesta por Memes</h3>
              <p className="text-text-secondary text-sm">Apuesta por los memes que crees que se volverán virales y ganarán más popularidad.</p>
            </div>
            
            <div className="text-center transform transition-transform hover:-translate-y-2 content-card">
              <div className="icon-container">
                <span className="icon-number">4</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Recibe Recompensas</h3>
              <p className="text-text-secondary text-sm">Si el meme se vuelve viral, tanto el creador como los apostadores reciben recompensas.</p>
            </div>
          </div>
          
          <div className="mt-12 glass-effect p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">¿Cómo se determina la viralidad?</h3>
            <p className="text-sm">Nuestro algoritmo analiza múltiples factores para determinar la viralidad de un meme:</p>
            <ul className="list-disc list-inside space-y-1 mt-3 text-text-secondary text-sm">
              <li>Número de apuestas y tamaño del bote</li>
              <li>Interacciones sociales (vistas, likes, comentarios)</li>
              <li>Tiempo en tendencias</li>
              <li>Número de compartidos en redes sociales</li>
            </ul>
            <p className="mt-3 text-sm">Cuando un meme supera nuestro umbral de viralidad, automáticamente se distribuyen las recompensas: 50% para el creador y 50% entre los apostadores.</p>
          </div>
        </div>
      </section>

      {/* Create Meme Section */}
      <section id="create" className="py-14">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Crea tu Meme</h2>
          
          <div className="glass-effect p-6 rounded-lg mb-8">
            <ConnectWallet />
            <CreateMemeForm />
          </div>
        </div>
      </section>

      {/* Trending Memes Section */}
      <section className="py-14">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 sm:mb-0">Explora Memes</h2>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                className="p-2 glass-effect rounded-full transition-all hover:bg-bg-tertiary mr-2"
                disabled={isLoading}
                title="Actualizar memes"
              >
                <svg 
                  className={`w-5 h-5 text-accent-color ${isLoading ? 'animate-spin' : ''}`} 
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
              <div className="glass-effect rounded-lg overflow-hidden">
                <button
                  onClick={() => setActiveTab('trending')}
                  className={`px-4 py-2 font-medium transition-colors text-sm ${
                    activeTab === 'trending' 
                      ? 'bg-primary-color text-white' 
                      : 'hover:bg-bg-tertiary'
                  }`}
                >
                  Trending
                </button>
                <button
                  onClick={() => setActiveTab('latest')}
                  className={`px-4 py-2 font-medium transition-colors text-sm ${
                    activeTab === 'latest' 
                      ? 'bg-primary-color text-white' 
                      : 'hover:bg-bg-tertiary'
                  }`}
                >
                  Recientes
                </button>
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent-color"></div>
            </div>
          ) : (
            <>
              {displayMemes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Memes con imágenes reales */}
                  <MemeCard
                    key="meme1"
                    id="meme1"
                    title="Cuando el café te pega de golpe"
                    imageUrl="/memes/meme1.jpg"
                    description="La sensación exacta al tomar el primer café de la mañana"
                    creator="0x1234567890abcdef1234567890abcdef12345678"
                    currentBets={45}
                    totalPot={1.25}
                    createdAt={new Date().toISOString()}
                  />
                  <MemeCard
                    key="meme2"
                    id="meme2"
                    title="Programando a las 3am"
                    imageUrl="/memes/meme2.jpg"
                    description="Cuando el código finalmente funciona pero no sabes por qué"
                    creator="0x2345678901abcdef2345678901abcdef23456789"
                    currentBets={32}
                    totalPot={0.85}
                    createdAt={new Date().toISOString()}
                  />
                  <MemeCard
                    key="meme3"
                    id="meme3"
                    title="El drama de las reuniones"
                    imageUrl="/memes/meme3.jpg"
                    description="Cuando la reunión podría haber sido un email"
                    creator="0x3456789012abcdef3456789012abcdef34567890"
                    currentBets={28}
                    totalPot={0.65}
                    createdAt={new Date().toISOString()}
                  />
                  <MemeCard
                    key="meme4"
                    id="meme4"
                    title="Expectativa vs. Realidad"
                    imageUrl="/memes/meme4.jpg"
                    description="Lo que esperabas vs. lo que conseguiste"
                    creator="0x4567890123abcdef4567890123abcdef45678901"
                    currentBets={38}
                    totalPot={0.95}
                    createdAt={new Date().toISOString()}
                  />
                  <MemeCard
                    key="meme5"
                    id="meme5"
                    title="Lunes por la mañana"
                    imageUrl="/memes/meme5.jpg"
                    description="La cara de todos al empezar la semana"
                    creator="0x5678901234abcdef5678901234abcdef56789012"
                    currentBets={42}
                    totalPot={1.15}
                    createdAt={new Date().toISOString()}
                  />
                  <MemeCard
                    key="meme6"
                    id="meme6"
                    title="Modo incógnito"
                    imageUrl="/memes/meme6.jpg"
                    description="Cuando usas el modo incógnito para sorpresas de cumpleaños, claro"
                    creator="0x6789012345abcdef6789012345abcdef67890123"
                    currentBets={36}
                    totalPot={0.90}
                    createdAt={new Date().toISOString()}
                  />
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-text-secondary">No hay memes para mostrar. ¡Crea el primero!</p>
                </div>
              )}
            </>
          )}
          
          <div className="mt-10 text-center">
            <Link href="/explore" className="button secondary py-2 px-4">
              Ver más memes
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
