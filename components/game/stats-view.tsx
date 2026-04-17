'use client'

import { STAT_DEFS } from '@/lib/game-types'

interface StatsViewProps {
  stats: {
    vit: number
    str: number
    dex: number
  }
  onUpgrade: (statId: 'vit' | 'str' | 'dex') => void
}

export function StatsView({ stats, onUpgrade }: StatsViewProps) {
  const getStatCost = (lvl: number) => ({
    souls: Math.floor(18 * Math.pow(2.8, lvl - 1)),
    usdt: lvl < 5 ? 0.5 : Math.floor(lvl / 2)
  })

  return (
    <section className="space-y-3">
      <h2 className="text-sm soul-font gold-text border-b border-gold/20 pb-2 mb-4 uppercase text-center">
        Pacto de Sangre
      </h2>

      <div className="space-y-3">
        {STAT_DEFS.map(stat => {
          const lvl = stats[stat.id]
          const cost = getStatCost(lvl)

          return (
            <div
              key={stat.id}
              className="bg-card border border-border/30 rounded-lg p-4 flex justify-between items-center border-l-2 border-l-red-900"
            >
              <div>
                <div className="text-[10px] font-bold gold-text uppercase">
                  {stat.name} Nv.{lvl}
                </div>
                <div className="text-[8px] text-muted-foreground mt-1">
                  {stat.desc}
                </div>
              </div>
              <button
                onClick={() => onUpgrade(stat.id)}
                className="bg-black border border-red-900 p-2 rounded text-[8px] text-foreground hover:bg-red-950/20 transition-colors active:scale-[0.98]"
              >
                <span className="text-red-400">{cost.souls}🕯️</span>
                <span className="mx-1">|</span>
                <span className="text-green-500">{cost.usdt} USDT</span>
              </button>
            </div>
          )
        })}
      </div>

      <div className="mt-6 p-4 bg-card/50 border border-border/20 rounded-lg">
        <h3 className="text-[10px] font-bold text-muted-foreground uppercase mb-2">
          Efectos de Stats
        </h3>
        <ul className="text-[9px] text-muted-foreground space-y-1">
          <li>• <span className="text-red-400">Vitalidad</span>: +1 energía máxima por nivel</li>
          <li>• <span className="text-orange-400">Fuerza</span>: +0.5% almas por nivel</li>
          <li>• <span className="text-green-400">Destreza</span>: +10% velocidad por nivel</li>
        </ul>
      </div>
    </section>
  )
}
