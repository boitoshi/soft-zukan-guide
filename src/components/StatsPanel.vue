<script setup lang="ts">
import type { ZukanStats } from '@/types'

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

const getProgressBarClass = (): string => {
  if (props.progressPercent === 100) return 'bg-green-500'
  if (props.progressPercent >= 80) return 'bg-emerald-500'
  if (props.progressPercent >= 50) return 'bg-blue-500'
  return 'bg-blue-400'
}
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-200 p-3 mb-4">
    <!-- Progress -->
    <div class="flex items-center justify-between mb-1.5">
      <span class="text-xs font-semibold text-gray-600">図鑑完成度</span>
      <span
        class="text-lg font-bold"
        :class="progressPercent === 100 ? 'text-green-600' : 'text-blue-600'"
      >
        {{ progressPercent }}%
      </span>
    </div>
    <div class="w-full bg-gray-200 rounded-full h-2.5 mb-2">
      <div
        :class="getProgressBarClass()"
        class="h-2.5 rounded-full transition-all duration-500"
        :style="{ width: progressPercent + '%' }"
      ></div>
    </div>
    <div class="flex justify-between text-[11px] text-gray-500">
      <span>✅ {{ caughtCount }} / {{ totalCount }}</span>
      <span v-if="progressPercent < 100" class="text-orange-600 font-medium">
        残り {{ totalCount - caughtCount }}
      </span>
      <span v-else class="text-green-600 font-medium">
        🎉 完成！
      </span>
    </div>
    <div v-if="stats.duplicates && stats.duplicates > 0" class="mt-2 pt-2 border-t border-gray-100">
      <div class="text-[11px] text-gray-500 text-center">
        🔄 <strong>{{ stats.duplicates }}匹</strong>が複数図鑑に登録
      </div>
    </div>
  </div>
</template>
