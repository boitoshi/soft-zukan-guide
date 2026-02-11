/**
 * useSoftZukanAdvisor Composable
 * ソフト図鑑完成に向けたスマートアドバイスを生成
 */
import { computed } from 'vue';
import type { ComputedRef } from 'vue';
import { usePokemonMaster } from '@/composables/usePokemonMaster';
import { useGlobalProgress } from '@/composables/useGlobalProgress';
import type { PokemonMasterEntry, AdviceItem, GameSoftZukanSummary } from '@/types/softZukan';

// ソフト図鑑対象ゲーム
const SOFT_ZUKAN_GAMES = [
  { id: 'paldea', name: 'スカーレット・バイオレット', displayName: '🏔️ SV' },
  { id: 'galar', name: 'ソード・シールド', displayName: '⚔️ SwSh' },
] as const;

// 全ゲーム名マップ
const GAME_NAMES: Record<string, string> = {
  paldea: 'SV',
  galar: 'SwSh',
  usum: 'USUM',
  sm: 'SM',
  oras: 'ORAS',
  xy: 'XY',
};

const GAME_FULL_NAMES: Record<string, string> = {
  paldea: 'スカーレット・バイオレット',
  galar: 'ソード・シールド',
  usum: 'ウルトラサン・ウルトラムーン',
  sm: 'サン・ムーン',
  oras: 'オメガルビー・アルファサファイア',
  xy: 'X・Y',
};

export function useSoftZukanAdvisor() {
  const master = usePokemonMaster();
  const globalProgress = useGlobalProgress();

  // 対象ゲームのソフト図鑑サマリーを取得
  const getGameSummary = (targetGameId: string): GameSoftZukanSummary | null => {
    const gameInfo = SOFT_ZUKAN_GAMES.find(g => g.id === targetGameId);
    if (!gameInfo) return null;

    let total = 0;
    let caught = 0;
    let canBreed = 0;
    let mustCatch = 0;
    let versionExclusive = 0;

    for (const pokemon of master.allPokemon.value) {
      if (!(targetGameId in pokemon.games)) continue;
      total++;

      if (globalProgress.isCaughtInGame(pokemon.name, targetGameId)) {
        caught++;
        continue;
      }

      // 未取得の分析
      const caughtGames = globalProgress.getCaughtGames(pokemon.name);
      const exclusive = pokemon.games[targetGameId]?.versionExclusive;

      if (exclusive) {
        versionExclusive++;
      }

      if (caughtGames.length > 0 && pokemon.breedable) {
        canBreed++;
      } else {
        mustCatch++;
      }
    }

    return {
      gameId: targetGameId,
      gameName: gameInfo.name,
      gameDisplayName: gameInfo.displayName,
      total,
      caught,
      remaining: total - caught,
      canBreed,
      mustCatch,
      versionExclusive,
      completionPercent: total > 0 ? Math.round((caught / total) * 100) : 0,
    };
  };

  // 対象ゲームの未登録ポケモン + アドバイスを取得
  const getAdviceForGame = (targetGameId: string): AdviceItem[] => {
    const advice: AdviceItem[] = [];

    for (const pokemon of master.allPokemon.value) {
      if (!(targetGameId in pokemon.games)) continue;
      if (globalProgress.isCaughtInGame(pokemon.name, targetGameId)) continue;

      // 未取得ポケモン → アドバイス生成
      const caughtGames = globalProgress.getCaughtGames(pokemon.name);
      const exclusive = pokemon.games[targetGameId]?.versionExclusive;

      if (caughtGames.length > 0 && pokemon.breedable) {
        // 孵化で登録可能（最優先）
        const sourceGameId = caughtGames[0];
        advice.push({
          type: 'breed',
          targetGame: targetGameId,
          targetGameName: GAME_NAMES[targetGameId] ?? targetGameId,
          sourceGame: sourceGameId,
          sourceGameName: GAME_NAMES[sourceGameId] ?? sourceGameId,
          pokemonName: pokemon.name,
          message: `${GAME_FULL_NAMES[sourceGameId] ?? sourceGameId}で入手済み → 孵化で登録可能！`,
          priority: 1,
        });
      } else if (caughtGames.length > 0 && !pokemon.breedable) {
        // 所持しているが孵化不可
        advice.push({
          type: 'not_breedable',
          targetGame: targetGameId,
          targetGameName: GAME_NAMES[targetGameId] ?? targetGameId,
          sourceGame: caughtGames[0],
          sourceGameName: GAME_NAMES[caughtGames[0]] ?? caughtGames[0],
          pokemonName: pokemon.name,
          message: '孵化不可。直接捕獲が必要',
          priority: 4,
        });
      } else if (exclusive) {
        // バージョン限定
        const versionLabel = exclusive === 'sword' ? 'ソード' :
          exclusive === 'shield' ? 'シールド' :
          exclusive === 'scarlet' ? 'スカーレット' :
          exclusive === 'violet' ? 'バイオレット' : exclusive;
        advice.push({
          type: 'version_exclusive',
          targetGame: targetGameId,
          targetGameName: GAME_NAMES[targetGameId] ?? targetGameId,
          pokemonName: pokemon.name,
          message: `${versionLabel}限定`,
          priority: 3,
        });
      } else {
        // 通常の直接捕獲
        advice.push({
          type: 'catch',
          targetGame: targetGameId,
          targetGameName: GAME_NAMES[targetGameId] ?? targetGameId,
          pokemonName: pokemon.name,
          message: '捕まえよう',
          priority: 2,
        });
      }
    }

    // 優先度でソート（小さいほど優先）
    advice.sort((a, b) => a.priority - b.priority);
    return advice;
  };

  // すぐ孵化で登録できるポケモン一覧（Quick Wins）
  const getQuickWins = (targetGameId: string): AdviceItem[] => {
    return getAdviceForGame(targetGameId).filter(a => a.type === 'breed');
  };

  // 全ソフト図鑑のサマリー
  const allGameSummaries: ComputedRef<GameSoftZukanSummary[]> = computed(() => {
    return SOFT_ZUKAN_GAMES
      .map(g => getGameSummary(g.id))
      .filter((s): s is GameSoftZukanSummary => s !== null);
  });

  return {
    softZukanGames: SOFT_ZUKAN_GAMES,
    getGameSummary,
    getAdviceForGame,
    getQuickWins,
    allGameSummaries,
  };
}
