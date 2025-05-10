'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useWeb3Modal } from '@coinbase/onchainkit'

export default function ConnectWallet() {
  const { isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()
  const { open } = useWeb3Modal()

  if (isConnected && address) {
    return (
      <div className="flex items-center">
        <button 
          onClick={() => disconnect()}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Desconectar
        </button>
      </div>
    )
  }

  return (
    <button 
      onClick={() => open()}
      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
    >
      Conectar Wallet
    </button>
  )
} 