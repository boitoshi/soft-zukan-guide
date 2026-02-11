/**
 * useGlobalProgress Composable
 * ポケモン名をキーにした全ゲーム横断の進捗管理
 *
 * localStorage 設計:
 *   既存: pokemonProgress_{gameId} → per-game 進捗（後方互換で維持）
 *   新規: softZukanProgress → グローバル進捗
 *   新規: softZukanMigrated → 移行済みフラグ
 */
import { ref, computed } from 'vue';
import type { Ref, ComputedRef } from 'vue';
import type { GlobalProgress, PokemonCaughtStatus } from '@/types/softZukan';
import type { PokemonProgress } from '@/types';

const STORAGE_KEY = 'softZukanProgress';
const MIGRATED_KEY = 'softZukanMigrated';
const CURRENT_VERSION = 1;

// 全ゲームIDリスト（移行時に使用）
const ALL_GAME_IDS = ['paldea', 'galar', 'usum', 'sm', 'oras', 'xy'];

export function useGlobalProgress() {
  const progress = ref<GlobalProgress>({
    version: CURRENT_VERSION,
    pokemon: {},
  });
  const isMigrated = ref(false);

  // localStorage から読み込み
  const loadGlobalProgress = (): GlobalProgress => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as GlobalProgress;
        progress.value = parsed;
        return parsed;
      }
    } catch (err) {
      console.warn('グローバル進捗の読み込みに失敗:', err);
    }
    return progress.value;
  };

  // localStorage に保存
  const saveGlobalProgress = (): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress.value));
    } catch (err) {
      console.warn('グローバル進捗の保存に失敗:', err);
    }
  };

  // 既存の per-game 進捗からの初回移行
  // pokemon-master.json が必要なので、名前→ID マッピングを受け取る
  const migrateFromPerGameProgress = (
    gameIdToPokemonMap: Record<string, { id: string; name: string }[]>,
  ): void => {
    try {
      // 既に移行済みならスキップ
      if (localStorage.getItem(MIGRATED_KEY) === 'true') {
        isMigrated.value = true;
        return;
      }

      let migrated = false;

      for (const gameId of ALL_GAME_IDS) {
        const savedStr = localStorage.getItem(`pokemonProgress_${gameId}`);
        if (!savedStr) continue;

        const savedProgress = JSON.parse(savedStr) as PokemonProgress[];
        const pokemonList = gameIdToPokemonMap[gameId] ?? [];

        for (const saved of savedProgress) {
          if (!saved.caught) continue;

          // ID からポケモン名を逆引き
          const pokemon = pokemonList.find(p => p.id === saved.id);
          if (!pokemon) continue;

          const name = pokemon.name;
          if (!progress.value.pokemon[name]) {
            progress.value.pokemon[name] = { caughtIn: [] };
          }
          if (!progress.value.pokemon[name].caughtIn.includes(gameId)) {
            progress.value.pokemon[name].caughtIn.push(gameId);
            migrated = true;
          }
        }
      }

      if (migrated) {
        saveGlobalProgress();
      }

      localStorage.setItem(MIGRATED_KEY, 'true');
      isMigrated.value = true;
    } catch (err) {
      console.warn('per-game 進捗からの移行に失敗:', err);
    }
  };

  // ポケモンを「取得済み」にマーク
  const markCaught = (name: string, gameId: string): void => {
    if (!progress.value.pokemon[name]) {
      progress.value.pokemon[name] = { caughtIn: [] };
    }
    if (!progress.value.pokemon[name].caughtIn.includes(gameId)) {
      progress.value.pokemon[name].caughtIn.push(gameId);
      saveGlobalProgress();
    }
  };

  // ポケモンを「未取得」に戻す
  const markUncaught = (name: string, gameId: string): void => {
    const status = progress.value.pokemon[name];
    if (!status) return;

    status.caughtIn = status.caughtIn.filter(id => id !== gameId);
    if (status.caughtIn.length === 0) {
      delete progress.value.pokemon[name];
    }
    saveGlobalProgress();
  };

  // あるポケモンを取得済みのゲーム一覧を返す
  const getCaughtGames = (name: string): string[] => {
    return progress.value.pokemon[name]?.caughtIn ?? [];
  };

  // あるポケモンが指定ゲームで取得済みか
  const isCaughtInGame = (name: string, gameId: string): boolean => {
    return getCaughtGames(name).includes(gameId);
  };

  // あるポケモンがどこかのゲームで取得済みか
  const isCaughtAnywhere = (name: string): boolean => {
    return getCaughtGames(name).length > 0;
  };

  // 特定ゲームの進捗を一括クリア
  const clearGameProgress = (gameId: string): void => {
    const names = Object.keys(progress.value.pokemon);
    for (const name of names) {
      const status = progress.value.pokemon[name];
      if (!status) continue;
      status.caughtIn = status.caughtIn.filter(id => id !== gameId);
      if (status.caughtIn.length === 0) {
        delete progress.value.pokemon[name];
      }
    }
    saveGlobalProgress();
  };

  // グローバル進捗の統計
  const totalCaughtPokemon: ComputedRef<number> = computed(() => {
    return Object.keys(progress.value.pokemon).length;
  });

  return {
    progress,
    isMigrated,
    loadGlobalProgress,
    saveGlobalProgress,
    migrateFromPerGameProgress,
    markCaught,
    markUncaught,
    clearGameProgress,
    getCaughtGames,
    isCaughtInGame,
    isCaughtAnywhere,
    totalCaughtPokemon,
  };
}
