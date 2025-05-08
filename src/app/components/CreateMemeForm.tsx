'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAccount, useNetwork, useContractWrite } from 'wagmi'
import { create } from 'ipfs-http-client'
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

// Hook para proveer la instancia de IPFS solo del lado del cliente
function useClientSideIPFS() {
  const [ipfsInstance, setIpfsInstance] = useState<any>(null)
  
  useEffect(() => {
    // Esta función solo se ejecuta en el cliente
    if (projectId && projectSecret) {
      const ipfs = create({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https',
        headers: {
          authorization: auth
        }
      })
      setIpfsInstance(ipfs)
    } else {
      // Función de simulación para desarrollo
      setIpfsInstance({
        add: async (content: any) => {
          console.log('Simulando carga a IPFS:', content)
          // Generar un CID simulado
          const cid = 'Qm' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
          return { path: cid }
        }
      })
    }
  }, [])
  
  return ipfsInstance
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
  
  // Obtener la dirección del contrato según la cadena actual
  const contractAddress = chainId ? MEMEX_CONTRACT_ADDRESSES[chainId] : null
  
  // Preparar la llamada al contrato
  const { write, isLoading, isSuccess, error: contractError } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi: MEMEX_CONTRACT_ABI,
    functionName: 'createMeme',
  })
  
  // Inicializar IPFS del lado del cliente
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl text-black font-bold mb-4">Crear Nuevo Meme</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      {!isConnected && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          Por favor conecta tu wallet antes de crear un meme
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-black mb-2">
          Imagen del Meme
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files && setFile(e.target.files[0])}
          className="w-full border border-gray-300 rounded p-2 text-black"
          disabled={uploading || !isConnected}
        />
        
        {preview && (
          <div className="mt-4 relative h-48 w-full overflow-hidden rounded-lg border-2 border-blue-300">
            <Image
              src={preview}
              alt="Vista previa"
              fill
              className="object-contain"
            />
          </div>
        )}
      </div>
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-black mb-2">
          Título
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 text-black"
          placeholder="Un título creativo para tu meme"
          disabled={uploading || !isConnected}
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-black mb-2">
          Descripción
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 text-black"
          rows={3}
          placeholder="Una breve descripción de tu meme"
          disabled={uploading || !isConnected}
        />
      </div>
      
      <div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={uploading || !isConnected}
        >
          {uploading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Subiendo...
            </span>
          ) : "Crear Meme"}
        </button>
      </div>
    </form>
  )
} 