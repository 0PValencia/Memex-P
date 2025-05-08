'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useAccount, useChainId, useContractWrite } from 'wagmi'
import { parseEther } from 'viem'
import { MEMEX_CONTRACT_ABI, MEMEX_CONTRACT_ADDRESSES } from '@/utils/contracts'
import { triggerMemesUpdate } from '../mocks/sampleMemes'

interface MemeCardProps {
  id: string
  title: string
  imageUrl: string
  description: string
  creator: string
  currentBets: number
  totalPot: number
}

// Imagen de respaldo en caso de que la original falle
const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23cccccc'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='18' fill='%23333333'%3EImagen no disponible%3C/text%3E%3C/svg%3E"

export default function MemeCard({
  id,
  title,
  imageUrl,
  description,
  creator,
  currentBets,
  totalPot,
}: MemeCardProps) {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const [betAmount, setBetAmount] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)
  
  // Estado para controlar la renderización del lado del cliente
  const [mounted, setMounted] = useState(false)
  
  // Solo ejecutar después del montaje del componente (en el cliente)
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Obtener la dirección del contrato según la cadena actual
  const contractAddress = chainId ? MEMEX_CONTRACT_ADDRESSES[chainId] : null
  
  // Preparar la llamada al contrato
  const { write, isLoading, isSuccess } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi: MEMEX_CONTRACT_ABI,
    functionName: 'betOnMeme',
  })

  // Verificar si la imagen es base64
  const isBase64Image = imageUrl?.startsWith('data:image')

  const handleBet = async () => {
    if (!isConnected) {
      setError('Por favor conecta tu wallet primero')
      return
    }

    if (!betAmount || parseFloat(betAmount) <= 0) {
      setError('Por favor introduce una cantidad válida')
      return
    }

    if (!contractAddress) {
      setError('El contrato no está disponible en esta red')
      return
    }

    try {
      setError(null)
      setSuccess(null)

      // En desarrollo, simular una apuesta exitosa
      if (process.env.NODE_ENV === 'development' || !contractAddress) {
        // Simular una transacción local para desarrollo
        setTimeout(() => {
          setSuccess(`¡Apuesta de ${betAmount} ETH simulada con éxito!`)
          setBetAmount('')
          
          // Actualizar localmente las apuestas para este meme
          if (typeof window !== 'undefined') {
            try {
              // Recuperar memes guardados
              const savedMemesJson = localStorage.getItem('memex_uploaded_memes')
              if (savedMemesJson) {
                const savedMemes = JSON.parse(savedMemesJson)
                // Buscar y actualizar el meme apostado
                const updatedMemes = savedMemes.map((meme: any) => {
                  if (meme.id === id) {
                    return {
                      ...meme,
                      currentBets: meme.currentBets + 1,
                      totalPot: meme.totalPot + parseFloat(betAmount)
                    }
                  }
                  return meme
                })
                localStorage.setItem('memex_uploaded_memes', JSON.stringify(updatedMemes))
                
                // Disparar evento para actualizar los memes en todos los componentes
                triggerMemesUpdate()
              }
            } catch (storageErr) {
              console.error('Error al actualizar apuesta local:', storageErr)
            }
          }
        }, 1500)
        return
      }

      // En producción: Llamar al contrato inteligente para apostar
      write({
        args: [BigInt(id)],
        value: parseEther(betAmount),
      })
    } catch (err) {
      console.error('Error al realizar la apuesta:', err)
      setError('Error al realizar la apuesta. Por favor intenta de nuevo.')
    }
  }

  const handleImageError = () => {
    setImageError(true)
  }

  // Actualizar el estado en un efecto para evitar cambios de estado durante la renderización
  useEffect(() => {
    if (isSuccess && !success) {
      setSuccess(`¡Apuesta de ${betAmount} ETH realizada con éxito!`)
      setBetAmount('')
      
      // También disparar actualización de memes cuando la apuesta es exitosa en producción
      triggerMemesUpdate()
    }
  }, [isSuccess, success, betAmount])

  return (
    <div className="meme-card">
      <div className="relative h-64 w-full overflow-hidden" style={{ minHeight: '16rem' }}>
        {mounted && (
          <Image
            src={imageError ? FALLBACK_IMAGE : imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            className="object-cover transition-transform duration-300 hover:scale-105"
            onError={handleImageError}
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            unoptimized={isBase64Image} // No optimizar imágenes base64
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-4 text-white">
            <p className="font-semibold">Creador: {creator}</p>
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold">{title}</h3>
          <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
            {currentBets} apuestas
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg mb-4 shadow-inner">
          <p className="text-center font-semibold text-blue-800">
            Bote actual: <span className="text-lg">{totalPot} ETH</span>
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 rounded mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Controlar la visualización de los componentes dependiendo del estado de montaje */}
        {mounted ? (
          <>
            {!isConnected && (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 rounded mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm">Conecta tu wallet para poder apostar</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  placeholder="Cantidad en ETH"
                  className="w-full p-2 pr-10 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  min="0"
                  step="0.01"
                  disabled={isLoading || !isConnected}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500">ETH</span>
                </div>
              </div>
              <button
                onClick={handleBet}
                className="btn-primary py-2 px-4 rounded"
                disabled={isLoading || !isConnected}
              >
                {isLoading ? 
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Apostando...
                  </span> : 'Apostar'
                }
              </button>
            </div>
          </>
        ) : (
          <div className="p-2 bg-gray-100 rounded animate-pulse">
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        )}
      </div>
    </div>
  )
} 