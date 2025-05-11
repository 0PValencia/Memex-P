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
      <body className="font-sans">
        <ThemeProvider>
          <WagmiProvider>
            <OnchainKitContextProvider>
              <Navbar />
              <div className="pt-20 pb-12 px-4 md:px-6">
                {children}
              </div>
              <footer className="mt-auto py-6 border-t border-gray-800">
                <div className="max-w-6xl mx-auto px-4 text-center text-sm opacity-70">
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
