<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useGameData } from '@/composables/useGameData'
import type { GameConfig, Pokemon, ZukanData } from '@/types'
import { getGameIcon, getRegionIcon, shortenVersionLabel } from '@/constants/icons'
import { buildVersionBadges } from '@/utils/versionBadges'

// composable でゲームデータを読み込み（localStorage不要＝閲覧専用）
const { zukanData, availableGames, selectedGame, isLoading, error, loadAvailableGames } = useGameData()

const activeTab = ref('')
const searchTerm = ref('')
const hideDuplicates = ref(false)
const showScrollToTop = ref(false)

// ゲーム選択
const selectGame = async (gameId: string) => {
  isLoading.value = true
  error.value = null
  try {
    const game = availableGames.value.find((g) => g.id === gameId)
    if (!game) throw new Error('ゲームが見つかりません')

    selectedGame.value = game

    const response = await fetch(game.dataFile)
    if (!response.ok) throw new Error('図鑑データの読み込みに失敗しました')

    zukanData.value = await response.json() as ZukanData

    if (game.regions?.length > 0) {
      activeTab.value = game.regions[0].id
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '不明なエラー'
  } finally {
    isLoading.value = false
  }
}

const backToSelection = () => {
  selectedGame.value = null
}

// 計算プロパティ
const isDataLoaded = computed(
  () => !isLoading.value && selectedGame.value && zukanData.value.pokemon.length > 0,
)

const filteredPokemon = computed(() => {
  if (!zukanData.value?.pokemon) return []

  let filtered: Pokemon[] = zukanData.value.pokemon

  // 検索フィルター
  if (searchTerm.value) {
    const searchLower = searchTerm.value.toLowerCase().trim()
    filtered = filtered.filter((pokemon) => {
      const pokemonName = pokemon.name.toLowerCase()
      return (
        pokemonName === searchLower ||
        pokemonName.startsWith(searchLower) ||
        (searchLower.length >= 3 && pokemonName.includes(searchLower))
      )
    })
  }

  // タブフィルター（地域別）
  filtered = filtered.filter((pokemon) => pokemon.regions.includes(activeTab.value))

  // ソート
  filtered = [...filtered].sort((a, b) => {
    const aNum = parseInt(a.pokedex_numbers?.[activeTab.value] ?? '999999')
    const bNum = parseInt(b.pokedex_numbers?.[activeTab.value] ?? '999999')
    return aNum - bNum
  })

  return filtered
})

const uniquePokemon = computed(() => {
  if (!hideDuplicates.value) return filteredPokemon.value
  return filteredPokemon.value.filter((pokemon) => pokemon.regions.length === 1)
})

const regionTabs = computed(() => {
  if (!selectedGame.value?.regions) return []
  return selectedGame.value.regions.map((region) => ({
    id: region.id,
    name: region.name,
    icon: getRegionIcon(region.id),
  }))
})

// ポケモン番号取得
const getPokemonNumber = (pokemon: Pokemon): string => {
  if (pokemon.regions.includes(activeTab.value) && pokemon.pokedex_numbers?.[activeTab.value]) {
    return pokemon.pokedex_numbers[activeTab.value]
  }
  const firstRegion = pokemon.regions[0]
  return pokemon.pokedex_numbers?.[firstRegion] ?? pokemon.id
}

// バージョンバッジ
const getPokemonVersionBadges = (pokemon: Pokemon) => {
  return buildVersionBadges(
    pokemon.version_info,
    zukanData.value.version_filters,
    { labelTransform: (label, availability) => shortenVersionLabel(label, availability) },
  )
}

// スクロール
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
const handleScroll = () => { showScrollToTop.value = window.scrollY > 300 }

onMounted(() => {
  loadAvailableGames()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="container mx-auto px-3 py-4 md:px-4 md:py-6 max-w-4xl">
    <!-- ヘッダー -->
    <div class="text-center mb-3">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-800">📋 図鑑一覧</h1>
      <p class="text-xs text-gray-500 mt-1">図鑑別ポケモン一覧・重複確認</p>
    </div>

    <!-- ゲーム選択セクション -->
    <div v-if="!selectedGame && !isLoading" class="mb-4">
      <div class="flex gap-2 flex-wrap justify-center">
        <button
          v-for="game in availableGames"
          :key="game.id"
          @click="selectGame(game.id)"
          class="flex items-center gap-2 bg-white border border-gray-200 hover:border-blue-400 rounded-xl px-4 py-3 transition-colors cursor-pointer"
        >
          <span class="text-2xl">{{ getGameIcon(game.id) }}</span>
          <div class="text-left">
            <div class="text-sm font-bold text-gray-800">{{ game.displayName }}</div>
            <div class="text-[11px] text-gray-500">{{ game.stats?.total ?? '?' }}匹</div>
          </div>
        </button>
      </div>
    </div>

    <!-- ローディング -->
    <div v-if="isLoading" class="text-center py-8">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-3"></div>
      <span class="text-sm text-gray-500">読み込み中...</span>
    </div>

    <!-- エラー -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
      <div class="flex items-center gap-2">
        <span>⚠️</span>
        <div>
          <p class="text-sm font-medium text-red-800">エラーが発生しました</p>
          <p class="text-xs text-red-600">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- メインコンテンツ -->
    <div v-if="isDataLoaded">
      <!-- ゲーム情報ヘッダー -->
      <div class="flex items-center justify-between bg-white rounded-xl border border-gray-200 px-4 py-3 mb-3">
        <div class="flex items-center gap-2">
          <span class="text-xl">{{ getGameIcon(selectedGame!.id) }}</span>
          <div>
            <h2 class="text-sm font-bold text-gray-800">{{ selectedGame!.displayName }}</h2>
            <p class="text-[11px] text-gray-500">{{ selectedGame!.game }}</p>
          </div>
        </div>
        <button
          @click="backToSelection"
          class="text-xs text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
        >
          🔄 変更
        </button>
      </div>

      <!-- 検索・フィルター -->
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden mb-3">
        <div class="px-3 py-3 border-b bg-gray-50">
          <div class="flex items-center gap-2">
            <input
              v-model="searchTerm"
              type="text"
              placeholder="🔍 ポケモン名で検索..."
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <button
              @click="hideDuplicates = !hideDuplicates"
              class="flex-shrink-0 px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
              :class="hideDuplicates
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            >
              {{ hideDuplicates ? '🔄 重複表示' : '❌ 重複非表示' }}
            </button>
            <span class="text-[11px] text-gray-400 flex-shrink-0">{{ uniquePokemon.length }}匹</span>
          </div>
        </div>

        <!-- 地域タブ -->
        <div class="border-b border-gray-200 overflow-x-auto">
          <nav class="flex min-w-max">
            <button
              v-for="tab in regionTabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="px-3 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap"
              :class="activeTab === tab.id
                ? 'border-blue-600 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              {{ tab.icon }} {{ tab.name.replace(/図鑑$/, '') }}
            </button>
          </nav>
        </div>

        <!-- テーブル -->
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-3 py-2 text-left text-[11px] font-semibold text-gray-500">No.</th>
                <th class="px-3 py-2 text-left text-[11px] font-semibold text-gray-500">ポケモン名</th>
                <th class="px-3 py-2 text-left text-[11px] font-semibold text-gray-500">登録図鑑</th>
                <th class="px-3 py-2 text-left text-[11px] font-semibold text-gray-500">バージョン</th>
                <th class="px-3 py-2 text-left text-[11px] font-semibold text-gray-500">備考</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr
                v-for="pokemon in uniquePokemon"
                :key="pokemon.id"
                class="hover:bg-gray-50/50 transition-colors"
              >
                <td class="px-3 py-1.5 text-xs text-gray-500">#{{ getPokemonNumber(pokemon) }}</td>
                <td class="px-3 py-1.5 text-xs font-medium text-gray-800">{{ pokemon.name }}</td>
                <td class="px-3 py-1.5">
                  <div class="flex flex-wrap gap-0.5">
                    <span
                      v-for="region in pokemon.regions"
                      :key="region"
                      class="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full"
                    >
                      {{ getRegionIcon(region) }}
                    </span>
                  </div>
                </td>
                <td class="px-3 py-1.5">
                  <div class="flex flex-wrap gap-0.5">
                    <span
                      v-for="badge in getPokemonVersionBadges(pokemon)"
                      :key="badge.text"
                      :class="['text-[10px] px-1.5 py-0.5 rounded-full font-medium', badge.className]"
                    >
                      {{ badge.text }}
                    </span>
                  </div>
                </td>
                <td class="px-3 py-1.5 text-[11px]">
                  <span v-if="pokemon.regions.length > 1" class="text-orange-600 font-medium">
                    🔄 {{ pokemon.regions.length }}図鑑
                  </span>
                  <span v-else class="text-green-600">⭐ 専用</span>
                </td>
              </tr>
              <tr v-if="uniquePokemon.length === 0">
                <td colspan="5" class="px-4 py-8 text-center text-gray-400">
                  <div class="text-2xl mb-2">🔍</div>
                  <div class="text-sm">該当するポケモンなし</div>
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
        <path d="m18 15-6-6-6 6" />
      </svg>
    </button>

    <div class="mt-6 text-center text-gray-400 text-[10px]">
      📋 図鑑一覧 | ソフト図鑑完成ガイド
    </div>
  </div>
</template>

<style scoped>
.scroll-to-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 50;
  width: 40px;
  height: 40px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 10px;
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
}
</style>
