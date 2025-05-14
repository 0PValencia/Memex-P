'use client'

import React from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  variant?: 'default' | 'outline' | 'minimal' | 'rounded' | 'pills' | 'simple'
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  variant = 'default'
}: PaginationProps) {
  
  // Generar array de páginas para mostrar
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 7 // Número máximo de páginas a mostrar en la navegación
    
    if (totalPages <= maxPagesToShow) {
      // Si hay pocas páginas, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Lógica para mostrar páginas con ellipsis
      const leftSide = Math.floor(maxPagesToShow / 2)
      const rightSide = maxPagesToShow - leftSide - 1
      
      // Si la página actual está cerca del inicio
      if (currentPage <= leftSide + 1) {
        for (let i = 1; i <= maxPagesToShow - 2; i++) {
          pageNumbers.push(i)
        }
        pageNumbers.push('...')
        pageNumbers.push(totalPages)
      } 
      // Si la página actual está cerca del final
      else if (currentPage >= totalPages - rightSide) {
        pageNumbers.push(1)
        pageNumbers.push('...')
        for (let i = totalPages - maxPagesToShow + 3; i <= totalPages; i++) {
          pageNumbers.push(i)
        }
      } 
      // Si la página actual está en el medio
      else {
        pageNumbers.push(1)
        pageNumbers.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i)
        }
        pageNumbers.push('...')
        pageNumbers.push(totalPages)
      }
    }
    
    return pageNumbers
  }
  
  // Asignar clases CSS según la variante
  const getClassNames = () => {
    const baseClasses = {
      container: 'flex items-center justify-center my-8',
      pageButton: 'mx-1 flex items-center justify-center focus:outline-none transition-colors',
      activeButton: 'text-white',
      inactiveButton: 'text-gray-700 hover:bg-gray-200',
      navButton: 'mx-1 flex items-center justify-center focus:outline-none transition-colors',
      ellipsis: 'mx-1 text-gray-500'
    }
    
    switch (variant) {
      case 'outline':
        return {
          ...baseClasses,
          pageButton: `${baseClasses.pageButton} h-10 w-10 border rounded`,
          activeButton: `${baseClasses.activeButton} bg-primary-color border-primary-color`,
          inactiveButton: `${baseClasses.inactiveButton} border-gray-300`,
          navButton: `${baseClasses.navButton} h-10 px-4 border border-gray-300 rounded hover:bg-gray-100`,
        }
        
      case 'minimal':
        return {
          ...baseClasses,
          pageButton: `${baseClasses.pageButton} h-10 w-10 rounded`,
          activeButton: `${baseClasses.activeButton} bg-primary-color`,
          inactiveButton: `${baseClasses.inactiveButton}`,
          navButton: `${baseClasses.navButton} h-10 px-4 rounded hover:bg-gray-100`,
        }
        
      case 'rounded':
        return {
          ...baseClasses,
          pageButton: `${baseClasses.pageButton} h-10 w-10 rounded-full`,
          activeButton: `${baseClasses.activeButton} bg-primary-color`,
          inactiveButton: `${baseClasses.inactiveButton}`,
          navButton: `${baseClasses.navButton} h-10 px-4 rounded-full hover:bg-gray-100`,
        }
        
      case 'pills':
        return {
          ...baseClasses,
          container: `${baseClasses.container} bg-bg-primary p-1 inline-flex rounded-full`,
          pageButton: `${baseClasses.pageButton} h-9 w-9 rounded-full`,
          activeButton: `${baseClasses.activeButton} bg-primary-color`,
          inactiveButton: 'text-text-primary hover:bg-bg-tertiary',
          navButton: `${baseClasses.navButton} h-9 px-4 rounded-full text-text-primary hover:bg-bg-tertiary`,
        }
        
      case 'simple':
        return {
          ...baseClasses,
          container: `${baseClasses.container} border border-gray-300 rounded inline-flex`,
          pageButton: `${baseClasses.pageButton} h-10 w-10 border-r border-gray-300 last:border-r-0`,
          activeButton: 'bg-gray-100 text-gray-800',
          inactiveButton: 'text-gray-600 hover:bg-gray-50',
          navButton: `${baseClasses.navButton} h-10 px-4 border-r border-gray-300`,
        }
        
      default: // 'default'
        return {
          ...baseClasses,
          pageButton: `${baseClasses.pageButton} h-10 w-10 rounded`,
          activeButton: `${baseClasses.activeButton} bg-primary-color`,
          inactiveButton: `${baseClasses.inactiveButton} hover:bg-gray-100`,
          navButton: `${baseClasses.navButton} h-10 px-4 rounded hover:bg-gray-100`,
        }
    }
  }
  
  const classes = getClassNames()
  const pageNumbers = getPageNumbers()
  
  return (
    <div className={classes.container}>
      {/* Botón anterior */}
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${classes.navButton} ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
      >
        ← Prev
      </button>
      
      {/* Números de página */}
      {pageNumbers.map((page, index) => (
        page === '...' ? (
          <span key={`ellipsis-${index}`} className={classes.ellipsis}>...</span>
        ) : (
          <button
            key={`page-${page}`}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            className={`${classes.pageButton} ${
              page === currentPage 
                ? classes.activeButton
                : classes.inactiveButton
            }`}
          >
            {page}
          </button>
        )
      ))}
      
      {/* Botón siguiente */}
      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${classes.navButton} ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
      >
        Next →
      </button>
    </div>
  )
} 