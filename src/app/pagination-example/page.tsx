import PaginationExample from '../components/PaginationExample'

export default function PaginationDemoPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <div className="py-10">
          <h1 className="text-3xl font-bold mb-6 text-text-primary">Ejemplos de Paginación</h1>
          <p className="mb-8 text-text-secondary">
            Diferentes estilos de paginación disponibles para usar en tu aplicación.
            Selecciona el que mejor se adapte a tu diseño.
          </p>
          
          <PaginationExample />
        </div>
      </div>
    </div>
  )
} 