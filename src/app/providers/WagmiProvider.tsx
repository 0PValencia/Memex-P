'use client'

import { ReactNode } from 'react'
import { WagmiConfig, createConfig } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { createPublicClient, fallback, http } from 'viem'
import { mainnet } from 'viem/chains'

// Cliente publicClient básico usando fallback
const publicClient = createPublicClient({
  chain: mainnet,
  transport: fallback([
    http('https://eth-mainnet.g.alchemy.com/v2/demo'),
    http('https://cloudflare-eth.com')
  ])
})

// Configuración básica sin configureChains para evitar errores
const config = createConfig({
  autoConnect: false,
  publicClient,
  connectors: [
    new InjectedConnector(),
    new CoinbaseWalletConnector({
      options: {
        appName: 'Memex - Memes On-Chain',
        chainId: 1, // Ethereum mainnet
      },
    }),
  ],
})

export function WagmiProvider({ children }: { children: ReactNode }) {
  return <WagmiConfig config={config}>{children}</WagmiConfig>
} 