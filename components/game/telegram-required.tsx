'use client'

export function TelegramRequired() {
  return (
    <div className="min-h-screen soul-bg flex flex-col items-center justify-center p-6 text-center">
      {/* Logo de Telegram SVG */}
      <div className="mb-8">
        <svg 
          viewBox="0 0 240 240" 
          className="w-32 h-32 mx-auto"
          aria-label="Telegram Logo"
        >
          <defs>
            <linearGradient id="telegram-gradient" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#2AABEE" />
              <stop offset="100%" stopColor="#229ED9" />
            </linearGradient>
          </defs>
          <circle cx="120" cy="120" r="120" fill="url(#telegram-gradient)" />
          <path
            d="M98 175c-3.888 0-3.227-1.468-4.568-5.17L82 132.207 170 80"
            fill="#C8DAEA"
          />
          <path
            d="M98 175c3 0 4.325-1.372 6-3l16-15.558-19.958-12.035"
            fill="#A9C9DD"
          />
          <path
            d="M100.04 144.41l48.36 35.729c5.519 3.045 9.501 1.468 10.876-5.123l19.685-92.763c2.015-8.08-3.08-11.746-8.36-9.349l-115.59 44.571c-7.89 3.165-7.843 7.567-1.438 9.528l29.663 9.259 68.673-43.325c3.242-1.966 6.218-.91 3.776 1.258"
            fill="#FFF"
          />
        </svg>
      </div>

      {/* Mensaje */}
      <div className="max-w-sm">
        <h1 className="soul-font gold-text text-2xl mb-4">
          DARK SOULS
        </h1>
        <h2 className="soul-font text-white text-lg mb-3">
          Hardcore Chronicles
        </h2>
        
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <p className="text-muted-foreground text-sm mb-4">
            Este juego solo puede abrirse desde la aplicacion de Telegram.
          </p>
          <p className="text-muted-foreground text-xs">
            Abre el bot en Telegram para comenzar tu aventura.
          </p>
        </div>

        {/* Boton para abrir el bot */}
        <a
          href="https://t.me/Darksoutlbot"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-3 w-full py-4 px-6 bg-[#229ED9] hover:bg-[#1e8fc4] text-white font-bold rounded-xl transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
          </svg>
          Abrir en Telegram
        </a>

        <p className="text-muted-foreground text-[10px] mt-6 uppercase tracking-wider">
          @Darksoutlbot
        </p>
      </div>

      {/* Decoracion inferior */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 opacity-30">
        <span className="text-2xl">&#9760;</span>
        <span className="text-2xl gold-text">&#9876;</span>
        <span className="text-2xl">&#9760;</span>
      </div>
    </div>
  )
}
