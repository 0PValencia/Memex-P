'use client'

import { ReactNode, useEffect, useState } from 'react'
import { baseSepolia } from 'wagmi/chains';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { publicProvider } from 'wagmi/providers/public';

// Configuración para wagmi v1.4.13 incluyendo Base Mainnet y Sepolia
const { chains, publicClient } = configureChains(
  [baseSepolia],
  [publicProvider()]
);

// Cliente de wagmi para v1.4.13
const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'Memex',
      },
    }),
  ],
  publicClient,
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