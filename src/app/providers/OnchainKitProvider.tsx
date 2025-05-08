'use client'

import { OnchainKitProvider } from '@coinbase/onchainkit'
import { ReactNode } from 'react'
import { base } from 'viem/chains'

export function OnchainKitContextProvider({ children }: { children: ReactNode }) {
  return (
    <OnchainKitProvider
      chain={base}
    >
      {children}
    </OnchainKitProvider>
  )
} 