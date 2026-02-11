<script setup lang="ts">
import { onMounted, ref } from 'vue'
import GameSelector from '@/components/GameSelector.vue'
import StatsPanel from '@/components/StatsPanel.vue'
import FilterPanel from '@/components/FilterPanel.vue'
import PokemonCard from '@/components/PokemonCard.vue'
import ExportPanel from '@/components/ExportPanel.vue'
import { useGameData } from '@/composables/useGameData'
import { usePokemonFilter } from '@/composables/usePokemonFilter'
import { usePokemonMaster } from '@/composables/usePokemonMaster'
import { useGlobalProgress } from '@/composables/useGlobalProgress'
import { installPWA, isPWA } from '@/utils/pwa'
import type { GameConfig } from '@/types'

// Composables
const gameDataComposable = useGameData()
const globalProgress = useGlobalProgress()
const master = usePokemonMaster()

// Reactive refs for template access
const { zukanData, availableGames, selectedGame, error, isLoading,
  caughtCount, progressPercent, uniquePokemonCount } = gameDataComposable

// Initialize pokemon filter with isCaught function from globalProgress
const pokemonFilterComposable = usePokemonFilter(
  zukanData,
  selectedGame,
  (name: string) => gameDataComposable.isCaughtInCurrentGame(name),
)
const { filters, filteredPokemon } = pokemonFilterComposable

// Methods
const handleSelectGame = async (gameId: string) => {
  await gameDataComposable.selectGame(gameId)
}

const handleBackToGameSelection = () => {
  gameDataComposable.backToGameSelection()
}

const handleToggleCaught = (pokemonName: string) => {
  gameDataComposable.toggleCaught(pokemonName)
}

const resetFilters = () => {
  pokemonFilterComposable.resetFilters()
}

const clearError = () => {
  gameDataComposable.clearError()
}

// 一括チェック解除
const handleClearAllCaught = () => {
  if (!selectedGame.value) return
  const ok = window.confirm(
    `${selectedGame.value.game} のゲット済みチェックをすべて解除します。よろしいですか？`,
  )
  if (ok) {
    globalProgress.clearGameProgress(selectedGame.value.id)
  }
}

// Export modal state
const showExportModal = ref(false)

// PWA Install
const showPWAInstall = ref(!isPWA())

const handlePWAInstall = async () => {
  const success = await installPWA()
  if (success) {
    showPWAInstall.value = false
  }
}

// Lifecycle
onMounted(async () => {
  await gameDataComposable.loadAvailableGames()

  // 旧 per-game 進捗からの一括マイグレーション（初回のみ）
  if (!globalProgress.isMigrated.value) {
    await master.loadMasterData()
    const gameIdToPokemonMap: Record<string, { id: string; name: string }[]> = {}
    for (const pokemon of master.allPokemon.value) {
      for (const [gameId, gameEntry] of Object.entries(pokemon.games)) {
        if (!gameIdToPokemonMap[gameId]) {
          gameIdToPokemonMap[gameId] = []
        }
        gameIdToPokemonMap[gameId].push({ id: gameEntry.id, name: pokemon.name })
      }
    }
    globalProgress.migrateFromPerGameProgress(gameIdToPokemonMap)
  }

  // 保存されていたゲームを復元
  const savedGame = localStorage.getItem('selectedGame')
  if (savedGame) {
    const gameExists = availableGames.value.find(
      (g: GameConfig) => g.id === savedGame,
    )
    if (gameExists) {
      await handleSelectGame(savedGame)
    }
  }
})
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <!-- Header -->
    <div v-if="!selectedGame" class="mb-4">
      <p class="text-sm text-gray-600 leading-relaxed">
        ゲームごとの図鑑進捗を管理できます。まずはゲームを選んでね。
      </p>
    </div>
    <div v-else class="flex items-center justify-between mb-3">
      <div class="text-sm text-gray-600">
        <span class="font-semibold text-gray-800">{{ selectedGame.game }}</span>
        <span class="ml-2 text-xs text-gray-400">{{ zukanData.stats?.total || 0 }}匹 / 固有 {{ uniquePokemonCount }}匹</span>
      </div>
      <button
        v-if="caughtCount > 0"
        @click="handleClearAllCaught"
        class="text-[10px] text-red-400 hover:text-red-600 transition-colors"
      >
        チェック全解除
      </button>
    </div>

    <!-- PWA Install Button -->
    <div v-if="showPWAInstall" class="text-center mb-4">
      <button
        id="pwa-install-button"
        @click="handlePWAInstall"
        class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
      >
        <span>📱</span>
        アプリをインストール
      </button>
    </div>

    <!-- Loading Indicator -->
    <div v-if="isLoading" class="text-center py-8">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-3"></div>
      <span class="text-sm text-gray-500">読み込み中...</span>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="mb-4">
      <div class="bg-red-50 border border-red-200 rounded-xl p-4">
        <div class="flex items-start gap-3">
          <span class="text-lg">❌</span>
          <div class="flex-1">
            <p class="text-sm font-medium text-red-800 mb-1">エラーが発生しました</p>
            <p class="text-xs text-red-700 mb-3">{{ error }}</p>
            <button
              @click="clearError"
              class="text-xs font-medium text-red-700 bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Game Selector -->
    <GameSelector
      :available-games="availableGames"
      :selected-game="selectedGame"
      :show-back-button="true"
      @game-selected="handleSelectGame"
      @back-to-selection="handleBackToGameSelection"
    />

    <!-- Main App (after game selection) -->
    <template v-if="selectedGame">
      <!-- Stats Dashboard -->
      <StatsPanel
        :stats="zukanData.stats"
        :caught-count="caughtCount"
        :total-count="zukanData.stats?.total || 0"
        :progress-percent="progressPercent"
      />

      <!-- Filter Panel -->
      <FilterPanel
        :selected-game="selectedGame"
        :version-filters="zukanData.version_filters"
        v-model="filters"
        @reset-filters="resetFilters"
      />

      <!-- Pokemon List -->
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div class="flex items-center justify-between px-3 py-2 border-b bg-gray-50">
          <div>
            <span class="text-sm font-bold text-gray-800">📋 {{ filteredPokemon.length }}匹</span>
            <span v-if="filters.multipleDex === 'only'" class="text-[10px] text-blue-600 ml-1">
              （複数図鑑に登録）
            </span>
          </div>
          <button
            @click="showExportModal = true"
            class="text-[10px] text-gray-500 hover:text-emerald-600 transition-colors"
            title="進捗をエクスポート"
          >
            📤 エクスポート
          </button>
        </div>

        <div>
          <PokemonCard
            v-for="pokemon in filteredPokemon"
            :key="pokemon.name"
            :pokemon="pokemon"
            :is-caught="gameDataComposable.isCaughtInCurrentGame(pokemon.name)"
            :selected-game="selectedGame"
            :version-filters="zukanData.version_filters"
            @toggle-caught="handleToggleCaught"
          />
          <div v-if="filteredPokemon.length === 0" class="px-4 py-8 text-center text-gray-400">
            <div class="text-2xl mb-2">🔍</div>
            <div class="text-sm">該当するポケモンなし</div>
          </div>
        </div>
      </div>

      <!-- Duplicate Analysis (compact) -->
      <div class="mt-3 bg-white rounded-xl border border-gray-200 px-3 py-2">
        <div class="flex items-center gap-3 text-[11px] text-gray-600 flex-wrap">
          <span class="font-semibold text-gray-700">📊 分析</span>
          <span>🔄 複数図鑑 <strong class="text-blue-600">{{ zukanData.stats?.duplicates || 0 }}</strong></span>
          <span
            v-for="region in selectedGame.regions"
            :key="region.id"
          >
            {{ region.name }}専用 <strong class="text-green-600">{{ zukanData.stats?.regions?.[region.id]?.only || 0 }}</strong>
          </span>
        </div>
      </div>

      <!-- Export Modal -->
      <ExportPanel
        :game-data="zukanData"
        :game-info="selectedGame"
        :is-visible="showExportModal"
        @close="showExportModal = false"
      />
    </template>

    <!-- Footer -->
    <div class="mt-6 text-center text-gray-400 text-[10px]">
      データは自動保存されます
    </div>
  </div>
</template>

