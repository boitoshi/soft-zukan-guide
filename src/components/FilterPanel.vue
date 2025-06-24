<script setup lang="ts">
import type { GameConfig, FilterState } from '../index.js'

interface VersionFilterOption {
  value: string
  label: string
}

interface VersionFilter {
  name: string
  options: VersionFilterOption[]
}

interface Props {
  selectedGame: GameConfig
  versionFilters?: Record<string, VersionFilter>
  modelValue: FilterState
}

const props = withDefaults(defineProps<Props>(), {
  versionFilters: () => ({})
})

const emit = defineEmits<{
  'update:modelValue': [value: FilterState]
  'reset-filters': []
}>()

// フィルター値更新
const updateFilter = (key: keyof FilterState, value: string): void => {
  const newFilters = { ...props.modelValue, [key]: value }
  emit('update:modelValue', newFilters)
}

// 型安全なイベントハンドラー
const handleSelectChange = (key: keyof FilterState) => (event: Event) => {
  const target = event.target as HTMLSelectElement
  updateFilter(key, target.value)
}

const handleInputChange = (key: keyof FilterState) => (event: Event) => {
  const target = event.target as HTMLInputElement
  updateFilter(key, target.value)
}

// フィルターリセット
const resetFilters = (): void => {
  emit('reset-filters')
}

// 地域フィルターオプション
const getRegionOptions = () => {
  const options = [
    { value: '', label: '🌍 全ての地域' },
    { value: 'duplicates', label: '🔄 重複ポケモン' }
  ]

  // 選択されたゲームの地域を追加
  if (props.selectedGame?.regions) {
    props.selectedGame.regions.forEach(region => {
      options.push({
        value: region.id,
        label: region.name
      })
    })
  }

  return options
}

// 進捗状況フィルターオプション
const statusOptions = [
  { value: '', label: '📋 全て表示' },
  { value: 'caught', label: '✅ ゲット済み' },
  { value: 'uncaught', label: '❌ 未ゲット' }
]

// アクティブフィルター数の計算
const getActiveFilterCount = (): number => {
  let count = 0
  if (props.modelValue.region) count++
  if (props.modelValue.status) count++
  if (props.modelValue.search) count++
  return count
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
    <div class="p-6 border-b bg-gradient-to-r from-green-50 to-blue-50">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <span class="text-2xl mr-3">🔍</span>
          <div>
            <h2 class="text-xl font-bold text-gray-800">フィルター</h2>
            <p class="text-gray-600 text-sm">ポケモンを絞り込んで表示</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span v-if="getActiveFilterCount() > 0" class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {{ getActiveFilterCount() }}個のフィルター
          </span>
          <button
            @click="resetFilters"
            class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
          >
            🔄 リセット
          </button>
        </div>
      </div>
    </div>

    <div class="p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- 地域フィルター -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">📍 地域・図鑑</label>          <select
            :value="modelValue.region"
            @change="handleSelectChange('region')"
            class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option v-for="option in getRegionOptions()" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <!-- 進捗状況フィルター -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">📊 進捗状況</label>          <select
            :value="modelValue.status"
            @change="handleSelectChange('status')"
            class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option v-for="option in statusOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <!-- 検索フィルター -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">🔍 ポケモン名検索</label>          <input
            type="text"
            :value="modelValue.search"
            @input="handleInputChange('search')"
            placeholder="ポケモン名を入力..."
            class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <!-- バージョン限定フィルター -->
      <div v-if="versionFilters && Object.keys(versionFilters).length > 0" class="mt-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">🎮 バージョン限定フィルター</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="(filter, key) in versionFilters" :key="key">
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ filter.name }}</label>            <select
              :value="modelValue[key as keyof FilterState] || ''"
              @change="handleSelectChange(key as keyof FilterState)"
              class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">全て</option>
              <option v-for="option in filter.options" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* フォーカス時のスタイル強化 */
select:focus,
input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
</style>
