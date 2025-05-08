// Traducciones para la aplicación en español e inglés

export const translations = {
  es: {
    // Navegación
    home: 'Inicio',
    dashboard: 'Mi Dashboard',
    trending: 'Trending',
    settings: 'Configuración',
    
    // Acciones
    connect: 'Conectar Wallet',
    disconnect: 'Desconectar',
    connecting: 'Conectando...',
    loading: 'Cargando...',
    save: 'Guardar',
    saving: 'Guardando...',
    
    // CreateMemeForm
    createMeme: 'Crear Nuevo Meme',
    uploadImage: 'Imagen del Meme',
    title: 'Título',
    titlePlaceholder: 'Un título creativo para tu meme',
    description: 'Descripción',
    descriptionPlaceholder: 'Una breve descripción de tu meme',
    create: 'Crear Meme',
    uploading: 'Subiendo...',
    connectFirst: 'Por favor conecta tu wallet antes de crear un meme',
    selectImage: 'Por favor selecciona una imagen',
    enterTitle: 'Por favor ingresa un título',
    memeCreated: '¡Meme creado con éxito! Se ha guardado localmente.',
    previewImage: 'Vista previa',
    
    // Meme Card
    bets: 'apuestas',
    currentPot: 'Bote actual:',
    betAmount: 'Cantidad en ETH',
    placeBet: 'Apostar',
    betting: 'Apostando...',
    betSuccess: '¡Apuesta realizada con éxito!',
    creator: 'Creador:',
    
    // Settings
    accountSettings: 'Cuenta',
    displayName: 'Nombre de visualización',
    displayNamePlaceholder: 'Nombre público en la plataforma',
    email: 'Email (opcional)',
    emailPlaceholder: 'Para notificaciones importantes (no se comparte públicamente)',
    privacy: 'Privacidad',
    publicProfile: 'Público - Todos pueden ver mis memes y apuestas',
    privateProfile: 'Privado - Solo yo puedo ver mis memes y apuestas',
    preferences: 'Preferencias',
    theme: 'Tema',
    themeLight: 'Claro',
    themeDark: 'Oscuro',
    themeSystem: 'Sistema',
    language: 'Idioma',
    spanish: 'Español',
    english: 'Inglés',
    notifications: 'Notificaciones',
    enableNotifications: 'Activar notificaciones en el navegador',
    enableEmailNotifications: 'Recibir notificaciones por email',
    saved: 'Configuración guardada correctamente',
    error: 'Error al guardar la configuración',
    connectForSettings: 'Conecta tu wallet para acceder a la configuración',
    
    // Errors
    errorConnecting: 'Error al conectar. Inténtalo de nuevo.',
    connectionTimeout: 'La conexión está tomando demasiado tiempo. Inténtalo de nuevo.',
    noConnectors: 'No hay conectores disponibles',
    
    // Other
    noMemesFound: 'No hay memes para mostrar. ¡Sé el primero en crear uno!',
    exploreMore: 'Ver más memes'
  },
  
  en: {
    // Navigation
    home: 'Home',
    dashboard: 'My Dashboard',
    trending: 'Trending',
    settings: 'Settings',
    
    // Actions
    connect: 'Connect Wallet',
    disconnect: 'Disconnect',
    connecting: 'Connecting...',
    loading: 'Loading...',
    save: 'Save',
    saving: 'Saving...',
    
    // CreateMemeForm
    createMeme: 'Create New Meme',
    uploadImage: 'Meme Image',
    title: 'Title',
    titlePlaceholder: 'A creative title for your meme',
    description: 'Description',
    descriptionPlaceholder: 'A brief description of your meme',
    create: 'Create Meme',
    uploading: 'Uploading...',
    connectFirst: 'Please connect your wallet before creating a meme',
    selectImage: 'Please select an image',
    enterTitle: 'Please enter a title',
    memeCreated: 'Meme created successfully! It has been saved locally.',
    previewImage: 'Preview',
    
    // Meme Card
    bets: 'bets',
    currentPot: 'Current pot:',
    betAmount: 'Amount in ETH',
    placeBet: 'Place Bet',
    betting: 'Betting...',
    betSuccess: 'Bet placed successfully!',
    creator: 'Creator:',
    
    // Settings
    accountSettings: 'Account',
    displayName: 'Display Name',
    displayNamePlaceholder: 'Public name on the platform',
    email: 'Email (optional)',
    emailPlaceholder: 'For important notifications (not shared publicly)',
    privacy: 'Privacy',
    publicProfile: 'Public - Everyone can see my memes and bets',
    privateProfile: 'Private - Only I can see my memes and bets',
    preferences: 'Preferences',
    theme: 'Theme',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeSystem: 'System',
    language: 'Language',
    spanish: 'Spanish',
    english: 'English',
    notifications: 'Notifications',
    enableNotifications: 'Enable browser notifications',
    enableEmailNotifications: 'Receive email notifications',
    saved: 'Settings saved successfully',
    error: 'Error saving settings',
    connectForSettings: 'Connect your wallet to access settings',
    
    // Errors
    errorConnecting: 'Error connecting. Please try again.',
    connectionTimeout: 'Connection is taking too long. Please try again.',
    noConnectors: 'No connectors available',
    
    // Other
    noMemesFound: 'No memes to display. Be the first to create one!',
    exploreMore: 'See more memes'
  }
};

// Función para obtener las traducciones según el idioma
export const getTranslations = (lang: 'es' | 'en') => {
  return translations[lang];
};

export default translations; 