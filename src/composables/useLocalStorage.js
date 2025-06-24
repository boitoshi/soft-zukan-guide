export function useLocalStorage() {
    // 進捗保存
    const saveProgress = (gameId, pokemon) => {
        try {
            const progressData = pokemon.map(p => ({
                id: p.id,
                caught: p.caught
            }));
            localStorage.setItem(`pokemonProgress_${gameId}`, JSON.stringify(progressData));
        }
        catch (error) {
            console.warn('進捗保存に失敗しました:', error);
        }
    };
    // 進捗読み込み
    const loadProgress = (gameId, pokemon) => {
        try {
            const saved = localStorage.getItem(`pokemonProgress_${gameId}`);
            if (saved) {
                const savedData = JSON.parse(saved);
                pokemon.forEach(p => {
                    const savedPokemon = savedData.find(s => s.id === p.id);
                    if (savedPokemon) {
                        p.caught = savedPokemon.caught;
                    }
                });
            }
        }
        catch (error) {
            console.warn('進捗読み込みに失敗しました:', error);
        }
    };
    // 選択したゲームを保存
    const saveSelectedGame = (gameId) => {
        try {
            localStorage.setItem('selectedGame', gameId);
        }
        catch (error) {
            console.warn('ゲーム選択の保存に失敗しました:', error);
        }
    };
    // 選択したゲームを読み込み
    const loadSelectedGame = () => {
        try {
            return localStorage.getItem('selectedGame');
        }
        catch (error) {
            console.warn('ゲーム選択の読み込みに失敗しました:', error);
            return null;
        }
    };
    // 選択したゲームをクリア
    const clearSelectedGame = () => {
        try {
            localStorage.removeItem('selectedGame');
        }
        catch (error) {
            console.warn('ゲーム選択のクリアに失敗しました:', error);
        }
    };
    return {
        saveProgress,
        loadProgress,
        saveSelectedGame,
        loadSelectedGame,
        clearSelectedGame
    };
}
