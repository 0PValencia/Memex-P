'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ConnectWallet from './ConnectWallet'
import NotificationPanel from './NotificationPanel'
import { useAccount } from 'wagmi'
import { Identity, Name } from '@coinbase/onchainkit/identity'
import { base } from 'viem/chains'

export default function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { address, isConnected } = useAccount()

  const isActive = (path: string) => {
    return pathname === path
      ? 'text-blue-600 font-medium'
      : 'text-gray-600 hover:text-blue-600'
  }

  // Configuración del objeto de cadena para OnchainKit
  const chainForOnchainKit = {
    id: base.id,
    name: base.name,
    network: base.network,
    nativeCurrency: base.nativeCurrency,
    rpcUrls: base.rpcUrls
  }

  return (
    <nav className="navbar bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed w-full top-0 left-0 z-30 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="font-bold text-2xl text-gradient-primary">
                Memex<span className="text-blue-600">.</span>
              </Link>
            </div>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link href="/" className={`inline-flex items-center px-2 py-2 border-b-2 transition-colors ${pathname === '/' ? 'border-blue-500' : 'border-transparent'} ${isActive('/')}`}>
                Inicio
              </Link>
              <Link href="/dashboard" className={`inline-flex items-center px-2 py-2 border-b-2 transition-colors ${pathname === '/dashboard' ? 'border-blue-500' : 'border-transparent'} ${isActive('/dashboard')}`}>
                Mi Dashboard
              </Link>
              <Link href="/trending" className={`inline-flex items-center px-2 py-2 border-b-2 transition-colors ${pathname === '/trending' ? 'border-blue-500' : 'border-transparent'} ${isActive('/trending')}`}>
                Trending
              </Link>
              <Link href="/profile" className={`inline-flex items-center px-2 py-2 border-b-2 transition-colors ${pathname === '/profile' ? 'border-blue-500' : 'border-transparent'} ${isActive('/profile')}`}>
                Perfil
              </Link>
            </div>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-4">
            <NotificationPanel />
            {isConnected && address && (
              <Link href="/profile" className="mr-2 bg-blue-50 text-blue-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                <Identity address={address} chain={chainForOnchainKit}>
                  <Name />
                </Identity>
                <span className="ml-1">Mi Perfil</span>
              </Link>
            )}
            <div className="ml-2">
              <ConnectWallet />
            </div>
          </div>
          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-blue-600 hover:bg-gray-100 focus:outline-none transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menú</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <div className={`${isMenuOpen ? 'block animate-fadeIn' : 'hidden'} md:hidden absolute w-full bg-white shadow-lg z-20`}>
        <div className="pt-2 pb-3 space-y-1 px-4">
          <Link 
            href="/"
            className={`block py-2 rounded-md transition-colors ${pathname === '/' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Inicio
          </Link>
          <Link 
            href="/dashboard"
            className={`block py-2 rounded-md transition-colors ${pathname === '/dashboard' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Mi Dashboard
          </Link>
          <Link 
            href="/trending"
            className={`block py-2 rounded-md transition-colors ${pathname === '/trending' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Trending
          </Link>
          <Link 
            href="/profile"
            className={`block py-2 rounded-md transition-colors ${pathname === '/profile' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Perfil
          </Link>
          <div className="flex items-center py-4 mt-4 border-t border-gray-100">
            <NotificationPanel />
            <div className="ml-2 flex-1">
              <ConnectWallet />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}