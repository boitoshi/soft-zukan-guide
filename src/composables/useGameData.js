/**
 * useGameData Composable (TypeScript版)
 * ゲームデータの読み込み・管理を担当
 */
import { ref, computed } from 'vue';
export function useGameData() {
    // リアクティブデータ
    const zukanData = ref({
        stats: {
            total: 0,
            duplicates: 0,
            regions: {}
        },
        pokemon: []
    });
    const availableGames = ref([]);
    const selectedGame = ref(null);
    // 利用可能なゲーム一覧を読み込み
    const loadAvailableGames = async () => {
        try {
            const configResponse = await fetch('/zukan-config.json');
            const config = await configResponse.json();
            const games = [];
            for (const [gameId, gameConfig] of Object.entries(config)) {
                try {
                    const dataResponse = await fetch(`/${gameId}_zukan_data.json`);
                    if (dataResponse.ok) {
                        const gameData = await dataResponse.json();
                        games.push({
                            id: gameId,
                            ...gameConfig,
                            stats: gameData.stats
                        });
                    }
                }
                catch (error) {
                    console.log(`ゲーム ${gameId} のデータが見つかりません`);
                }
            }
            availableGames.value = games;
            return games;
        }
        catch (error) {
            console.error('ゲーム設定の読み込みに失敗しました:', error);
            return [];
        }
    };
    // 特定のゲームデータを読み込み
    const loadGameData = async (gameId, localStorage) => {
        try {
            const response = await fetch(`/${gameId}_zukan_data.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
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
        }
        catch (error) {
            console.error(`ゲーム ${gameId} のデータ読み込みに失敗しました:`, error);
            throw error;
        }
    };
    // ゲーム選択
    const selectGame = async (gameId, localStorage) => {
        try {
            await loadGameData(gameId, localStorage);
            if (localStorage) {
                localStorage.saveSelectedGame(gameId);
            }
            return true;
        }
        catch (error) {
            console.error('ゲーム選択に失敗しました:', error);
            return false;
        }
    };
    // ゲーム選択をリセット
    const backToGameSelection = (localStorage) => {
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
    const getGameIcon = (gameId) => {
        const iconMap = {
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
    const caughtCount = computed(() => {
        return zukanData.value.pokemon?.filter((p) => p.caught).length || 0;
    });
    const remainingCount = computed(() => {
        const total = zukanData.value.stats?.total || zukanData.value.pokemon?.length || 0;
        return total - caughtCount.value;
    });
    const progressPercent = computed(() => {
        const total = zukanData.value.stats?.total || zukanData.value.pokemon?.length || 0;
        return total > 0 ? Math.round((caughtCount.value / total) * 100) : 0;
    });
    const uniquePokemonCount = computed(() => {
        return zukanData.value.pokemon?.filter((p) => p.regions.length === 1).length || 0;
    });
    // ポケモンのゲット状況を切り替える
    const toggleCaught = (pokemonId, localStorage) => {
        const pokemon = zukanData.value.pokemon?.find((p) => p.id === pokemonId);
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
