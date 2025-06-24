/**
 * StatsPanel Component  
 * 統計ダッシュボードの表示を担当
 */
const StatsPanel = {
  name: 'StatsPanel',
  props: {
    stats: {
      type: Object,
      default: () => ({})
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
  setup(props) {
    const { computed } = Vue;

    // 残りのポケモン数を計算
    const remainingCount = computed(() => {
      return props.totalCount - props.caughtCount;
    });

    // 統計項目の定義
    const statItems = computed(() => [
      {
        value: props.stats.total || props.totalCount || 0,
        label: '総ポケモン数',
        color: 'purple',
        colorClass: 'text-purple-600'
      },
      {
        value: props.caughtCount,
        label: 'ゲット済み',
        color: 'green', 
        colorClass: 'text-green-600'
      },
      {
        value: remainingCount.value,
        label: '未ゲット',
        color: 'red',
        colorClass: 'text-red-600'
      },
      {
        value: props.progressPercent + '%',
        label: '完成度',
        color: 'blue',
        colorClass: 'text-blue-600',
        showProgress: true
      }
    ]);

    return {
      remainingCount,
      statItems
    };
  },
  template: `
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div v-for="item in statItems" 
           :key="item.label"
           class="bg-white rounded-2xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform">
        <div class="text-3xl font-bold mb-2" :class="item.colorClass">
          {{ item.value }}
        </div>
        <div class="text-sm text-gray-500">{{ item.label }}</div>
        
        <!-- プログレスバー（完成度の場合のみ表示） -->
        <div v-if="item.showProgress" class="mt-2 bg-gray-200 rounded-full h-2">
          <div class="bg-blue-600 h-2 rounded-full transition-all duration-500" 
               :style="{width: progressPercent + '%'}"></div>
        </div>
      </div>
    </div>
  `
};