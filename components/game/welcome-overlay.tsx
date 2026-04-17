'use client'

interface WelcomeOverlayProps {
  playerName: string
  onSelectCountry: (country: string) => void
}

export function WelcomeOverlay({ playerName, onSelectCountry }: WelcomeOverlayProps) {
  const countries = [
    { code: 'Cuba', flag: '🇨🇺', color: 'blue' },
    { code: 'España', flag: '🇪🇸', color: 'red' },
    { code: 'México', flag: '🇲🇽', color: 'green' }
  ]

  return (
    <div className="fixed inset-0 bg-black z-[1000] flex flex-col items-center justify-center p-5 text-center">
      <h1 className="soul-font gold-text text-3xl mb-1">DARK SOULS</h1>
      <p className="text-xs text-muted-foreground mb-6">Hardcore Chronicles</p>
      
      <div className="bg-card border border-border/30 rounded-lg p-6 w-full max-w-xs">
        <h2 className="text-foreground text-sm soul-font mb-4">
          Despierta, <span className="gold-text">{playerName}</span>
        </h2>
        
        <p className="text-[10px] text-muted-foreground mb-4 uppercase tracking-wider">
          Selecciona tu origen
        </p>
        
        <div className="grid grid-cols-1 gap-3">
          {countries.map(country => (
            <button
              key={country.code}
              onClick={() => onSelectCountry(country.code)}
              className={`py-3 rounded soul-font text-xs text-foreground border transition-all hover:scale-[1.02] active:scale-[0.98] ${
                country.color === 'blue' ? 'bg-blue-900/20 border-blue-500/50 hover:bg-blue-900/30' :
                country.color === 'red' ? 'bg-red-900/20 border-red-500/50 hover:bg-red-900/30' :
                'bg-green-900/20 border-green-500/50 hover:bg-green-900/30'
              }`}
            >
              {country.flag} {country.code.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
