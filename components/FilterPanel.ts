/**
 * FilterPanel Component (TypeScript版)
 * フィルター機能とバージョン限定フィルターを担当
 */
import type { GameConfig, FilterState } from '../types/index.js';
import type { PropType } from 'vue';

interface VersionFilterOption {
  value: string;
  label: string;
}

interface VersionFilter {
  name: string;
  options: VersionFilterOption[];
}

const FilterPanel = {
  name: 'FilterPanel',
  props: {
    selectedGame: {
      type: Object as PropType<GameConfig>,
      required: true
    },
    versionFilters: {
      type: Object as PropType<Record<string, VersionFilter>>,
      default: () => ({})
    },
    modelValue: {
      type: Object as PropType<FilterState>,
      required: true
    }
  },
  emits: {
    'update:modelValue': (value: FilterState) => true,
    'reset-filters': () => true
  },
  setup(props: { 
    selectedGame: GameConfig; 
    versionFilters: Record<string, VersionFilter>; 
    modelValue: FilterState; 
  }, { emit }: { emit: any }) {
    
    // フィルター値更新
    const updateFilter = (key: keyof FilterState, value: string): void => {
      const newFilters = { ...props.modelValue, [key]: value };
      emit('update:modelValue', newFilters);
    };

    // フィルターリセット
    const resetAllFilters = (): void => {
      emit('reset-filters');
    };

    return {
      updateFilter,
      resetAllFilters
    };
  },
  template: `
    <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <h2 class="text-2xl font-bold mb-6 flex items-center">
        <span class="text-2xl mr-2">🔍</span>
        フィルター機能
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
        
        <!-- 図鑑フィルター -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">📚 図鑑</label>
          <select :value="modelValue.region" 
                  @change="updateFilter('region', $event.target.value)"
                  class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
            <option value="">すべて</option>
            <option v-for="region in selectedGame.regions" :key="region.id" :value="region.id">
              {{ region.name }}
            </option>
            <option value="duplicates">🔄 重複ポケモン</option>
            <option value="unique">⭐ 重複なし</option>
          </select>
        </div>
        
        <!-- ステータスフィルター -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">📊 状況</label>
          <select :value="modelValue.status" 
                  @change="updateFilter('status', $event.target.value)"
                  class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
            <option value="">すべて</option>
            <option value="caught">✅ ゲット済み</option>
            <option value="not-caught">⭕ 未ゲット</option>
          </select>
        </div>
        
        <!-- 名前検索 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">🔎 検索</label>
          <input type="text" 
                 :value="modelValue.search" 
                 @input="updateFilter('search', $event.target.value)"
                 placeholder="ポケモン名で検索"
                 class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
        </div>
        
        <!-- バージョンフィルター（スカーレット・バイオレット） -->
        <div v-if="versionFilters.scarlet_violet">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ versionFilters.scarlet_violet.name }}
          </label>
          <select :value="modelValue.scarlet_violet" 
                  @change="updateFilter('scarlet_violet', $event.target.value)"
                  class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
            <option v-for="option in versionFilters.scarlet_violet.options" 
                    :key="option.value" 
                    :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
        
        <!-- バージョンフィルター（ソード・シールド） -->
        <div v-if="versionFilters.sword_shield">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ versionFilters.sword_shield.name }}
          </label>
          <select :value="modelValue.sword_shield" 
                  @change="updateFilter('sword_shield', $event.target.value)"
                  class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
            <option v-for="option in versionFilters.sword_shield.options" 
                    :key="option.value" 
                    :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
      
      <!-- リセットボタン -->
      <div class="flex justify-end">
        <button @click="resetAllFilters" 
                class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors">
          🔄 フィルターリセット
        </button>
      </div>
    </div>
  `
};