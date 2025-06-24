/**
 * useGameData Composable (TypeScript版)
 * ゲームデータの読み込み・管理を担当
 */
import type { 
  ZukanData, 
  GameConfig, 
  UseLocalStorageReturn, 
  UseGameDataReturn,
  ZukanStats
} from '../types/index.js';
import type { Ref, ComputedRef } from 'vue';

function useGameData(): UseGameDataReturn {
  const { ref, computed } = Vue;

  // リアクティブデータ
  const zukanData = ref<ZukanData>({ 
    stats: {
      total: 0,
      duplicates: 0,
      regions: {}
    }, 
    pokemon: [] 
  });
  const availableGames = ref<GameConfig[]>([]);
  const selectedGame = ref<GameConfig | null>(null);

  // 利用可能なゲーム一覧を読み込み
  const loadAvailableGames = async (): Promise<GameConfig[]> => {
    try {
      const configResponse = await fetch('zukan-config.json');
      const config: Record<string, Omit<GameConfig, 'id'>> = await configResponse.json();
      
      const games: GameConfig[] = [];
      for (const [gameId, gameConfig] of Object.entries(config)) {
        try {
          const dataResponse = await fetch(`data/${gameId}_zukan_data.json`);
          if (dataResponse.ok) {
            const gameData: ZukanData = await dataResponse.json();
            games.push({
              id: gameId,
              ...gameConfig,
              stats: gameData.stats
            });
          }
        } catch (error) {
          console.log(`ゲーム ${gameId} のデータが見つかりません`);
        }
      }
      
      availableGames.value = games;
      return games;
    } catch (error) {
      console.error('ゲーム設定の読み込みに失敗しました:', error);
      return [];
    }
  };

  // 特定のゲームデータを読み込み
  const loadGameData = async (
    gameId: string, 
    localStorage?: UseLocalStorageReturn
  ): Promise<ZukanData> => {
    try {
      const response = await fetch(`data/${gameId}_zukan_data.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ZukanData = await response.json();
      
      // ローカルストレージから進捗を復元
      if (localStorage) {
        localStorage.loadProgress(gameId, data.pokemon);
      }
      
      zukanData.value = data;
      
      // 選択されたゲーム情報を更新
      const gameInfo = availableGames.value.find(g => g.id === gameId);
      if (gameInfo) {
        selectedGame.value = {
          ...gameInfo,
          ...data
        };
      }
      
      return data;
    } catch (error) {
      console.error(`ゲーム ${gameId} のデータ読み込みに失敗しました:`, error);
      throw error;
    }
  };

  // ゲーム選択
  const selectGame = async (
    gameId: string, 
    localStorage?: UseLocalStorageReturn
  ): Promise<boolean> => {
    try {
      await loadGameData(gameId, localStorage);
      if (localStorage) {
        localStorage.saveSelectedGame(gameId);
      }
      return true;
    } catch (error) {
      console.error('ゲーム選択に失敗しました:', error);
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
        regions: {}
      }, 
      pokemon: [] 
    };
    if (localStorage) {
      localStorage.clearSelectedGame();
    }
  };

  // ゲームアイコン取得
  const getGameIcon = (gameId: string): string => {
    const iconMap: Record<string, string> = {
      test: '🧪',
      paldea: '🏔️',
      galar: '⚔️',
      alola: '🌺',
      kalos: '🗼',
      unova: '🌉',
      sinnoh: '⛰️',
      hoenn: '🌊',
      johto: '🌸',
      kanto: '⚡'
    };
    return iconMap[gameId] || '🎮';
  };

  // 統計計算
  const caughtCount: ComputedRef<number> = computed(() => {
    return zukanData.value.pokemon?.filter(p => p.caught).length || 0;
  });

  const remainingCount: ComputedRef<number> = computed(() => {
    const total = zukanData.value.stats?.total || zukanData.value.pokemon?.length || 0;
    return total - caughtCount.value;
  });

  const progressPercent: ComputedRef<number> = computed(() => {
    const total = zukanData.value.stats?.total || zukanData.value.pokemon?.length || 0;
    return total > 0 ? Math.round((caughtCount.value / total) * 100) : 0;
  });

  const uniquePokemonCount: ComputedRef<number> = computed(() => {
    return zukanData.value.pokemon?.filter(p => p.regions.length === 1).length || 0;
  });

  // ポケモンのゲット状況を切り替える
  const toggleCaught = (pokemonId: string, localStorage?: UseLocalStorageReturn): void => {
    const pokemon = zukanData.value.pokemon?.find(p => p.id === pokemonId);
    if (pokemon) {
      pokemon.caught = !pokemon.caught;
      
      // ローカルストレージに保存
      if (localStorage && selectedGame.value) {
        localStorage.saveProgress(selectedGame.value.id, zukanData.value.pokemon);
      }
    }
  };

  return {
    // リアクティブデータ
    zukanData,
    availableGames,
    selectedGame,
    
    // メソッド
    loadAvailableGames,
    loadGameData,
    selectGame,
    backToGameSelection,
    getGameIcon,
    toggleCaught,
    
    // 計算済みプロパティ
    caughtCount,
    remainingCount,
    progressPercent,
    uniquePokemonCount
  };
}