import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WagmiProvider } from "./providers/WagmiProvider";
import { OnchainKitContextProvider } from "./providers/OnchainKitProvider";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./contexts/ThemeContext";
import WebSocketErrorHandler from "./components/WebSocketErrorHandler";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Memex - Plataforma de Memes en Blockchain",
  description: "Crea, comparte y apuesta por memes en la blockchain de Base",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="font-sans">
        <ThemeProvider>
          <WagmiProvider>
            <OnchainKitContextProvider>
              <WebSocketErrorHandler />
              <div className="flex flex-col min-h-screen">
                {/* Header fijo con z-index menor para evitar que tape contenido */}
                <header className="sticky top-0 z-10 w-full">
                  <Navbar />
                </header>
                
                {/* Espaciador para compensar la altura del navbar */}
                <div className="h-20"></div>
                
                {/* Contenido principal simplificado con z-index mayor */}
                <main className="flex-1 w-full max-w-4xl mx-auto pb-8 px-4 z-20 relative">
                  {children}
                </main>
                
                {/* Footer */}
                <footer className="mt-auto py-4 border-t border-gray-800">
                  <div className="max-w-6xl mx-auto px-4 text-center text-sm opacity-70">
                    <p>Memex - Plataforma social de memes en blockchain Base</p>
                  </div>
                </footer>
              </div>
            </OnchainKitContextProvider>
          </WagmiProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
