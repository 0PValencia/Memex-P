'use client'

import { OnchainKitProvider } from '@coinbase/onchainkit'
import { ReactNode } from 'react'
import { base } from 'viem/chains'

// Crear objeto de cadena compatible con OnchainKit con propiedades mínimas
const chainForOnchainKit = {
  id: base.id,
  name: base.name,
  network: base.network,
  nativeCurrency: base.nativeCurrency,
  rpcUrls: base.rpcUrls
}

export function OnchainKitContextProvider({ children }: { children: ReactNode }) {
  return (
    <OnchainKitProvider
      chain={chainForOnchainKit}
      projectId={process.env.NEXT_PUBLIC_ACCOUNT_KIT_PROJECT_ID || ''}
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || ''}
    >
      {children}
    </OnchainKitProvider>
  )
} 