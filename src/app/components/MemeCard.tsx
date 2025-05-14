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
    <div className="meme-card border-y border-border-color hover:bg-bg-secondary/20 transition-colors text-center">
      <div className="px-4 pt-3">
        {/* Título y descripción */}
        <h3 className="font-bold mb-1 text-center">{title}</h3>
        {description && (
          <p className="text-text-primary mb-2 text-sm line-clamp-2 text-center">{description}</p>
        )}
        
        {/* Imagen del meme */}
        <div className="relative rounded-xl overflow-hidden mb-3 border border-border-color mx-auto">
          {mounted && (
            isBase64Image ? (
              <div className="w-full h-0 pb-[56.25%] relative">
                <img
                  src={imageSrc}
                  alt={title}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={handleImageError}
                />
              </div>
            ) : (
              <div className="w-full h-0 pb-[56.25%] relative">
                <Image
                  src={imageError ? FALLBACK_IMAGE : imageSrc}
                  alt={title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                  className="object-cover"
                  onError={handleImageError}
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                  unoptimized={false}
                />
              </div>
            )
          )}
        </div>
        
        {/* Información del creador */}
        <div className="flex items-center justify-center mb-2">
          <div className="w-8 h-8 rounded-full bg-accent-color flex items-center justify-center text-white font-semibold mr-2">
            {creator ? creator.slice(0, 2).toUpperCase() : 'AN'}
          </div>
          <span className="font-bold text-text-primary">
            {creator ? creator.slice(0, 6) + '...' + creator.slice(-4) : 'Anónimo'}
          </span>
          <span className="ml-1 text-text-secondary">·</span>
          <span className="ml-1 text-text-secondary text-sm">{formattedDate}</span>
        </div>
        
        {/* Información de apuestas y pote */}
        <div className="flex items-center justify-center text-xs font-medium mb-3">
          <span className="bg-bg-tertiary text-text-primary px-2 py-1 rounded-full">
            {currentBets} apuestas
          </span>
          <span className="mx-2 text-text-secondary">•</span>
          <span className="bg-accent-color bg-opacity-10 text-accent-color px-2 py-1 rounded-full">
            {formatPot(totalPot)} ETH
          </span>
        </div>
        
        {/* Botones de acción e interacción */}
        <div className="flex justify-center space-x-8 py-2 px-2 border-t border-border-color">
          <button className="action-button">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>3</span>
          </button>
          <button className="action-button">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            <span>23</span>
          </button>
          <button className="action-button">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>12</span>
          </button>
        </div>
        
        {/* Botón para apostar */}
        <div className="px-4 pb-4">
          <button
            onClick={handleBet}
            disabled={isLoading || !isConnected}
            className={`w-full py-2 rounded-full text-white text-sm font-semibold transition-colors ${
              isLoading
                ? 'bg-accent-color opacity-70 cursor-not-allowed'
                : 'bg-accent-color hover:bg-accent-color/90'
            }`}
          >
            {isLoading ? 'Procesando...' : 'Apostar 0.001 ETH'}
          </button>
          
          {error && (
            <p className="text-error-color text-xs mt-2">{error}</p>
          )}
          
          {success && (
            <p className="text-success-color text-xs mt-2">{success}</p>
          )}
        </div>
      </div>
    </div>
  )
} 