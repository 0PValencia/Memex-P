'use client'

import { ReactNode } from 'react'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

// Configurar cadenas y proveedores
const { chains, publicClient } = configureChains(
  [base, baseSepolia],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: chain.rpcUrls.default.http[0],
      }),
    }),
  ]
)

// Crear configuración de Wagmi
const config = createConfig({
  autoConnect: true,
  publicClient,
  connectors: [
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'Memex - Memes On-Chain',
      },
    }),
  ],
})

export function WagmiProvider({ children }: { children: ReactNode }) {
  return <WagmiConfig config={config}>{children}</WagmiConfig>
} 