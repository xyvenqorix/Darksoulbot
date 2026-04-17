'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  GameState,
  getDefaultState,
  getEnemyForIndex,
  PREMIUM_SETS,
  WEAPONS,
  ENERGY_REGEN_TIME,
  Enemy
} from '@/lib/game-types'

// Convertir estado del juego a formato de base de datos
function stateToDb(state: GameState) {
  return {
    telegram_id: state.telegramUserId,
    player_name: state.playerName,
    country: state.country,
    souls: state.souls,
    usdt: state.usdt,
    diamonds: state.diamonds,
    energy: state.energy,
    max_energy: state.maxEnergy,
    energy_timer_start: state.energyTimerStart,
    stat_vit: state.stats.vit,
    stat_str: state.stats.str,
    stat_dex: state.stats.dex,
    current_weapon: state.weapon,
    current_defense: state.defense,
    current_set: state.set,
    owned_weapons: state.owned.weapons,
    owned_defenses: state.owned.defenses,
    owned_sets: state.owned.sets,
    auto_farm: state.autoFarm,
    combat_cycle_start: state.combatCycleStart,
    current_enemy_index: state.currentEnemyIndex,
    followed_insta: state.followedInsta,
    last_tick: state.lastTick
  }
}

// Convertir datos de base de datos a estado del juego
function dbToState(db: Record<string, unknown>, playerName: string): GameState {
  return {
    telegramUserId: db.telegram_id as number,
    playerName: (db.player_name as string) || playerName,
    country: db.country as string | null,
    souls: Number(db.souls) || 0,
    usdt: Number(db.usdt) || 0,
    diamonds: Number(db.diamonds) || 0,
    energy: Number(db.energy) || 10,
    maxEnergy: Number(db.max_energy) || 10,
    energyTimerStart: Number(db.energy_timer_start) || Date.now(),
    stats: {
      vit: Number(db.stat_vit) || 1,
      str: Number(db.stat_str) || 1,
      dex: Number(db.stat_dex) || 1
    },
    weapon: db.current_weapon as string | null,
    defense: db.current_defense as string | null,
    set: db.current_set as string | null,
    owned: {
      weapons: (db.owned_weapons as string[]) || [],
      defenses: (db.owned_defenses as string[]) || [],
      sets: (db.owned_sets as string[]) || []
    },
    autoFarm: Boolean(db.auto_farm),
    combatCycleStart: db.combat_cycle_start as number | null,
    currentEnemyIndex: Number(db.current_enemy_index) || 0,
    followedInsta: Boolean(db.followed_insta),
    lastTick: Number(db.last_tick) || Date.now()
  }
}

export function useGameState() {
  const [state, setState] = useState<GameState>(getDefaultState)
  const [isInitialized, setIsInitialized] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const telegramIdRef = useRef<number | null>(null)
  const supabase = createClient()

  // Mostrar toast
  const showToast = useCallback((message: string) => {
    setToast(message)
    setTimeout(() => setToast(null), 2000)
  }, [])

  // Guardar estado en Supabase (con debounce para no saturar)
  const saveToDb = useCallback(async (newState: GameState) => {
    if (!telegramIdRef.current) return

    // Cancelar guardado pendiente
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    // Debounce de 500ms para agrupar cambios rapidos
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const dbData = stateToDb(newState)
        
        const { error } = await supabase
          .from('game_players')
          .upsert(dbData, { 
            onConflict: 'telegram_id'
          })

        if (error) {
          console.error('[v0] Error saving to Supabase:', error)
        }
      } catch (e) {
        console.error('[v0] Exception saving to Supabase:', e)
      }
    }, 500)
  }, [supabase])

  // Inicializacion
  useEffect(() => {
    if (typeof window === 'undefined') return

    const initGame = async () => {
      const tg = window.Telegram?.WebApp
      
      if (tg) {
        tg.expand?.()
        tg.ready?.()
      }

      const user = tg?.initDataUnsafe?.user
      const userId = user?.id ?? null
      const playerName = user?.first_name ?? 'Hueco'

      if (!userId) {
        // Sin ID de Telegram, usar estado por defecto
        const defaultState = getDefaultState()
        defaultState.playerName = playerName
        setState(defaultState)
        setIsInitialized(true)
        return
      }

      telegramIdRef.current = userId

      try {
        // Buscar datos existentes en Supabase
        const { data: existingPlayer, error: fetchError } = await supabase
          .from('game_players')
          .select('*')
          .eq('telegram_id', userId)
          .single()

        let loadedState: GameState

        if (fetchError || !existingPlayer) {
          // Nuevo jugador - crear registro
          loadedState = getDefaultState()
          loadedState.telegramUserId = userId
          loadedState.playerName = playerName
          loadedState.lastTick = Date.now()
          loadedState.energyTimerStart = Date.now()

          const { error: insertError } = await supabase
            .from('game_players')
            .insert(stateToDb(loadedState))

          if (insertError) {
            console.error('[v0] Error creating player:', insertError)
          }
        } else {
          // Jugador existente - cargar datos
          loadedState = dbToState(existingPlayer, playerName)
          
          // Calcular progreso offline
          const now = Date.now()
          const elapsed = now - loadedState.lastTick

          // Regenerar energia offline
          const maxE = loadedState.maxEnergy + (loadedState.stats.vit - 1)
          const regPoints = Math.floor(elapsed / ENERGY_REGEN_TIME)
          if (regPoints > 0) {
            loadedState.energy = Math.min(maxE, loadedState.energy + regPoints)
          }

          // Farm offline - calcular ganancias mientras estaba cerrado
          if (loadedState.autoFarm && loadedState.combatCycleStart) {
            const setData = PREMIUM_SETS.find(s => s.id === loadedState.set)
            const wData = WEAPONS.find(w => w.id === loadedState.weapon)
            const speedMult = ((setData?.speed ?? 1) * (wData?.speed ?? 1) * (1 + loadedState.stats.dex * 0.1))
            const cycleDur = 30000 / speedMult
            const eCost = setData?.energyCost ?? 1

            let cyclesCompleted = 0
            const maxCycles = 1000 // Limite de seguridad

            while (now - loadedState.combatCycleStart >= cycleDur && loadedState.energy >= eCost && cyclesCompleted < maxCycles) {
              const enemy = getEnemyForIndex(loadedState.currentEnemyIndex)
              let gain = (0.013 + (loadedState.stats.str * 0.005)) * enemy.factor
              if (loadedState.set === 'dragon') gain *= 1000
              loadedState.souls += gain
              if (enemy.isBoss) {
                loadedState.diamonds += 3
                loadedState.usdt += 0.02
              } else {
                loadedState.diamonds += 1
              }
              loadedState.energy -= eCost
              loadedState.combatCycleStart += cycleDur
              loadedState.currentEnemyIndex++
              cyclesCompleted++
            }

            if (cyclesCompleted > 0) {
              showToast(`FARMEO OFFLINE: +${cyclesCompleted} ciclos`)
            }
          }

          loadedState.lastTick = now
          
          // Guardar progreso offline calculado
          await saveToDb(loadedState)
        }

        setState(loadedState)
      } catch (e) {
        console.error('[v0] Error initializing game:', e)
        const defaultState = getDefaultState()
        defaultState.playerName = playerName
        setState(defaultState)
      }

      setIsInitialized(true)
    }

    // Esperar a que Telegram WebApp este disponible
    const checkTelegram = setInterval(() => {
      if (window.Telegram?.WebApp || document.readyState === 'complete') {
        clearInterval(checkTelegram)
        initGame()
      }
    }, 100)

    // Timeout de 2 segundos para inicializar sin Telegram
    const timeout = setTimeout(() => {
      clearInterval(checkTelegram)
      if (!isInitialized) {
        initGame()
      }
    }, 2000)

    return () => {
      clearInterval(checkTelegram)
      clearTimeout(timeout)
    }
  }, [isInitialized, saveToDb, showToast, supabase])

  // Game loop principal
  useEffect(() => {
    if (!isInitialized) return

    const mainLoop = () => {
      setState(prevState => {
        const now = Date.now()
        const newState = { ...prevState }
        const maxE = newState.maxEnergy + newState.stats.vit - 1

        // Regeneracion de energia
        if (newState.energy < maxE) {
          if (now - newState.energyTimerStart >= ENERGY_REGEN_TIME) {
            newState.energy = Math.min(maxE, newState.energy + 1)
            newState.energyTimerStart = now
          }
        } else {
          newState.energyTimerStart = now
        }

        // Auto farm
        if (newState.autoFarm) {
          const setData = PREMIUM_SETS.find(s => s.id === newState.set)
          const eCost = setData?.energyCost ?? 1

          if (newState.energy >= eCost) {
            if (!newState.combatCycleStart) {
              newState.combatCycleStart = now
            }

            const wData = WEAPONS.find(w => w.id === newState.weapon)
            const speedMult = ((setData?.speed ?? 1) * (wData?.speed ?? 1) * (1 + newState.stats.dex * 0.1))
            const cycleDur = 30000 / speedMult

            const progress = ((now - newState.combatCycleStart) / cycleDur) * 100

            if (progress >= 100) {
              const enemy = getEnemyForIndex(newState.currentEnemyIndex)
              let gain = (0.013 + (newState.stats.str * 0.005)) * enemy.factor
              if (newState.set === 'dragon') gain *= 1000
              newState.souls += gain

              if (enemy.isBoss) {
                newState.diamonds += 3
                newState.usdt += 0.02
              } else {
                newState.diamonds += 1
              }

              newState.energy -= eCost
              newState.combatCycleStart = now
              newState.currentEnemyIndex++
            }
          }
        }

        newState.lastTick = now
        saveToDb(newState)
        return newState
      })
    }

    intervalRef.current = setInterval(mainLoop, 200)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isInitialized, saveToDb])

  // Acciones del juego
  const selectCountry = useCallback((country: string) => {
    setState(prev => {
      const newState = { ...prev, country }
      saveToDb(newState)
      return newState
    })
  }, [saveToDb])

  const toggleAutoFarm = useCallback((on: boolean) => {
    setState(prev => {
      const newState = {
        ...prev,
        autoFarm: on,
        combatCycleStart: on ? Date.now() : null
      }
      saveToDb(newState)
      return newState
    })
  }, [saveToDb])

  const upgradeStat = useCallback((statId: 'vit' | 'str' | 'dex') => {
    setState(prev => {
      const lvl = prev.stats[statId]
      const sCost = Math.floor(18 * Math.pow(2.8, lvl - 1))
      const uCost = lvl < 5 ? 0.5 : Math.floor(lvl / 2)

      if (prev.souls >= sCost && prev.usdt >= uCost) {
        const newState = {
          ...prev,
          souls: prev.souls - sCost,
          usdt: prev.usdt - uCost,
          stats: {
            ...prev.stats,
            [statId]: prev.stats[statId] + 1
          }
        }
        saveToDb(newState)
        return newState
      } else {
        showToast('FALTA ALMAS O USDT')
        return prev
      }
    })
  }, [saveToDb, showToast])

  const buyItem = useCallback((type: 'weapon' | 'defense' | 'set', id: string, cost: number, currency: 'usdt' | 'diam') => {
    setState(prev => {
      const cat = `${type}s` as 'weapons' | 'defenses' | 'sets'
      
      if (prev.owned[cat].includes(id)) {
        const newState = { ...prev, [type]: id }
        saveToDb(newState)
        return newState
      } else {
        const bal = currency === 'usdt' ? prev.usdt : prev.diamonds
        if (bal >= cost) {
          const newState = {
            ...prev,
            [currency === 'usdt' ? 'usdt' : 'diamonds']: bal - cost,
            owned: {
              ...prev.owned,
              [cat]: [...prev.owned[cat], id]
            },
            [type]: id
          }
          saveToDb(newState)
          return newState
        } else {
          showToast('RECURSOS INSUFICIENTES')
          return prev
        }
      }
    })
  }, [saveToDb, showToast])

  const exchange = useCallback((mode: 'usdt_souls' | 'diam_usdt') => {
    setState(prev => {
      if (mode === 'usdt_souls' && prev.usdt >= 20) {
        const newState = {
          ...prev,
          usdt: prev.usdt - 20,
          souls: prev.souls + 5000
        }
        saveToDb(newState)
        return newState
      } else if (mode === 'diam_usdt' && prev.diamonds >= 5000) {
        const newState = {
          ...prev,
          diamonds: prev.diamonds - 5000,
          usdt: prev.usdt + 2
        }
        saveToDb(newState)
        return newState
      } else {
        showToast('RECURSOS INSUFICIENTES')
        return prev
      }
    })
  }, [saveToDb, showToast])

  const followInstagram = useCallback(() => {
    if (state.followedInsta) {
      showToast('YA VINCULADO')
      return
    }
    window.open('https://instagram.com/xyvenqorix.mp', '_blank')
    setState(prev => {
      const newState = {
        ...prev,
        followedInsta: true,
        diamonds: prev.diamonds + 500
      }
      saveToDb(newState)
      return newState
    })
  }, [state.followedInsta, saveToDb, showToast])

  // Calcular progreso de combate actual
  const getCombatProgress = useCallback((): { progress: number; enemy: Enemy | null } => {
    if (!state.autoFarm || !state.combatCycleStart) {
      return { progress: 0, enemy: null }
    }

    const setData = PREMIUM_SETS.find(s => s.id === state.set)
    const eCost = setData?.energyCost ?? 1

    if (state.energy < eCost) {
      return { progress: 0, enemy: null }
    }

    const wData = WEAPONS.find(w => w.id === state.weapon)
    const speedMult = ((setData?.speed ?? 1) * (wData?.speed ?? 1) * (1 + state.stats.dex * 0.1))
    const cycleDur = 30000 / speedMult
    const now = Date.now()
    const progress = Math.min(100, ((now - state.combatCycleStart) / cycleDur) * 100)
    const enemy = getEnemyForIndex(state.currentEnemyIndex)

    return { progress, enemy }
  }, [state])

  // Timer de energia
  const getEnergyTimer = useCallback((): string => {
    const maxE = state.maxEnergy + (state.stats.vit - 1)
    if (state.energy >= maxE) return 'ALMA REBOSANTE'
    if (state.energy <= 0) return 'ESPERE PARA ENERGIA'

    const rem = ENERGY_REGEN_TIME - (Date.now() - state.energyTimerStart)
    if (rem <= 0) return 'RECARGANDO...'
    
    const m = Math.floor(rem / 60000)
    const s = Math.floor((rem % 60000) / 1000)
    return `RECARGA EN: ${m}:${s < 10 ? '0' : ''}${s}`
  }, [state])

  return {
    state,
    isInitialized,
    toast,
    showToast,
    selectCountry,
    toggleAutoFarm,
    upgradeStat,
    buyItem,
    exchange,
    followInstagram,
    getCombatProgress,
    getEnergyTimer
  }
}
