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

  const getItemStatus = (
    type: 'weapon' | 'defense' | 'set',
    id: string
  ) => {
    const cat = `${type}s` as 'weapons' | 'defenses' | 'sets'
    if (equipped[type] === id) return 'EQUIPADO'
    if (owned[cat].includes(id)) return 'USAR'
    return null
  }

  return (
    <section className="space-y-6">

      {/* MERCADO */}
      <div className="bg-card border border-border/30 rounded-lg p-4 space-y-4">

        {/* INSTAGRAM SYSTEM */}
        <div
          onClick={() => {
            window.open('https://www.instagram.com/xyvenqorix', '_blank')
            setInstaOpened(true)
          }}
          className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-pink-500/30 rounded-lg cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span>📸</span>
            <div className="text-left">
              <span className="text-[10px] block text-pink-400 font-bold uppercase">
                Instagram
              </span>
              <span className="text-[8px] text-muted-foreground">
                +500 💎 por seguir
              </span>
            </div>
          </div>

          <button
            disabled={followedInsta}
            onClick={(e) => {
              e.stopPropagation()

              if (!instaOpened) {
                alert('❌ No vinculado a Instagram')
                return
              }

              if (followedInsta) return

              onFollowInstagram()
            }}
            className={`text-[9px] font-bold px-3 py-1 rounded ${
              followedInsta
                ? 'bg-gray-600 text-gray-300'
                : instaOpened
                ? 'bg-pink-600/40 text-white hover:bg-pink-600/60'
                : 'bg-red-600/40 text-red-200'
            }`}
          >
            {!instaOpened
              ? 'NO VINCULADO'
              : followedInsta
              ? 'YA RECLAMADO ✔'
              : 'RECLAMAR +500 💎'}
          </button>
        </div>

      </div>

    </section>
  )
}
