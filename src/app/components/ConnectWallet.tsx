'use client'

import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Wallet, ConnectWallet as OnchainConnectWallet } from '@coinbase/onchainkit/wallet'
import { base } from 'viem/chains'

export default function ConnectWallet() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isLoading, error } = useConnect()
  const { disconnect } = useDisconnect()
  
  // Estados para gestionar la conexión y errores
  const [mounted, setMounted] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  
  // Solo ejecutar después del montaje del componente (en el cliente)
  useEffect(() => {
    setMounted(true)
  }, [])

  // Manejar errores de conexión
  useEffect(() => {
    if (error) {
      console.error('Error de conexión:', error)
      setConnectionError('Error al conectar. Inténtalo de nuevo.')
    }
  }, [error])
  
  // Limpiar error cuando conecta correctamente
  useEffect(() => {
    if (isConnected && connectionError) {
      setConnectionError(null)
    }
  }, [isConnected, connectionError])

  // Función para dar formato a la dirección
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  // En el servidor o durante la hidratación inicial, mostrar un estado "no conectado" por defecto
  if (!mounted) {
    return (
      <div className="my-4 px-2">
        <button
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg shadow-sm font-medium"
          disabled
        >
          Cargando...
        </button>
      </div>
    )
  }

  // Si hay soporte para Smart Wallet, usar el componente de OnchainKit
  return (
    <div className="my-4 px-2">
      {connectionError && (
        <div className="notification notification-error mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">{connectionError}</p>
            </div>
          </div>
        </div>
      )}
      
      {!isConnected ? (
        <Wallet>
          <OnchainConnectWallet 
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg shadow-sm font-medium hover:bg-blue-700 transition-colors"
            disconnectedLabel="Conectar Wallet"
          />
        </Wallet>
      ) : (
        <div className="flex justify-between items-center bg-green-100 p-4 rounded-lg shadow-sm">
          <span className="text-green-700 font-medium">
            Conectado: {formatAddress(address || '')}
          </span>
          <button
            onClick={() => disconnect()}
            className="text-sm text-red-600 hover:text-red-800 font-medium px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
          >
            Desconectar
          </button>
        </div>
      )}
    </div>
  )
} 