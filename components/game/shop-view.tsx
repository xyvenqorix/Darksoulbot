'use client'

import { WEAPONS, DEFENSES, PREMIUM_SETS } from '@/lib/game-types'

interface ShopViewProps {
  owned: {
    weapons: string[]
    defenses: string[]
    sets: string[]
  }
  equipped: {
    weapon: string | null
    defense: string | null
    set: string | null
  }
  followedInsta: boolean
  onBuyItem: (type: 'weapon' | 'defense' | 'set', id: string, cost: number, currency: 'usdt' | 'diam') => void
  onExchange: (mode: 'usdt_souls' | 'diam_usdt') => void
  onFollowInstagram: () => void
}

export function ShopView({
  owned,
  equipped,
  followedInsta,
  onBuyItem,
  onExchange,
  onFollowInstagram
}: ShopViewProps) {
  const getItemStatus = (type: 'weapon' | 'defense' | 'set', id: string) => {
    const cat = `${type}s` as 'weapons' | 'defenses' | 'sets'
    if (equipped[type] === id) return 'EQUIPADO'
    if (owned[cat].includes(id)) return 'USAR'
    return null
  }

  return (
    <section className="space-y-6">
      {/* Mercado */}
      <div className="bg-card border border-border/30 rounded-lg p-4 space-y-4">
        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border/30 pb-2">
          Mercado de Lordran
        </h3>

        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={() => onExchange('usdt_souls')}
            className="flex justify-between items-center p-3 bg-zinc-900 border border-red-900/30 rounded-lg hover:bg-zinc-800 transition-colors active:scale-[0.98]"
          >
            <div className="text-left">
              <span className="text-[10px] block text-red-400 font-bold uppercase">
                Comprar Almas
              </span>
              <span className="text-[9px] text-muted-foreground">
                20 USDT ➔ 5.000 Almas
              </span>
            </div>
            <span className="text-xs font-bold text-foreground bg-red-900/40 px-3 py-1 rounded">
              PACTAR
            </span>
          </button>

          <button
            onClick={() => onExchange('diam_usdt')}
            className="flex justify-between items-center p-3 bg-zinc-900 border border-green-900/30 rounded-lg hover:bg-zinc-800 transition-colors active:scale-[0.98]"
          >
            <div className="text-left">
              <span className="text-[10px] block text-green-400 font-bold uppercase">
                Vender Diamantes
              </span>
              <span className="text-[9px] text-muted-foreground">
                5.000 💎 ➔ 2.00 USDT
              </span>
            </div>
            <span className="text-xs font-bold text-foreground bg-green-900/40 px-3 py-1 rounded">
              VENDER
            </span>
          </button>
        </div>

        <button
          onClick={onFollowInstagram}
          className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-pink-500/30 rounded-lg hover:from-purple-900/30 hover:to-pink-900/30 transition-colors active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <span>📸</span>
            <div className="text-left">
              <span className="text-[10px] block text-pink-400 font-bold uppercase">
                Instagram
              </span>
              <span className="text-[8px] text-muted-foreground">
                +500 💎 (Seguir)
              </span>
            </div>
          </div>
          <span className="text-[9px] font-bold text-foreground bg-pink-600/40 px-3 py-1 rounded">
            {followedInsta ? 'RECLAMADO' : 'VINCULAR'}
          </span>
        </button>
      </div>

      {/* Sets Premium */}
      <div className="space-y-2.5">
        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          🛡️ Sets Premium
        </h3>
        {PREMIUM_SETS.map(item => {
          const status = getItemStatus('set', item.id)
          return (
            <div
              key={item.id}
              className="bg-card border border-border/30 rounded-lg p-3 flex justify-between items-center"
            >
              <div>
                <div className="text-[10px] font-bold uppercase text-foreground">
                  {item.name}
                </div>
                <div className="text-[8px] text-muted-foreground">
                  Velocidad x{item.speed} | Energía: {item.energyCost}/ciclo
                </div>
              </div>
              <button
                onClick={() => onBuyItem('set', item.id, item.usdt, 'usdt')}
                className={`px-3 py-1 rounded text-[9px] uppercase font-bold ${
                  status === 'EQUIPADO'
                    ? 'bg-gold/20 text-gold border border-gold/30'
                    : status === 'USAR'
                    ? 'bg-blue-900/40 text-blue-300 hover:bg-blue-900/60'
                    : 'bg-zinc-800 text-foreground hover:bg-zinc-700'
                } transition-colors active:scale-[0.98]`}
              >
                {status ?? `${item.usdt} USDT`}
              </button>
            </div>
          )
        })}
      </div>

      {/* Armas */}
      <div className="space-y-2.5">
        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          ⚔️ Armas
        </h3>
        {WEAPONS.map(item => {
          const status = getItemStatus('weapon', item.id)
          return (
            <div
              key={item.id}
              className="bg-card border border-border/30 rounded-lg p-3 flex justify-between items-center"
            >
              <div>
                <div className="text-[10px] font-bold uppercase text-foreground">
                  {item.name}
                </div>
                <div className="text-[8px] text-muted-foreground">
                  Velocidad x{item.speed}
                </div>
              </div>
              <button
                onClick={() => onBuyItem('weapon', item.id, item.diam, 'diam')}
                className={`px-3 py-1 rounded text-[9px] uppercase font-bold ${
                  status === 'EQUIPADO'
                    ? 'bg-gold/20 text-gold border border-gold/30'
                    : status === 'USAR'
                    ? 'bg-blue-900/40 text-blue-300 hover:bg-blue-900/60'
                    : 'bg-zinc-800 text-foreground hover:bg-zinc-700'
                } transition-colors active:scale-[0.98]`}
              >
                {status ?? `${item.diam} 💎`}
              </button>
            </div>
          )
        })}
      </div>

      {/* Defensas */}
      <div className="space-y-2.5">
        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          🛡️ Escudos
        </h3>
        {DEFENSES.map(item => {
          const status = getItemStatus('defense', item.id)
          return (
            <div
              key={item.id}
              className="bg-card border border-border/30 rounded-lg p-3 flex justify-between items-center"
            >
              <div className="text-[10px] font-bold uppercase text-foreground">
                {item.name}
              </div>
              <button
                onClick={() => onBuyItem('defense', item.id, item.diam, 'diam')}
                className={`px-3 py-1 rounded text-[9px] uppercase font-bold ${
                  status === 'EQUIPADO'
                    ? 'bg-gold/20 text-gold border border-gold/30'
                    : status === 'USAR'
                    ? 'bg-blue-900/40 text-blue-300 hover:bg-blue-900/60'
                    : 'bg-zinc-800 text-foreground hover:bg-zinc-700'
                } transition-colors active:scale-[0.98]`}
              >
                {status ?? `${item.diam} 💎`}
              </button>
            </div>
          )
        })}
      </div>
    </section>
  )
}
