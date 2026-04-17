'use client'

import { formatSouls } from '@/lib/game-types'

interface HeaderProps {
  souls: number
  usdt: number
  diamonds: number
}

export function GameHeader({ souls, usdt, diamonds }: HeaderProps) {
  return (
    <header className="p-3 border-b border-border/50 grid grid-cols-3 gap-2 bg-black/80 sticky top-0 z-50">
      <div className="flex flex-col items-center border-r border-border/30">
        <span className="text-[9px] uppercase font-bold text-muted-foreground">Almas</span>
        <span className="text-sm font-bold gold-text">{formatSouls(souls)}</span>
      </div>
      <div className="flex flex-col items-center border-r border-border/30">
        <span className="text-[9px] uppercase font-bold text-muted-foreground">USDT</span>
        <span className="text-sm font-bold text-green-500">{usdt.toFixed(2)}</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-[9px] uppercase font-bold text-muted-foreground">💎</span>
        <span className="text-sm font-bold text-cyan-400">{diamonds}</span>
      </div>
    </header>
  )
}
