<script setup lang="ts">
interface NavigationPage {
  id: string;
  url: string;
  label: string;
  description: string;
}

interface Props {
  currentPage?: string;
}

const props = withDefaults(defineProps<Props>(), {
  currentPage: 'index'
});

// ページ設定
const pages: NavigationPage[] = [
  {
    id: 'overview',
    url: 'zukan-overview.html',
    label: '📋 図鑑一覧表示',
    description: '全図鑑をタブで表示'
  },
  {
    id: 'index', 
    url: 'index.html',
    label: '🎮 詳細フィルター',
    description: 'バージョン限定・進捗管理'
  }
];

// 現在のページかどうか判定
const isCurrentPage = (pageId: string): boolean => {
  return props.currentPage === pageId;
};

// ページのスタイルクラス取得
const getPageClass = (pageId: string): string => {
  return isCurrentPage(pageId) 
    ? 'bg-purple-600 text-white px-4 py-2 rounded-lg font-bold text-sm'
    : 'bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-bold text-sm transition-colors';
};
</script>

<template>
  <nav class="bg-white rounded-2xl shadow-lg p-6 mb-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
      <div class="mb-4 md:mb-0">
        <h2 class="text-xl font-bold text-gray-800 mb-2">
          🧭 ナビゲーション
        </h2>
        <p class="text-gray-600 text-sm">
          用途に応じてページを切り替えてください
        </p>
      </div>
      
      <div class="flex flex-wrap gap-3">
        <a 
          v-for="page in pages" 
          :key="page.id"
          :href="page.url"
          :class="getPageClass(page.id)"
          :title="page.description"
        >
          {{ page.label }}
        </a>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* ナビゲーション固有のスタイルがあれば追加 */
</style>
