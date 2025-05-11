# Memex MiniKit Integration

Este directorio contiene la implementación de una mini aplicación de Memex utilizando MiniKit, que permite distribuir la aplicación directamente en feeds sociales y aprovechar el gráfico social de formas únicas.

## ¿Qué es MiniKit?

MiniKit es una herramienta de Coinbase que facilita la creación de mini aplicaciones que pueden distribuirse directamente en feeds sociales, especialmente en Farcaster Frames. Permite una experiencia de usuario fluida sin necesidad de abrir una nueva pestaña o descargar una aplicación.

## Características implementadas

- **Vista principal de memes**: Navega a través de memes populares directamente en el feed
- **Guardado de la aplicación**: Los usuarios pueden guardar la mini aplicación para acceder a ella más tarde
- **Notificaciones**: Envía notificaciones a los usuarios cuando los memes se vuelven virales
- **Interacción social**: Integración con perfiles de Farcaster
- **Botones de navegación**: Interfaz intuitiva que aprovecha las funciones específicas de MiniKit

## Configuración necesaria

Para que esta integración funcione correctamente en producción, debes:

1. **Crear un manifest de Farcaster**:
   - Ejecuta `npx create-onchain --manifest` después de desplegar tu aplicación
   - Conecta con tu wallet de custodia de Farcaster
   - Firma el manifest para obtener las claves necesarias
   - Actualiza el archivo `manifest.json` con los valores generados

2. **Configurar variables de entorno**:
   ```
   NEXT_PUBLIC_CDP_CLIENT_API_KEY=your_api_key
   NEXT_PUBLIC_URL=your_deployed_url
   FARCASTER_HEADER=your_header
   FARCASTER_PAYLOAD=your_payload
   FARCASTER_SIGNATURE=your_signature
   ```

3. **Desplegar el archivo `.well-known/farcaster.json`**:
   - Este archivo debe estar accesible desde la raíz de tu dominio
   - Asegúrate de que tu servidor web permita el acceso a archivos en `.well-known`

## Cómo funciona

1. **Inicialización**: La aplicación se inicializa con `useMiniKit` y se marca como lista cuando se carga completamente
2. **Interacción de usuarios**: Se permite a los usuarios navegar por memes, guardar la aplicación y recibir notificaciones
3. **Notificaciones**: Se envían a través del endpoint `/api/notification` cuando ocurren eventos relevantes
4. **Navegación**: El botón primario permite navegar entre memes sin salir del frame

## Flujo de datos

```
[Cliente] <- useMiniKit -> [Farcaster SDK]
   |
   v
[Guardar Frame] -> [Obtener token y URL]
   |
   v
[Enviar notificación] -> [API de notificación] -> [Farcaster]
```

## Mejoras futuras

- Integración con el contrato para mostrar datos en tiempo real
- Permitir apuestas directamente desde el frame
- Mejorar la UX para dispositivos móviles específicamente
- Implementar autenticación con Farcaster para funciones avanzadas

## Referencias

- [Documentación de MiniKit](https://docs.base.org/builderkits/minikit/overview)
- [Especificación de Farcaster Frames](https://docs.farcaster.xyz/reference/frames/spec)
- [Create Onchain CLI](https://github.com/coinbase/create-onchain) 