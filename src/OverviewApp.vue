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
  
  // 検索フィルター（完全一致優先、前方一致、部分一致の順）
  if (searchTerm.value) {
    const searchLower = searchTerm.value.toLowerCase().trim()
    filtered = filtered.filter((pokemon: any) => {
      const pokemonName = pokemon.name.toLowerCase()
      // 完全一致、前方一致、または3文字以上の場合のみ部分一致
      return pokemonName === searchLower || 
             pokemonName.startsWith(searchLower) ||
             (searchLower.length >= 3 && pokemonName.includes(searchLower))
    })
  }
  
  // タブフィルター（地域別）
  filtered = filtered.filter((pokemon: any) => 
    pokemon.regions.includes(activeTab.value)
  )
  
  // 選択された図鑑のNo順でソート
  filtered.sort((a: any, b: any) => {
    const aNum = parseInt(a.pokedex_numbers?.[activeTab.value] || '999999')
    const bNum = parseInt(b.pokedex_numbers?.[activeTab.value] || '999999')
    return aNum - bNum
  })
  
  return filtered
})

const regionTabs = computed(() => {
  if (!selectedGame.value?.regions) return []
  
  const tabs: any[] = []
  
  selectedGame.value.regions.forEach((region: any) => {
    tabs.push({
      id: region.id,
      name: region.name,
      icon: getRegionIcon(region.id)
    })
  })
  
  return tabs
})

// 選択された図鑑での番号を取得
const getPokemonNumber = (pokemon: any): string => {
  // 特定図鑑の場合はその図鑑の番号（そのポケモンがその図鑑にいる場合のみ）
  if (pokemon.regions.includes(activeTab.value) && pokemon.pokedex_numbers?.[activeTab.value]) {
    return pokemon.pokedex_numbers[activeTab.value]
  }
  // フォールバック: そのポケモンが選択された図鑑にいない場合は最初の地域の番号
  const firstRegion = pokemon.regions[0]
  return pokemon.pokedex_numbers?.[firstRegion] || pokemon.id
}

// メソッド
const loadAvailableGames = async () => {
  try {
    const response = await fetch('/zukan-config.json')
    if (!response.ok) throw new Error('設定データの読み込みに失敗しました')
    
    const config = await response.json()
    availableGames.value = config.games || []
    
    // 図鑑選択画面を表示（自動選択しない）
    loading.value = false
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

const getPokemonVersionBadges = (pokemon: any): { text: string, color: string }[] => {
  const badges: { text: string, color: string }[] = []
  
  if (pokemon.version_info?.scarlet_violet) {
    const sv = pokemon.version_info.scarlet_violet
    if (sv.availability === 'scarlet') {
      badges.push({ text: 'S', color: 'bg-red-100 text-red-800' })
    } else if (sv.availability === 'violet') {
      badges.push({ text: 'V', color: 'bg-purple-100 text-purple-800' })
    }
    // 'both'の場合は表示しない（当然両方で入手可能だから）
  }
  
  if (pokemon.version_info?.sword_shield) {
    const ss = pokemon.version_info.sword_shield
    if (ss.availability === 'sword') badges.push({ text: '剣', color: 'bg-blue-100 text-blue-800' })
    else if (ss.availability === 'shield') badges.push({ text: '盾', color: 'bg-pink-100 text-pink-800' })
    // 'both'の場合は表示しない
  }
  
  return badges
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 重複ポケモンを除外した表示用データ
const uniquePokemon = computed(() => {
  if (!zukanData.value?.pokemon) return []
  
  let filtered = filteredPokemon.value
  
  // 重複除外フィルターが有効な場合
  if (hideDuplicates.value) {
    filtered = filtered.filter((pokemon: any) => pokemon.regions.length === 1)
  }
  
  return filtered
})

// 重複除外フラグ
const hideDuplicates = ref(false)

// 重複除外トグル
const toggleDuplicates = () => {
  hideDuplicates.value = !hideDuplicates.value
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
  <div class="bg-gray-50 min-h-screen">
    <div class="container mx-auto px-4 py-6">
      <!-- ナビゲーションヘッダー -->
      <PageNavigation current-page="overview" />

      <!-- ヘッダー -->
      <div v-if="!selectedGame" class="text-center mb-4">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          📋 ポケモン図鑑一覧
        </h1>
        <p class="text-sm text-gray-600">図鑑別表示 - 備考欄で重複確認</p>
      </div>
      
      <!-- 図鑑選択後の小さなヘッダー -->
      <div v-else class="text-center mb-2">
        <h1 class="text-lg font-bold text-gray-700 mb-1">
          📋 図鑑一覧
        </h1>
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
              class="bg-white border-2 border-gray-200 hover:border-blue-400 rounded-lg p-6 transition-colors duration-200 cursor-pointer"
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
                  <span class="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-md border border-blue-200">
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
      <div v-if="loadError" class="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-6">
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
        <div class="bg-white border border-gray-200 rounded-lg p-6 mb-6">
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
              class="border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              🔄 ゲーム変更
            </button>
          </div>
        </div>

        <!-- 検索とタブ -->
        <div class="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
          <!-- 検索バー -->
          <div class="p-6 border-b bg-gray-50">
            <div class="flex items-center space-x-4">
              <div class="flex-1">
                <input
                  v-model="searchTerm"
                  type="text"
                  placeholder="ポケモン名で検索..."
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              
              <!-- 重複削除ボタン -->
              <button
                @click="toggleDuplicates"
                :class="[
                  'px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 border-2',
                  hideDuplicates
                    ? 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600 hover:border-orange-600'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-800'
                ]"
              >
                {{ hideDuplicates ? '🔄 重複表示' : '❌ 重複削除' }}
              </button>
              
              <div class="text-sm text-gray-600">
                {{ uniquePokemon.length }}匹
              </div>
            </div>
          </div>

          <!-- 図鑑選択ナビゲーション（従来通りタブ） -->
          <div class="border-b border-gray-200 overflow-x-auto">
            <nav class="flex space-x-0 min-w-max">
              <button
                v-for="tab in regionTabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'tab-button px-3 py-3 sm:px-6 text-xs sm:text-sm font-medium border-b-2 transition-colors duration-200 whitespace-nowrap',
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-400'
                ]"
              >
                <span class="block sm:inline">{{ tab.icon }}</span>
                <span class="block sm:inline sm:ml-1">{{ tab.name.replace(/図鑑$/, '') }}</span>
              </button>
            </nav>
          </div>

          <!-- ポケモンテーブル -->
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ポケモン名</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">登録図鑑</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">バージョン</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">備考</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr 
                  v-for="pokemon in uniquePokemon" 
                  :key="pokemon.id"
                  class="pokemon-row hover:bg-gray-50 transition-colors duration-200"
                >
                  <td class="px-4 py-2 text-sm text-gray-900">#{{ getPokemonNumber(pokemon) }}</td>
                  <td class="px-4 py-2 text-sm font-medium text-gray-900">{{ pokemon.name }}</td>
                  <td class="px-4 py-2 text-sm">
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
                  <td class="px-4 py-2 text-sm">
                    <div class="flex flex-wrap gap-1">
                      <span
                        v-for="badge in getPokemonVersionBadges(pokemon)"
                        :key="badge.text"
                        :class="['inline-block text-xs px-2 py-1 rounded-full font-medium', badge.color]"
                      >
                        {{ badge.text }}
                      </span>
                    </div>
                  </td>
                  <td class="px-4 py-2 text-sm text-gray-600">
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
  background: #3b82f6;
  color: white;
  border: 2px solid #3b82f6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  transform: translateY(100px);
  opacity: 0;
}

.scroll-to-top.visible {
  transform: translateY(0);
  opacity: 1;
}

.scroll-to-top:hover {
  background: #2563eb;
  border-color: #2563eb;
}

/* タブスタイル */
.tab-button {
  transition: all 0.3s ease;
}
</style>