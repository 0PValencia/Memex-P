'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useAccount, useChainId, useContractWrite } from 'wagmi'
import { parseEther } from 'viem'
import { MEMEX_CONTRACT_ABI, MEMEX_CONTRACT_ADDRESSES } from '@/utils/contracts'

interface MemeCardProps {
  id: string
  title: string
  imageUrl: string
  description: string
  creator: string
  currentBets: number
  totalPot: number
}

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

      // Llamar al contrato inteligente para apostar
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
    }
  }, [isSuccess, success, betAmount])

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="relative h-64">
        {!imageError ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            priority
            className="object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-black">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">{title}</div>
              <div className="text-sm">Imagen no disponible</div>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-xl text-black font-bold mb-2">{title}</h3>
        <p className="text-black mb-4">{description}</p>
        
        <div className="flex justify-between text-sm text-black mb-4">
          <span>Creador: {creator}</span>
          <span>Apuestas: {currentBets}</span>
        </div>
        
        <div className="bg-gray-100 p-3 rounded mb-4">
          <p className="text-center text-black font-semibold">
            Bote actual: {totalPot} ETH
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {/* Controlar la visualización de los componentes dependiendo del estado de montaje */}
        {mounted ? (
          <>
            {!isConnected && (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                Conecta tu wallet para poder apostar
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                placeholder="Cantidad en ETH"
                className="flex-1 p-2 border rounded"
                min="0"
                step="0.01"
                disabled={isLoading || !isConnected}
              />
              <button
                onClick={handleBet}
                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors disabled:bg-gray-400"
                disabled={isLoading || !isConnected}
              >
                {isLoading ? 'Apostando...' : 'Apostar'}
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