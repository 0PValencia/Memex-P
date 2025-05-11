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
      apiKey={process.env.NEXT_PUBLIC_CDP_CLIENT_API_KEY || ''}
      config={{
        appearance: {
          mode: 'light',
          theme: 'memex',
          name: 'Memex',
          logo: process.env.NEXT_PUBLIC_ICON_URL || '/images/logo.svg',
        },
      }}
    >
      {children}
    </OnchainKitProvider>
  )
} 