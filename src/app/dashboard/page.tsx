'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAccount } from 'wagmi'
import ConnectWallet from '../components/ConnectWallet'
import { sampleMemes } from '../mocks/sampleMemes'

interface UserMeme {
  id: string
  title: string
  imageUrl: string
  totalPot: number
  createdAt: Date
  viralityScore: number
  isViral: boolean
}

interface UserBet {
  memeId: string
  memeTitle: string
  memeImage: string
  amount: number
  timestamp: Date
  potentialReward: number
  status: 'active' | 'viral' | 'claimed'
}

export default function Dashboard() {
  const { address, isConnected } = useAccount()
  const [userMemes, setUserMemes] = useState<UserMeme[]>([])
  const [userBets, setUserBets] = useState<UserBet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'memes' | 'bets'>('memes')

  useEffect(() => {
    if (isConnected) {
      // Simulación de carga de datos del usuario desde la blockchain
      setTimeout(() => {
        // Memes de ejemplo para simular contenido del usuario
        const mockMemes = [
          {
            id: "mock-1",
            title: "Meme de prueba 1",
            imageUrl: "/images/meme1.jpg", 
            totalPot: 0.5,
            createdAt: new Date(Date.now() - 5 * 86400000), // 5 días atrás
            viralityScore: 75,
            isViral: false
          },
          {
            id: "mock-2",
            title: "Meme de prueba 2",
            imageUrl: "/images/meme1.svg",
            totalPot: 1.2,
            createdAt: new Date(Date.now() - 10 * 86400000), // 10 días atrás
            viralityScore: 92,
            isViral: true
          }
        ];
        
        // Generar memes creados por el usuario (ahora usando mocks fijos en lugar de sampleMemes que está vacío)
        const createdMemes: UserMeme[] = mockMemes.map((mockMeme, i) => {
          return {
            id: `user-meme-${i}`,
            title: mockMeme.title,
            imageUrl: mockMeme.imageUrl,
            totalPot: mockMeme.totalPot,
            createdAt: mockMeme.createdAt,
            viralityScore: mockMeme.viralityScore,
            isViral: mockMeme.isViral
          };
        });
        
        // Generar apuestas realizadas por el usuario (simulado)
        const userBetsData: UserBet[] = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, i) => {
          return {
            memeId: `bet-meme-${i}`,
            memeTitle: `Meme apostado ${i+1}`,
            memeImage: `/images/meme${(i % 3) + 1}.svg`,
            amount: parseFloat((Math.random() * 0.5).toFixed(3)),
            timestamp: new Date(Date.now() - Math.random() * 14 * 86400000), // Últimos 14 días
            potentialReward: parseFloat((0.2 * (2 + Math.random() * 5)).toFixed(3)),
            status: ['active', 'viral', 'claimed'][Math.floor(Math.random() * 3)] as 'active' | 'viral' | 'claimed'
          };
        });
        
        // Ordenar por fecha más reciente
        createdMemes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        userBetsData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        
        setUserMemes(createdMemes);
        setUserBets(userBetsData);
        setIsLoading(false);
      }, 1500);
    } else {
      setIsLoading(false);
    }
  }, [isConnected]);

  if (!isConnected) {
    return (
      <main className="min-h-screen p-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-black">Dashboard</h1>
          
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h2 className="text-xl font-semibold mb-4 text-black">Conecta tu wallet para ver tu dashboard</h2>
            <ConnectWallet />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-black">Mi Dashboard</h1>
          <ConnectWallet />
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex border-b">
            <button
              className={`px-6 py-3 text-lg font-medium flex-1 ${
                activeTab === 'memes' 
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('memes')}
            >
              Mis Memes ({userMemes.length})
            </button>
            <button
              className={`px-6 py-3 text-lg font-medium flex-1 ${
                activeTab === 'bets' 
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('bets')}
            >
              Mis Apuestas ({userBets.length})
            </button>
          </div>

          {isLoading ? (
            <div className="p-6 animate-pulse space-y-4">
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          ) : (
            <div className="p-6">
              {activeTab === 'memes' && (
                <>
                  {userMemes.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">Aún no has creado ningún meme</p>
                      <Link 
                        href="/create" 
                        className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                      >
                        Crear mi primer meme
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userMemes.map(meme => (
                        <div key={meme.id} className="border rounded-lg overflow-hidden flex flex-col md:flex-row">
                          <div className="relative w-full md:w-48 h-40">
                            <Image
                              src={meme.imageUrl}
                              alt={meme.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="p-4 flex-1">
                            <div className="flex justify-between items-start">
                              <h3 className="text-xl font-semibold text-black">
                                <Link href={`/meme/${meme.id}`} className="hover:text-blue-600">
                                  {meme.title}
                                </Link>
                              </h3>
                              <div className={`text-sm font-medium px-3 py-1 rounded-full ${
                                meme.isViral 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {meme.isViral ? '¡Viral!' : 'Activo'}
                              </div>
                            </div>
                            <div className="mt-2 text-sm text-gray-500">
                              Creado: {meme.createdAt.toLocaleDateString()}
                            </div>
                            <div className="mt-3 flex justify-between">
                              <div>
                                <span className="text-gray-600">Bote actual:</span>
                                <span className="ml-2 font-semibold text-black">{meme.totalPot} ETH</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Viralidad:</span>
                                <span className="ml-2 font-semibold text-black">{meme.viralityScore}/100</span>
                              </div>
                            </div>
                            <div className="mt-4">
                              <Link 
                                href={`/meme/${meme.id}`}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                Ver detalles →
                              </Link>
                              {meme.isViral && (
                                <button
                                  className="ml-4 text-green-600 hover:text-green-800"
                                  onClick={() => alert('En una implementación real, aquí reclamarías tus recompensas')}
                                >
                                  Reclamar recompensas
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {activeTab === 'bets' && (
                <>
                  {userBets.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">Aún no has realizado ninguna apuesta</p>
                      <Link 
                        href="/explore" 
                        className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                      >
                        Explorar memes para apostar
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userBets.map(bet => (
                        <div key={bet.memeId} className="border rounded-lg overflow-hidden flex flex-col md:flex-row">
                          <div className="relative w-full md:w-48 h-40">
                            <Image
                              src={bet.memeImage}
                              alt={bet.memeTitle}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="p-4 flex-1">
                            <div className="flex justify-between items-start">
                              <h3 className="text-xl font-semibold text-black">
                                <Link href={`/meme/${bet.memeId}`} className="hover:text-blue-600">
                                  {bet.memeTitle}
                                </Link>
                              </h3>
                              <div className={`text-sm font-medium px-3 py-1 rounded-full ${
                                bet.status === 'viral' 
                                  ? 'bg-green-100 text-green-800' 
                                  : bet.status === 'claimed'
                                    ? 'bg-gray-100 text-gray-800'
                                    : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {bet.status === 'viral' 
                                  ? '¡Viral! Recompensa disponible' 
                                  : bet.status === 'claimed'
                                    ? 'Recompensa reclamada'
                                    : 'Apuesta activa'}
                              </div>
                            </div>
                            <div className="mt-2 text-sm text-gray-500">
                              Fecha de la apuesta: {bet.timestamp.toLocaleDateString()}
                            </div>
                            <div className="mt-3 flex justify-between">
                              <div>
                                <span className="text-gray-600">Cantidad apostada:</span>
                                <span className="ml-2 font-semibold text-black">{bet.amount} ETH</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Recompensa potencial:</span>
                                <span className="ml-2 font-semibold text-black">{bet.potentialReward} ETH</span>
                              </div>
                            </div>
                            <div className="mt-4">
                              <Link 
                                href={`/meme/${bet.memeId}`}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                Ver meme →
                              </Link>
                              {bet.status === 'viral' && (
                                <button
                                  className="ml-4 text-green-600 hover:text-green-800"
                                  onClick={() => alert('En una implementación real, aquí reclamarías tus recompensas')}
                                >
                                  Reclamar recompensa
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
} 