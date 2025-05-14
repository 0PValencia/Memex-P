'use client'

import React, { useState } from 'react'
import Pagination from './Pagination'

export default function PaginationExample() {
  const [currentPage, setCurrentPage] = useState(5)
  const totalPages = 20
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }
  
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-10">
      <div>
        <h2 className="text-xl font-bold mb-3 text-text-primary">Variante Default</h2>
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={handlePageChange} 
          variant="default" 
        />
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-3 text-text-primary">Variante Outline</h2>
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={handlePageChange}
          variant="outline" 
        />
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-3 text-text-primary">Variante Minimal</h2>
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={handlePageChange}
          variant="minimal" 
        />
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-3 text-text-primary">Variante Rounded</h2>
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={handlePageChange}
          variant="rounded" 
        />
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-3 text-text-primary">Variante Pills</h2>
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={handlePageChange}
          variant="pills" 
        />
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-3 text-text-primary">Variante Simple</h2>
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={handlePageChange}
          variant="simple" 
        />
      </div>
      
      <div className="mt-10 p-6 border border-border-color rounded-lg">
        <h3 className="text-lg font-medium mb-2 text-text-primary">Instrucciones de uso:</h3>
        <div className="text-text-secondary space-y-2">
          <p>• Importa el componente Pagination desde <code className="bg-bg-tertiary px-2 py-1 rounded text-accent-color">@/components/Pagination</code></p>
          <p>• Propiedades requeridas: currentPage, totalPages y onPageChange</p>
          <p>• Variantes disponibles: default, outline, minimal, rounded, pills, simple</p>
          <p>• Ejemplo:</p>
          <pre className="bg-bg-tertiary p-4 rounded-md text-sm overflow-x-auto">
{`import Pagination from '@/components/Pagination'

const [currentPage, setCurrentPage] = useState(1)
const totalPages = 10

<Pagination 
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
  variant="pills"
/>`}
          </pre>
        </div>
      </div>
    </div>
  )
} 