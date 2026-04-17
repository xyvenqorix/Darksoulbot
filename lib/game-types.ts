// Tipos del juego Dark Souls: Hardcore Chronicles

export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
}

export interface TelegramWebApp {
  initDataUnsafe?: {
    user?: TelegramUser
  }
  expand: () => void
  ready: () => void
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp
    }
  }
}

export interface Enemy {
  id: string
  name: string
  factor: number
  isBoss: boolean
  image: string
}

export interface StatDef {
  id: 'vit' | 'str' | 'dex'
  name: string
  desc: string
}

export interface Weapon {
  id: string
  name: string
  diam: number
  speed: number
  image: string
}

export interface Defense {
  id: string
  name: string
  diam: number
  image: string
}

export interface PremiumSet {
  id: string
  name: string
  usdt: number
  speed: number
  energyCost: number
}

export interface GameState {
  telegramUserId: number | null // ID único del usuario de Telegram
  playerName: string
  souls: number
  usdt: number
  diamonds: number
  energy: number
  maxEnergy: number
  stats: {
    vit: number
    str: number
    dex: number
  }
  weapon: string | null
  defense: string | null
  set: string | null
  owned: {
    weapons: string[]
    defenses: string[]
    sets: string[]
  }
  autoFarm: boolean
  lastTick: number
  combatCycleStart: number | null
  energyTimerStart: number
  currentEnemyIndex: number
  followedInsta: boolean
  country: string | null
}

export const BOSSES: Enemy[] = [
  { 
    id: 'vampire', 
    name: 'Vampiro de Ceniza', 
    factor: 10.0, 
    isBoss: true,
    image: '/enemies/vampire.svg'
  },
  { 
    id: 'demon', 
    name: 'Diablo del Abismo', 
    factor: 20.0, 
    isBoss: true,
    image: '/enemies/demon.svg'
  },
  { 
    id: 'dragon', 
    name: 'Dragón Eterno', 
    factor: 50.0, 
    isBoss: true,
    image: '/enemies/dragon.svg'
  }
]

export const NORMALS: Enemy[] = [
  { 
    id: 'rat', 
    name: 'Rata de Alcantarilla', 
    factor: 0.1, 
    isBoss: false,
    image: '/enemies/rat.svg'
  },
  { 
    id: 'zombie', 
    name: 'Hueco Zombi', 
    factor: 0.5, 
    isBoss: false,
    image: '/enemies/zombie.svg'
  }
]

export const STAT_DEFS: StatDef[] = [
  { id: 'vit', name: 'Vitalidad', desc: 'Soporta más dolor.' },
  { id: 'str', name: 'Fuerza', desc: 'Extrae más almas.' },
  { id: 'dex', name: 'Destreza', desc: 'Ataque más rápido.' }
]

export const WEAPONS: Weapon[] = [
  { id: 'rusty', name: 'Espada Oxidada', diam: 500, speed: 1.1, image: '/weapons/sword.svg' },
  { id: 'mace', name: 'Maza Clérigo', diam: 2000, speed: 0.8, image: '/weapons/mace.svg' },
  { id: 'ultra', name: 'Espadón Humo', diam: 15000, speed: 0.4, image: '/weapons/greatsword.svg' },
  { id: 'chaos', name: 'Hoja del Caos', diam: 50000, speed: 2.5, image: '/weapons/chaos.svg' }
]

export const DEFENSES: Defense[] = [
  { id: 'plank', name: 'Escudo Tablas', diam: 300, image: '/shields/wood.svg' },
  { id: 'grass', name: 'Escudo Hierba', diam: 2500, image: '/shields/grass.svg' },
  { id: 'great', name: 'Escudo Artorias', diam: 20000, image: '/shields/artorias.svg' }
]

export const PREMIUM_SETS: PremiumSet[] = [
  { id: 'abyss', name: 'Caminante Abismo', usdt: 300, speed: 2, energyCost: 1 },
  { id: 'nameless', name: 'Rey Sin Nombre', usdt: 1000, speed: 5, energyCost: 0.5 },
  { id: 'dragon', name: 'Guerrero Dragón', usdt: 2000, speed: 10, energyCost: 0.1 }
]

export const ENERGY_REGEN_TIME = 30 * 60 * 1000 // 30 minutos

export function getDefaultState(): GameState {
  return {
    telegramUserId: null,
    playerName: 'Hueco',
    souls: 0,
    usdt: 0,
    diamonds: 0,
    energy: 10,
    maxEnergy: 10,
    stats: { vit: 1, str: 1, dex: 1 },
    weapon: null,
    defense: null,
    set: null,
    owned: { weapons: [], defenses: [], sets: [] },
    autoFarm: false,
    lastTick: Date.now(),
    combatCycleStart: null,
    energyTimerStart: Date.now(),
    currentEnemyIndex: 0,
    followedInsta: false,
    country: null
  }
}

export function getEnemyForIndex(idx: number): Enemy {
  if ((idx + 1) % 4 === 0) {
    const bossIdx = Math.floor(idx / 4) % BOSSES.length
    return BOSSES[bossIdx]
  }
  return NORMALS[idx % NORMALS.length]
}

export function formatSouls(v: number): string {
  return v.toFixed(3).padStart(7, '0')
}
