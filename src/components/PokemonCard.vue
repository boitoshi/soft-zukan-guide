<script setup lang="ts">
import { computed } from 'vue';
import type { Pokemon, GameConfig, VersionFiltersMap } from '@/types';
import { buildVersionBadges } from '@/utils/versionBadges';
import { getRegionClass, GAME_ICON_MAP } from '@/constants/icons';
import { useGlobalProgress } from '@/composables/useGlobalProgress';

interface Props {
  pokemon: Pokemon;
  isCaught: boolean;
  selectedGame: GameConfig;
  versionFilters?: VersionFiltersMap;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'toggle-caught': [pokemonName: string];
}>();

const getRegionShortName = (regionId: string): string => {
  if (!props.selectedGame) return regionId;
  const region = props.selectedGame.regions.find((r) => r.id === regionId);
  if (!region) return regionId;
  return region.name.replace(/図鑑$/, '');
};

const handleClick = (): void => {
  emit('toggle-caught', props.pokemon.name);
};

const versionBadges = computed(() =>
  buildVersionBadges(props.pokemon.version_info, props.versionFilters),
);

// 他ゲームで所持チェック
const globalProgress = useGlobalProgress();
const otherGamesCaught = computed(() => {
  const currentGameId = props.selectedGame?.id;
  if (!currentGameId) return [];
  const games = globalProgress.getCaughtGames(props.pokemon.name);
  return games.filter(g => g !== currentGameId);
});
</script>

<template>
  <div
    @click="handleClick"
    role="checkbox"
    :aria-checked="isCaught"
    class="flex items-center gap-2.5 px-3 py-2.5 border-b border-gray-100 cursor-pointer transition-colors active:bg-blue-100"
    :class="isCaught ? 'bg-green-50 hover:bg-green-100' : 'hover:bg-gray-50'"
  >
    <!-- チェックボックス -->
    <div
      class="flex-shrink-0 w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-colors"
      :class="isCaught
        ? 'bg-emerald-500 border-emerald-500 text-white'
        : 'border-gray-300 bg-white'"
    >
      <svg v-if="isCaught" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
      </svg>
    </div>

    <!-- ポケモン情報 -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-1.5">
        <span class="text-[11px] text-gray-400">#{{ pokemon.id }}</span>
        <span
          class="text-sm font-semibold truncate"
          :class="isCaught ? 'text-emerald-700' : 'text-gray-800'"
        >
          {{ pokemon.name }}
        </span>
      </div>
      <!-- バッジ行 -->
      <div class="flex flex-wrap gap-0.5 mt-0.5">
        <span
          v-for="regionId in pokemon.regions"
          :key="regionId"
          :class="getRegionClass(regionId)"
          class="text-[9px] px-1.5 py-0 rounded font-medium"
        >
          {{ getRegionShortName(regionId) }}
        </span>
        <span
          v-for="badge in versionBadges"
          :key="badge.text"
          :class="badge.className"
          class="text-[9px] px-1.5 py-0 rounded font-medium"
        >
          {{ badge.text }}
        </span>
      </div>
    </div>

    <!-- 他ゲーム所持アイコン -->
    <div v-if="otherGamesCaught.length > 0 && !isCaught" class="flex-shrink-0">
      <span class="text-[10px] text-purple-500" title="他ゲームで所持">
        🥚
        <span v-for="gameId in otherGamesCaught" :key="gameId">{{ GAME_ICON_MAP[gameId] ?? '🎮' }}</span>
      </span>
    </div>
  </div>
</template>
