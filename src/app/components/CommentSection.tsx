'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'

interface Comment {
  id: string
  author: string
  content: string
  timestamp: Date
  likes: number
}

interface CommentSectionProps {
  memeId: string
}

export default function CommentSection({ memeId }: CommentSectionProps) {
  const { address, isConnected } = useAccount()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Simular carga de comentarios desde la API
  useEffect(() => {
    const fetchComments = async () => {
      // En una implementación real, aquí obtendríamos los comentarios de una API
      setTimeout(() => {
        // Generar comentarios de ejemplo
        const sampleComments: Comment[] = Array.from({ length: Math.floor(Math.random() * 5) + 2 }, (_, i) => ({
          id: `comment-${memeId}-${i}`,
          author: `0x${Math.random().toString(16).substring(2, 10)}...`,
          content: [
            '¡Este meme va a ser viral! 🚀',
            'Acabo de apostar, espero que valga la pena 💰',
            'Esto me recordó algo que vi ayer, muy bueno 😂',
            'Este meme definitivamente vale 10 ETH, jaja',
            'No entiendo por qué a la gente le gusta esto 🤔',
            '¡Genial! Ya hice mi apuesta',
            'Increíble trabajo con este meme 👏',
            'Voy a compartirlo con mis amigos ahora mismo'
          ][Math.floor(Math.random() * 8)],
          timestamp: new Date(Date.now() - Math.random() * 86400000 * 3), // Últimos 3 días
          likes: Math.floor(Math.random() * 15)
        }));

        // Ordenar por timestamp más reciente
        sampleComments.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        
        setComments(sampleComments);
        setIsLoading(false);
      }, 1000);
    };

    fetchComments();
  }, [memeId]);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    if (!isConnected) {
      alert('Conecta tu wallet para comentar');
      return;
    }

    // Crear nuevo comentario
    const newCommentObj: Comment = {
      id: `comment-${memeId}-${Date.now()}`,
      author: address ? `${address.substring(0, 6)}...${address.substring(38)}` : 'Usuario anónimo',
      content: newComment,
      timestamp: new Date(),
      likes: 0
    };

    // Añadir al inicio de la lista
    setComments([newCommentObj, ...comments]);
    setNewComment('');

    // En una implementación real, aquí enviaríamos el comentario a la API
  };

  const handleLikeComment = (commentId: string) => {
    setComments(
      comments.map(comment => 
        comment.id === commentId 
          ? { ...comment, likes: comment.likes + 1 } 
          : comment
      )
    );
  };

  if (isLoading) {
    return (
      <div className="mt-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-4">
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h2 className="text-xl font-bold text-black mb-4">Comentarios ({comments.length})</h2>
      
      <form onSubmit={handleSubmitComment} className="mb-6">
        <div className="flex flex-col md:flex-row gap-2">
          <textarea
            className="flex-1 p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={isConnected ? "Escribe tu comentario..." : "Conecta tu wallet para comentar"}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            disabled={!isConnected}
          ></textarea>
          <button
            type="submit"
            disabled={!isConnected || !newComment.trim()}
            className="md:self-end bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            Comentar
          </button>
        </div>
      </form>

      {comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No hay comentarios todavía. ¡Sé el primero en comentar!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment.id} className="bg-gray-50 p-4 rounded">
              <div className="flex justify-between">
                <span className="font-medium text-black">{comment.author}</span>
                <span className="text-sm text-gray-500">{comment.timestamp.toLocaleString()}</span>
              </div>
              <p className="my-2 text-black">{comment.content}</p>
              <div className="flex items-center text-sm text-gray-500">
                <button 
                  onClick={() => handleLikeComment(comment.id)}
                  className="flex items-center hover:text-blue-600"
                >
                  <span className="mr-1">👍</span> {comment.likes}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 