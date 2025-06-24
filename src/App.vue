<script setup lang="ts">
import { onMounted, ref } from 'vue'
import PageNavigation from './components/PageNavigation.vue'
import GameSelector from './components/GameSelector.vue'
import StatsPanel from './components/StatsPanel.vue'
import FilterPanel from './components/FilterPanel.vue'
import PokemonCard from './components/PokemonCard.vue'
import ExportPanel from './components/ExportPanel.vue'
import { useGameData } from './composables/useGameData.js'
import { useLocalStorage } from './composables/useLocalStorage.js'
import { usePokemonFilter } from './composables/usePokemonFilter.js'
import { installPWA, isPWA } from './utils/pwa.js'
import type { GameConfig } from './index.js'

// Composables
const gameDataComposable = useGameData()
const localStorageComposable = useLocalStorage()

// Reactive refs for template access
const zukanData = gameDataComposable.zukanData
const availableGames = gameDataComposable.availableGames  
const selectedGame = gameDataComposable.selectedGame
const error = gameDataComposable.error
const isLoading = gameDataComposable.isLoading
const caughtCount = gameDataComposable.caughtCount
const progressPercent = gameDataComposable.progressPercent
const uniquePokemonCount = gameDataComposable.uniquePokemonCount

// Initialize pokemon filter after game data is available
const pokemonFilterComposable = usePokemonFilter(zukanData, selectedGame)
const filters = pokemonFilterComposable.filters
const filteredPokemon = pokemonFilterComposable.filteredPokemon

// Methods
const handleSelectGame = async (gameId: string) => {
  await gameDataComposable.selectGame(gameId, localStorageComposable)
}

const handleBackToGameSelection = () => {
  gameDataComposable.backToGameSelection(localStorageComposable)
}

const handleToggleCaught = (pokemonId: string) => {
  gameDataComposable.toggleCaught(pokemonId, localStorageComposable)
}

const resetFilters = () => {
  pokemonFilterComposable.resetFilters()
}

const clearError = () => {
  gameDataComposable.clearError()
}

// Export modal state
const showExportModal = ref(false)

const openExportModal = () => {
  showExportModal.value = true
}

const closeExportModal = () => {
  showExportModal.value = false
}

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
  
  // Restore previously selected game with type safety
  const savedGame = localStorageComposable.loadSelectedGame()
  if (savedGame) {
    const gameExists = gameDataComposable.availableGames.value.find((g: GameConfig) => g.id === savedGame)
    if (gameExists) {
      await handleSelectGame(savedGame)
    }
  }
})
</script>

<template>
  <div class="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen">
    <div class="container mx-auto px-4 py-8">
      <!-- Navigation Header -->
      <PageNavigation current-page="index" />

      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
          🎮 ポケモン図鑑マスター
        </h1>
        <p class="text-xl text-gray-600 mb-2">全ソフト対応版 - Ultimate Edition</p>        <div v-if="selectedGame" class="flex justify-center gap-4 text-sm text-gray-500">
          <span>{{ selectedGame.game }}: {{ zukanData.stats?.total || 0 }}匹</span>
          <span>•</span>
          <span>重複なし: {{ uniquePokemonCount }}匹</span>
        </div>
      </div>

      <!-- PWA Install Button -->
      <div v-if="showPWAInstall" class="text-center mb-6">
        <button
          id="pwa-install-button"
          @click="handlePWAInstall"
          class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium rounded-lg hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all"
        >
          <span class="text-lg">📱</span>
          アプリをインストール
        </button>
      </div>

      <!-- Loading Indicator -->
      <div v-if="isLoading" class="text-center mb-8">
        <div class="inline-flex items-center gap-3 bg-white rounded-2xl shadow-lg px-6 py-4">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
          <span class="text-lg font-medium text-gray-700">データを読み込み中...</span>
        </div>
      </div>

      <!-- Error Display -->
      <div v-if="error" class="mb-8">
        <div class="bg-red-50 border border-red-200 rounded-2xl p-6">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <span class="text-2xl">❌</span>
            </div>
            <div class="ml-3 flex-1">
              <h3 class="text-lg font-medium text-red-800 mb-2">エラーが発生しました</h3>
              <p class="text-red-700 mb-4">{{ error }}</p>
              <button 
                @click="clearError"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                エラーを閉じる
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
      <div v-if="selectedGame">
        <!-- Stats Dashboard -->
        <StatsPanel 
          :stats="zukanData.stats" 
          :caught-count="caughtCount"
          :total-count="zukanData.stats?.total || 0"
          :progress-percent="progressPercent" 
        />

        <!-- Export Button -->
        <div class="text-center mb-6">
          <button
            @click="openExportModal"
            class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all transform hover:scale-105"
          >
            <span class="text-xl">📤</span>
            進捗をエクスポート
          </button>
        </div>

        <!-- Filter Panel -->
        <FilterPanel 
          :selected-game="selectedGame"
          :version-filters="zukanData.version_filters"
          v-model="filters"
          @reset-filters="resetFilters"
        />

        <!-- Statistics Summary -->
        <Transition name="slide-down">          <div v-if="filteredPokemon.length > 0" 
               class="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-4 mb-6">
            <div class="text-center">
              <span class="text-lg font-semibold text-purple-800">
                {{ filteredPokemon.length }}匹のポケモンが見つかりました
              </span>
              <span v-if="filters.region === 'duplicates'" 
                    class="text-sm text-purple-600 ml-2">
                (複数の図鑑に登録されているポケモン)
              </span>
            </div>
          </div>
        </Transition>

        <!-- Pokemon List -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="p-6 border-b bg-gradient-to-r from-purple-50 to-blue-50">
            <h2 class="text-2xl font-bold flex items-center">
              <span class="text-2xl mr-2">📋</span>
              ポケモンリスト
            </h2>
            <p class="text-gray-600 mt-1">ポケモンをクリックしてゲット状況を更新 ⚡</p>
          </div>
          
          <div class="max-h-96 overflow-y-auto custom-scrollbar">            <TransitionGroup name="fade" tag="div">
              <PokemonCard 
                v-for="pokemon in filteredPokemon" 
                :key="pokemon.id"
                :pokemon="pokemon"
                :selected-game="selectedGame"
                @toggle-caught="handleToggleCaught"
              />
            </TransitionGroup>
          </div>
        </div>

        <!-- Duplicate Analysis Section -->
        <div class="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h2 class="text-2xl font-bold mb-6 flex items-center">
            <span class="text-2xl mr-2">📊</span>
            図鑑分析レポート
          </h2>          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <div class="text-3xl font-bold text-blue-600 mb-2">
                {{ zukanData.stats?.duplicates || 0 }}
              </div>
              <div class="text-sm text-blue-800">🔄 重複ポケモン</div>
              <div class="text-xs text-blue-600 mt-1">複数図鑑に登録</div>
            </div>
            <div v-for="region in selectedGame.regions" 
                 :key="region.id"
                 class="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <div class="text-3xl font-bold text-green-600 mb-2">
                {{ zukanData.stats?.regions?.[region.id]?.only || 0 }}
              </div>
              <div class="text-sm text-green-800">{{ region.name }}専用</div>
              <div class="text-xs text-green-600 mt-1">
                合計: {{ zukanData.stats?.regions?.[region.id]?.total || 0 }}匹
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-8 text-center text-gray-500 text-sm">
        <p>🎮 ポケモン図鑑マスター v3.0 Ultimate | ✨ Vue.js 3 + TypeScript で作成</p>
        <p class="mt-1">データは自動保存されます 💾 | 全ソフト対応版</p>
      </div>

      <!-- Export Modal -->
      <ExportPanel 
        v-if="selectedGame"
        :game-data="zukanData"
        :game-info="selectedGame"
        :is-visible="showExportModal"
        @close="closeExportModal"
      />
    </div>
  </div>
</template>

<style scoped>
/* Custom animations */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.3s ease;
}
.slide-down-enter-from, .slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Custom scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
