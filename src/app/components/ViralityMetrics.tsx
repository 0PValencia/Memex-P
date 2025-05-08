'use client'

import { useState, useEffect } from 'react'
import { ViralityData, calculateViralityScore } from '@/utils/viralityService'

interface ViralityMetricsProps {
  tokenId: string;
  initialData?: ViralityData;
}

export default function ViralityMetrics({ tokenId, initialData }: ViralityMetricsProps) {
  const [data, setData] = useState<ViralityData | null>(initialData || null);
  const [score, setScore] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(!initialData);
  
  // Usar datos simulados para demostración
  useEffect(() => {
    if (!initialData) {
      setIsLoading(true);
      
      // Simular carga de datos de viralidad
      const timeout = setTimeout(() => {
        const simulatedData: ViralityData = {
          tokenId,
          views: Math.floor(Math.random() * 1000) + 100,
          likes: Math.floor(Math.random() * 200) + 20,
          comments: Math.floor(Math.random() * 50) + 5,
          shares: Math.floor(Math.random() * 30) + 3,
          saveRate: Math.floor(Math.random() * 25) + 5,
          timeSpent: Math.floor(Math.random() * 30) + 10,
          lastUpdated: new Date()
        };
        
        setData(simulatedData);
        setScore(calculateViralityScore(simulatedData));
        setIsLoading(false);
      }, 1500);
      
      return () => clearTimeout(timeout);
    } else {
      setScore(calculateViralityScore(initialData));
    }
  }, [tokenId, initialData]);
  
  // Determinar si el meme es viral basado en la puntuación
  const getViralityStatus = (score: number) => {
    if (score >= 70) return { status: 'Viral', color: 'text-green-500' };
    if (score >= 50) return { status: 'Trending', color: 'text-yellow-500' };
    if (score >= 30) return { status: 'Popular', color: 'text-blue-500' };
    return { status: 'Normal', color: 'text-gray-500' };
  };
  
  const viralityStatus = getViralityStatus(score);
  
  if (isLoading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow space-y-2 animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-1/3"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }
  
  if (!data) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-red-500">No se pudieron cargar datos de viralidad</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-black mb-2">Métricas de Viralidad</h3>
      
      <div className="flex items-center mb-4">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mr-4">
          <span className="text-2xl font-bold text-black">{score}</span>
        </div>
        
        <div>
          <p className="text-lg font-medium text-black">Estado: <span className={viralityStatus.color}>{viralityStatus.status}</span></p>
          <p className="text-sm text-gray-500">Última actualización: {data.lastUpdated.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 p-2 rounded">
          <p className="text-sm text-gray-500">Vistas</p>
          <p className="text-lg font-medium text-black">{data.views.toLocaleString()}</p>
        </div>
        
        <div className="bg-gray-50 p-2 rounded">
          <p className="text-sm text-gray-500">Likes</p>
          <p className="text-lg font-medium text-black">{data.likes.toLocaleString()}</p>
        </div>
        
        <div className="bg-gray-50 p-2 rounded">
          <p className="text-sm text-gray-500">Comentarios</p>
          <p className="text-lg font-medium text-black">{data.comments.toLocaleString()}</p>
        </div>
        
        <div className="bg-gray-50 p-2 rounded">
          <p className="text-sm text-gray-500">Compartidos</p>
          <p className="text-lg font-medium text-black">{data.shares.toLocaleString()}</p>
        </div>
        
        <div className="bg-gray-50 p-2 rounded">
          <p className="text-sm text-gray-500">Tasa de guardado</p>
          <p className="text-lg font-medium text-black">{data.saveRate.toFixed(1)}%</p>
        </div>
        
        <div className="bg-gray-50 p-2 rounded">
          <p className="text-sm text-gray-500">Tiempo promedio</p>
          <p className="text-lg font-medium text-black">{data.timeSpent.toFixed(1)}s</p>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-200">
        <h4 className="text-sm font-medium text-black mb-2">Probabilidad de recompensa</h4>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${score >= 70 ? 'bg-green-500' : 'bg-blue-500'}`}
            style={{ width: `${score}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {score >= 70 
            ? '¡Este meme es viral! Las apuestas serían recompensadas pronto.' 
            : `Necesita ${70 - score} puntos más para ser considerado viral.`
          }
        </p>
      </div>
    </div>
  );
} 