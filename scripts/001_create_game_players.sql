-- Tabla para guardar el progreso de cada jugador de Telegram
-- Usa telegram_user_id como identificador unico (sin necesidad de auth)

CREATE TABLE IF NOT EXISTS public.game_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_user_id BIGINT UNIQUE NOT NULL,
  telegram_username TEXT,
  player_name TEXT NOT NULL DEFAULT 'Hueco',
  country TEXT,
  
  -- Recursos
  souls DECIMAL(20, 6) NOT NULL DEFAULT 0,
  usdt DECIMAL(20, 6) NOT NULL DEFAULT 0,
  diamonds BIGINT NOT NULL DEFAULT 0,
  
  -- Energia
  energy DECIMAL(10, 2) NOT NULL DEFAULT 10,
  max_energy INTEGER NOT NULL DEFAULT 10,
  energy_timer_start BIGINT NOT NULL DEFAULT 0,
  
  -- Stats
  stat_vit INTEGER NOT NULL DEFAULT 1,
  stat_str INTEGER NOT NULL DEFAULT 1,
  stat_dex INTEGER NOT NULL DEFAULT 1,
  
  -- Equipamiento actual
  current_weapon TEXT,
  current_defense TEXT,
  current_set TEXT,
  
  -- Items comprados (arrays de IDs)
  owned_weapons TEXT[] NOT NULL DEFAULT '{}',
  owned_defenses TEXT[] NOT NULL DEFAULT '{}',
  owned_sets TEXT[] NOT NULL DEFAULT '{}',
  
  -- Estado de combate
  auto_farm BOOLEAN NOT NULL DEFAULT false,
  combat_cycle_start BIGINT,
  current_enemy_index INTEGER NOT NULL DEFAULT 0,
  last_tick BIGINT NOT NULL DEFAULT 0,
  
  -- Extras
  followed_insta BOOLEAN NOT NULL DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indice para busquedas rapidas por telegram_user_id
CREATE INDEX IF NOT EXISTS idx_game_players_telegram_id ON public.game_players(telegram_user_id);

-- Funcion para actualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_game_players_updated_at ON public.game_players;
CREATE TRIGGER update_game_players_updated_at
  BEFORE UPDATE ON public.game_players
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS: Permitir acceso publico (el juego usa telegram_user_id, no auth de Supabase)
ALTER TABLE public.game_players ENABLE ROW LEVEL SECURITY;

-- Politica para permitir todas las operaciones (usamos telegram_user_id para verificar)
CREATE POLICY "Allow all operations for game_players" ON public.game_players
  FOR ALL
  USING (true)
  WITH CHECK (true);
