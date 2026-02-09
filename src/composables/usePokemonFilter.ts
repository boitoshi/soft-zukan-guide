/**
 * usePokemonFilter Composable (TypeScript版)
 * ポケモンフィルタリング機能を担当
 */
import { ref, computed, watch } from "vue";
import type {
  ZukanData,
  GameConfig,
  Pokemon,
  FilterState,
  UsePokemonFilterReturn,
  VersionFiltersMap,
} from '@/types'
import { getRegionClass } from '@/constants/icons'
import type { Ref, ComputedRef } from 'vue'

const buildDefaultFilters = (
  versionFilters?: VersionFiltersMap,
): FilterState => {
  const defaults: FilterState = {
    region: "",
    status: "",
    search: "",
  };

  if (versionFilters) {
    Object.keys(versionFilters).forEach((key) => {
      defaults[key] = "";
    });
  }

  return defaults;
};

export function usePokemonFilter(
  zukanData: Ref<ZukanData>,
  selectedGame: Ref<GameConfig | null>,
): UsePokemonFilterReturn {
  // フィルター状態
  const filters = ref<FilterState>(
    buildDefaultFilters(zukanData.value.version_filters),
  );

  watch(
    () => zukanData.value.version_filters,
    (versionFilters) => {
      const baseFilters = buildDefaultFilters(versionFilters);
      filters.value = {
        ...baseFilters,
        region: filters.value.region,
        status: filters.value.status,
        search: filters.value.search,
      };
    },
    { immediate: true },
  );

  // フィルター適用後のポケモンリスト
  const filteredPokemon: ComputedRef<Pokemon[]> = computed(() => {
    let filtered = zukanData.value.pokemon || [];

    // 図鑑フィルター
    if (filters.value.region) {
      if (filters.value.region === "duplicates") {
        filtered = filtered.filter((p: Pokemon) => p.regions.length > 1);
      } else if (filters.value.region === "unique") {
        filtered = filtered.filter((p: Pokemon) => p.regions.length === 1);
      } else {
        filtered = filtered.filter((p: Pokemon) =>
          p.regions.includes(filters.value.region),
        );
      }
    }

    // ステータスフィルター
    if (filters.value.status === "caught") {
      filtered = filtered.filter((p: Pokemon) => p.caught);
    } else if (filters.value.status === "uncaught") {
      filtered = filtered.filter((p: Pokemon) => !p.caught);
    }

    // 名前検索
    if (filters.value.search) {
      const search = filters.value.search.toLowerCase();
      filtered = filtered.filter((p: Pokemon) =>
        p.name.toLowerCase().includes(search),
      );
    }

    // バージョンフィルター（動的）
    const versionFilters = zukanData.value.version_filters || {};
    Object.keys(versionFilters).forEach((filterKey) => {
      const value = filters.value[filterKey];
      if (!value || value === "all") return;
      filtered = filtered.filter(
        (p: Pokemon) => p.version_info?.[filterKey]?.availability === value,
      );
    });

    return filtered;
  });

  // フィルターリセット
  const resetFilters = (): void => {
    filters.value = buildDefaultFilters(zukanData.value.version_filters);
  };

  // 図鑑名取得
  const getRegionName = (regionId: string): string => {
    if (!selectedGame.value) return regionId
    const region = selectedGame.value.regions?.find(
      (r) => r.id === regionId,
    )
    return region ? region.name : regionId
  }

  return {
    // リアクティブデータ
    filters,

    // 計算済みプロパティ
    filteredPokemon,

    // メソッド
    resetFilters,
    getRegionName,
  };
}
