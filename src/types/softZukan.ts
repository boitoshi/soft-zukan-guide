/**
 * ソフト図鑑 クロスゲーム型定義
 * Pokémon HOME ソフト図鑑完成ガイドのための型
 */

// ==============================
// マスターデータ（pokemon-master.json）
// ==============================

/** 通信交換進化情報 */
export interface TradeEvolutionInfo {
  from: string;
  method: string;
  svLinkCord: boolean;
}

/** マスターデータ内の1匹のポケモン情報 */
export interface PokemonMasterEntry {
  name: string;
  breedable: boolean;
  tradeEvolution?: TradeEvolutionInfo;
  games: Record<string, PokemonGameEntry>;
}

/** マスターデータ内の各ゲームでの情報 */
export interface PokemonGameEntry {
  id: string;
  regions: string[];
  versionExclusive?: string;
}

/** pokemon-master.json 全体の構造 */
export interface PokemonMasterData {
  version: string;
  generated: string;
  stats: {
    totalPokemon: number;
    breedable: number;
    nonBreedable: number;
    multiGamePokemon: number;
    totalGames: number;
    tradeEvolutions: number;
  };
  pokemon: PokemonMasterEntry[];
}

// ==============================
// クロスゲーム進捗（localStorage）
// ==============================

/** グローバル進捗データ（全ゲーム横断） */
export interface GlobalProgress {
  version: number;
  pokemon: Record<string, PokemonCaughtStatus>;
}

/** 1匹のポケモンの取得状況 */
export interface PokemonCaughtStatus {
  caughtIn: string[];  // 取得済みのゲームID配列
}

// ==============================
// クロスチェック・アドバイザー
// ==============================

/** 1匹のポケモンの全ゲーム横断ステータス */
export interface GlobalPokemonStatus {
  name: string;
  breedable: boolean;
  gameStatuses: GameCaughtStatus[];
}

/** あるポケモンの特定ゲームでのステータス */
export interface GameCaughtStatus {
  gameId: string;
  gameName: string;
  gameDisplayName: string;
  inGame: boolean;
  caught: boolean;
  isSoftZukan: boolean;      // ソフト図鑑対象か（Switch以降のみ true）
  versionExclusive?: string;
  canBreedFrom: string[];    // 孵化元となれるゲームID
}

/** アドバイスアイテム */
export interface AdviceItem {
  type: 'breed' | 'catch' | 'version_exclusive' | 'not_breedable' | 'already_caught';
  targetGame: string;
  targetGameName: string;
  sourceGame?: string;
  sourceGameName?: string;
  pokemonName: string;
  message: string;
  priority: number;  // 小さいほど優先度高い
}

/** ゲームごとのソフト図鑑サマリー */
export interface GameSoftZukanSummary {
  gameId: string;
  gameName: string;
  gameDisplayName: string;
  total: number;
  caught: number;
  remaining: number;
  canBreed: number;
  mustCatch: number;
  versionExclusive: number;
  completionPercent: number;
}
