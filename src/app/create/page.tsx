'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ConnectWallet from '../components/ConnectWallet'
import CreateMemeForm from '../components/CreateMemeForm'
import { useTheme } from '../contexts/ThemeContext'
import { getTranslations } from '../contexts/translations'

// Evento personalizado para detectar cuando se ha creado un meme
const MEME_CREATED_EVENT = 'memex_meme_created'

export default function CreateMemePage() {
  const router = useRouter()
  const { language } = useTheme()
  const t = getTranslations(language)
  
  // Escuchar evento de creación de meme exitosa para redirigir
  useEffect(() => {
    const handleMemeCreated = () => {
      // Esperar un momento y redirigir a explorar
      setTimeout(() => {
        router.push('/explore')
      }, 2000) // Dar tiempo para ver el mensaje de éxito
    }
    
    // Registrar escuchador de evento
    window.addEventListener(MEME_CREATED_EVENT, handleMemeCreated)
    
    // Limpiar escuchador al desmontar
    return () => {
      window.removeEventListener(MEME_CREATED_EVENT, handleMemeCreated)
    }
  }, [router])
  
  // Método para disparar el evento desde el componente hijo
  const handleMemeCreated = () => {
    window.dispatchEvent(new CustomEvent(MEME_CREATED_EVENT))
  }
  
  return (
    <main className="min-h-screen bg-bg-primary p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-4 sm:mb-0">
            {t.createMeme}
          </h1>
          <ConnectWallet />
        </div>
        
        <div className="bg-bg-secondary shadow-lg rounded-lg p-6 border border-border-color">
          <CreateMemeForm onMemeCreated={handleMemeCreated} />
        </div>
      </div>
    </main>
  )
} 