import type { Metadata, Viewport } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster"; // Import Toaster
import { AudioPlayer } from "@/components/audio-player"; // Import AudioPlayer

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PropHealth",
  description: "Secure healthcare records for Africa.",
  manifest: "/manifest.json",
  appleWebAppCapable: "yes",
  appleWebAppStatusBarStyle: "default",
  appleWebAppTitle: "PropHealth",
  formatDetection: {
    telephone: false,
  },
  generator: 'v0.dev'
};

export const viewport: Viewport = {
  themeColor: "#E0E7FF",
  minimumScale: 1,
  initialScale: 1,
  width: "device-width",
  shrinkToFit: "no",
  viewportFit: "cover"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col transition-colors duration-300`}>
        <ThemeProvider>
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
            {children}
          </main>
          <Footer />
          <Toaster /> {/* Add Toaster component here */}
          <AudioPlayer /> {/* Add AudioPlayer component here */}
        </ThemeProvider>
      </body>
    </html>
  );
}
