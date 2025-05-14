'use client'

import { useState } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { baseSepolia } from 'wagmi/chains'

export default function ConnectWallet() {
  const { isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()
  const { connect, isLoading } = useConnect()
  const [showOptions, setShowOptions] = useState(false)

  // Manejar errores de conexión
  const handleConnectWithFallback = (connectorType: 'coinbase' | 'metamask') => {
    try {
      if (connectorType === 'coinbase') {
        connect({ 
          connector: new CoinbaseWalletConnector({
            chains: [baseSepolia],
            options: {
              appName: 'Memex',
              reloadOnDisconnect: false,
              headlessMode: true,
              jsonRpcUrl: 'https://sepolia.base.org',
              enableMobileWalletLink: false,
            },
          })
        })
      } else {
        connect({
          connector: new InjectedConnector({
            chains: [baseSepolia]
          })
        })
      }
    } catch (error) {
      console.error('Error al conectar wallet:', error)
      // Si falla, intentar con configuración alternativa
      connect({ 
        connector: new CoinbaseWalletConnector({
          chains: [baseSepolia],
          options: {
            appName: 'Memex',
            jsonRpcUrl: 'https://sepolia.base.org',
          },
        })
      })
    }
    setShowOptions(false)
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center">
        <button 
          onClick={() => disconnect()}
          className="button primary"
        >
          {address.slice(0, 6)}...{address.slice(-4)}
        </button>
      </div>
    )
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setShowOptions(!showOptions)}
        className="button primary"
        disabled={isLoading}
      >
        {isLoading ? 'Conectando...' : 'Conectar Wallet'}
      </button>
      
      {showOptions && (
        <div className="absolute top-full right-0 mt-2 bg-bg-secondary rounded-md shadow-lg p-2 z-50 border border-border-color">
          <button 
            onClick={() => handleConnectWithFallback('coinbase')}
            className="w-full text-left px-4 py-2 hover:bg-bg-tertiary rounded transition-colors"
          >
            Coinbase Wallet
          </button>
          <button 
            onClick={() => handleConnectWithFallback('metamask')}
            className="w-full text-left px-4 py-2 hover:bg-bg-tertiary rounded transition-colors"
          >
            MetaMask
          </button>
        </div>
      )}
    </div>
  )
} 