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
  createdAt?: string
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
  createdAt,
}: MemeCardProps) {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)
  const [imageSrc, setImageSrc] = useState<string>(FALLBACK_IMAGE)
  
  // Estado para controlar la renderización del lado del cliente
  const [mounted, setMounted] = useState(false)
  
  // Solo ejecutar después del montaje del componente (en el cliente)
  useEffect(() => {
    setMounted(true)
    
    // Validar y establecer la imagen fuente
    if (imageUrl) {
      // Si es una imagen base64, usarla directamente
      if (imageUrl.startsWith('data:image')) {
        setImageSrc(imageUrl)
      } 
      // Si es una URL normal, usarla
      else if (imageUrl.startsWith('http')) {
        setImageSrc(imageUrl)
      }
      // En caso de blob u otros formatos problemáticos, usar la imagen de respaldo
      else {
        setImageSrc(FALLBACK_IMAGE)
      }
    }
  }, [imageUrl])

  // Formatear la fecha
  const formattedDate = createdAt 
    ? new Date(createdAt).toLocaleDateString() 
    : 'Fecha desconocida'

  // Formatear el valor del pote
  const formatPot = (pot: number) => {
    return pot.toFixed(4)
  }
  
  // Obtener la dirección del contrato según la cadena actual
  const contractAddress = chainId ? MEMEX_CONTRACT_ADDRESSES[chainId] : null
  
  // Preparar la llamada al contrato
  const { write, isLoading, isSuccess } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi: MEMEX_CONTRACT_ABI,
    functionName: 'betOnMeme',
  })

  // Verificar si la imagen es base64
  const isBase64Image = imageSrc.startsWith('data:image')

  const handleBet = () => {
    if (!isConnected) {
      console.error('Wallet no conectada')
      setError('Por favor conecta tu wallet primero')
      return
    }

    try {
      // Llamar al contrato para apostar por este meme
      // Enviamos 0.001 ETH como apuesta (reducido para pruebas)
      if (write) {
        // Convertir el ID a BigInt explícitamente
        const tokenId = BigInt(parseInt(id, 10))
        
        console.log(`Intentando apostar por el meme con ID: ${tokenId}`)
        
        write({
          args: [tokenId],
          value: parseEther('0.001') // Reducido de 0.01 a 0.001 ETH
        })
        
        console.log(`Apuesta de 0.001 ETH por el meme ${id} iniciada`)
      } else {
        setError('Error: No se pudo inicializar la transacción')
      }
    } catch (err: any) {
      console.error('Error al apostar:', err)
      
      // Manejo específico para error de fondos insuficientes
      if (err.message && err.message.includes('insufficient funds')) {
        setError('No tienes fondos o no tienes fondos suficientes para hacer la apuesta. Necesitas ETH en Base para continuar.')
      } else {
        setError('Error al realizar la apuesta. Inténtalo de nuevo.')
      }
    }
  }

  const handleImageError = () => {
    setImageError(true)
    setImageSrc(FALLBACK_IMAGE)
  }

  // Efectos para manejar el resultado de la transacción
  useEffect(() => {
    if (isSuccess) {
      setSuccess('¡Apuesta realizada con éxito!')
      // Limpiar mensaje después de un tiempo
      setTimeout(() => setSuccess(null), 5000)
    }
  }, [isSuccess])

  return (
    <div className="meme-card">
      <div className="relative h-48 sm:h-64 md:h-72 overflow-hidden">
        {mounted && (
          isBase64Image ? (
            // Renderizar imágenes base64 como img normal en lugar de usar Image de Next.js
            <div className="w-full h-full relative">
              <img
                src={imageSrc}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover"
                onError={handleImageError}
              />
            </div>
          ) : (
            <Image
              src={imageError ? FALLBACK_IMAGE : imageSrc}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
              className="object-cover transition-transform duration-500 hover:scale-110"
              onError={handleImageError}
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              unoptimized={true} // No optimizar ninguna imagen para evitar problemas
            />
          )
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/90 via-bg-primary/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-5 w-full">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-primary-color flex items-center justify-center text-white text-xs">
                {creator ? creator.slice(0, 2).toUpperCase() : 'AN'}
              </div>
              <span className="ml-2 font-medium text-text-primary">
                {creator ? creator.slice(0, 6) + '...' + creator.slice(-4) : 'Anónimo'}
              </span>
            </div>
            <div className="flex justify-between text-sm text-text-secondary">
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        
        {description && (
          <p className="text-text-secondary mb-4 line-clamp-2">{description}</p>
        )}
        
        <div className="flex justify-between items-center mb-4 border-t border-b border-border-color py-3 my-3">
          <div className="flex flex-col">
            <span className="text-sm text-text-secondary">Apuestas</span>
            <span className="text-lg font-semibold">{currentBets}</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-sm text-text-secondary">Pote</span>
            <span className="text-lg font-semibold text-accent-color">{formatPot(totalPot)} ETH</span>
          </div>
        </div>

        {/* Mensajes de error o éxito */}
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-950/20 p-3 rounded">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 text-sm text-green-500 bg-green-950/20 p-3 rounded">
            {success}
          </div>
        )}
        
        <button
          onClick={handleBet}
          disabled={isLoading || !isConnected}
          className={`w-full py-3 rounded-md font-medium ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'button primary'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </div>
          ) : (
            <>Apostar 0.001 ETH</>
          )}
        </button>
      </div>
    </div>
  )
} 