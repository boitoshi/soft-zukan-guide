<script setup lang="ts">
/**
 * PageNavigation Component
 * zukan-overview.htmlのナビゲーションデザインを採用した改良版
 */
interface Props {
  currentPage: 'index' | 'overview'
}

const props = withDefaults(defineProps<Props>(), {
  currentPage: 'index'
})

// ナビゲーションアイテムの定義
const navigationItems = [
  {
    id: 'overview',
    href: 'overview.html',
    icon: '📋',
    label: '図鑑一覧表示',
    description: 'タブ表示で全図鑑を確認'
  },
  {
    id: 'index',
    href: 'index.html',
    icon: '🎮',
    label: '詳細フィルター',
    description: '高機能な図鑑管理'
  }
]

// アクティブ状態の判定
const isActive = (itemId: string): boolean => {
  return props.currentPage === itemId
}

// アクティブアイテムの取得
const getActiveItem = () => {
  return navigationItems.find(item => isActive(item.id))
}

// 非アクティブアイテムの取得
const getInactiveItems = () => {
  return navigationItems.filter(item => !isActive(item.id))
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-lg p-4 mb-6">
    <div class="flex justify-between items-center">
      <!-- ナビゲーションボタン -->
      <div class="flex space-x-4">
        <!-- アクティブなページ -->
        <div 
          v-if="getActiveItem()"
          class="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md"
        >
          {{ getActiveItem()?.icon }} {{ getActiveItem()?.label }}
        </div>
        
        <!-- 非アクティブなページ（リンク） -->
        <a 
          v-for="item in getInactiveItems()" 
          :key="item.id"
          :href="item.href" 
          class="bg-gray-200 hover:bg-gradient-to-r hover:from-gray-300 hover:to-gray-400 text-gray-700 hover:text-gray-800 px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5"
          :title="item.description"
        >
          {{ item.icon }} {{ item.label }}
        </a>
      </div>
      
      <!-- ブランド表示 -->
      <div class="flex items-center space-x-2">
        <div class="text-sm text-gray-500 font-medium">
          🎯 ポケモン図鑑マスター
        </div>
        <div class="hidden sm:block text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
          v3.0
        </div>
      </div>
    </div>
    
    <!-- 現在のページ説明（小さく表示） -->
    <div v-if="getActiveItem()" class="mt-2 pt-2 border-t border-gray-100">
      <p class="text-xs text-gray-500 text-center">
        {{ getActiveItem()?.description }}
      </p>
    </div>
  </div>
</template>

<style scoped>
/* ホバーアニメーション強化 */
a {
  position: relative;
  overflow: hidden;
}

a:before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s;
}

a:hover:before {
  left: 100%;
}
</style>