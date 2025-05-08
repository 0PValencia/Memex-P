'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { Identity, Name, Avatar } from '@coinbase/onchainkit/identity'
import { base } from 'viem/chains'

interface ProfileCardProps {
  showActions?: boolean;
}

export default function ProfileCard({ showActions = true }: ProfileCardProps) {
  const { address, isConnected } = useAccount()
  const [mounted, setMounted] = useState(false)
  
  // Asegurar que el componente solo se monte en el cliente
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="animate-pulse h-40 bg-gray-100 rounded-lg"></div>
  }

  if (!isConnected || !address) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="text-center">
          <div className="bg-gray-100 w-20 h-20 mx-auto rounded-full mb-4 flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No conectado</h3>
          <p className="text-gray-500 mb-4">Conecta tu wallet para ver tu perfil</p>
        </div>
      </div>
    )
  }
  
  // Configuración del objeto de cadena para OnchainKit
  const chainForOnchainKit = {
    id: base.id,
    name: base.name,
    network: base.network,
    nativeCurrency: base.nativeCurrency,
    rpcUrls: base.rpcUrls
  }

  // Función para formatear la dirección
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex flex-col items-center text-center">
        <div className="w-24 h-24 mb-4 relative overflow-hidden rounded-full bg-blue-100">
          <Identity address={address} chain={chainForOnchainKit}>
            <Avatar className="w-full h-full object-cover" />
          </Identity>
        </div>
        
        <h2 className="text-xl font-bold mb-1 flex items-center">
          <Identity address={address} chain={chainForOnchainKit}>
            <Name className="text-blue-600" />
          </Identity>
        </h2>
        
        <div className="text-sm text-gray-500 mb-4">
          <span className="font-mono text-xs">{formatAddress(address)}</span>
        </div>
        
        {showActions && (
          <div className="mt-4 flex gap-3 w-full">
            <a 
              href={`https://basescan.org/address/${address}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 bg-blue-100 text-blue-600 py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-200 transition-colors"
            >
              Ver en BaseScan
            </a>
            <a 
              href="https://app.base.org/names" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 bg-purple-100 text-purple-600 py-2 px-4 rounded-md text-sm font-medium hover:bg-purple-200 transition-colors"
            >
              Registrar Basename
            </a>
          </div>
        )}
      </div>
    </div>
  )
} 