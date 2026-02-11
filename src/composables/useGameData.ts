/**
 * useGameData Composable (TypeScript版)
 * ゲームデータの読み込み・管理を担当
 *
 * caught 状態は useGlobalProgress から導出（ポケモン名ベース）
 * per-game localStorage への直接保存は行わない
 */
import { ref, computed } from 'vue';
import type {
  ZukanData,
  GameConfig,
  Pokemon,
  UseGameDataReturn,
  ZukanConfigFile,
} from '@/types';
import { getGameIcon as getGameIconFromConstants } from '@/constants/icons';
import { useGlobalProgress } from '@/composables/useGlobalProgress';
import type { ComputedRef } from 'vue';

const SELECTED_GAME_KEY = 'selectedGame';

export function useGameData(): UseGameDataReturn {
  // リアクティブデータ
  const zukanData = ref<ZukanData>({
    stats: {
      total: 0,
      duplicates: 0,
      regions: {},
    },
    pokemon: [],
  });
  const availableGames = ref<GameConfig[]>([]);
  const selectedGame = ref<GameConfig | null>(null);

  // エラー状態管理
  const error = ref<string | null>(null);
  const isLoading = ref<boolean>(false);

  // グローバル進捗管理（ポケモン名ベース）
  const globalProgress = useGlobalProgress();

  const clearError = (): void => {
    error.value = null;
  };

  // 利用可能なゲーム一覧を読み込み
  const loadAvailableGames = async (): Promise<GameConfig[]> => {
    isLoading.value = true;
    error.value = null;

    try {
      const configResponse = await fetch('/zukan-config.json');
      if (!configResponse.ok) {
        throw new Error(
          `設定ファイルの読み込みに失敗しました (${configResponse.status})`,
        );
      }
      const config = (await configResponse.json()) as ZukanConfigFile;

      const games: GameConfig[] = [];

      if (config.games && Array.isArray(config.games)) {
        for (const gameConfig of config.games) {
          try {
            const dataResponse = await fetch(gameConfig.dataFile);
            if (dataResponse.ok) {
              const gameData = (await dataResponse.json()) as ZukanData;
              games.push({
                ...gameConfig,
                stats: gameData.stats,
              });
            }
          } catch (err) {
            console.log(`ゲーム ${gameConfig.id} のデータが見つかりません`);
          }
        }
      }

      // 旧形式との互換性
      if (config.test) {
        try {
          const dataResponse = await fetch('/test_zukan_data.json');
          if (dataResponse.ok) {
            const gameData = (await dataResponse.json()) as ZukanData;
            games.push({
              id: 'test',
              ...config.test,
              dataFile: '/test_zukan_data.json',
              stats: gameData.stats,
            });
          }
        } catch (err) {
          console.log('テストデータが見つかりません');
        }
      }

      availableGames.value = games;

      // グローバル進捗を読み込み
      globalProgress.loadGlobalProgress();

      return games;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '不明なエラーが発生しました';
      error.value = `ゲーム設定の読み込みに失敗しました: ${errorMessage}`;
      console.error('ゲーム設定の読み込みに失敗しました:', err);
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  // 特定のゲームデータを読み込み
  const loadGameData = async (gameId: string): Promise<ZukanData> => {
    isLoading.value = true;
    error.value = null;

    try {
      const gameInfo = availableGames.value.find((g) => g.id === gameId);
      if (!gameInfo) {
        throw new Error(`ゲーム「${gameId}」の設定が見つかりません`);
      }

      const response = await fetch(gameInfo.dataFile);
      if (!response.ok) {
        throw new Error(
          `データファイルの読み込みに失敗しました (${response.status})`,
        );
      }

      const data = (await response.json()) as ZukanData;

      // caught 状態は zukanData には書き込まない
      // globalProgress から都度導出する
      zukanData.value = data;
      selectedGame.value = gameInfo;

      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '不明なエラーが発生しました';
      error.value = `ゲーム「${gameId}」のデータ読み込みに失敗しました: ${errorMessage}`;
      console.error(`ゲーム ${gameId} のデータ読み込みに失敗しました:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // ゲーム選択
  const selectGame = async (gameId: string): Promise<boolean> => {
    try {
      await loadGameData(gameId);
      try {
        localStorage.setItem(SELECTED_GAME_KEY, gameId);
      } catch (e) {
        // localStorage が使えない環境でもアプリは動作する
      }
      return true;
    } catch (err) {
      console.error('ゲーム選択に失敗しました:', err);
      return false;
    }
  };

  // ゲーム選択をリセット
  const backToGameSelection = (): void => {
    selectedGame.value = null;
    zukanData.value = {
      stats: { total: 0, duplicates: 0, regions: {} },
      pokemon: [],
    };
    try {
      localStorage.removeItem(SELECTED_GAME_KEY);
    } catch (e) {
      // ignore
    }
  };

  // ゲームアイコン取得
  const getGameIcon = (gameId: string): string => {
    return getGameIconFromConstants(gameId);
  };

  // ポケモン名で caught 判定（現在選択中のゲーム）
  const isCaughtInCurrentGame = (pokemonName: string): boolean => {
    if (!selectedGame.value) return false;
    return globalProgress.isCaughtInGame(pokemonName, selectedGame.value.id);
  };

  // 統計計算（globalProgress から導出）
  const caughtCount: ComputedRef<number> = computed(() => {
    if (!selectedGame.value) return 0;
    const gameId = selectedGame.value.id;
    return (
      zukanData.value.pokemon?.filter((p: Pokemon) =>
        globalProgress.isCaughtInGame(p.name, gameId),
      ).length || 0
    );
  });

  const remainingCount: ComputedRef<number> = computed(() => {
    const total =
      zukanData.value.stats?.total || zukanData.value.pokemon?.length || 0;
    return total - caughtCount.value;
  });

  const progressPercent: ComputedRef<number> = computed(() => {
    const total =
      zukanData.value.stats?.total || zukanData.value.pokemon?.length || 0;
    return total > 0 ? Math.round((caughtCount.value / total) * 100) : 0;
  });

  const uniquePokemonCount: ComputedRef<number> = computed(() => {
    return (
      zukanData.value.pokemon?.filter((p: Pokemon) => p.regions.length === 1)
        .length || 0
    );
  });

  // ポケモンのゲット状況を切り替える（名前ベース）
  const toggleCaught = (pokemonName: string): void => {
    if (!selectedGame.value) return;
    const gameId = selectedGame.value.id;

    if (globalProgress.isCaughtInGame(pokemonName, gameId)) {
      globalProgress.markUncaught(pokemonName, gameId);
    } else {
      globalProgress.markCaught(pokemonName, gameId);
    }
  };

  return {
    zukanData,
    availableGames,
    selectedGame,
    error,
    isLoading,
    loadAvailableGames,
    loadGameData,
    selectGame,
    backToGameSelection,
    getGameIcon,
    toggleCaught,
    isCaughtInCurrentGame,
    clearError,
    caughtCount,
    remainingCount,
    progressPercent,
    uniquePokemonCount,
  };
}
