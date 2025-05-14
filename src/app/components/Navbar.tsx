'use client'

import Link from 'next/link'
import ConnectWallet from './ConnectWallet'

export default function Navbar() {
  return (
    <nav className="backdrop-blur-md bg-opacity-90 bg-bg-primary w-full border-b border-gray-800">
      {/* Estructura de dos elementos en extremos opuestos */}
      <div className="flex items-center justify-between h-14 px-4 max-w-screen-2xl mx-auto">
        {/* Logo a la izquierda */}
        <div className="flex">
          <Link href="/" className="memex-logo">
            Memex
          </Link>
        </div>
        
        {/* Conectar wallet a la derecha, con un z-index menor */}
        <div className="ml-auto relative" style={{ zIndex: 5 }}>
          <ConnectWallet />
        </div>
      </div>
    </nav>
  )
}