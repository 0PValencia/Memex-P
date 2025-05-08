// Direcciones de contratos por red
import { base, baseSepolia } from 'wagmi/chains'

export const MEMEX_CONTRACT_ADDRESSES: Record<number, string> = {
  // Base mainnet
  [base.id]: '0x71828A166D00f0291F6c87383ed32165d4F2fF35', // Dirección temporal para simular
  
  // Para testnet o localhost, puedes agregar más direcciones
  // Ejemplo para Base Sepolia
  [baseSepolia.id]: '0x71828A166D00f0291F6c87383ed32165d4F2fF35',
}

// ABI simplificado para nuestro contrato
export const MEMEX_CONTRACT_ABI = [
  // Función para crear un meme
  {
    "inputs": [{ "internalType": "string", "name": "tokenURI", "type": "string" }],
    "name": "createMeme",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Función para apostar por un meme
  {
    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
    "name": "betOnMeme",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  // Función para obtener información de un meme
  {
    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
    "name": "getMemeInfo",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "id", "type": "uint256" },
          { "internalType": "address", "name": "creator", "type": "address" },
          { "internalType": "uint256", "name": "totalBets", "type": "uint256" },
          { "internalType": "uint256", "name": "totalPot", "type": "uint256" },
          { "internalType": "bool", "name": "isActive", "type": "bool" },
          { "internalType": "uint256", "name": "createdAt", "type": "uint256" }
        ],
        "internalType": "struct MemexContract.Meme",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  // Eventos
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "creator", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "tokenURI", "type": "string" }
    ],
    "name": "MemeCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "better", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "BetPlaced",
    "type": "event"
  }
] 