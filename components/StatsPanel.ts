/**
 * StatsPanel Component (TypeScript版)
 * 統計ダッシュボードの表示を担当
 */
import type { ZukanStats } from '../types/index.js';
import type { PropType } from 'vue';

const StatsPanel = {
  name: 'StatsPanel',
  props: {
    stats: {
      type: Object as PropType<ZukanStats>,
      default: () => ({
        total: 0,
        duplicates: 0,
        regions: {}
      })
    },
    caughtCount: {
      type: Number,
      default: 0
    },
    totalCount: {
      type: Number,
      default: 0
    },
    progressPercent: {
      type: Number,
      default: 0
    }
  },
  setup(props: { 
    stats: ZukanStats; 
    caughtCount: number; 
    totalCount: number; 
    progressPercent: number; 
  }) {
    // 残り数の計算
    const remainingCount = (): number => {
      return props.totalCount - props.caughtCount;
    };

    return {
      remainingCount
    };
  },
  template: `
    <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <h2 class="text-2xl font-bold mb-6 flex items-center">
        <span class="text-2xl mr-2">📊</span>
        統計ダッシュボード
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
          <div class="text-3xl font-bold text-green-600 mb-1">{{ caughtCount }}</div>
          <div class="text-sm text-green-800">ゲット済み</div>
        </div>
        
        <div class="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl">
          <div class="text-3xl font-bold text-red-600 mb-1">{{ remainingCount() }}</div>
          <div class="text-sm text-red-800">残り</div>
        </div>
        
        <div class="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
          <div class="text-3xl font-bold text-blue-600 mb-1">{{ totalCount }}</div>
          <div class="text-sm text-blue-800">総ポケモン数</div>
        </div>
        
        <div class="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
          <div class="text-3xl font-bold text-purple-600 mb-1">{{ progressPercent }}%</div>
          <div class="text-sm text-purple-800">完成度</div>
        </div>
      </div>
      
      <!-- プログレスバー -->
      <div class="mb-4">
        <div class="flex justify-between text-sm text-gray-600 mb-1">
          <span>図鑑完成度</span>
          <span>{{ caughtCount }} / {{ totalCount }} ({{ progressPercent }}%)</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-3">
          <div class="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-300"
               :style="{ width: progressPercent + '%' }"></div>
        </div>
      </div>
      
      <div class="text-center text-sm text-gray-500">
        <span class="font-medium">{{ progressPercent >= 100 ? '🎉 図鑑コンプリート！' : '🎯 頑張って図鑑コンプリートを目指そう！' }}</span>
      </div>
    </div>
  `
};