<script setup lang="ts">
import { ref } from 'vue'

/**
 * PageNavigation Component
 * ハンバーガーメニュー対応版
 */
interface Props {
  currentPage: 'index' | 'overview'
}

const props = withDefaults(defineProps<Props>(), {
  currentPage: 'index'
})

const showMobileMenu = ref(false)

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

// モバイルメニュートグル
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg p-4 mb-6">
    <div class="flex justify-between items-center">
      <!-- デスクトップナビゲーション -->
      <div class="hidden md:flex space-x-4">
        <template v-for="item in navigationItems" :key="item.id">
          <!-- アクティブなページ -->
          <div 
            v-if="isActive(item.id)"
            class="bg-blue-600 text-white px-4 py-2 rounded-md font-medium text-sm border-2 border-blue-600"
          >
            {{ item.icon }} {{ item.label }}
          </div>
          
          <!-- 非アクティブなページ（リンク） -->
          <a 
            v-else
            :href="item.href" 
            class="border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200"
            :title="item.description"
          >
            {{ item.icon }} {{ item.label }}
          </a>
        </template>
      </div>

      <!-- モバイルナビゲーション -->
      <div class="md:hidden flex items-center">
        <div class="flex items-center mr-3">
          <span class="text-lg mr-2">{{ getActiveItem()?.icon }}</span>
          <span class="font-medium text-gray-900">{{ getActiveItem()?.label }}</span>
        </div>
        <button
          @click="toggleMobileMenu"
          class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <div class="w-5 h-5 flex flex-col justify-center items-center">
            <template v-if="!showMobileMenu">
              <div class="w-4 h-0.5 bg-current mb-1"></div>
              <div class="w-4 h-0.5 bg-current mb-1"></div>
              <div class="w-4 h-0.5 bg-current"></div>
            </template>
            <template v-else>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </template>
          </div>
        </button>
      </div>
      
      <!-- ブランド表示 -->
      <div class="hidden md:flex items-center space-x-2">
        <div class="text-sm text-gray-500 font-medium">
          🎯 ポケモン図鑑マスター
        </div>
        <div class="hidden sm:block text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
          v3.0
        </div>
      </div>
    </div>

    <!-- モバイルドロップダウンメニュー -->
    <Transition name="slide-down">
      <div v-if="showMobileMenu" class="md:hidden mt-4 pt-4 border-t border-gray-200">
        <template v-for="item in getInactiveItems()" :key="item.id">
          <a 
            :href="item.href"
            @click="showMobileMenu = false" 
            class="flex items-center w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <span class="mr-3 text-lg">{{ item.icon }}</span>
            <div>
              <div class="font-medium">{{ item.label }}</div>
              <div class="text-xs text-gray-500">{{ item.description }}</div>
            </div>
          </a>
        </template>
      </div>
    </Transition>
    
    <!-- 現在のページ説明（デスクトップのみ） -->
    <div v-if="getActiveItem()" class="hidden md:block mt-2 pt-2 border-t border-gray-100">
      <p class="text-xs text-gray-500 text-center">
        {{ getActiveItem()?.description }}
      </p>
    </div>
  </div>
</template>

<style scoped>
/* モダンフラットデザイン */
.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.2s ease;
}
.slide-down-enter-from, .slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>