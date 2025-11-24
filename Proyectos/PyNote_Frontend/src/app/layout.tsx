import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PyNote - Tu App de Notas Profesional",
  description: "Una aplicación de notas elegante y profesional con búsqueda instantánea, modo oscuro y más.",
  keywords: ["PyNote", "notas", "productividad", "Next.js", "TypeScript", "Tailwind CSS"],
  authors: [{ name: "PyNote Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "PyNote - Tu App de Notas Profesional",
    description: "Una aplicación de notas elegante y profesional con búsqueda instantánea, modo oscuro y más.",
    url: "https://pynote.app",
    siteName: "PyNote",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PyNote - Tu App de Notas Profesional",
    description: "Una aplicación de notas elegante y profesional con búsqueda instantánea, modo oscuro y más.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
