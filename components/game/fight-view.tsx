'use client'

import Image from 'next/image'
import { Enemy, PREMIUM_SETS } from '@/lib/game-types'

interface FightViewProps {
  autoFarm: boolean
  energy: number
  maxEnergy: number
  vitLevel: number
  currentSet: string | null
  combatProgress: number
  currentEnemy: Enemy | null
  energyTimer: string
  onToggleFarm: (on: boolean) => void
}

export function FightView({
  autoFarm,
  energy,
  maxEnergy,
  vitLevel,
  currentSet,
  combatProgress,
  currentEnemy,
  energyTimer,
  onToggleFarm
}: FightViewProps) {
  const totalMaxEnergy = maxEnergy + (vitLevel - 1)
  const energyPercent = (energy / totalMaxEnergy) * 100
  
  const setData = PREMIUM_SETS.find(s => s.id === currentSet)
  const eCost = setData?.energyCost ?? 1
  const hasEnergy = energy >= eCost

  return (
    <section className="space-y-4">
      {/* Área de combate */}
      <div className="text-center py-6 min-h-[220px] flex flex-col justify-center">
        <div className="mb-4 flex flex-col items-center gap-2">
          <span className="border border-gold/30 px-2 rounded text-[10px] gold-text uppercase">
            Rango: Hueco
          </span>
          <span className="text-[9px] text-red-500 font-bold tracking-widest uppercase bg-red-900/20 px-3 rounded">
            Clase: Marginado
          </span>
        </div>

        <div className="relative inline-block mb-2">
          <div className={`w-24 h-24 mx-auto ${autoFarm ? 'enemy-glow' : 'bonfire-glow'}`}>
            <Image
              src={currentEnemy?.image ?? '/enemies/bonfire.svg'}
              alt={currentEnemy?.name ?? 'Hoguera'}
              width={96}
              height={96}
              className="pixel-art w-full h-full object-contain"
              priority
            />
          </div>
          
          {autoFarm && (
            <div className="text-[10px] absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-900 px-3 py-0.5 rounded-full border border-red-500 uppercase font-bold tracking-widest shadow-lg text-red-100">
              INVADIENDO
            </div>
          )}
        </div>

        <h2 className={`text-xl soul-font mt-4 ${currentEnemy?.isBoss ? 'text-red-500' : 'text-orange-500'}`}>
          {autoFarm && !hasEnergy ? 'SIN RESISTENCIA' : (currentEnemy?.name ?? 'Hoguera')}
        </h2>

        <div className={`text-[10px] font-mono mt-2 px-3 py-1 rounded inline-block mx-auto ${
          energy <= 0 ? 'bg-red-900/20 text-red-400' : 'bg-blue-900/20 text-blue-400'
        }`}>
          {energyTimer}
        </div>
      </div>

      {/* Barras y controles */}
      <div className="bg-card border border-border/30 rounded-lg p-5 space-y-5">
        <div className="space-y-4">
          {/* Barra de energía */}
          <div>
            <div className="flex justify-between text-[10px] mb-1.5 font-bold uppercase">
              <span className="text-blue-400">⚡ Resistencia</span>
              <span className="text-blue-300">{energy.toFixed(1)}/{totalMaxEnergy.toFixed(0)}</span>
            </div>
            <div className="bar-container">
              <div 
                className="bar-fill energy-fill"
                style={{ width: `${Math.min(100, energyPercent)}%` }}
              />
            </div>
          </div>

          {/* Barra de combate */}
          <div>
            <div className="flex justify-between text-[10px] mb-1.5 font-bold uppercase">
              <span className="text-red-500 tracking-wider">Invasión Temporal</span>
              <span className="text-red-400">{Math.floor(combatProgress)}%</span>
            </div>
            <div className="bar-container bg-red-950/20 border-red-900/30">
              <div 
                className="bar-fill battle-fill"
                style={{ width: `${combatProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-3">
          {!autoFarm ? (
            <button
              onClick={() => onToggleFarm(true)}
              className="flex-1 py-4 bg-red-950/40 border border-red-800/50 rounded-xl text-xs soul-font text-red-200 font-bold uppercase hover:bg-red-950/60 transition-colors active:scale-[0.98]"
            >
              Invadir Mundo
            </button>
          ) : (
            <button
              onClick={() => onToggleFarm(false)}
              className="flex-1 py-4 bg-zinc-900 border border-zinc-700 rounded-xl text-xs soul-font font-bold uppercase text-foreground hover:bg-zinc-800 transition-colors active:scale-[0.98]"
            >
              Rendirse
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
