# Integración de Memex con MiniKit

Esta integración permite que Memex funcione como una mini aplicación que se puede distribuir directamente en feeds sociales (especialmente en Farcaster) y aprovechar el gráfico social de formas únicas.

## ¿Qué es MiniKit?

MiniKit es una herramienta de Coinbase que facilita la creación de mini aplicaciones para redes sociales onchain. Permite:

- Crear mini apps que funcionan dentro de Farcaster Frames
- Enviar notificaciones a usuarios
- Interactuar con perfiles de usuarios
- Implementar experiencias sociales inmersivas

## Archivos de la integración

- `/src/app/minikit/page.tsx`: La página principal de la mini aplicación
- `/src/app/minikit/metadata.ts`: Metadatos para SEO y compartición social
- `/src/app/minikit/manifest.json`: Configuración para Farcaster Frames
- `/src/app/api/notification/route.ts`: Endpoint para manejar notificaciones
- `/src/app/providers/OnchainKitProvider.tsx`: Proveedor para OnchainKit (incluye configuración de MiniKit)

## Configuración de variables de entorno

Crea un archivo `.env.local` con las siguientes variables:

```
# Infura IPFS - Para almacenamiento de memes
NEXT_PUBLIC_INFURA_PROJECT_ID=your_infura_project_id
NEXT_PUBLIC_INFURA_API_SECRET=your_infura_api_secret

# Mainnet Base - Para operaciones en blockchain
BASE_RPC_URL=https://mainnet.base.org

# Separador - Private Key para deploy de contratos
PRIVATE_KEY=your_private_key

# BaseScan - Para verificación de contratos
BASESCAN_API_KEY=your_basescan_api_key

# MiniKit - Para integración con feed social
NEXT_PUBLIC_CDP_CLIENT_API_KEY=your_cdp_client_api_key
NEXT_PUBLIC_ACCOUNT_KIT_PROJECT_ID=your_account_kit_project_id
NEXT_PUBLIC_URL=https://your-deployed-site.com
NEXT_PUBLIC_ICON_URL=https://your-deployed-site.com/images/logo.svg

# Farcaster - Manifest para MiniKit
FARCASTER_HEADER=your_farcaster_header
FARCASTER_PAYLOAD=your_farcaster_payload
FARCASTER_SIGNATURE=your_farcaster_signature
```

## Pasos para implementar MiniKit

### 1. Obtener API Key de Coinbase Developer Platform (CDP)

1. Ve a [Coinbase Developer Platform](https://developers.coinbase.com/)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Genera una API Key para el Cliente (Client API Key)
5. Copia la key y colócala en la variable `NEXT_PUBLIC_CDP_CLIENT_API_KEY`

### 2. Desplegar la aplicación

Recomendamos usar Vercel para el despliegue:

```bash
vercel
```

Asegúrate de configurar las variables de entorno en Vercel.

### 3. Generar el Manifest de Farcaster

Una vez desplegada la aplicación:

```bash
npx create-onchain --manifest
```

Sigue el proceso de firma con tu wallet de custodia de Farcaster.

### 4. Configurar el archivo manifest.json

Actualiza `/src/app/minikit/manifest.json` con los valores generados:

```json
{
  "accountAssociation": {
    "header": "TU_FARCASTER_HEADER",
    "payload": "TU_FARCASTER_PAYLOAD",
    "signature": "TU_FARCASTER_SIGNATURE"
  },
  "frame": {
    "version": "next",
    "name": "Memex",
    "iconUrl": "https://tu-url.com/images/logo.svg",
    "splashImageUrl": "https://tu-url.com/images/meme1.svg",
    "splashBackgroundColor": "#1E293B",
    "homeUrl": "https://tu-url.com/minikit"
  }
}
```

### 5. Crear el archivo .well-known/farcaster.json

Crea un archivo en la ruta `public/.well-known/farcaster.json` con el mismo contenido que `manifest.json`.

### 6. Verificar la integración

1. Ve a [Warpcast Frames Developer Tools](https://warpcast.com/~/developers/frames)
2. Ingresa la URL de tu aplicación desplegada (`https://tu-url.com/minikit`)
3. Prueba la funcionalidad de la mini aplicación

## Características implementadas

- **Navegación de memes**: Explora memes populares
- **Botón de guardado**: Permite guardar la mini app para uso futuro
- **Notificaciones**: Envía alertas cuando los memes se vuelven virales
- **Interacción social**: Ver perfiles de Farcaster
- **Experiencia fluida**: Navegación entre memes sin salir del frame

## Ejemplo de uso en Farcaster

Para compartir tu mini app en Farcaster, publica un cast con la URL:

```
Check out my new Memex mini app!
https://tu-url.com/minikit
```

Farcaster automáticamente renderizará la aplicación como un frame interactivo.

## Requisitos del Buildathon

Esta integración cumple con los requisitos del Buildathon:
- ✅ Aplicación onchain que funciona en URL pública
- ✅ Repositorio de GitHub con código fuente
- ✅ Integración con Basenames y Smart Wallet
- ✅ Implementación en red principal Base con transacciones verificables
- ✅ Aprovecha el gráfico social de formas únicas

## Soporte

Para más información sobre MiniKit, consulta:
- [Documentación de MiniKit](https://docs.base.org/builderkits/minikit/overview)
- [Especificación de Farcaster Frames](https://docs.farcaster.xyz/reference/frames/spec)
- [Create Onchain CLI](https://github.com/coinbase/create-onchain) 