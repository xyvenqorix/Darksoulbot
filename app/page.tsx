'use client'

import { useState, useEffect } from 'react'
import { useGameState } from '@/hooks/use-game-state'
import { GameHeader } from '@/components/game/header'
import { GameFooter } from '@/components/game/footer'
import { WelcomeOverlay } from '@/components/game/welcome-overlay'
import { FightView } from '@/components/game/fight-view'
import { StatsView } from '@/components/game/stats-view'
import { ShopView } from '@/components/game/shop-view'
import { GameToast } from '@/components/game/toast'
import { TelegramRequired } from '@/components/game/telegram-required'

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData?: string
        initDataUnsafe?: {
          user?: {
            id: number
            first_name: string
          }
        }
        expand?: () => void
        ready?: () => void
      }
    }
  }
}

export default function DarkSoulsGame() {
  const [activeTab, setActiveTab] = useState<'fight' | 'stats' | 'shop'>('fight')
  const [combatProgress, setCombatProgress] = useState(0)
  const [isTelegramApp, setIsTelegramApp] = useState<boolean | null>(null)
  
  const {
    state,
    isInitialized,
    toast,
    selectCountry,
    toggleAutoFarm,
    upgradeStat,
    buyItem,
    exchange,
    followInstagram,
    getCombatProgress,
    getEnergyTimer
  } = useGameState()

  // Detectar si estamos en Telegram WebApp
  useEffect(() => {
    const checkTelegram = () => {
      const tg = window.Telegram?.WebApp
      // Verificar si tiene initData (solo presente cuando se abre desde Telegram)
      const hasInitData = tg?.initData && tg.initData.length > 0
      const hasUser = tg?.initDataUnsafe?.user?.id !== undefined
      
      setIsTelegramApp(hasInitData || hasUser)
    }
    
    // Esperar un momento para que cargue el script de Telegram
    const timer = setTimeout(checkTelegram, 100)
    return () => clearTimeout(timer)
  }, [])

  // Actualizar progreso de combate mas frecuentemente para animacion suave
  useEffect(() => {
    if (!isInitialized) return

    const updateProgress = () => {
      const { progress } = getCombatProgress()
      setCombatProgress(progress)
    }

    const interval = setInterval(updateProgress, 50)
    return () => clearInterval(interval)
  }, [isInitialized, getCombatProgress])

  // Pantalla de verificacion de Telegram
  if (isTelegramApp === null) {
    return (
      <div className="min-h-screen soul-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="soul-font gold-text text-2xl mb-2">DARK SOULS</h1>
          <p className="text-xs text-muted-foreground animate-pulse">Verificando conexion...</p>
        </div>
      </div>
    )
  }

  // Mostrar pantalla de bloqueo si no esta en Telegram
  if (!isTelegramApp) {
    return <TelegramRequired />
  }

  // Pantalla de carga
  if (!isInitialized) {
    return (
      <div className="min-h-screen soul-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="soul-font gold-text text-2xl mb-2">DARK SOULS</h1>
          <p className="text-xs text-muted-foreground animate-pulse">Despertando del sueno eterno...</p>
        </div>
      </div>
    )
  }

  const { enemy: currentEnemy } = getCombatProgress()
  const energyTimer = getEnergyTimer()

  return (
    <div className="min-h-screen soul-bg flex flex-col">
      {/* Overlay de bienvenida */}
      {!state.country && (
        <WelcomeOverlay
          playerName={state.playerName}
          onSelectCountry={selectCountry}
        />
      )}

      {/* Header con recursos */}
      <GameHeader
        souls={state.souls}
        usdt={state.usdt}
        diamonds={state.diamonds}
      />

      {/* Área de contenido principal */}
      <main className="flex-1 overflow-y-auto p-4 pb-28">
        {activeTab === 'fight' && (
          <FightView
            autoFarm={state.autoFarm}
            energy={state.energy}
            maxEnergy={state.maxEnergy}
            vitLevel={state.stats.vit}
            currentSet={state.set}
            combatProgress={combatProgress}
            currentEnemy={state.autoFarm ? currentEnemy : null}
            energyTimer={energyTimer}
            onToggleFarm={toggleAutoFarm}
          />
        )}

        {activeTab === 'stats' && (
          <StatsView
            stats={state.stats}
            onUpgrade={upgradeStat}
          />
        )}

        {activeTab === 'shop' && (
          <ShopView
            owned={state.owned}
            equipped={{
              weapon: state.weapon,
              defense: state.defense,
              set: state.set
            }}
            followedInsta={state.followedInsta}
            onBuyItem={buyItem}
            onExchange={exchange}
            onFollowInstagram={followInstagram}
          />
        )}
      </main>

      {/* Footer con navegación */}
      <GameFooter
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Toast de notificaciones */}
      <GameToast message={toast} />
      
      {/* Debug info - solo en desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-16 right-2 text-[8px] text-muted-foreground bg-black/80 p-2 rounded z-50">
          <div>User ID: {state.odluser ?? 'null'}</div>
          <div>Name: {state.playerName}</div>
        </div>
      )}
    </div>
  )
}
