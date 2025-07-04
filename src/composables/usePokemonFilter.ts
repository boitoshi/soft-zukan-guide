/**
 * usePokemonFilter Composable (TypeScript版)
 * ポケモンフィルタリング機能を担当
 */
import { ref, computed } from 'vue'
import type { 
  ZukanData, 
  GameConfig, 
  Pokemon, 
  FilterState, 
  UsePokemonFilterReturn 
} from '../index.js'
import type { Ref, ComputedRef } from 'vue'

export function usePokemonFilter(
  zukanData: Ref<ZukanData>, 
  selectedGame: Ref<GameConfig | null>
): UsePokemonFilterReturn {
  // フィルター状態
  const filters = ref<FilterState>({
    region: '',
    status: '',
    search: '',
    scarlet_violet: 'all',
    sword_shield: 'all'
  });

  // フィルター適用後のポケモンリスト
  const filteredPokemon: ComputedRef<Pokemon[]> = computed(() => {
    let filtered = zukanData.value.pokemon || [];

    // 図鑑フィルター
    if (filters.value.region) {
      if (filters.value.region === 'duplicates') {
        filtered = filtered.filter((p: Pokemon) => p.regions.length > 1);
      } else if (filters.value.region === 'unique') {
        filtered = filtered.filter((p: Pokemon) => p.regions.length === 1);
      } else {
        filtered = filtered.filter((p: Pokemon) => p.regions.includes(filters.value.region));
      }
    }

    // ステータスフィルター
    if (filters.value.status === 'caught') {
      filtered = filtered.filter((p: Pokemon) => p.caught);
    } else if (filters.value.status === 'not-caught') {
      filtered = filtered.filter((p: Pokemon) => !p.caught);
    }

    // 名前検索
    if (filters.value.search) {
      const search = filters.value.search.toLowerCase();
      filtered = filtered.filter((p: Pokemon) => p.name.toLowerCase().includes(search));
    }    // バージョンフィルター - スカーレット・バイオレット
    if (filters.value.scarlet_violet && filters.value.scarlet_violet !== 'all') {
      filtered = filtered.filter((p: Pokemon) => 
        p.version_info?.scarlet_violet?.availability === filters.value.scarlet_violet
      );
    }    // バージョンフィルター - ソード・シールド
    if (filters.value.sword_shield && filters.value.sword_shield !== 'all') {
      filtered = filtered.filter((p: Pokemon) => 
        p.version_info?.sword_shield?.availability === filters.value.sword_shield
      );
    }

    return filtered;
  });

  // フィルターリセット
  const resetFilters = (): void => {
    filters.value = {
      region: '',
      status: '',
      search: '',
      scarlet_violet: 'all',
      sword_shield: 'all'
    };
  };

  // 図鑑名取得
  const getRegionName = (regionId: string): string => {
    if (!selectedGame.value) return regionId;
    const region = selectedGame.value.regions?.find((r: any) => r.id === regionId);
    return region ? region.name : regionId;
  };

  // 図鑑バッジのスタイル取得
  const getRegionClass = (regionId: string): string => {
    const classMap: Record<string, string> = {
      paldea: 'bg-blue-100 text-blue-800',
      kitakami: 'bg-orange-100 text-orange-800',
      blueberry: 'bg-purple-100 text-purple-800',
      galar: 'bg-green-100 text-green-800',
      armor: 'bg-yellow-100 text-yellow-800',
      crown: 'bg-pink-100 text-pink-800'
    };
    return classMap[regionId] || 'bg-gray-100 text-gray-800';
  };

  return {
    // リアクティブデータ
    filters,
    
    // 計算済みプロパティ
    filteredPokemon,
    
    // メソッド
    resetFilters,
    getRegionName,
    getRegionClass
  };
}
