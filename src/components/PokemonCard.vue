<script setup lang="ts">
import { computed } from 'vue'
import type { Pokemon, GameConfig, VersionFiltersMap } from '@/types'
import { buildVersionBadges } from '@/utils/versionBadges'
import { getRegionClass } from '@/constants/icons'

interface Props {
  pokemon: Pokemon;
  selectedGame: GameConfig;
  versionFilters?: VersionFiltersMap;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "toggle-caught": [pokemonId: string];
}>();

const getRegionName = (regionId: string): string => {
  if (!props.selectedGame) return regionId
  const region = props.selectedGame.regions.find((r) => r.id === regionId)
  return region ? region.name : regionId
}

// クリック処理
const handleClick = (): void => {
  emit("toggle-caught", props.pokemon.id);
};

const versionBadges = computed(() =>
  buildVersionBadges(props.pokemon.version_info, props.versionFilters),
);
</script>

<template>
  <div
    @click="handleClick"
    class="pokemon-card flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors group"
    :class="{ 'bg-green-50 border-green-200': pokemon.caught }"
  >
    <div class="flex-1">
      <!-- ポケモン基本情報 -->
      <div class="flex items-center mb-2">
        <div class="flex items-center mr-4">
          <span
            class="text-2xl mr-2"
            :class="{
              'grayscale-0': pokemon.caught,
              grayscale: !pokemon.caught,
            }"
          >
            {{ pokemon.caught ? "✅" : "⭕" }}
          </span>
          <div>
            <div class="flex items-center">
              <span class="text-sm text-gray-500 mr-2"
                >#{{ props.pokemon.id }}</span
              >
              <span
                class="font-bold text-lg"
                :class="{
                  'text-green-700': props.pokemon.caught,
                  'text-gray-800': !props.pokemon.caught,
                }"
              >
                {{ props.pokemon.name }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 図鑑バッジ -->
      <div class="flex flex-wrap gap-1 mb-2">
        <span
          v-for="regionId in pokemon.regions"
          :key="regionId"
          :class="getRegionClass(regionId)"
          class="px-2 py-1 rounded text-xs font-medium"
        >
          {{ getRegionName(regionId) }}
        </span>
      </div>

      <!-- バージョン限定情報 -->
      <div v-if="versionBadges.length > 0" class="flex flex-wrap gap-1">
        <span
          v-for="badge in versionBadges"
          :key="badge.text"
          :class="badge.className"
          class="px-2 py-1 rounded text-xs font-medium"
        >
          🎮 {{ badge.text }}
        </span>
      </div>
    </div>

    <!-- 状態表示・操作ヒント -->
    <div class="flex items-center ml-4">
      <div class="text-right">
        <div
          class="text-sm font-medium"
          :class="{
            'text-green-600': pokemon.caught,
            'text-gray-500': !pokemon.caught,
          }"
        >
          {{ pokemon.caught ? "ゲット済み" : "未ゲット" }}
        </div>
        <div
          class="text-xs text-gray-400 group-hover:text-blue-500 transition-colors"
        >
          クリックで切り替え
        </div>
      </div>
      <div
        class="ml-3 text-2xl opacity-50 group-hover:opacity-100 transition-opacity"
      >
        {{ pokemon.caught ? "🎉" : "🎯" }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.pokemon-card {
  transition: all 0.2s ease;
}

.pokemon-card:hover {
  background-color: #f9fafb;
  border-left: 4px solid #3b82f6;
}

.pokemon-card.bg-green-50:hover {
  background-color: #f0fdf4;
  border-left: 4px solid #10b981;
}

.grayscale {
  filter: grayscale(100%);
  opacity: 0.6;
}

.grayscale-0 {
  filter: grayscale(0%);
  opacity: 1;
}
</style>
