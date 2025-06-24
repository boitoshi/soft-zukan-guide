<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import PageNavigation from './components/PageNavigation.vue'

// リアクティブデータ
const zukanData = ref<any>({ stats: {}, pokemon: [] })
const availableGames = ref<any[]>([])
const selectedGame = ref<any>(null)
const loading = ref(true)
const loadError = ref('')
const activeTab = ref('paldea')
const searchTerm = ref('')
const showScrollToTop = ref(false)

// 計算プロパティ
const isDataLoaded = computed(() => !loading.value && selectedGame.value && zukanData.value.pokemon.length > 0)

const filteredPokemon = computed(() => {
  if (!zukanData.value?.pokemon) return []
  
  let filtered = zukanData.value.pokemon
  
  // 検索フィルター
  if (searchTerm.value) {
    filtered = filtered.filter((pokemon: any) => 
      pokemon.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  }
  
  // タブフィルター（地域別）
  if (activeTab.value !== 'all') {
    filtered = filtered.filter((pokemon: any) => 
      pokemon.regions.includes(activeTab.value)
    )
  }
  
  return filtered
})

const regionTabs = computed(() => {
  if (!selectedGame.value?.regions) return []
  
  const tabs = [
    { id: 'all', name: '全て', icon: '🌍' }
  ]
  
  selectedGame.value.regions.forEach((region: any) => {
    tabs.push({
      id: region.id,
      name: region.name,
      icon: getRegionIcon(region.id)
    })
  })
  
  return tabs
})

// メソッド
const loadAvailableGames = async () => {
  try {
    const response = await fetch('/zukan-config.json')
    if (!response.ok) throw new Error('設定データの読み込みに失敗しました')
    
    const config = await response.json()
    availableGames.value = config.games || []
    
    if (availableGames.value.length > 0) {
      selectGame(availableGames.value[0].id)
    }
  } catch (error) {
    console.error('ゲーム設定の読み込みエラー:', error)
    loadError.value = 'ゲーム設定の読み込みに失敗しました'
    loading.value = false
  }
}

const selectGame = async (gameId: string) => {
  try {
    loading.value = true
    loadError.value = ''
    
    const game = availableGames.value.find(g => g.id === gameId)
    if (!game) throw new Error('ゲームが見つかりません')
    
    selectedGame.value = game
    
    const response = await fetch(game.dataFile)
    if (!response.ok) throw new Error('図鑑データの読み込みに失敗しました')
    
    zukanData.value = await response.json()
    
    // 最初のタブを設定
    if (game.regions && game.regions.length > 0) {
      activeTab.value = game.regions[0].id
    }
    
  } catch (error) {
    console.error('ゲームデータ読み込みエラー:', error)
    loadError.value = 'ゲームデータの読み込みに失敗しました'
  } finally {
    loading.value = false
  }
}

const getRegionIcon = (regionId: string): string => {
  const iconMap: Record<string, string> = {
    paldea: '🏔️',
    kitakami: '🍂', 
    blueberry: '🫐',
    galar: '⚔️',
    crown_tundra: '❄️',
    isle_of_armor: '🏝️'
  }
  return iconMap[regionId] || '📍'
}

const getGameIcon = (gameId: string): string => {
  const iconMap: Record<string, string> = {
    test: '🧪',
    paldea: '🏔️',
    galar: '⚔️'
  }
  return iconMap[gameId] || '🎮'
}

const getPokemonVersionBadges = (pokemon: any): string[] => {
  const badges: string[] = []
  
  if (pokemon.version_info?.scarlet_violet) {
    const sv = pokemon.version_info.scarlet_violet
    if (sv.availability === 'scarlet') badges.push('S')
    else if (sv.availability === 'violet') badges.push('V')
    else if (sv.availability === 'both') badges.push('SV')
  }
  
  if (pokemon.version_info?.sword_shield) {
    const ss = pokemon.version_info.sword_shield
    if (ss.availability === 'sword') badges.push('剣')
    else if (ss.availability === 'shield') badges.push('盾')
    else if (ss.availability === 'both') badges.push('剣盾')
  }
  
  return badges
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleScroll = () => {
  showScrollToTop.value = window.scrollY > 300
}

// ライフサイクル
onMounted(() => {
  loadAvailableGames()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen">
    <div class="container mx-auto px-4 py-6">
      <!-- ナビゲーションヘッダー -->
      <PageNavigation current-page="overview" />

      <!-- ヘッダー -->
      <div class="text-center mb-6">
        <h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
          📋 ポケモン図鑑一覧
        </h1>
        <p class="text-lg text-gray-600">全図鑑タブ表示 - 備考欄で重複確認</p>
      </div>

      <!-- ゲーム選択セクション -->
      <Transition name="slide-down">
        <div v-if="!selectedGame && !loading" class="mb-8">
          <h2 class="text-2xl font-bold text-center mb-6 text-gray-800">
            🎯 図鑑を選択してください
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div 
              v-for="game in availableGames" 
              :key="game.id"
              @click="selectGame(game.id)"
              class="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border-2 border-transparent hover:border-purple-200"
            >
              <div class="text-center">
                <div class="text-4xl mb-3">{{ getGameIcon(game.id) }}</div>
                <h3 class="text-lg font-bold text-gray-800 mb-2">{{ game.displayName }}</h3>
                <p class="text-sm text-gray-600 mb-3">{{ game.game }}</p>
                
                <div v-if="game.stats" class="text-xs text-gray-500">
                  <div>総ポケモン数: {{ game.stats.total }}匹</div>
                  <div v-if="game.stats.duplicates">重複: {{ game.stats.duplicates }}匹</div>
                </div>
                
                <div class="mt-4">
                  <span class="text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                    クリックして選択
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- ローディング表示 -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mb-4"></div>
        <p class="text-gray-600">データを読み込み中...</p>
      </div>

      <!-- エラー表示 -->
      <div v-if="loadError" class="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
        <div class="flex items-center">
          <span class="text-2xl mr-3">⚠️</span>
          <div>
            <h3 class="text-lg font-bold text-red-800">エラーが発生しました</h3>
            <p class="text-red-600">{{ loadError }}</p>
          </div>
        </div>
      </div>

      <!-- メインコンテンツ -->
      <div v-if="isDataLoaded">
        <!-- ゲーム情報 -->
        <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <span class="text-3xl mr-3">{{ getGameIcon(selectedGame.id) }}</span>
              <div>
                <h2 class="text-xl font-bold text-gray-800">{{ selectedGame.displayName }}</h2>
                <p class="text-gray-600">{{ selectedGame.game }}</p>
              </div>
            </div>
            <button 
              @click="selectedGame = null; loading = false"
              class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              🔄 ゲーム変更
            </button>
          </div>
        </div>

        <!-- 検索とタブ -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <!-- 検索バー -->
          <div class="p-6 border-b bg-gradient-to-r from-purple-50 to-blue-50">
            <div class="flex items-center space-x-4">
              <div class="flex-1">
                <input
                  v-model="searchTerm"
                  type="text"
                  placeholder="ポケモン名で検索..."
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div class="text-sm text-gray-600">
                {{ filteredPokemon.length }}匹
              </div>
            </div>
          </div>

          <!-- タブナビゲーション -->
          <div class="border-b border-gray-200 overflow-x-auto">
            <nav class="flex space-x-0 min-w-max">
              <button
                v-for="tab in regionTabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'tab-button px-6 py-4 text-sm font-medium border-b-2 transition-all duration-300',
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600 bg-purple-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                ]"
              >
                {{ tab.icon }} {{ tab.name }}
              </button>
            </nav>
          </div>

          <!-- ポケモンテーブル -->
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ポケモン名</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">登録図鑑</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">バージョン</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">備考</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr 
                  v-for="pokemon in filteredPokemon" 
                  :key="pokemon.id"
                  class="pokemon-row hover:bg-gray-50 transition-colors duration-200"
                >
                  <td class="px-4 py-3 text-sm text-gray-900">{{ pokemon.id }}</td>
                  <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ pokemon.name }}</td>
                  <td class="px-4 py-3 text-sm">
                    <div class="flex flex-wrap gap-1">
                      <span
                        v-for="region in pokemon.regions"
                        :key="region"
                        class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                      >
                        {{ getRegionIcon(region) }}
                      </span>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-sm">
                    <div class="flex flex-wrap gap-1">
                      <span
                        v-for="badge in getPokemonVersionBadges(pokemon)"
                        :key="badge"
                        class="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-medium"
                      >
                        {{ badge }}
                      </span>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-600">
                    <span v-if="pokemon.regions.length > 1" class="text-orange-600 font-medium">
                      🔄 重複（{{ pokemon.regions.length }}図鑑）
                    </span>
                    <span v-else class="text-green-600">
                      ⭐ {{ pokemon.regions[0] }}専用
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- トップへ戻るボタン -->
      <button 
        @click="scrollToTop" 
        :class="['scroll-to-top', { visible: showScrollToTop }]"
        aria-label="トップへ戻る"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m18 15-6-6-6 6"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* アニメーション */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.3s ease;
}
.slide-down-enter-from, .slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* トップへ戻るボタン */
.scroll-to-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 50;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
  transform: translateY(100px);
  opacity: 0;
}

.scroll-to-top.visible {
  transform: translateY(0);
  opacity: 1;
}

.scroll-to-top:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.6);
}

/* タブスタイル */
.tab-button {
  transition: all 0.3s ease;
}
</style>