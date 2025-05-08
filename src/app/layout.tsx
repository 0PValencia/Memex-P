import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WagmiProvider } from "./providers/WagmiProvider";
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black dark:bg-gray-900 dark:text-white`}
      >
        <ThemeProvider>
          <WagmiProvider>
            <Navbar />
            <div className="pt-16">
              {children}
            </div>
          </WagmiProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
