'use client'

import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

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

  const handleConnect = async () => {
    if (isConnected || isLoading) return
    
    // Buscar el conector de Coinbase
    const coinbaseConnector = connectors.find(c => c.id === 'coinbaseWallet')
    
    if (coinbaseConnector) {
      try {
        // Conectar usando el conector de Coinbase
        connect({ connector: coinbaseConnector })
      } catch (err) {
        console.error('Error al iniciar conexión:', err)
        setConnectionError('Error al iniciar la conexión. Inténtalo de nuevo.')
      }
    } else {
      // Si no está disponible Coinbase Wallet, intentar con otro conector
      const firstConnector = connectors[0]
      if (firstConnector) {
        connect({ connector: firstConnector })
      } else {
        setConnectionError('No hay conectores disponibles')
      }
    }
  }

  const handleDisconnect = () => {
    disconnect()
    setConnectionError(null)
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  // En el servidor o durante la hidratación inicial, mostrar un estado "no conectado" por defecto
  if (!mounted) {
    return (
      <div className="mb-6">
        <button
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          disabled
        >
          Cargando...
        </button>
      </div>
    )
  }

  // Una vez montado (en el cliente), mostrar el estado real
  return (
    <div className="mb-6">
      {connectionError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-3 rounded">
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
      
      {isConnected && address ? (
        <div className="flex justify-between items-center bg-green-100 p-3 rounded">
          <span className="text-green-700 font-medium">
            Conectado: {formatAddress(address)}
          </span>
          <button
            onClick={handleDisconnect}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Desconectar
          </button>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Conectando...
            </span>
          ) : 'Conectar Wallet'}
        </button>
      )}
    </div>
  )
} 