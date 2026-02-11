<script setup lang="ts">
import { computed } from 'vue'
import type { GameConfig, FilterState } from '@/types'

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

// フィルター値更新（カリー化しない直接関数）
const updateFilter = (key: string, value: string): void => {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}

// フィルターリセット
const resetFilters = (): void => {
  emit('reset-filters')
}

// 地域フィルターオプション
const regionOptions = computed(() => {
  const options: { value: string; label: string }[] = [
    { value: '', label: '全ての地域' }
  ]
  if (props.selectedGame?.regions) {
    props.selectedGame.regions.forEach(region => {
      options.push({ value: region.id, label: region.name })
    })
  }
  return options
})

// バージョンフィルターのオプション（空値の重複を除去）
const getVersionOptions = (filter: VersionFilter) => {
  return filter.options.filter(opt => opt.value !== '')
}

// アクティブフィルター数
const activeFilterCount = computed((): number => {
  let count = 0
  if (props.modelValue.region) count++
  if (props.modelValue.status) count++
  if (props.modelValue.search) count++
  if (props.modelValue.multipleDex) count++
  // バージョンフィルターのカウント
  if (props.versionFilters) {
    Object.keys(props.versionFilters).forEach(key => {
      if (props.modelValue[key]) count++
    })
  }
  return count
})
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-200 p-3 mb-3">
    <!-- フィルターヘッダー -->
    <div class="flex items-center justify-between mb-2">
      <span class="text-xs font-semibold text-gray-600">🔍 フィルター</span>
      <div class="flex items-center gap-2">
        <span v-if="activeFilterCount > 0" class="text-[10px] text-blue-600 font-medium">
          {{ activeFilterCount }}件適用中
        </span>
        <button
          v-if="activeFilterCount > 0"
          @click="resetFilters"
          class="text-[10px] text-gray-500 hover:text-gray-700 underline"
        >
          リセット
        </button>
      </div>
    </div>

    <!-- フィルター行 -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
      <!-- 地域 -->
      <select
        :value="modelValue.region"
        @change="updateFilter('region', ($event.target as HTMLSelectElement).value)"
        class="text-xs p-1.5 border border-gray-200 rounded-lg bg-gray-50 focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
      >
        <option v-for="opt in regionOptions" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>

      <!-- 進捗 -->
      <select
        :value="modelValue.status"
        @change="updateFilter('status', ($event.target as HTMLSelectElement).value)"
        class="text-xs p-1.5 border border-gray-200 rounded-lg bg-gray-50 focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
      >
        <option value="">全て表示</option>
        <option value="caught">✅ ゲット済み</option>
        <option value="uncaught">❌ 未ゲット</option>
      </select>

      <!-- 検索 -->
      <input
        type="text"
        :value="modelValue.search"
        @input="updateFilter('search', ($event.target as HTMLInputElement).value)"
        placeholder="名前で検索..."
        class="text-xs p-1.5 border border-gray-200 rounded-lg bg-gray-50 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 col-span-2 md:col-span-1"
      />
    </div>

    <!-- 複数図鑑フィルター（地域が2つ以上ある場合のみ表示） -->
    <div v-if="selectedGame?.regions && selectedGame.regions.length > 1" class="mt-2">
      <label class="inline-flex items-center gap-1.5 cursor-pointer">
        <input
          type="checkbox"
          :checked="modelValue.multipleDex === 'only'"
          @change="updateFilter('multipleDex', ($event.target as HTMLInputElement).checked ? 'only' : '')"
          class="rounded border-gray-300 text-blue-600 focus:ring-blue-400 h-3.5 w-3.5"
        />
        <span class="text-xs text-gray-600">🔄 複数図鑑に登録されたポケモンのみ</span>
      </label>
    </div>

    <!-- バージョンフィルター -->
    <div v-if="versionFilters && Object.keys(versionFilters).length > 0" class="mt-2">
      <div v-for="(filter, key) in versionFilters" :key="key">
        <select
          :value="modelValue[key as keyof FilterState] || ''"
          @change="updateFilter(key as string, ($event.target as HTMLSelectElement).value)"
          class="w-full text-xs p-1.5 border border-gray-200 rounded-lg bg-gray-50 focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
        >
          <option value="">🎮 {{ filter.name }}：指定なし</option>
          <option v-for="opt in getVersionOptions(filter)" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>
