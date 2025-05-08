/**
 * Servicio para evaluar la viralidad de memes basado en métricas de redes sociales
 * En una aplicación real, este servicio se conectaría con APIs de redes sociales y oráculos blockchain
 */

import { getContract } from './contracts';

// Ponderación de cada factor de viralidad
const VIRALITY_WEIGHTS = {
  views: 1,
  likes: 3,
  comments: 5,
  shares: 10,
  saveRate: 8,
  timeSpent: 2
};

// Estructura de los datos de viralidad
export interface ViralityData {
  tokenId: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saveRate: number; // Porcentaje de usuarios que guardan el meme (0-100)
  timeSpent: number; // Tiempo promedio en segundos que los usuarios ven el meme
  lastUpdated: Date;
}

// Mapa para almacenar los datos de viralidad en memoria (simulado)
const viralityDataStore: Map<string, ViralityData> = new Map();

/**
 * Calcula la puntuación de viralidad de un meme
 * @param data Datos de viralidad del meme
 * @returns Puntuación de viralidad (0-100)
 */
export function calculateViralityScore(data: ViralityData): number {
  // Puntuación base basada en métricas ponderadas
  const baseScore = (
    (data.views * VIRALITY_WEIGHTS.views) +
    (data.likes * VIRALITY_WEIGHTS.likes) +
    (data.comments * VIRALITY_WEIGHTS.comments) +
    (data.shares * VIRALITY_WEIGHTS.shares) +
    (data.saveRate * VIRALITY_WEIGHTS.saveRate) +
    (data.timeSpent * VIRALITY_WEIGHTS.timeSpent)
  );
  
  // Normalizar a un valor de 0-100
  // En una implementación real, esta normalización sería más sofisticada
  // y podría variar según la categoría del meme
  const normalizedScore = Math.min(100, baseScore / 1000);
  
  return Math.round(normalizedScore);
}

/**
 * Actualiza los datos de viralidad de un meme desde fuentes externas
 * @param tokenId ID del token del meme
 * @returns Promesa con los datos de viralidad actualizados
 */
export async function updateViralityData(tokenId: string): Promise<ViralityData> {
  // En una implementación real, aquí se conectaría con APIs de redes sociales
  // para obtener datos reales de interacciones y alcance
  
  // Simulamos datos para desarrollo
  const existingData = viralityDataStore.get(tokenId) || {
    tokenId,
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    saveRate: 0,
    timeSpent: 0,
    lastUpdated: new Date()
  };
  
  // Simulamos un incremento de métricas
  const updatedData: ViralityData = {
    ...existingData,
    views: existingData.views + Math.floor(Math.random() * 100),
    likes: existingData.likes + Math.floor(Math.random() * 20),
    comments: existingData.comments + Math.floor(Math.random() * 5),
    shares: existingData.shares + Math.floor(Math.random() * 3),
    saveRate: Math.min(100, existingData.saveRate + Math.random() * 2),
    timeSpent: Math.min(60, existingData.timeSpent + Math.random()),
    lastUpdated: new Date()
  };
  
  // Guardar datos actualizados
  viralityDataStore.set(tokenId, updatedData);
  
  return updatedData;
}

/**
 * Verifica si un meme se ha vuelto viral y actualiza el contrato si es necesario
 * @param tokenId ID del token del meme
 * @param threshold Umbral de viralidad (0-100)
 * @returns Promesa con un booleano indicando si el meme es viral
 */
export async function checkAndUpdateViralityStatus(tokenId: string, threshold: number = 70): Promise<boolean> {
  try {
    // 1. Obtener datos actualizados
    const data = await updateViralityData(tokenId);
    
    // 2. Calcular puntuación
    const score = calculateViralityScore(data);
    
    // 3. Verificar si supera el umbral
    const isViral = score >= threshold;
    
    // 4. Si es viral, actualizar el contrato (en una implementación real)
    if (isViral) {
      // En una implementación real, aquí se llamaría al contrato
      // para actualizar la puntuación de viralidad
      console.log(`¡Meme ${tokenId} se ha vuelto viral con puntuación ${score}!`);
      
      // Este código está comentado porque requeriría integración real con el contrato
      // const contract = await getContract();
      // await contract.updateViralityScore(tokenId, score);
    }
    
    return isViral;
  } catch (error) {
    console.error("Error al verificar viralidad:", error);
    return false;
  }
}

/**
 * Obtiene los memes más virales ordenados por puntuación
 * @param limit Límite de resultados
 * @returns Arreglo de IDs de memes con sus puntuaciones
 */
export function getTopViralMemes(limit: number = 10): Array<{tokenId: string, score: number}> {
  // Convertir el mapa a un arreglo
  const entries = Array.from(viralityDataStore.entries());
  
  // Calcular puntuación para cada entrada y ordenar
  return entries
    .map(([tokenId, data]) => ({
      tokenId,
      score: calculateViralityScore(data)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Método para registrar una interacción social con un meme
 * @param tokenId ID del token del meme
 * @param interactionType Tipo de interacción (view, like, comment, share)
 * @param amount Cantidad (por defecto 1)
 */
export async function recordSocialInteraction(
  tokenId: string, 
  interactionType: 'view' | 'like' | 'comment' | 'share',
  amount: number = 1
): Promise<void> {
  // Obtener datos actuales
  const data = viralityDataStore.get(tokenId) || {
    tokenId,
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    saveRate: 0,
    timeSpent: 0,
    lastUpdated: new Date()
  };
  
  // Actualizar según el tipo de interacción
  switch (interactionType) {
    case 'view':
      data.views += amount;
      break;
    case 'like':
      data.likes += amount;
      break;
    case 'comment':
      data.comments += amount;
      break;
    case 'share':
      data.shares += amount;
      break;
  }
  
  data.lastUpdated = new Date();
  
  // Guardar datos actualizados
  viralityDataStore.set(tokenId, data);
  
  // Verificar viralidad después de actualizar
  await checkAndUpdateViralityStatus(tokenId);
} 