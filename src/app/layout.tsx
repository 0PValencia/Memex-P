import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WagmiProvider } from "./providers/WagmiProvider";
import { OnchainKitContextProvider } from "./providers/OnchainKitProvider";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./contexts/ThemeContext";

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
      <head>
        <style>
          {`
            body {
              background-color: white !important;
              color: black !important;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            }

            nav {
              background-color: white !important;
              border-bottom: 1px solid #e5e7eb !important;
              box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05) !important;
              padding: 0.75rem 1rem !important;
              position: fixed !important;
              top: 0 !important;
              left: 0 !important;
              right: 0 !important;
              z-index: 50 !important;
            }
          `}
        </style>
      </head>
      <body>
        <ThemeProvider>
          <WagmiProvider>
            <OnchainKitContextProvider>
              <Navbar />
              <div className="pt-20 pb-12 px-4 md:px-6">
                {children}
              </div>
              <footer className="mt-auto py-6 bg-white border-t border-gray-200">
                <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
                  <p>Memex - Plataforma social de memes en blockchain Base</p>
                </div>
              </footer>
            </OnchainKitContextProvider>
          </WagmiProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
