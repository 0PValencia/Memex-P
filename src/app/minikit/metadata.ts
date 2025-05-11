import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Memex Mini App',
  description: 'Una mini aplicación de Memex para crear, compartir y apostar por memes en la blockchain',
  openGraph: {
    title: 'Memex Mini App',
    description: 'Crea, comparte y apuesta por memes en la blockchain Base',
    images: [
      {
        url: '/images/meme1.svg',
        width: 1200,
        height: 630,
        alt: 'Memex Mini App',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Memex Mini App',
    description: 'Crea, comparte y apuesta por memes en la blockchain Base',
    images: ['/images/meme1.svg'],
  },
}

export default metadata 