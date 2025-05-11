'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAccount, useNetwork, useContractWrite } from 'wagmi'
import { MEMEX_CONTRACT_ABI, MEMEX_CONTRACT_ADDRESSES } from '@/utils/contracts'
import Image from 'next/image'
import { triggerMemesUpdate } from '../mocks/sampleMemes'
import { base } from 'viem/chains'

// Configuración de IPFS con Infura (necesitarás tus propias claves en producción)
const projectId = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID || ''
const projectSecret = process.env.NEXT_PUBLIC_INFURA_API_SECRET || ''
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')

// Simulación de almacenamiento local
const LOCAL_STORAGE_KEY = 'memex_uploaded_memes'

// Hook para proveer la instancia de IPFS simulada (evita problemas de compatibilidad)
function useClientSideIPFS() {
  // En lugar de cargar la biblioteca real, usamos una implementación simulada
  // que evita el error de propiedad de solo lectura
  return {
    add: async (content: any) => {
      console.log('Simulando carga a IPFS:', content)
      // Generar un CID simulado
      const cid = 'Qm' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      return { path: cid }
    }
  }
}

export default function CreateMemeForm({ onMemeCreated }: { onMemeCreated?: () => void }) {
  const { address, isConnected } = useAccount()
  const chainId = base.id
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Obtener la dirección del contrato según la cadena actual
  const contractAddress = chainId ? MEMEX_CONTRACT_ADDRESSES[chainId] : null
  
  // Preparar la llamada al contrato
  const { write, isLoading, isSuccess, error: contractError } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi: MEMEX_CONTRACT_ABI,
    functionName: 'createMeme',
  })
  
  // Inicializar IPFS del lado del cliente (versión simulada)
  const ipfs = useClientSideIPFS()

  // Detectar errores del contrato
  useEffect(() => {
    if (contractError) {
      console.error('Error del contrato:', contractError)
      setError(`Error del contrato: ${contractError.message}`)
    }
  }, [contractError])

  // Generar vista previa de la imagen
  useEffect(() => {
    if (!file) {
      setPreview(null)
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    // Limpiar URL cuando ya no sea necesario
    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  // Guardar el meme localmente para desarrollo
  const saveMemeLocally = useCallback((memeData: any) => {
    try {
      // Recuperar memes existentes
      let existingMemes = []
      if (typeof window !== 'undefined') {
        const savedMemes = localStorage.getItem(LOCAL_STORAGE_KEY)
        existingMemes = savedMemes ? JSON.parse(savedMemes) : []
      
        // Agregar el nuevo meme
        existingMemes.push({
          ...memeData,
          id: String(Date.now()), // Usar timestamp como ID temporal
          currentBets: 0,
          totalPot: 0,
        })
      
        // Guardar la lista actualizada
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existingMemes))
      }
      
      return true
    } catch (err) {
      console.error('Error al guardar meme localmente:', err)
      return false
    }
  }, [])

  // Convertir File a base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isConnected) {
      setError('Por favor conecta tu wallet primero')
      return
    }

    if (!file) {
      setError('Por favor selecciona una imagen')
      return
    }

    if (!title) {
      setError('Por favor ingresa un título')
      return
    }

    try {
      setUploading(true)
      setError(null)
      setSuccess(null)

      // Convertir imagen a base64 para almacenamiento local
      const base64Image = await fileToBase64(file);

      // Crear objeto con datos del meme
      const memeData = {
        title,
        description,
        imageUrl: base64Image, // Guardamos la imagen como base64 en lugar de la URL temporal
        creator: address || '0x0',
        createdAt: new Date().toISOString()
      }

      // Guardar localmente (para desarrollo)
      const saved = saveMemeLocally(memeData)
      
      if (saved) {
        setSuccess('¡Meme creado con éxito! Se ha guardado localmente.')
        
        // En un entorno real o de desarrollo, intentar interactuar con el contrato real
        if (contractAddress && ipfs) {
          try {
            console.log('Intentando interactuar con el contrato real en Base mainnet...')
            console.log('Dirección del contrato:', contractAddress)
            
            // Crear metadatos simplificados para la prueba
            const metadata = {
              title: title || "Meme sin título",
              description: description || "Sin descripción",
              creator: address || "0x",
              createdAt: new Date().toISOString()
            }
            
            // Convertir metadatos a string para la llamada al contrato
            const metadataStr = JSON.stringify(metadata)
            
            // Llamar al contrato inteligente para mintear el meme
            write({ args: [metadataStr] })
            
            setSuccess('¡Transacción iniciada! Interactuando con el contrato en Base mainnet...')
          } catch (contractErr) {
            console.error('Error al interactuar con el contrato:', contractErr)
            // No mostramos este error al usuario para no interferir con la experiencia
          }
        }
        
        // Limpiar el formulario
        setFile(null)
        setPreview(null)
        setTitle('')
        setDescription('')
        
        // Disparar evento para actualizar los memes en todos los componentes
        triggerMemesUpdate()
        
        // Notificar al componente padre sobre la creación exitosa
        if (onMemeCreated) {
          onMemeCreated()
        }
      } else {
        throw new Error('Error al guardar localmente')
      }
      
      setUploading(false)
    } catch (err) {
      console.error('Error al crear el meme:', err)
      setError('Error al subir el meme. Por favor intenta de nuevo.')
      setUploading(false)
    }
  }
  
  // Cuando la transacción es exitosa
  useEffect(() => {
    if (isSuccess && !success) {
      setSuccess('¡Meme creado con éxito! Se ha minted como NFT.')
      // Resetear el formulario
      setFile(null)
      setPreview(null)
      setTitle('')
      setDescription('')
      
      // Disparar evento para actualizar los memes en todos los componentes
      triggerMemesUpdate()
      
      // Notificar al componente padre sobre la creación exitosa
      if (onMemeCreated) {
        onMemeCreated()
      }
    }
  }, [isSuccess, success, onMemeCreated])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      setFile(droppedFile)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  return (
    <div className="animate-fadeIn">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Selector de imagen */}
        <div className="form-group">
          <label htmlFor="meme-image" className="block text-text-secondary mb-2">
            Imagen del Meme
          </label>
          
          <div 
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
              isDragging 
                ? 'border-primary-color bg-primary-color/10' 
                : 'border-border-color hover:border-accent-color'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            {preview ? (
              <div className="relative">
                <Image 
                  src={preview} 
                  alt="Vista previa" 
                  width={400} 
                  height={300}
                  className="mx-auto rounded-lg max-h-64 w-auto object-contain"
                  unoptimized={true}
                />
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                  className="absolute top-2 right-2 bg-error-color text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="py-6">
                <svg className="mx-auto h-12 w-12 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-2 text-sm text-text-secondary">Arrastra una imagen o haz clic para seleccionar</p>
                <p className="mt-1 text-xs text-text-secondary opacity-70">JPG, PNG, GIF (Max 10MB)</p>
              </div>
            )}
            
            <input
              type="file"
              id="meme-image"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
          </div>
          
          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="button secondary py-2 px-4 text-sm"
            >
              {preview ? "Cambiar imagen" : "Seleccionar archivo"}
            </button>
          </div>
        </div>
        
        {/* Título */}
        <div className="form-group">
          <label htmlFor="title" className="block text-text-secondary mb-2">
            Título del Meme
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            placeholder="Ingresa un título creativo"
            className="w-full"
            required
          />
          <p className="mt-1 text-xs text-text-secondary text-right">
            {title.length}/100
          </p>
        </div>
        
        {/* Descripción */}
        <div className="form-group">
          <label htmlFor="description" className="block text-text-secondary mb-2">
            Descripción (opcional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={300}
            placeholder="Explica el contexto o agrega etiquetas"
            className="w-full min-h-[100px]"
            rows={4}
          />
          <p className="mt-1 text-xs text-text-secondary text-right">
            {description.length}/300
          </p>
        </div>
        
        {/* Mensajes de error y éxito */}
        {error && (
          <div className="bg-red-950/20 text-red-500 p-4 rounded-lg">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-950/20 text-green-500 p-4 rounded-lg">
            {success}
          </div>
        )}
        
        {/* Botón de envío */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="button primary w-full py-3 text-lg"
            disabled={uploading || isLoading || !isConnected || !file}
          >
            {uploading || isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creando meme...
              </div>
            ) : (
              "Crear Meme"
            )}
          </button>
        </div>
        
        <p className="text-center text-xs text-text-secondary mt-4">
          Al crear un meme, confirmas que tienes los derechos necesarios para compartir esta imagen.
        </p>
      </form>
    </div>
  )
} 