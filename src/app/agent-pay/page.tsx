'use client'

import ConnectWallet from '../components/ConnectWallet'
import CreateQuoteForm from '../components/CreateQuoteForm'

export default function AgentPay() {
  return (
    <main className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-black">Memex Agent</h1>
        
        <ConnectWallet />
        
        <div className="bg-blue-50 p-4 rounded mb-8 border border-blue-200">
          <h2 className="text-xl font-semibold mb-2 text-black">Sistema de Pago para Freelancers</h2>
          <p className="text-black mb-4">
            Este sistema te permite crear cotizaciones para servicios freelance, gestionar pagos y resolver disputas.
          </p>
          <ul className="list-disc list-inside space-y-2 text-black">
            <li>Crea una cotización especificando el monto, plazo y descripción del servicio</li>
            <li>El cliente puede aceptar la cotización depositando el pago en el contrato</li>
            <li>Al completar el trabajo, el cliente confirma y el pago se libera automáticamente</li>
            <li>Si hay disputas, un administrador puede intervenir para resolverlas</li>
          </ul>
        </div>
        
        <div className="mb-8">
          <CreateQuoteForm />
        </div>
      </div>
    </main>
  )
} 