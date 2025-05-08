'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useAccount, useContractRead } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { MEMEX_CONTRACT_ABI, MEMEX_CONTRACT_ADDRESSES } from '@/utils/contracts'
import ConnectWallet from '@/app/components/ConnectWallet'
import ViralityMetrics from '@/app/components/ViralityMetrics'
import CommentSection from '@/app/components/CommentSection'
import { sampleMemes } from '@/app/mocks/sampleMemes'

interface BetHistoryItem {
  better: string;
  amount: string;
  timestamp: Date;
}

export default function MemePage() {
  const params = useParams()
  const id = params?.id as string
  const { address, isConnected } = useAccount()
  const [meme, setMeme] = useState<any>(null)
  const [betHistory, setBetHistory] = useState<BetHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // En producción, estos datos vendrían del contrato
  useEffect(() => {
    // Simulación de carga de datos del meme
    const timeout = setTimeout(() => {
      // Buscar el meme en los datos de muestra
      const foundMeme = sampleMemes.find(m => m.id === id)
      
      if (foundMeme) {
        setMeme({
          ...foundMeme,
          // Añadir datos adicionales que vendrían del contrato
          creator: foundMeme.creator,
          createdAt: new Date(Date.now() - Math.random() * 10000000000),
          isActive: Math.random() > 0.3, // 70% de probabilidad de estar activo
          totalBets: foundMeme.currentBets,
          totalPot: foundMeme.totalPot
        })
        
        // Simular historial de apuestas
        const history: BetHistoryItem[] = []
        for (let i = 0; i < Math.floor(Math.random() * 12) + 3; i++) {
          history.push({
            better: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
            amount: formatEther(BigInt(Math.floor(Math.random() * 1000000000000000))),
            timestamp: new Date(Date.now() - Math.random() * 5000000000)
          })
        }
        
        // Ordenar por timestamp descendente
        history.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        setBetHistory(history)
      }
      
      setIsLoading(false)
    }, 1500)
    
    return () => clearTimeout(timeout)
  }, [id])
  
  if (isLoading) {
    return (
      <main className="min-h-screen p-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <ConnectWallet />
          
          <div className="animate-pulse space-y-4 mt-4">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-10 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </main>
    )
  }
  
  if (!meme) {
    return (
      <main className="min-h-screen p-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <ConnectWallet />
          
          <div className="bg-red-50 p-4 rounded-lg border border-red-200 mt-4">
            <h2 className="text-xl font-bold text-red-700">Meme no encontrado</h2>
            <p className="text-red-600 mt-2">No se pudo encontrar el meme con el ID: {id}</p>
            <Link href="/" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </main>
    )
  }
  
  return (
    <main className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Volver al inicio
          </Link>
        </div>
        
        <ConnectWallet />
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-4">
          <div className="relative h-96">
            <Image
              src={meme.imageUrl}
              alt={meme.title}
              fill
              priority
              className="object-contain"
            />
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-black">{meme.title}</h1>
                <p className="text-gray-600 mt-2">{meme.description}</p>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <p className="text-sm text-gray-600">Bote actual</p>
                <p className="text-2xl font-bold text-black">{meme.totalPot} ETH</p>
                <p className="text-sm text-gray-500">{meme.totalBets} apuestas</p>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-bold text-black mb-4">Información del Meme</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Creador:</span>
                    <span className="text-black font-medium">{meme.creator}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fecha de creación:</span>
                    <span className="text-black font-medium">{meme.createdAt.toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estado:</span>
                    <span className={`font-medium ${meme.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {meme.isActive ? 'Activo para apuestas' : 'Cerrado - Viral'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID del token:</span>
                    <span className="text-black font-medium">{id}</span>
                  </div>
                </div>
                
                {meme.isActive && (
                  <div className="mt-6">
                    <button
                      className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
                      onClick={() => alert('En una versión real, aquí se abriría el modal para apostar')}
                    >
                      Apostar por este Meme
                    </button>
                  </div>
                )}
                
                {!meme.isActive && (
                  <div className="mt-6">
                    <button
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                      onClick={() => alert('En una versión real, aquí se reclamarían recompensas')}
                    >
                      Reclamar Recompensas
                    </button>
                  </div>
                )}
              </div>
              
              <ViralityMetrics tokenId={id} />
            </div>
            
            <CommentSection memeId={id} />
            
            <div className="mt-8">
              <h2 className="text-xl font-bold text-black mb-4">Historial de Apuestas</h2>
              
              {betHistory.length === 0 ? (
                <p className="text-gray-500">No hay apuestas registradas para este meme.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 text-sm">
                      <tr>
                        <th className="py-3 px-4">Apostador</th>
                        <th className="py-3 px-4">Cantidad</th>
                        <th className="py-3 px-4">Fecha</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {betHistory.map((bet, index) => (
                        <tr key={index} className="text-black hover:bg-gray-50">
                          <td className="py-3 px-4">{bet.better}</td>
                          <td className="py-3 px-4">{bet.amount} ETH</td>
                          <td className="py-3 px-4">{bet.timestamp.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-bold text-black mb-4">Compartir este Meme</h2>
              
              <div className="flex space-x-4">
                <button 
                  className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => alert('Compartir en Twitter')}
                >
                  <span>Twitter</span>
                </button>
                
                <button 
                  className="flex items-center space-x-2 bg-blue-700 text-white px-4 py-2 rounded"
                  onClick={() => alert('Compartir en Facebook')}
                >
                  <span>Facebook</span>
                </button>
                
                <button 
                  className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded"
                  onClick={() => alert('Compartir en WhatsApp')}
                >
                  <span>WhatsApp</span>
                </button>
                
                <button 
                  className="flex items-center space-x-2 bg-gray-200 text-black px-4 py-2 rounded"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('URL copiada al portapapeles');
                  }}
                >
                  <span>Copiar enlace</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 