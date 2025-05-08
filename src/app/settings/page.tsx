'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import ConnectWallet from '../components/ConnectWallet'
import { useTheme } from '../contexts/ThemeContext'
import { getTranslations } from '../contexts/translations'

interface UserSettings {
  email: string
  displayName: string
  privacyMode: 'public' | 'private'
}

export default function SettingsPage() {
  const { address, isConnected } = useAccount()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null)
  
  // Usar el contexto de tema
  const { language } = useTheme()
  
  // Obtener traducciones según el idioma actual
  const t = getTranslations(language)
  
  // Estado de las configuraciones
  const [settings, setSettings] = useState<UserSettings>({
    email: '',
    displayName: '',
    privacyMode: 'public'
  })

  // Cargar configuraciones del usuario
  useEffect(() => {
    if (isConnected && address) {
      // Simular carga de configuraciones desde la API o localStorage
      setTimeout(() => {
        // En una implementación real, aquí cargarías los datos del usuario
        // desde un backend o localStorage
        const savedSettings = localStorage.getItem(`memex-settings-${address}`)
        
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings)
          setSettings({
            email: parsedSettings.email || '',
            displayName: parsedSettings.displayName || '',
            privacyMode: parsedSettings.privacyMode || 'public'
          })
        } else {
          // Asignar un nombre de visualización por defecto basado en la dirección
          setSettings(prev => ({
            ...prev,
            displayName: `Usuario ${address.substring(2, 6)}`
          }))
        }
        
        setIsLoading(false)
      }, 800)
    } else {
      setIsLoading(false)
    }
  }, [address, isConnected])

  // Manejar cambios en los campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value
    }))
  }

  // Guardar configuraciones
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isConnected || !address) {
      return
    }
    
    setIsSaving(true)
    setSaveSuccess(null)
    
    try {
      // Simular guardado en la API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Guardar en localStorage como simulación
      localStorage.setItem(`memex-settings-${address}`, JSON.stringify(settings))
      
      setSaveSuccess(true)
      
      // Resetear el estado después de unos segundos
      setTimeout(() => {
        setSaveSuccess(null)
      }, 3000)
    } catch (error) {
      console.error('Error al guardar configuraciones:', error)
      setSaveSuccess(false)
    } finally {
      setIsSaving(false)
    }
  }

  if (!isConnected) {
    return (
      <main className="min-h-screen p-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-black dark:text-white">{t.settings}</h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">{t.connectForSettings}</h2>
            <ConnectWallet />
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-4 bg-white">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-black dark:text-white">{t.settings}</h1>
          <ConnectWallet />
        </div>
        
        {isLoading ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 rounded-lg shadow divide-y divide-gray-200 dark:divide-gray-700">
            {/* Sección de cuenta */}
            <div className="p-6">
              <h2 className="text-xl font-semibold text-black dark:text-white mb-4">{t.accountSettings}</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.displayName}
                  </label>
                  <input
                    type="text"
                    id="displayName"
                    name="displayName"
                    value={settings.displayName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t.displayNamePlaceholder}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.email}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={settings.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t.emailPlaceholder}
                  />
                </div>
                
                <div>
                  <label htmlFor="privacyMode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.privacy}
                  </label>
                  <select
                    id="privacyMode"
                    name="privacyMode"
                    value={settings.privacyMode}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="public">{t.publicProfile}</option>
                    <option value="private">{t.privateProfile}</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Sección de botones */}
            <div className="p-6">
              {saveSuccess === true && (
                <div className="bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-100 p-3 rounded mb-4">
                  {t.saved}
                </div>
              )}
              
              {saveSuccess === false && (
                <div className="bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-100 p-3 rounded mb-4">
                  {t.error}
                </div>
              )}
              
              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:bg-blue-400"
              >
                {isSaving ? t.saving : t.save}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  )
} 