# Memex - Memes en la Blockchain

Memex es una plataforma social descentralizada que permite a los usuarios crear, compartir y apostar por memes en la blockchain. Si un meme se vuelve viral, los usuarios que apostaron reciben recompensas.

## Características

- 🖼️ Crea memes como NFTs que se almacenan en IPFS
- 💰 Apuesta por memes que crees que se volverán virales
- 💸 Recibe recompensas cuando tus apuestas aciertan
- 🔗 Todo integrado en la red Base para transacciones rápidas y de bajo costo

## Tecnologías

- **Frontend**: Next.js 15, React 19, TailwindCSS 4
- **Web3**: Wagmi, Viem, Coinbase Wallet
- **Almacenamiento**: IPFS a través de Infura
- **Contratos**: Solidity con OpenZeppelin

## Requisitos

- Node.js 18+
- Coinbase Wallet u otra wallet compatible
- Conexión a la red Base

## Instalación

1. Clona este repositorio
   ```bash
   git clone https://github.com/Tu_usuario/memex.git
   cd memex
   ```

2. Instala las dependencias
   ```bash
   npm install
   ```

3. Configura las variables de entorno
   Crea un archivo `.env.local` con las siguientes variables:
   ```
   NEXT_PUBLIC_INFURA_PROJECT_ID=tu-id-de-proyecto
   NEXT_PUBLIC_INFURA_API_SECRET=tu-clave-secreta
   ```

4. Inicia el servidor de desarrollo
   ```bash
   npm run dev
   ```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador

## Estructura del Proyecto

- `/src/app` - Componentes de la aplicación
- `/src/contracts` - Contratos inteligentes
- `/src/utils` - Utilidades y configuración de contratos
- `/public` - Archivos estáticos

## Cómo Funciona

1. Los usuarios conectan su wallet de Coinbase
2. Crean memes que se almacenan en IPFS y se mintean como NFTs
3. Otros usuarios pueden apostar por memes que creen que se volverán virales
4. Cuando un meme se marca como viral, los apostadores y el creador reciben recompensas

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.
