/**
 * Servicio de notificaciones para informar a los usuarios sobre eventos importantes
 * en la plataforma Memex
 */

// Tipos de notificaciones
export enum NotificationType {
  MEME_VIRAL = 'MEME_VIRAL',
  BET_PLACED = 'BET_PLACED',
  REWARD_AVAILABLE = 'REWARD_AVAILABLE',
  REWARD_CLAIMED = 'REWARD_CLAIMED',
  NEW_COMMENT = 'NEW_COMMENT',
  TRENDING = 'TRENDING'
}

// Estructura de una notificación
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  imageUrl?: string;
  memeId?: string;
}

// Clase para gestionar notificaciones
export class NotificationService {
  private static instance: NotificationService;
  private notifications: Map<string, Notification[]> = new Map();
  private callbacks: Map<string, ((notification: Notification) => void)[]> = new Map();

  private constructor() {
    // Singleton: constructor privado
  }

  // Obtener la instancia única
  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Añadir una notificación para un usuario
  public addNotification(userAddress: string, notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): Notification {
    const userNotifications = this.notifications.get(userAddress) || [];
    
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date(),
      read: false
    };
    
    userNotifications.unshift(newNotification);
    this.notifications.set(userAddress, userNotifications);
    
    // Ejecutar callbacks para el usuario
    this.triggerCallbacks(userAddress, newNotification);
    
    return newNotification;
  }

  // Crear una notificación para un meme viral
  public notifyMemeViral(userAddress: string, memeId: string, memeTitle: string, imageUrl: string): Notification {
    return this.addNotification(userAddress, {
      type: NotificationType.MEME_VIRAL,
      title: '¡Tu meme se ha vuelto viral!',
      message: `Tu meme "${memeTitle}" ha alcanzado el estado viral. ¡Ya puedes reclamar tus recompensas!`,
      memeId,
      imageUrl,
      actionUrl: `/meme/${memeId}`
    });
  }

  // Crear una notificación para una apuesta realizada
  public notifyBetPlaced(userAddress: string, memeId: string, memeTitle: string, amount: string): Notification {
    return this.addNotification(userAddress, {
      type: NotificationType.BET_PLACED,
      title: 'Apuesta realizada con éxito',
      message: `Has apostado ${amount} ETH en el meme "${memeTitle}". ¡Buena suerte!`,
      memeId,
      actionUrl: `/meme/${memeId}`
    });
  }

  // Crear una notificación para recompensas disponibles
  public notifyRewardAvailable(userAddress: string, memeId: string, memeTitle: string, amount: string): Notification {
    return this.addNotification(userAddress, {
      type: NotificationType.REWARD_AVAILABLE,
      title: '¡Recompensa disponible!',
      message: `Tienes una recompensa de ${amount} ETH disponible para reclamar del meme "${memeTitle}"`,
      memeId,
      actionUrl: `/meme/${memeId}`
    });
  }

  // Obtener notificaciones de un usuario
  public getNotifications(userAddress: string): Notification[] {
    return this.notifications.get(userAddress) || [];
  }

  // Marcar una notificación como leída
  public markAsRead(userAddress: string, notificationId: string): boolean {
    const userNotifications = this.notifications.get(userAddress) || [];
    const notificationIndex = userNotifications.findIndex(n => n.id === notificationId);
    
    if (notificationIndex === -1) return false;
    
    userNotifications[notificationIndex].read = true;
    this.notifications.set(userAddress, userNotifications);
    
    return true;
  }

  // Marcar todas las notificaciones como leídas
  public markAllAsRead(userAddress: string): void {
    const userNotifications = this.notifications.get(userAddress) || [];
    
    const updatedNotifications = userNotifications.map(notification => ({
      ...notification,
      read: true
    }));
    
    this.notifications.set(userAddress, updatedNotifications);
  }

  // Registrar una callback para cuando llegue una nueva notificación
  public onNewNotification(userAddress: string, callback: (notification: Notification) => void): () => void {
    const userCallbacks = this.callbacks.get(userAddress) || [];
    userCallbacks.push(callback);
    this.callbacks.set(userAddress, userCallbacks);
    
    // Devolver una función para eliminar la callback
    return () => {
      const callbacks = this.callbacks.get(userAddress) || [];
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
        this.callbacks.set(userAddress, callbacks);
      }
    };
  }

  // Ejecutar callbacks para un usuario
  private triggerCallbacks(userAddress: string, notification: Notification): void {
    const userCallbacks = this.callbacks.get(userAddress) || [];
    userCallbacks.forEach(callback => {
      try {
        callback(notification);
      } catch (error) {
        console.error('Error al ejecutar callback de notificación:', error);
      }
    });
  }
  
  // Simular notificaciones aleatorias para demostración
  public simulateRandomNotifications(userAddress: string, memeId: string = 'sample-meme-1'): void {
    const types = [
      {
        type: NotificationType.MEME_VIRAL,
        title: '¡Un meme se ha vuelto viral!',
        message: 'El meme "Gato programador" ha alcanzado el estado viral'
      },
      {
        type: NotificationType.BET_PLACED,
        title: 'Nueva apuesta en tu meme',
        message: 'Alguien ha apostado 0.2 ETH en tu meme'
      },
      {
        type: NotificationType.REWARD_AVAILABLE,
        title: '¡Recompensa disponible!',
        message: 'Tienes 0.5 ETH de recompensa disponibles para reclamar'
      },
      {
        type: NotificationType.NEW_COMMENT,
        title: 'Nuevo comentario',
        message: 'Alguien ha comentado en tu meme: "¡Este meme es genial!"'
      }
    ];
    
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    this.addNotification(userAddress, {
      ...randomType,
      memeId,
      actionUrl: `/meme/${memeId}`
    });
  }
}

// Exportar una instancia única del servicio
export const notificationService = NotificationService.getInstance(); 