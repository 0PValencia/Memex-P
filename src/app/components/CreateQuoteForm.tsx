'use client'

import { useState } from 'react'
import { useAccount, useContractWrite, useWaitForTransaction } from 'wagmi'
import { parseEther } from 'viem'
import { abi, contractAddress } from '@/contracts/abi'

export default function CreateQuoteForm() {
  const { address, isConnected } = useAccount()
  const [clientAddress, setClientAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [deadline, setDeadline] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Preparar la llamada al contrato para crear una cotización
  const { 
    data: createData, 
    write: createQuote,
    isLoading: isCreating,
    error: createError 
  } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'createQuote',
  })

  // Esperar la transacción
  const { isLoading: isWaiting, isSuccess } = useWaitForTransaction({
    hash: createData?.hash,
    onSuccess: () => {
      setSuccess(`¡Cotización creada con éxito! ID: ${createData?.hash}`)
      setClientAddress('')
      setAmount('')
      setDeadline('')
      setDescription('')
      console.log(`Cotización creada con ID: ${createData?.hash}`)
    },
    onError: () => {
      setError('Error al procesar la transacción. Inténtalo de nuevo.')
    }
  })

  // Convertir días a timestamp futuro
  const calculateDeadlineTimestamp = (daysFromNow: number): bigint => {
    const now = Math.floor(Date.now() / 1000)
    const secondsInDay = 86400
    return BigInt(now + (daysFromNow * secondsInDay))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!isConnected) {
      setError('Por favor conecta tu wallet para continuar')
      return
    }

    try {
      // Validaciones
      if (!clientAddress || !amount || !deadline || !description) {
        setError('Todos los campos son obligatorios')
        return
      }

      // Verificar que la dirección del cliente es válida
      if (!clientAddress.startsWith('0x') || clientAddress.length !== 42) {
        setError('La dirección del cliente no es válida')
        return
      }

      // Verificar que el monto es un número válido
      const amountValue = parseFloat(amount)
      if (isNaN(amountValue) || amountValue <= 0) {
        setError('El monto debe ser un número positivo')
        return
      }

      // Verificar que el plazo es un número válido
      const deadlineDays = parseInt(deadline)
      if (isNaN(deadlineDays) || deadlineDays <= 0) {
        setError('El plazo debe ser un número positivo de días')
        return
      }

      // Calcular el timestamp del plazo
      const deadlineTimestamp = calculateDeadlineTimestamp(deadlineDays)

      // Llamar al contrato
      createQuote?.({
        args: [
          clientAddress as `0x${string}`,
          parseEther(amount),
          deadlineTimestamp,
          description
        ],
      })
    } catch (err) {
      setError('Ocurrió un error inesperado. Por favor, inténtalo de nuevo.')
      console.error(err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl text-black font-bold mb-4">Crear Nueva Cotización</h2>
      
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
          Por favor conecta tu wallet antes de crear una cotización
        </div>
      )}

      <div>
        <label className="block text-black font-medium mb-1" htmlFor="clientAddress">
          Dirección del Cliente
        </label>
        <input
          id="clientAddress"
          type="text"
          className="w-full p-2 border border-gray-300 rounded text-black"
          placeholder="0x..."
          value={clientAddress}
          onChange={(e) => setClientAddress(e.target.value)}
          disabled={isCreating || isWaiting}
        />
      </div>

      <div>
        <label className="block text-black font-medium mb-1" htmlFor="amount">
          Monto (ETH)
        </label>
        <input
          id="amount"
          type="text"
          className="w-full p-2 border border-gray-300 rounded text-black"
          placeholder="0.1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={isCreating || isWaiting}
        />
      </div>

      <div>
        <label className="block text-black font-medium mb-1" htmlFor="deadline">
          Plazo (días)
        </label>
        <input
          id="deadline"
          type="number"
          className="w-full p-2 border border-gray-300 rounded text-black"
          placeholder="14"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          disabled={isCreating || isWaiting}
        />
      </div>

      <div>
        <label className="block text-black font-medium mb-1" htmlFor="description">
          Descripción del Servicio
        </label>
        <textarea
          id="description"
          className="w-full p-2 border border-gray-300 rounded text-black"
          placeholder="Describe el servicio que vas a proporcionar..."
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isCreating || isWaiting}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:bg-blue-400"
        disabled={isCreating || isWaiting || !isConnected}
      >
        {isCreating || isWaiting ? 'Procesando...' : 'Crear Cotización'}
      </button>
    </form>
  )
} 