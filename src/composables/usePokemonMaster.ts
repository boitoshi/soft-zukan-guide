/**
 * usePokemonMaster Composable
 * pokemon-master.json の読み込み・検索機能を提供
 */
import { ref, computed } from 'vue';
import type { Ref, ComputedRef } from 'vue';
import type { PokemonMasterData, PokemonMasterEntry } from '@/types/softZukan';

// シングルトン: 一度読み込んだらアプリ全体で共有
let masterDataCache: PokemonMasterData | null = null;
let nameIndexCache: Map<string, PokemonMasterEntry> | null = null;

export function usePokemonMaster() {
  const masterData = ref<PokemonMasterData | null>(masterDataCache);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // 名前→エントリのインデックスを構築
  const buildNameIndex = (data: PokemonMasterData): Map<string, PokemonMasterEntry> => {
    const index = new Map<string, PokemonMasterEntry>();
    for (const entry of data.pokemon) {
      index.set(entry.name, entry);
    }
    return index;
  };

  // マスターデータを読み込み（キャッシュあり）
  const loadMasterData = async (): Promise<PokemonMasterData> => {
    if (masterDataCache) {
      masterData.value = masterDataCache;
      return masterDataCache;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch('/pokemon-master.json');
      if (!response.ok) {
        throw new Error(`マスターデータの読み込みに失敗しました (${response.status})`);
      }

      const data = await response.json() as PokemonMasterData;
      masterDataCache = data;
      nameIndexCache = buildNameIndex(data);
      masterData.value = data;
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : '不明なエラー';
      error.value = `マスターデータの読み込みに失敗: ${message}`;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // ポケモン名で検索
  const findByName = (name: string): PokemonMasterEntry | undefined => {
    if (!nameIndexCache) return undefined;
    return nameIndexCache.get(name);
  };

  // あるポケモンがどのゲームに登場するか
  const getGamesForPokemon = (name: string): string[] => {
    const entry = findByName(name);
    if (!entry) return [];
    return Object.keys(entry.games);
  };

  // 孵化可能か
  const isBreedable = (name: string): boolean => {
    const entry = findByName(name);
    if (!entry) return true; // 不明な場合はデフォルト true
    return entry.breedable;
  };

  // 指定ゲームに登場するか
  const isInGame = (name: string, gameId: string): boolean => {
    const entry = findByName(name);
    if (!entry) return false;
    return gameId in entry.games;
  };

  // バージョン限定情報を取得
  const getVersionExclusive = (name: string, gameId: string): string | undefined => {
    const entry = findByName(name);
    if (!entry) return undefined;
    const gameEntry = entry.games[gameId];
    return gameEntry?.versionExclusive;
  };

  // 全ポケモンリスト
  const allPokemon: ComputedRef<PokemonMasterEntry[]> = computed(() => {
    return masterData.value?.pokemon ?? [];
  });

  // 統計情報
  const stats = computed(() => {
    return masterData.value?.stats ?? null;
  });

  return {
    masterData,
    isLoading,
    error,
    allPokemon,
    stats,
    loadMasterData,
    findByName,
    getGamesForPokemon,
    isBreedable,
    isInGame,
    getVersionExclusive,
  };
}
