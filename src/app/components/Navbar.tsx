'use client'

import Link from 'next/link'
import ConnectWallet from './ConnectWallet'

export default function Navbar() {
  return (
    <nav>
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <Link href="/" className="font-bold text-2xl text-accent-color">
            Memex
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          <Link href="/" className="px-3 py-2">
            Inicio
          </Link>
          <Link href="/dashboard" className="px-3 py-2">
            Dashboard
          </Link>
          <Link href="/trending" className="px-3 py-2">
            Trending
          </Link>
          <Link href="/explore" className="px-3 py-2">
            Explorar
          </Link>
          <Link href="/create" className="px-3 py-2">
            Crear
          </Link>
          <Link href="/profile" className="px-3 py-2">
            Perfil
          </Link>
        </div>

        <ConnectWallet />
      </div>
    </nav>
  )
}