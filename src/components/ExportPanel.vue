<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { useExport } from '../composables/useExport.js'
import type { ZukanData, GameConfig } from '../index.js'

// Props
interface Props {
  gameData: ZukanData
  gameInfo: GameConfig
  isVisible: boolean
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  close: []
}>()

// Composables
const { exportProgress } = useExport()

// Methods
const handleExport = (format: 'json' | 'csv' | 'summary-csv') => {
  exportProgress(format, props.gameData, props.gameInfo)
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <!-- Modal Overlay -->
  <div 
    v-if="isVisible"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click="handleClose"
  >
    <!-- Modal Content -->
    <div 
      class="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6"
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900 flex items-center">
          <span class="text-2xl mr-2">📤</span>
          進捗エクスポート
        </h2>
        <button 
          @click="handleClose"
          class="text-gray-400 hover:text-gray-600 text-2xl leading-none"
        >
          ×
        </button>
      </div>

      <!-- Game Info -->
      <div class="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 mb-6">
        <h3 class="font-semibold text-gray-800 mb-2">{{ gameInfo.name }}</h3>
        <div class="text-sm text-gray-600 space-y-1">
          <div>総ポケモン数: {{ gameData.stats.total }}匹</div>
          <div>ゲット済み: {{ gameData.pokemon.filter(p => p.caught).length }}匹</div>
          <div>完成率: {{ Math.round((gameData.pokemon.filter(p => p.caught).length / gameData.stats.total) * 100) }}%</div>
        </div>
      </div>

      <!-- Export Options -->
      <div class="space-y-3">
        <h3 class="font-semibold text-gray-800 mb-3">エクスポート形式を選択:</h3>
        
        <!-- JSON Export -->
        <button
          @click="handleExport('json')"
          class="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group"
        >
          <div class="flex items-center">
            <span class="text-2xl mr-3">📄</span>
            <div class="text-left">
              <div class="font-medium text-gray-900">JSON形式</div>
              <div class="text-sm text-gray-500">プログラム用・詳細データ</div>
            </div>
          </div>
          <span class="text-gray-400 group-hover:text-gray-600">→</span>
        </button>

        <!-- CSV Export -->
        <button
          @click="handleExport('csv')"
          class="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group"
        >
          <div class="flex items-center">
            <span class="text-2xl mr-3">📊</span>
            <div class="text-left">
              <div class="font-medium text-gray-900">CSV形式（詳細）</div>
              <div class="text-sm text-gray-500">Excel用・全ポケモンデータ</div>
            </div>
          </div>
          <span class="text-gray-400 group-hover:text-gray-600">→</span>
        </button>

        <!-- Summary CSV Export -->
        <button
          @click="handleExport('summary-csv')"
          class="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group"
        >
          <div class="flex items-center">
            <span class="text-2xl mr-3">📈</span>
            <div class="text-left">
              <div class="font-medium text-gray-900">CSV形式（サマリー）</div>
              <div class="text-sm text-gray-500">統計情報のみ・コンパクト</div>
            </div>
          </div>
          <span class="text-gray-400 group-hover:text-gray-600">→</span>
        </button>
      </div>

      <!-- Footer -->
      <div class="mt-6 pt-4 border-t border-gray-200">
        <div class="text-xs text-gray-500 text-center">
          ファイルはブラウザのダウンロードフォルダに保存されます
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Modal transition styles could be added here */
</style>