'use client'

import { useState, useEffect } from 'react'
import { 
  useMiniKit, 
  useAddFrame, 
  useOpenUrl, 
  useClose, 
  usePrimaryButton,
  useViewProfile,
  useNotification
} from '@coinbase/onchainkit/minikit'
import { useAccount } from 'wagmi'
import MemeCard from '../components/MemeCard'
import { sampleMemes } from '../mocks/sampleMemes'
import Image from 'next/image'

export default function MemexMiniApp() {
  const { isConnected, address } = useAccount()
  const { setFrameReady, isFrameReady, context } = useMiniKit()
  const addFrame = useAddFrame()
  const openUrl = useOpenUrl()
  const close = useClose()
  const viewProfile = useViewProfile()
  const sendNotification = useNotification()
  const [notificationSent, setNotificationSent] = useState(false)
  
  // Obtener memes para mostrar en el feed
  const [memes, setMemes] = useState(sampleMemes.slice(0, 3))
  const [currentMemeIndex, setCurrentMemeIndex] = useState(0)
  
  // Asegurar que la aplicación está lista para mostrarse
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady()
    }
  }, [isFrameReady, setFrameReady])
  
  // Función para manejar la adición del frame
  const handleAddFrame = async () => {
    const result = await addFrame()
    if (result) {
      console.log('Frame añadido:', result.url, result.token)
    }
  }
  
  // Función para enviar notificación
  const handleSendNotification = async () => {
    if (notificationSent) return
    
    try {
      setNotificationSent(true)
      await sendNotification({
        title: '¡Nuevo Meme Viral! 🔥',
        body: '¡Un meme que seguiste se ha vuelto viral! Reivindica tus recompensas ahora.'
      })
      setTimeout(() => setNotificationSent(false), 30000)
    } catch (error) {
      console.error('Error al enviar notificación:', error)
      setNotificationSent(false)
    }
  }
  
  // Botón primario para navegar entre memes
  usePrimaryButton(
    { text: 'Ver siguiente meme' },
    () => {
      setCurrentMemeIndex((prev) => (prev + 1) % memes.length)
    }
  )
  
  // Función para manejar el clic en el botón de perfil
  const handleViewProfile = () => {
    viewProfile()
  }
  
  // Renderizar el meme actual
  const currentMeme = memes[currentMemeIndex]
  
  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-2">
      {/* Header */}
      <header className="w-full flex justify-between items-center p-2 mb-4 bg-bg-secondary rounded-lg">
        <div className="flex items-center">
          <Image 
            src="/images/logo.svg" 
            alt="Memex" 
            width={32} 
            height={32}
            className="mr-2"
          />
          <h1 className="text-xl font-bold text-text-primary">Memex</h1>
        </div>
        
        <div className="flex space-x-2">
          {!context?.client.added && (
            <button
              onClick={handleAddFrame}
              className="text-sm px-3 py-1 bg-primary-color text-white rounded-lg hover:bg-primary-hover"
            >
              Guardar
            </button>
          )}
          
          {context?.client.added && !notificationSent && (
            <button
              onClick={handleSendNotification}
              className="text-sm px-3 py-1 bg-success-color text-white rounded-lg hover:bg-green-600"
              disabled={notificationSent}
            >
              Notificar
            </button>
          )}
          
          <button
            onClick={handleViewProfile}
            className="text-sm px-3 py-1 bg-bg-tertiary text-text-primary rounded-lg hover:bg-primary-color hover:text-white"
          >
            Perfil
          </button>
          
          <button
            onClick={close}
            className="text-sm px-3 py-1 bg-bg-tertiary text-text-primary rounded-lg hover:bg-primary-color hover:text-white"
          >
            Cerrar
          </button>
        </div>
      </header>
      
      {/* Meme Content */}
      <div className="flex-1 w-full max-w-lg mb-6">
        {currentMeme && (
          <MemeCard 
            id={currentMeme.id}
            title={currentMeme.title}
            imageUrl={currentMeme.imageUrl}
            description={currentMeme.description}
            creator={currentMeme.creator}
            currentBets={currentMeme.currentBets}
            totalPot={currentMeme.totalPot}
            createdAt={currentMeme.createdAt}
          />
        )}
      </div>
      
      {/* Footer */}
      <footer className="w-full flex justify-center p-2 border-t border-border-color">
        <button
          onClick={() => openUrl('https://base.org')}
          className="text-xs text-text-secondary hover:text-accent-color flex items-center transition-colors"
        >
          CONSTRUIDO EN BASE CON MINIKIT
        </button>
      </footer>
    </div>
  )
} 