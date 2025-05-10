'use client'

import Link from 'next/link'
import ConnectWallet from './ConnectWallet'

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 p-4 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <Link href="/" className="font-bold text-2xl text-blue-600">
            Memex
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          <Link href="/" className="px-3 py-2 text-black">
            Inicio
          </Link>
          <Link href="/dashboard" className="px-3 py-2 text-black">
            Dashboard
          </Link>
          <Link href="/trending" className="px-3 py-2 text-black">
            Trending
          </Link>
          <Link href="/explore" className="px-3 py-2 text-black">
            Explorar
          </Link>
          <Link href="/create" className="px-3 py-2 text-black">
            Crear
          </Link>
          <Link href="/profile" className="px-3 py-2 text-black">
            Perfil
          </Link>
        </div>

        <ConnectWallet />
      </div>
    </nav>
  )
}