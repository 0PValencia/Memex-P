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
    <main className="min-h-screen bg-white animate-fadeIn">
      {/* Hero Section */}
      <section className="hero-gradient py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Crea, Comparte y <span className="text-blue-300">Gana</span> con Memes
              </h1>
              <p className="text-xl mb-8 text-gray-100">
                La primera plataforma Web3 donde los memes virales generan recompensas para creadores y apostadores.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Link href="/explore" className="btn bg-white text-blue-700 hover:bg-gray-100 py-3 px-6 rounded-lg font-medium text-center shadow-md hover:shadow-lg transition-all">
                  Explorar Memes
                </Link>
                <Link href="/create" className="btn bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium text-center shadow-md hover:shadow-lg transition-all">
                  Crear Meme
                </Link>
              </div>
            </div>
            <div className="md:w-5/12 relative">
              <div className="bg-white p-3 rounded-lg shadow-xl transform rotate-3 transition-transform hover:rotate-0">
                <Image 
                  src="/images/meme1.svg" 
                  alt="Meme Example" 
                  width={400} 
                  height={400} 
                  className="rounded"
                  priority
                />
                <div className="viral-badge">
                  <span className="block text-xs text-green-600 mb-0.5">¡Viral!</span>
                  +120 ETH
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">¿Cómo funciona Memex?</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center transform transition-transform hover:-translate-y-1">
              <div className="icon-container">
                <span className="icon-number">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Conecta tu Wallet</h3>
              <p className="text-gray-600">Conecta tu wallet de Coinbase u otra wallet compatible con la red Base.</p>
            </div>
            
            <div className="text-center transform transition-transform hover:-translate-y-1">
              <div className="icon-container">
                <span className="icon-number">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Crea un Meme NFT</h3>
              <p className="text-gray-600">Sube una imagen, añade un título creativo y una descripción para convertirlo en NFT.</p>
            </div>
            
            <div className="text-center transform transition-transform hover:-translate-y-1">
              <div className="icon-container">
                <span className="icon-number">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Apuesta por Memes</h3>
              <p className="text-gray-600">Apuesta por los memes que crees que se volverán virales y ganarán más popularidad.</p>
            </div>
            
            <div className="text-center transform transition-transform hover:-translate-y-1">
              <div className="icon-container">
                <span className="icon-number">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Recibe Recompensas</h3>
              <p className="text-gray-600">Si el meme se vuelve viral, tanto el creador como los apostadores reciben recompensas.</p>
            </div>
          </div>
          
          <div className="mt-16 bg-blue-50 p-8 rounded-lg border border-blue-200 shadow-inner">
            <h3 className="text-xl font-semibold mb-3">¿Cómo se determina la viralidad?</h3>
            <p>Nuestro algoritmo analiza múltiples factores para determinar la viralidad de un meme:</p>
            <ul className="list-disc list-inside space-y-1 mt-4 text-gray-700">
              <li>Número de apuestas y tamaño del bote</li>
              <li>Interacciones sociales (vistas, likes, comentarios)</li>
              <li>Tiempo en tendencias</li>
              <li>Número de compartidos en redes sociales</li>
            </ul>
            <p className="mt-4">Cuando un meme supera nuestro umbral de viralidad, automáticamente se distribuyen las recompensas: 50% para el creador y 50% entre los apostadores.</p>
          </div>
        </div>
      </section>

      {/* Create Meme Section */}
      <section id="create" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">Crea tu Meme</h2>
          
          <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
            <ConnectWallet />
            <CreateMemeForm />
          </div>
        </div>
      </section>

      {/* Trending Memes Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 sm:mb-0">Explora Memes</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                className="p-2 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors mr-4"
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
              <div className="flex border rounded-lg overflow-hidden shadow">
                <button
                  onClick={() => setActiveTab('trending')}
                  className={`px-5 py-2.5 font-medium transition-colors ${
                    activeTab === 'trending' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Trending
                </button>
                <button
                  onClick={() => setActiveTab('latest')}
                  className={`px-5 py-2.5 font-medium transition-colors ${
                    activeTab === 'latest' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Recientes
                </button>
              </div>
            </div>
          </div>

          {/* Estado de carga y memes */}
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayMemes.length > 0 ? (
                displayMemes.map((meme) => (
                  <MemeCard key={`${meme.id}-${refreshKey}`} {...meme} />
                ))
              ) : (
                <p className="col-span-3 text-center text-gray-500 py-20">
                  No hay memes para mostrar. ¡Sé el primero en crear uno!
                </p>
              )}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link 
              href="/explore" 
              className="btn-primary py-3 px-8 rounded-lg font-medium inline-block shadow-md hover:shadow-lg transition-all"
            >
              Ver más memes
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-10">
            <div>
              <h3 className="text-2xl font-bold mb-4">Memex<span className="text-blue-400">.</span></h3>
              <p className="text-gray-400">La plataforma definitiva para crear, compartir y apostar por memes en la blockchain.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Enlaces</h3>
              <ul className="space-y-3">
                <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Inicio</Link></li>
                <li><Link href="/trending" className="text-gray-400 hover:text-white transition-colors">Trending</Link></li>
                <li><Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href="/settings" className="text-gray-400 hover:text-white transition-colors">Configuración</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Comunidad</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Discord</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Memex. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
