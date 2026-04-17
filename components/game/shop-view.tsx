'use client'

import { useState } from 'react'
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
  onBuyItem: (
    type: 'weapon' | 'defense' | 'set',
    id: string,
    cost: number,
    currency: 'usdt' | 'diam'
  ) => void
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

  const [instaOpened, setInstaOpened] = useState(false)

  const getItemStatus = (type: 'weapon' | 'defense' | 'set', id: string) => {
    const cat = `${type}s` as 'weapons' | 'defenses' | 'sets'
    if (equipped[type] === id) return 'EQUIPADO'
    if (owned[cat].includes(id)) return 'USAR'
    return null
  }

  return (
    <section className="space-y-6">

      {/* MERCADO */}
      <div className="bg-card border border-border/30 rounded-lg p-4 space-y-4">

        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border/30 pb-2">
          Mercado de Lordran
        </h3>

        <div className="grid grid-cols-1 gap-3">

          <button
            onClick={() => onExchange('usdt_souls')}
            className="flex justify-between items-center p-3 bg-zinc-900 border border-red-900/30 rounded-lg"
          >
            Comprar Almas
          </button>

          <button
            onClick={() => onExchange('diam_usdt')}
            className="flex justify-between items-center p-3 bg-zinc-900 border border-green-900/30 rounded-lg"
          >
            Vender Diamantes
          </button>

        </div>

        {/* INSTAGRAM (NO DUPLICA REWARD) */}
        <div
          onClick={() => {
            window.open('https://www.instagram.com/xyvenqorix', '_blank')

            if (!followedInsta) {
              setInstaOpened(true)
              onFollowInstagram()
            }
          }}
          className="w-full flex justify-between p-3 bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-pink-500/30 rounded-lg cursor-pointer"
        >
          <div>
            📸 Instagram +500 💎
          </div>

          <span>
            {followedInsta ? 'OK ✔' : instaOpened ? 'DADO' : 'ACTIVAR'}
          </span>
        </div>

      </div>

      {/* SETS */}
      <div>
        <h3>🛡️ Sets</h3>

        {PREMIUM_SETS.map(item => (
          <div key={item.id} className="flex justify-between p-3 bg-card">
            <div>{item.name}</div>

            <button
              onClick={() =>
                onBuyItem('set', item.id, item.usdt, 'usdt')
              }
            >
              {getItemStatus('set', item.id) ?? `${item.usdt} USDT`}
            </button>
          </div>
        ))}
      </div>

      {/* ARMAS */}
      <div>
        <h3>⚔️ Armas</h3>

        {WEAPONS.map(item => (
          <div key={item.id} className="flex justify-between p-3 bg-card">
            <div>{item.name}</div>

            <button
              onClick={() =>
                onBuyItem('weapon', item.id, item.diam, 'diam')
              }
            >
              {getItemStatus('weapon', item.id) ?? `${item.diam} 💎`}
            </button>
          </div>
        ))}
      </div>

      {/* DEFENSAS */}
      <div>
        <h3>🛡️ Escudos</h3>

        {DEFENSES.map(item => (
          <div key={item.id} className="flex justify-between p-3 bg-card">
            <div>{item.name}</div>

            <button
              onClick={() =>
                onBuyItem('defense', item.id, item.diam, 'diam')
              }
            >
              {getItemStatus('defense', item.id) ?? `${item.diam} 💎`}
            </button>
          </div>
        ))}
      </div>

    </section>
  )
}
