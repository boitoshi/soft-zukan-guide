/**
 * FilterPanel Component
 * フィルター機能とバージョン限定フィルターを担当
 */
const FilterPanel = {
  name: 'FilterPanel',
  props: {
    selectedGame: {
      type: Object,
      required: true
    },
    versionFilters: {
      type: Object,
      default: () => ({})
    },
    modelValue: {
      type: Object,
      required: true
    }
  },
  emits: ['update:modelValue', 'reset-filters'],
  setup(props, { emit }) {
    const { computed } = Vue;

    // 現在のフィルター値
    const filters = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    });

    // フィルター項目の更新
    const updateFilter = (key, value) => {
      const newFilters = { ...filters.value, [key]: value };
      emit('update:modelValue', newFilters);
    };

    // リセット処理
    const handleReset = () => {
      emit('reset-filters');
    };

    // 基本フィルターオプション
    const statusOptions = [
      { value: '', label: 'すべて' },
      { value: 'caught', label: '✅ ゲット済み' },
      { value: 'not-caught', label: '❌ 未ゲット' }
    ];

    return {
      filters,
      updateFilter,
      handleReset,
      statusOptions
    };
  },
  template: `
    <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <h2 class="text-2xl font-bold mb-6 flex items-center">
        <span class="text-2xl mr-2">🔍</span>
        フィルター & 検索
      </h2>
      
      <!-- 第1行: 基本フィルター -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <!-- 図鑑で絞り込み -->
        <div>
          <label class="block text-sm font-medium mb-2 text-gray-700">図鑑で絞り込み</label>
          <select 
            :value="filters.region"
            @change="updateFilter('region', $event.target.value)"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
            <option value="">すべて表示</option>
            <option v-for="region in selectedGame.regions" :key="region.id" :value="region.id">
              {{ region.name }}
            </option>
            <option value="duplicates">🔄 重複ポケモン</option>
            <option value="unique">⭐ 重複なし</option>
          </select>
        </div>
        
        <!-- ゲット状況 -->
        <div>
          <label class="block text-sm font-medium mb-2 text-gray-700">ゲット状況</label>
          <select 
            :value="filters.status"
            @change="updateFilter('status', $event.target.value)"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
            <option v-for="option in statusOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
        
        <!-- ポケモン名検索 -->
        <div>
          <label class="block text-sm font-medium mb-2 text-gray-700">ポケモン名で検索</label>
          <input 
            :value="filters.search"
            @input="updateFilter('search', $event.target.value)"
            type="text" 
            placeholder="例: ピカチュウ" 
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
        </div>
        
        <!-- リセットボタン -->
        <div class="flex flex-col justify-end">
          <button @click="handleReset" 
                  class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
            🔄 リセット
          </button>
        </div>
      </div>
      
      <!-- 第2行: バージョンフィルター -->
      <div class="border-t pt-4" v-if="versionFilters && Object.keys(versionFilters).length > 0">
        <h3 class="text-lg font-semibold mb-3 text-gray-800">🎮 バージョン限定フィルター</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <!-- スカーレット・バイオレット -->
          <div v-if="versionFilters.scarlet_violet">
            <label class="block text-sm font-medium mb-2 text-gray-700">
              スカーレット・バイオレット
            </label>
            <select 
              :value="filters.scarlet_violet"
              @change="updateFilter('scarlet_violet', $event.target.value)"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent">
              <option v-for="(label, value) in versionFilters.scarlet_violet" 
                      :key="value" :value="value">
                {{ label }}
              </option>
            </select>
          </div>
          
          <!-- ソード・シールド -->
          <div v-if="versionFilters.sword_shield">
            <label class="block text-sm font-medium mb-2 text-gray-700">
              ソード・シールド
            </label>
            <select 
              :value="filters.sword_shield"
              @change="updateFilter('sword_shield', $event.target.value)"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option v-for="(label, value) in versionFilters.sword_shield" 
                      :key="value" :value="value">
                {{ label }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  `
};