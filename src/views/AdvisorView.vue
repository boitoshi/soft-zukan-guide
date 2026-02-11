<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { usePokemonMaster } from '@/composables/usePokemonMaster'
import { useGlobalProgress } from '@/composables/useGlobalProgress'
import { useSoftZukanAdvisor } from '@/composables/useSoftZukanAdvisor'
import { GAME_ICON_MAP } from '@/constants/icons'
import type { AdviceItem, GameSoftZukanSummary } from '@/types/softZukan'

const master = usePokemonMaster()
const globalProgress = useGlobalProgress()
const advisor = useSoftZukanAdvisor()

const isReady = ref(false)
const selectedGameId = ref('paldea')
const activeTab = ref<'breed' | 'catch' | 'version_exclusive' | 'not_breedable' | 'all'>('breed')

onMounted(async () => {
  await master.loadMasterData()
  globalProgress.loadGlobalProgress()
  isReady.value = true
})

// 選択中ゲームのサマリー
const currentSummary = computed((): GameSoftZukanSummary | null => {
  if (!isReady.value) return null
  return advisor.getGameSummary(selectedGameId.value)
})

// 選択中ゲームのアドバイス
const currentAdvice = computed((): AdviceItem[] => {
  if (!isReady.value) return []
  return advisor.getAdviceForGame(selectedGameId.value)
})

// タブ別にフィルタリング
const filteredAdvice = computed(() => {
  if (activeTab.value === 'all') return currentAdvice.value
  return currentAdvice.value.filter(a => a.type === activeTab.value)
})

// 各タイプの件数
const typeCounts = computed(() => {
  const counts = { breed: 0, catch: 0, version_exclusive: 0, not_breedable: 0 }
  for (const item of currentAdvice.value) {
    if (item.type in counts) {
      counts[item.type as keyof typeof counts]++
    }
  }
  return counts
})

// キャッチ状態トグル
const toggleCaught = (pokemonName: string) => {
  if (globalProgress.isCaughtInGame(pokemonName, selectedGameId.value)) {
    globalProgress.markUncaught(pokemonName, selectedGameId.value)
  } else {
    globalProgress.markCaught(pokemonName, selectedGameId.value)
  }
}

// アドバイスタイプの表示情報
const typeInfo: Record<string, { icon: string; label: string; color: string; bg: string }> = {
  breed: { icon: '🥚', label: '孵化で登録', color: 'text-purple-700', bg: 'bg-purple-50' },
  catch: { icon: '🎯', label: '直接捕獲', color: 'text-blue-700', bg: 'bg-blue-50' },
  version_exclusive: { icon: '🔒', label: 'バージョン限定', color: 'text-orange-700', bg: 'bg-orange-50' },
  not_breedable: { icon: '⚠️', label: '孵化不可', color: 'text-red-700', bg: 'bg-red-50' },
}
</script>

<template>
  <div class="container mx-auto px-3 py-4 md:px-4 md:py-8 max-w-2xl">
    <!-- Header -->
    <div class="mb-4">
      <p class="text-sm text-gray-600 leading-relaxed">
        Pokémon HOME の<strong>ソフト図鑑</strong>完成に向けて、次にやるべきことを提案します。
        「ゲーム別管理」でゲット済みにチェックしたポケモンを元に、残りの効率的な埋め方を分析します。
      </p>
      <p class="text-[11px] text-gray-400 mt-1">
        ※ 対象は Switch ソフト（SV・SwSh）のみ。ゲーム別管理で進捗を記録するほど精度が上がります。
      </p>
    </div>

    <!-- Loading -->
    <div v-if="!isReady" class="text-center py-12">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600 mx-auto mb-3"></div>
      <span class="text-sm text-gray-500">読み込み中...</span>
    </div>

    <template v-if="isReady">
      <!-- Game Toggle (Compact) -->
      <div class="flex gap-2 mb-4">
        <button
          v-for="game in advisor.softZukanGames"
          :key="game.id"
          @click="selectedGameId = game.id"
          class="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
          :class="selectedGameId === game.id
            ? 'bg-amber-500 text-white shadow-md'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
        >
          {{ GAME_ICON_MAP[game.id] }} {{ game.id === 'paldea' ? 'SV' : 'SwSh' }}
        </button>
      </div>

      <!-- Summary (Above the fold, always visible) -->
      <div v-if="currentSummary" class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4">
        <!-- Progress Bar -->
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-semibold text-gray-700">{{ currentSummary.gameDisplayName }}</span>
          <span class="text-xl font-bold text-amber-600">{{ currentSummary.completionPercent }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-3 mb-3">
          <div
            class="bg-gradient-to-r from-amber-400 to-orange-500 h-3 rounded-full transition-all duration-500"
            :style="{ width: `${currentSummary.completionPercent}%` }"
          ></div>
        </div>

        <!-- Key Stats (2x2 grid, compact) -->
        <div class="grid grid-cols-4 gap-2 text-center">
          <div>
            <div class="text-lg font-bold text-green-600">{{ currentSummary.caught }}</div>
            <div class="text-[10px] text-gray-500">登録済</div>
          </div>
          <div>
            <div class="text-lg font-bold text-orange-600">{{ currentSummary.remaining }}</div>
            <div class="text-[10px] text-gray-500">残り</div>
          </div>
          <div>
            <div class="text-lg font-bold text-purple-600">{{ currentSummary.canBreed }}</div>
            <div class="text-[10px] text-gray-500">🥚孵化可</div>
          </div>
          <div>
            <div class="text-lg font-bold text-blue-600">{{ currentSummary.mustCatch }}</div>
            <div class="text-[10px] text-gray-500">要捕獲</div>
          </div>
        </div>

        <!-- Quick Win Highlight -->
        <div v-if="currentSummary.canBreed > 0" class="mt-3 bg-purple-50 rounded-lg px-3 py-2 text-center">
          <span class="text-sm text-purple-700 font-medium">
            🥚 <strong>{{ currentSummary.canBreed }}匹</strong>は孵化で今すぐ登録できる！
          </span>
        </div>
      </div>

      <!-- Category Tabs (Scrollable on mobile) -->
      <div class="flex gap-1.5 mb-3 overflow-x-auto pb-1 -mx-1 px-1">
        <button
          @click="activeTab = 'all'"
          class="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
          :class="activeTab === 'all'
            ? 'bg-gray-800 text-white'
            : 'bg-gray-100 text-gray-600'"
        >
          全て ({{ currentAdvice.length }})
        </button>
        <button
          v-for="(info, type) in typeInfo"
          :key="type"
          @click="activeTab = type as any"
          class="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
          :class="activeTab === type
            ? 'bg-gray-800 text-white'
            : `${info.bg} ${info.color}`"
        >
          {{ info.icon }} {{ typeCounts[type as keyof typeof typeCounts] ?? 0 }}
        </button>
      </div>

      <!-- Advice List (Main Content - Mobile Optimized) -->
      <div v-if="filteredAdvice.length === 0" class="text-center py-8">
        <div class="text-3xl mb-2">🎉</div>
        <div class="text-sm font-medium text-gray-600">
          {{ activeTab === 'all' ? 'ソフト図鑑完成おめでとう！' : 'このカテゴリは完了！' }}
        </div>
      </div>

      <div v-else class="space-y-1.5">
        <div
          v-for="item in filteredAdvice"
          :key="item.pokemonName"
          class="flex items-center gap-2 bg-white rounded-lg border border-gray-100 px-3 py-2 hover:border-gray-300 transition-colors"
        >
          <!-- Type Icon -->
          <span class="text-base flex-shrink-0">{{ typeInfo[item.type]?.icon ?? '❓' }}</span>

          <!-- Pokemon Info (compact) -->
          <div class="flex-1 min-w-0">
            <div class="text-sm font-semibold text-gray-800 truncate">{{ item.pokemonName }}</div>
            <div class="text-[11px] text-gray-500 truncate">{{ item.message }}</div>
          </div>

          <!-- Source Game Badge (for breed type) -->
          <span
            v-if="item.sourceGame"
            class="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full flex-shrink-0"
          >
            {{ GAME_ICON_MAP[item.sourceGame] }} {{ item.sourceGameName }}
          </span>

          <!-- Toggle Button -->
          <button
            @click.stop="toggleCaught(item.pokemonName)"
            class="flex-shrink-0 w-8 h-8 rounded-lg text-sm transition-all hover:scale-110 bg-gray-100 text-gray-400 hover:bg-emerald-100 hover:text-emerald-600"
            title="登録済みにする"
          >
            ⭕
          </button>
        </div>
      </div>

      <!-- All Games Overview (at bottom) -->
      <div class="mt-6 mb-4">
        <h3 class="text-sm font-semibold text-gray-600 mb-2">📊 ソフト図鑑 全体進捗</h3>
        <div class="space-y-2">
          <div
            v-for="summary in advisor.allGameSummaries.value"
            :key="summary.gameId"
            class="bg-white rounded-lg border border-gray-200 px-3 py-2"
          >
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-medium text-gray-700">
                {{ GAME_ICON_MAP[summary.gameId] }} {{ summary.gameName }}
              </span>
              <span class="text-xs font-bold" :class="summary.completionPercent === 100 ? 'text-green-600' : 'text-gray-600'">
                {{ summary.caught }}/{{ summary.total }} ({{ summary.completionPercent }}%)
              </span>
            </div>
            <div class="w-full bg-gray-100 rounded-full h-1.5">
              <div
                class="h-1.5 rounded-full transition-all"
                :class="summary.completionPercent === 100 ? 'bg-green-500' : 'bg-amber-400'"
                :style="{ width: `${summary.completionPercent}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
