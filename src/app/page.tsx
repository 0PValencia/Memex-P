'use client'

import CreateMemeForm from './components/CreateMemeForm'
import MemeCard from './components/MemeCard'
import ConnectWallet from './components/ConnectWallet'
import { sampleMemes } from './mocks/sampleMemes'

export default function Home() {
  return (
    <main className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-black">Memex</h1>
        
        <ConnectWallet />
        
        <div className="bg-blue-50 p-4 rounded mb-8 border border-blue-200">
          <h2 className="text-xl font-semibold mb-2 text-black">¿Cómo funciona Memex?</h2>
          <ol className="list-decimal list-inside space-y-2 text-black">
            <li>Conéctate con tu wallet de Coinbase</li>
            <li>Crea un meme NFT: sube una imagen, añade título y descripción</li>
            <li>Apuesta por memes que crees que se volverán virales</li>
            <li>Si un meme se vuelve viral, los apostadores y el creador reciben recompensas</li>
          </ol>
          <p className="mt-4 text-sm text-black">Nota: Esta dApp está desplegada en la red Base. Asegúrate de estar conectado a la red Base.</p>
        </div>
        
        <div className="mb-8">
          <CreateMemeForm />
        </div>

        <h2 className="text-2xl font-bold mb-4 text-black">Memes Trending</h2>
        <div className="grid gap-6">
          {sampleMemes.map((meme) => (
            <MemeCard key={meme.id} {...meme} />
          ))}
        </div>
      </div>
    </main>
  )
}
