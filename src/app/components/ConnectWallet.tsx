'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'

export default function ConnectWallet() {
  const { isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()
  const { connect } = useConnect()

  // Función para conectar wallet
  const handleConnect = () => {
    connect({ 
      connector: new CoinbaseWalletConnector({
        chains: [],
        options: {
          appName: 'Memex',
        },
      })
    })
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center">
        <button 
          onClick={() => disconnect()}
          className="button primary"
        >
          Desconectar
        </button>
      </div>
    )
  }

  return (
    <button 
      onClick={handleConnect}
      className="button primary"
    >
      Conectar Wallet
    </button>
  )
} 