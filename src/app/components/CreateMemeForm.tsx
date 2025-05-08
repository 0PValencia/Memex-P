'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAccount, useChainId, useContractWrite } from 'wagmi'
import { create } from 'ipfs-http-client'
import { MEMEX_CONTRACT_ABI, MEMEX_CONTRACT_ADDRESSES } from '@/utils/contracts'

// Configuración de IPFS con Infura (necesitarás tus propias claves en producción)
const projectId = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID || ''
const projectSecret = process.env.NEXT_PUBLIC_INFURA_API_SECRET || ''
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')

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

export default function CreateMemeForm() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const [file, setFile] = useState<File | null>(null)
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
    
    if (!contractAddress) {
      setError('El contrato no está disponible en esta red')
      return
    }

    if (!ipfs) {
      setError('El servicio IPFS no está disponible')
      return
    }

    try {
      setUploading(true)
      setError(null)
      setSuccess(null)

      // Subir la imagen a IPFS
      const fileData = await file.arrayBuffer()
      const buffer = Buffer.from(fileData)
      const imageResult = await ipfs.add(buffer)
      const imageUrl = `ipfs://${imageResult.path}`

      // Crear los metadatos del meme
      const metadata = {
        title,
        description,
        image: imageUrl,
        creator: address,
        createdAt: new Date().toISOString()
      }

      // Subir los metadatos a IPFS
      const metadataResult = await ipfs.add(JSON.stringify(metadata))
      const tokenURI = `ipfs://${metadataResult.path}`

      console.log('Meme metadata:', tokenURI)
      
      // En desarrollo, simular éxito en lugar de llamar al contrato
      if (process.env.NODE_ENV === 'development') {
        // Simular una transacción exitosa después de 2 segundos
        setTimeout(() => {
          setSuccess('¡Meme creado con éxito! (Simulación en desarrollo)')
          setUploading(false)
          setFile(null)
          setTitle('')
          setDescription('')
        }, 2000)
      } else {
        // Llamar al contrato inteligente para mintear el meme
        write({ args: [tokenURI] })
        setUploading(false)
      }
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
      setTitle('')
      setDescription('')
    }
  }, [isSuccess, success])

  // Para renderizaciones de prueba en el servidor, podemos devolver un formulario básico
  if (!ipfs) {
    return (
      <div className="space-y-4 bg-white p-6 rounded-lg shadow animate-pulse">
        <h2 className="text-2xl text-black font-bold mb-4">Cargando formulario...</h2>
      </div>
    )
  }

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
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full p-2 border rounded"
          required
          disabled={uploading || isLoading || !isConnected}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-black mb-2">
          Título
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
          disabled={uploading || isLoading || !isConnected}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-black mb-2">
          Descripción
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          rows={3}
          disabled={uploading || isLoading || !isConnected}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        disabled={uploading || isLoading || !isConnected}
      >
        {uploading || isLoading ? 'Creando meme...' : 'Crear Meme'}
      </button>
    </form>
  )
} 