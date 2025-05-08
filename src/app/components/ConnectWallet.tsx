'use client'

import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'

export default function ConnectWallet() {
  const { address, isConnected } = useAccount()
  const { connect, status } = useConnect()
  const { disconnect } = useDisconnect()
  const isConnecting = status === 'loading'
  
  // Estado para controlar la renderización del lado del cliente
  const [mounted, setMounted] = useState(false)
  
  // Solo ejecutar después del montaje del componente (en el cliente)
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleConnect = async () => {
    if (isConnected) return
    
    const connector = new CoinbaseWalletConnector({
      options: {
        appName: 'Memex - Memes On-Chain',
      },
    })
    
    connect({ connector })
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  // En el servidor o durante la hidratación inicial, mostrar un estado "no conectado" por defecto
  // Esto evita discrepancias entre el HTML del servidor y el del cliente
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
      {isConnected && address ? (
        <div className="flex justify-between items-center bg-green-100 p-3 rounded">
          <span className="text-green-700 font-medium">
            Conectado: {formatAddress(address)}
          </span>
          <button
            onClick={() => disconnect()}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Desconectar
          </button>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          disabled={isConnecting}
        >
          {isConnecting ? 'Conectando...' : 'Conectar Wallet'}
        </button>
      )}
    </div>
  )
} 