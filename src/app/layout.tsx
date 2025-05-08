import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WagmiProvider } from "./providers/WagmiProvider";
import { OnchainKitContextProvider } from "./providers/OnchainKitProvider";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./contexts/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Memex - Memes On-Chain",
  description: "Crea, comparte y apuesta por memes en la blockchain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-black dark:bg-gray-900 dark:text-white min-h-screen`}
      >
        <ThemeProvider>
          <WagmiProvider>
            <OnchainKitContextProvider>
              <Navbar />
              <div className="pt-20 pb-12 px-4 md:px-6">
                {children}
              </div>
              <footer className="mt-auto py-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
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
