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
      {/* Hero Section - más compacto y con margen superior */}
      <section className="hero-gradient py-8 mt-4">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight text-white">
                Crea, Comparte y <span className="text-accent-color">Gana</span> con Memes
              </h1>
              <p className="text-lg mb-6 text-text-primary">
                La primera plataforma Web3 donde los memes virales generan recompensas para creadores y apostadores.
              </p>
              <div className="flex flex-row justify-center space-x-3">
                <Link href="/explore" className="button secondary py-2 px-5 text-center">
                  Explorar Memes
                </Link>
                <Link href="/create" className="button primary py-2 px-5 text-center">
                  Crear Meme
                </Link>
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

      {/* Trending Memes Section - COMPLETAMENTE REDISEÑADA */}
      <section className="py-14 bg-black">
        <div className="container mx-auto max-w-4xl px-4">
          <h1 className="text-3xl font-bold mb-4 text-center text-white">Explora Memes</h1>
          
          {/* Tabs centrados */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-full overflow-hidden border border-gray-700">
              <button
                onClick={() => setActiveTab('trending')}
                className={`px-6 py-2 text-sm font-semibold ${
                  activeTab === 'trending' 
                    ? 'bg-primary-color text-white'
                    : 'bg-transparent text-gray-300 hover:bg-gray-800'
                }`}
              >
                Trending
              </button>
              <button
                onClick={() => setActiveTab('latest')}
                className={`px-6 py-2 text-sm font-semibold ${
                  activeTab === 'latest' 
                    ? 'bg-primary-color text-white'
                    : 'bg-transparent text-gray-300 hover:bg-gray-800'
                }`}
              >
                Recientes
              </button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent-color"></div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Meme 1 */}
              <div className="bg-black border-t border-b border-gray-800">
                <div className="px-4 py-4">
                  <h2 className="text-xl font-bold text-white">Cuando el café te pega de golpe</h2>
                  <p className="text-gray-400 mb-4">La sensación exacta al tomar el primer café de la mañana</p>
                  
                  <div className="aspect-video mb-4 relative overflow-hidden rounded-lg" style={{ position: 'relative' }}>
                    <Image 
                      src="/memes/meme1.jpg"
                      alt="Cuando el café te pega de golpe"
                      fill
                      className="object-cover"
                      unoptimized={true}
                      priority
                    />
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-blue-400 font-bold">
                      0X
                    </div>
                    <div className="ml-2">
                      <p className="text-white text-sm">0x1234...5678<span className="text-gray-500 ml-1">·14/5/2025</span></p>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <span className="text-white">45 apuestas<span className="text-gray-500 mx-1">•</span><span className="text-blue-400">1.2500 ETH</span></span>
                  </div>
                  
                  <div className="flex space-x-8 mb-4">
                    <div className="flex items-center text-gray-500">
                      <span className="text-lg">3</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <span className="text-lg">23</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <span className="text-lg">12</span>
                    </div>
                  </div>
                  
                  <button className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-semibold">
                    Apostar 0.001 ETH
                  </button>
                </div>
              </div>
              
              {/* Meme 2 */}
              <div className="bg-black border-t border-b border-gray-800">
                <div className="px-4 py-4">
                  <h2 className="text-xl font-bold text-white">Programando a las 3am</h2>
                  <p className="text-gray-400 mb-4">Cuando el código finalmente funciona pero no sabes por qué</p>
                  
                  <div className="aspect-video mb-4 relative overflow-hidden rounded-lg" style={{ position: 'relative' }}>
                    <Image 
                      src="/memes/meme2.jpg"
                      alt="Programando a las 3am"
                      fill
                      className="object-cover"
                      unoptimized={true}
                      priority
                    />
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-blue-400 font-bold">
                      0X
                    </div>
                    <div className="ml-2">
                      <p className="text-white text-sm">0x2345...6789<span className="text-gray-500 ml-1">·14/5/2025</span></p>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <span className="text-white">32 apuestas<span className="text-gray-500 mx-1">•</span><span className="text-blue-400">0.8500 ETH</span></span>
                  </div>
                  
                  <div className="flex space-x-8 mb-4">
                    <div className="flex items-center text-gray-500">
                      <span className="text-lg">2</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <span className="text-lg">22</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <span className="text-lg">24</span>
                    </div>
                  </div>
                  
                  <button className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-semibold">
                    Apostar 0.001 ETH
                  </button>
                </div>
              </div>
              
              {/* Agregar más memes aquí */}
              
              <div className="text-center mt-8">
                <a href="/explore" className="inline-block px-6 py-2 border border-gray-600 text-white rounded-full hover:bg-gray-800 transition-colors">
                  Ver más memes
                </a>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
