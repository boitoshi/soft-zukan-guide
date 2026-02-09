/**
 * useGameData Composable (TypeScript版)
 * ゲームデータの読み込み・管理を担当
 */
import { ref, computed } from "vue";
import type {
  ZukanData,
  GameConfig,
  Pokemon,
  UseLocalStorageReturn,
  UseGameDataReturn,
  ZukanStats,
  ZukanConfigFile,
} from '@/types'
import { getGameIcon as getGameIconFromConstants } from '@/constants/icons'
import type { Ref, ComputedRef } from 'vue'

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

  // エラー状態をクリア
  const clearError = (): void => {
    error.value = null;
  };

  // 利用可能なゲーム一覧を読み込み
  const loadAvailableGames = async (): Promise<GameConfig[]> => {
    isLoading.value = true;
    error.value = null;

    try {
      const configResponse = await fetch("/zukan-config.json");
      if (!configResponse.ok) {
        throw new Error(
          `設定ファイルの読み込みに失敗しました (${configResponse.status})`,
        );
      }
      const config = (await configResponse.json()) as ZukanConfigFile;

      const games: GameConfig[] = [];

      // 新形式: gamesプロパティから読み込み
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
          } catch (error) {
            console.log(`ゲーム ${gameConfig.id} のデータが見つかりません`);
          }
        }
      }

      // 旧形式との互換性: testプロパティがある場合
      if (config.test) {
        try {
          const dataResponse = await fetch("/test_zukan_data.json");
          if (dataResponse.ok) {
            const gameData = (await dataResponse.json()) as ZukanData;
            games.push({
              id: "test",
              ...config.test,
              dataFile: "/test_zukan_data.json",
              stats: gameData.stats,
            });
          }
        } catch (error) {
          console.log("テストデータが見つかりません");
        }
      }

      availableGames.value = games;
      return games;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "不明なエラーが発生しました";
      error.value = `ゲーム設定の読み込みに失敗しました: ${errorMessage}`;
      console.error("ゲーム設定の読み込みに失敗しました:", err);
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  // 特定のゲームデータを読み込み
  const loadGameData = async (
    gameId: string,
    localStorage?: UseLocalStorageReturn,
  ): Promise<ZukanData> => {
    isLoading.value = true;
    error.value = null;

    try {
      // ゲーム設定を取得
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

      // ローカルストレージから進捗を復元
      if (localStorage) {
        localStorage.loadProgress(gameId, data.pokemon);
      }

      zukanData.value = data;

      // 選択されたゲーム情報を更新
      selectedGame.value = gameInfo;

      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "不明なエラーが発生しました";
      error.value = `ゲーム「${gameId}」のデータ読み込みに失敗しました: ${errorMessage}`;
      console.error(`ゲーム ${gameId} のデータ読み込みに失敗しました:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // ゲーム選択
  const selectGame = async (
    gameId: string,
    localStorage?: UseLocalStorageReturn,
  ): Promise<boolean> => {
    try {
      await loadGameData(gameId, localStorage);
      if (localStorage) {
        localStorage.saveSelectedGame(gameId);
      }
      return true;
    } catch (err) {
      // エラーはloadGameDataで既に設定されているので、ここでは追記のみ
      console.error("ゲーム選択に失敗しました:", err);
      return false;
    }
  };

  // ゲーム選択をリセット
  const backToGameSelection = (localStorage?: UseLocalStorageReturn): void => {
    selectedGame.value = null;
    zukanData.value = {
      stats: {
        total: 0,
        duplicates: 0,
        regions: {},
      },
      pokemon: [],
    };
    if (localStorage) {
      localStorage.clearSelectedGame();
    }
  };

  // ゲームアイコン取得（共有定数に委譲）
  const getGameIcon = (gameId: string): string => {
    return getGameIconFromConstants(gameId)
  }

  // 統計計算
  const caughtCount: ComputedRef<number> = computed(() => {
    return (
      zukanData.value.pokemon?.filter((p: Pokemon) => p.caught).length || 0
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

  // ポケモンのゲット状況を切り替える
  const toggleCaught = (
    pokemonId: string,
    localStorage?: UseLocalStorageReturn,
  ): void => {
    const pokemon = zukanData.value.pokemon?.find(
      (p: Pokemon) => p.id === pokemonId,
    );
    if (pokemon) {
      pokemon.caught = !pokemon.caught;

      // ローカルストレージに保存
      if (localStorage && selectedGame.value) {
        localStorage.saveProgress(
          selectedGame.value.id,
          zukanData.value.pokemon,
        );
      }
    }
  };

  return {
    // リアクティブデータ
    zukanData,
    availableGames,
    selectedGame,
    error,
    isLoading,

    // メソッド
    loadAvailableGames,
    loadGameData,
    selectGame,
    backToGameSelection,
    getGameIcon,
    toggleCaught,
    clearError,

    // 計算済みプロパティ
    caughtCount,
    remainingCount,
    progressPercent,
    uniquePokemonCount,
  };
}
