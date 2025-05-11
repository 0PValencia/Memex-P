import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Verificar que la solicitud es válida
    if (!request.body) {
      return NextResponse.json({ error: 'No body provided' }, { status: 400 })
    }

    // Extraer datos de la solicitud
    const data = await request.json()
    
    // Verificar que se proporcionó un token y url
    if (!data.token || !data.url) {
      return NextResponse.json(
        { error: 'Token y URL son obligatorios' }, 
        { status: 400 }
      )
    }
    
    // Verificar que se proporcionó un título y cuerpo
    if (!data.title || !data.body) {
      return NextResponse.json(
        { error: 'Título y cuerpo son obligatorios' }, 
        { status: 400 }
      )
    }
    
    // En un entorno real, aquí enviaríamos la notificación a través del servicio de Farcaster
    // usando el token y url proporcionados
    
    // Por ahora, simularemos una respuesta exitosa
    return NextResponse.json(
      { success: true, message: 'Notificación enviada con éxito' }, 
      { status: 200 }
    )
  } catch (error) {
    console.error('Error al procesar la notificación:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    )
  }
}

// Opcionalmente, también podemos implementar un método GET para verificar el estado
export async function GET() {
  return NextResponse.json(
    { status: 'online', service: 'Memex MiniKit Notification API' }, 
    { status: 200 }
  )
} 