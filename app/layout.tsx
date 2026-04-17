import type { Metadata, Viewport } from 'next'
import { Cinzel, Quicksand } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const cinzel = Cinzel({ 
  subsets: ["latin"],
  variable: '--font-cinzel',
  weight: ['400', '700']
})

const quicksand = Quicksand({ 
  subsets: ["latin"],
  variable: '--font-quicksand',
  weight: ['300', '500']
})

export const metadata: Metadata = {
  title: 'Dark Souls: Hardcore Chronicles',
  description: 'Un juego RPG oscuro para Telegram',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${cinzel.variable} ${quicksand.variable}`}>
      <head>
        <Script 
          src="https://telegram.org/js/telegram-web-app.js" 
          strategy="beforeInteractive"
        />
      </head>
      <body className="font-sans antialiased bg-background">
        {children}
      </body>
    </html>
  )
}
