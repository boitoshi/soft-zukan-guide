/**
 * TypeScript型定義ファイル
 * ポケモン図鑑アプリの共通型定義
 */

// バージョン情報の型定義
export interface PokemonVersionInfo {
  availability: string;
}

export type PokemonVersionInfoMap = Record<string, PokemonVersionInfo>;

export interface VersionFilterOption {
  value: string;
  label: string;
}

export interface VersionFilterGroup {
  name: string;
  options: VersionFilterOption[];
}

export type VersionFiltersMap = Record<string, VersionFilterGroup>;

// ポケモンデータの型定義
export interface Pokemon {
  id: string;
  name: string;
  regions: string[];
  caught: boolean;
  pokedex_numbers?: Record<string, string>;
  version_info?: PokemonVersionInfoMap;
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
  columns?: number[]; // 旧形式との互換性のためオプショナル
}

export interface GameConfig {
  id: string;
  name: string;
  displayName: string;
  game: string;
  seriesId: string;
  platform?: 'switch' | '3ds';
  softZukan?: boolean;
  dataFile: string;
  regions: ZukanRegion[];
  stats?: ZukanStats;
}

// 新しい設定ファイル構造
export interface ZukanConfigFile {
  games: GameConfig[];
  test?: any; // 旧形式のテストデータ
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
  version_filters?: VersionFiltersMap;
}

// フィルター状態の型定義
export interface FilterState {
  region: string;
  status: string;
  search: string;
  [key: string]: string;
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
  error: import('vue').Ref<string | null>;
  isLoading: import('vue').Ref<boolean>;
  loadAvailableGames: () => Promise<GameConfig[]>;
  loadGameData: (gameId: string) => Promise<ZukanData>;
  selectGame: (gameId: string) => Promise<boolean>;
  backToGameSelection: () => void;
  getGameIcon: (gameId: string) => string;
  toggleCaught: (pokemonName: string) => void;
  isCaughtInCurrentGame: (pokemonName: string) => boolean;
  clearError: () => void;
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
}
