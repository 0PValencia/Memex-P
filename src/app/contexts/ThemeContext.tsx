'use client'

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react'

type ThemeType = 'light' | 'dark' | 'system'
type LanguageType = 'es' | 'en'

interface ThemeContextType {
  theme: ThemeType
  language: LanguageType
  setTheme: (theme: ThemeType) => void
  setLanguage: (language: LanguageType) => void
  isDarkMode: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Valores por defecto: tema claro e idioma español
  const [theme, setThemeState] = useState<ThemeType>('light')
  const [language, setLanguageState] = useState<LanguageType>('es')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Cargar tema y lenguaje desde localStorage solo al iniciar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('memex-theme') as ThemeType | null
      const savedLanguage = localStorage.getItem('memex-language') as LanguageType | null
      
      // Usar los valores guardados solo si existen, de lo contrario usar los predeterminados
      if (savedTheme) {
        setThemeState(savedTheme)
      }
      
      if (savedLanguage) {
        setLanguageState(savedLanguage)
      }
      
      // Marcar el componente como montado para evitar problemas de hidratación
      setMounted(true)
    }
  }, [])

  // Actualizar el tema del documento cuando cambia la preferencia
  useEffect(() => {
    if (typeof window !== 'undefined' && mounted) {
      const root = window.document.documentElement
      
      // Eliminar clases antiguas
      root.classList.remove('light', 'dark')
      
      // Determinar si debe usar modo oscuro
      let resolvedTheme = theme
      
      if (theme === 'system') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        resolvedTheme = systemPrefersDark ? 'dark' : 'light'
      }
      
      // Aplicar la clase correspondiente
      root.classList.add(resolvedTheme)
      
      // Actualizar estado de oscuridad
      setIsDarkMode(resolvedTheme === 'dark')
      
      // Guardar preferencia en localStorage
      localStorage.setItem('memex-theme', theme)
    }
  }, [theme, mounted])

  // Guardar preferencia de idioma cuando cambia
  useEffect(() => {
    if (typeof window !== 'undefined' && mounted) {
      localStorage.setItem('memex-language', language)
      
      // Actualizar el atributo lang del HTML
      document.documentElement.lang = language
    }
  }, [language, mounted])

  // Funciones para cambiar tema e idioma
  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme)
  }

  const setLanguage = (newLanguage: LanguageType) => {
    setLanguageState(newLanguage)
  }

  // Renderizar children solo cuando el componente esté montado
  // para evitar diferencias entre el servidor y el cliente
  return (
    <ThemeContext.Provider value={{ theme, language, setTheme, setLanguage, isDarkMode }}>
      {mounted ? children : null}
    </ThemeContext.Provider>
  )
}

// Hook personalizado para usar el contexto
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme debe usarse dentro de un ThemeProvider')
  }
  return context
} 