/**
 * AppNavigation Component (TypeScript版)
 * ページ間のナビゲーションを担当
 */

interface NavigationPage {
  id: string;
  url: string;
  label: string;
  description: string;
}

const AppNavigation = {
  name: 'AppNavigation',
  props: {
    currentPage: {
      type: String,
      default: 'index'
    }
  },
  setup(props: { currentPage: string }) {
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

    return {
      pages,
      isCurrentPage,
      getPageClass
    };
  },
  template: `
    <div class="bg-white rounded-2xl shadow-lg p-4 mb-6">
      <div class="flex justify-between items-center">
        <div class="flex space-x-4">
          <a v-for="page in pages" 
             :key="page.id"
             :href="page.url" 
             :class="getPageClass(page.id)"
             :title="page.description">
            {{ page.label }}
          </a>
        </div>
        <div class="text-sm text-gray-500">
          🎯 ポケモン図鑑マスター
        </div>
      </div>
    </div>
  `
};