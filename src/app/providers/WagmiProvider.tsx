'use client'

import { ReactNode, useEffect, useState } from 'react'
import { base, baseSepolia } from 'viem/chains';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';

// Configuración para wagmi v1.4.13 incluyendo Base Mainnet y Sepolia
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [baseSepolia, base], // Prioridad a Sepolia para pruebas, luego Mainnet
  [
    // Base Sepolia Testnet
    jsonRpcProvider({
      rpc: () => ({ 
        http: 'https://sepolia.base.org',
      }),
    }),
    // Base Mainnet
    jsonRpcProvider({
      rpc: () => ({ 
        http: 'https://mainnet.base.org',
      }),
    }),
    publicProvider()
  ]
);

// Cliente de wagmi para v1.4.13
const config = createConfig({
  autoConnect: true,
  connectors: [
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'Memex - Memes On-Chain',
      }
    }),
    new InjectedConnector({
      chains,
    }),
  ],
  publicClient,
  webSocketPublicClient,
});

// Componente proveedor con soporte para hidratación
export function WagmiProvider({ children }: { children: ReactNode }) {
  // Estado para controlar la hidratación del lado del cliente
  const [mounted, setMounted] = useState(false);
  
  // Asegurar que el componente solo se monte en el cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Evitar problemas de hidratación renderizando solo después de montado
  return (
    <WagmiConfig config={config}>
      {mounted ? children : null}
    </WagmiConfig>
  );
} 