/**
 * usePokemonFilter Composable
 * ポケモンフィルタリング機能を担当
 */
function usePokemonFilter(zukanData, selectedGame) {
  const { ref, computed } = Vue;

  // フィルター状態
  const filters = ref({
    region: '',
    status: '',
    search: '',
    scarlet_violet: 'all',
    sword_shield: 'all'
  });

  // フィルター適用後のポケモンリスト
  const filteredPokemon = computed(() => {
    let filtered = zukanData.value.pokemon || [];

    // 図鑑フィルター
    if (filters.value.region) {
      if (filters.value.region === 'duplicates') {
        filtered = filtered.filter(p => p.regions.length > 1);
      } else if (filters.value.region === 'unique') {
        filtered = filtered.filter(p => p.regions.length === 1);
      } else {
        filtered = filtered.filter(p => p.regions.includes(filters.value.region));
      }
    }

    // ステータスフィルター
    if (filters.value.status === 'caught') {
      filtered = filtered.filter(p => p.caught);
    } else if (filters.value.status === 'not-caught') {
      filtered = filtered.filter(p => !p.caught);
    }

    // 名前検索
    if (filters.value.search) {
      const search = filters.value.search.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(search));
    }

    // バージョンフィルター - スカーレット・バイオレット
    if (filters.value.scarlet_violet && filters.value.scarlet_violet !== 'all') {
      filtered = filtered.filter(p => 
        p.version_info?.scarlet_violet?.availability === filters.value.scarlet_violet
      );
    }

    // バージョンフィルター - ソード・シールド
    if (filters.value.sword_shield && filters.value.sword_shield !== 'all') {
      filtered = filtered.filter(p => 
        p.version_info?.sword_shield?.availability === filters.value.sword_shield
      );
    }

    return filtered;
  });

  // フィルターリセット
  const resetFilters = () => {
    filters.value = {
      region: '',
      status: '',
      search: '',
      scarlet_violet: 'all',
      sword_shield: 'all'
    };
  };

  // 図鑑名取得
  const getRegionName = (regionId) => {
    if (!selectedGame.value) return regionId;
    const region = selectedGame.value.regions?.find(r => r.id === regionId);
    return region ? region.name : regionId;
  };

  // 図鑑バッジのスタイル取得
  const getRegionClass = (regionId) => {
    const classMap = {
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