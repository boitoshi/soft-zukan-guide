<script setup lang="ts">
import type { GameConfig } from '../index.js'

interface Props {
  availableGames?: GameConfig[]
  selectedGame?: GameConfig | null
  showBackButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  availableGames: () => [],
  selectedGame: null,
  showBackButton: false
})

const emit = defineEmits<{
  'game-selected': [gameId: string]
  'back-to-selection': []
}>()

// ゲーム選択処理
const selectGame = (gameId: string): void => {
  emit('game-selected', gameId)
}

// ゲーム選択画面に戻る
const backToGameSelection = (): void => {
  emit('back-to-selection')
}

// ゲームアイコン取得
const getGameIcon = (gameId: string): string => {
  const iconMap: Record<string, string> = {
    test: '🧪',
    paldea: '🏔️',
    galar: '⚔️',
    alola: '🌺',
    kalos: '🗼',
    unova: '🌉',
    sinnoh: '⛰️',
    hoenn: '🌊',
    johto: '🌸',
    kanto: '⚡'
  }
  return iconMap[gameId] || '🎮'
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
    <!-- ゲーム選択後のヘッダー -->
    <div v-if="selectedGame" class="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <span class="text-3xl mr-3">{{ getGameIcon(selectedGame.id) }}</span>
          <div>
            <h2 class="text-2xl font-bold text-gray-800">{{ selectedGame.displayName }}</h2>
            <p class="text-gray-600">{{ selectedGame.stats?.total || 0 }}匹のポケモンが登録されています</p>
          </div>
        </div>
        <button
          v-if="showBackButton"
          @click="backToGameSelection"
          class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-bold transition-colors"
        >
          ← ゲーム選択に戻る
        </button>
      </div>
    </div>

    <!-- ゲーム選択画面 -->
    <div v-else class="p-6">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-800 mb-4">🎮 ゲーム選択</h2>
        <p class="text-gray-600">プレイしているポケモンソフトを選択してください</p>
      </div>

      <!-- 利用可能なゲーム一覧 -->
      <div v-if="availableGames.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          v-for="game in availableGames"
          :key="game.id"
          @click="selectGame(game.id)"
          class="game-card bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border-2 border-gray-200 hover:border-blue-300 rounded-xl p-6 text-center transition-all duration-200 hover:shadow-lg"
        >
          <div class="text-4xl mb-3">{{ getGameIcon(game.id) }}</div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">{{ game.displayName }}</h3>
          <div class="text-sm text-gray-600">
            <p>{{ game.stats?.total || 0 }}匹</p>
            <p v-if="game.stats?.duplicates" class="text-xs mt-1">
              重複: {{ game.stats.duplicates }}匹
            </p>
          </div>
        </button>
      </div>

      <!-- データがない場合 -->
      <div v-else class="text-center py-12">
        <div class="text-6xl mb-4">😅</div>
        <h3 class="text-xl font-bold text-gray-600 mb-2">ゲームデータがありません</h3>
        <p class="text-sm text-gray-500 mt-2">データファイルを確認してください</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-card:hover {
  transform: translateY(-2px);
}
</style>
