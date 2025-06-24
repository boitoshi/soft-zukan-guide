/**
 * TypeScript型定義ファイル
 * ポケモン図鑑アプリの共通型定義
 */

// ポケモンデータの型定義
export interface Pokemon {
  id: string;
  name: string;
  regions: string[];
  caught: boolean;
  version_info?: {
    scarlet_violet?: {
      availability: 'both' | 'scarlet' | 'violet';
    };
    sword_shield?: {
      availability: 'both' | 'sword' | 'shield';
    };
  };
}

// 進捗保存用の型定義
export interface PokemonProgress {
  id: string;
  caught: boolean;
}

// 図鑑設定の型定義
export interface ZukanRegion {
  id: string;
  name: string;
  columns: number[];
}

export interface GameConfig {
  id: string;
  name: string;
  displayName: string;
  game: string;
  seriesId: string;
  regions: ZukanRegion[];
  stats?: ZukanStats;
}

// 統計情報の型定義
export interface ZukanStats {
  total: number;
  duplicates: number;
  regions: {
    [regionId: string]: {
      total: number;
      only: number;
    };
  };
}

// 図鑑データの型定義
export interface ZukanData {
  stats: ZukanStats;
  pokemon: Pokemon[];
  version_filters?: {
    [filterName: string]: {
      name: string;
      options: {
        value: string;
        label: string;
      }[];
    };
  };
}

// フィルター状態の型定義
export interface FilterState {
  region: string;
  status: string;
  search: string;
  scarlet_violet: string;
  sword_shield: string;
}

// Vue 3 Composition APIの型定義
export interface UseLocalStorageReturn {
  saveProgress: (gameId: string, pokemon: Pokemon[]) => void;
  loadProgress: (gameId: string, pokemon: Pokemon[]) => void;
  saveSelectedGame: (gameId: string) => void;
  loadSelectedGame: () => string | null;
  clearSelectedGame: () => void;
}

export interface UseGameDataReturn {
  zukanData: import('vue').Ref<ZukanData>;
  availableGames: import('vue').Ref<GameConfig[]>;
  selectedGame: import('vue').Ref<GameConfig | null>;
  loadAvailableGames: () => Promise<GameConfig[]>;
  loadGameData: (gameId: string, localStorage?: UseLocalStorageReturn) => Promise<ZukanData>;
  selectGame: (gameId: string, localStorage?: UseLocalStorageReturn) => Promise<boolean>;
  backToGameSelection: (localStorage?: UseLocalStorageReturn) => void;
  getGameIcon: (gameId: string) => string;
  toggleCaught: (pokemonId: string, localStorage?: UseLocalStorageReturn) => void;
  caughtCount: import('vue').ComputedRef<number>;
  remainingCount: import('vue').ComputedRef<number>;
  progressPercent: import('vue').ComputedRef<number>;
  uniquePokemonCount: import('vue').ComputedRef<number>;
}

export interface UsePokemonFilterReturn {
  filters: import('vue').Ref<FilterState>;
  filteredPokemon: import('vue').ComputedRef<Pokemon[]>;
  resetFilters: () => void;
  getRegionName: (regionId: string) => string;
  getRegionClass: (regionId: string) => string;
}