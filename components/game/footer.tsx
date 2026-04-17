'use client'

interface FooterProps {
  activeTab: 'fight' | 'stats' | 'shop'
  onTabChange: (tab: 'fight' | 'stats' | 'shop') => void
}

export function GameFooter({ activeTab, onTabChange }: FooterProps) {
  const tabs = [
    { id: 'fight' as const, icon: '💀', label: 'Agonía' },
    { id: 'stats' as const, icon: '🩸', label: 'Pacto' },
    { id: 'shop' as const, icon: '⚖️', label: 'Mercado' }
  ]

  return (
    <footer className="fixed bottom-0 w-full h-20 bg-black border-t border-border/30 flex z-50">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 flex flex-col items-center justify-center py-2 border-t-[3px] text-[0.7rem] uppercase transition-colors ${
            activeTab === tab.id
              ? 'border-gold bg-gold/5 gold-text'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <span className="text-xl mb-1">{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </footer>
  )
}
