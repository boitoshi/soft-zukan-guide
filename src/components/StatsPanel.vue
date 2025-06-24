<script setup lang="ts">
import type { ZukanStats } from '../index.js'

interface Props {
  stats?: ZukanStats
  caughtCount?: number
  totalCount?: number
  progressPercent?: number
}

const props = withDefaults(defineProps<Props>(), {
  stats: () => ({
    total: 0,
    duplicates: 0,
    regions: {}
  }),
  caughtCount: 0,
  totalCount: 0,
  progressPercent: 0
})

// 残り数の計算
const remainingCount = (): number => {
  return props.totalCount - props.caughtCount
}

// 進捗バーの色を決定
const getProgressColor = (): string => {
  if (props.progressPercent >= 80) return 'bg-green-500'
  if (props.progressPercent >= 50) return 'bg-yellow-500'
  return 'bg-blue-500'
}

// 進捗メッセージ
const getProgressMessage = (): string => {
  if (props.progressPercent === 100) return '🎉 図鑑完成！おめでとうございます！'
  if (props.progressPercent >= 80) return '🔥 もう少しで完成です！'
  if (props.progressPercent >= 50) return '💪 順調に進んでいます！'
  if (props.progressPercent >= 20) return '🌱 いいスタートです！'
  return '🚀 図鑑埋め頑張りましょう！'
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
    <div class="flex items-center mb-6">
      <span class="text-3xl mr-3">📊</span>
      <div>
        <h2 class="text-2xl font-bold text-gray-800">進捗ダッシュボード</h2>
        <p class="text-gray-600">あなたの図鑑コンプリート状況</p>
      </div>
    </div>

    <!-- 基本統計 -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
        <div class="text-2xl font-bold text-blue-600 mb-1">{{ caughtCount }}</div>
        <div class="text-sm text-blue-800">✅ ゲット済み</div>
      </div>
      <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 text-center">
        <div class="text-2xl font-bold text-gray-600 mb-1">{{ remainingCount() }}</div>
        <div class="text-sm text-gray-800">📋 残り</div>
      </div>
      <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
        <div class="text-2xl font-bold text-purple-600 mb-1">{{ totalCount }}</div>
        <div class="text-sm text-purple-800">🎯 全体</div>
      </div>
      <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
        <div class="text-2xl font-bold text-green-600 mb-1">{{ progressPercent }}%</div>
        <div class="text-sm text-green-800">📈 達成率</div>
      </div>
    </div>

    <!-- 進捗バー -->
    <div class="mb-6">
      <div class="flex justify-between items-center mb-2">
        <span class="text-sm font-medium text-gray-700">図鑑完成度</span>
        <span class="text-sm text-gray-500">{{ caughtCount }} / {{ totalCount }}</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div 
          :class="getProgressColor()"
          class="h-3 rounded-full transition-all duration-300 ease-out"
          :style="{ width: progressPercent + '%' }"
        ></div>
      </div>
      <div class="text-center mt-3">
        <span class="text-sm font-medium text-gray-600">{{ getProgressMessage() }}</span>
      </div>
    </div>

    <!-- 重複統計（存在する場合） -->
    <div v-if="stats.duplicates && stats.duplicates > 0" class="border-t pt-4">
      <div class="text-center">
        <div class="inline-flex items-center bg-orange-50 rounded-lg px-4 py-2">
          <span class="text-orange-600 font-bold mr-2">🔄 {{ stats.duplicates }}匹</span>
          <span class="text-sm text-orange-800">が複数の図鑑に登録されています</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 進捗バーのアニメーション */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>
