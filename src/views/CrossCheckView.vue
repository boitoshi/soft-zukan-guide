<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePokemonMaster } from '@/composables/usePokemonMaster'
import { useGlobalProgress } from '@/composables/useGlobalProgress'
import { GAME_ICON_MAP } from '@/constants/icons'
import type { PokemonMasterEntry } from '@/types/softZukan'

// Composables
const master = usePokemonMaster()
const globalProgress = useGlobalProgress()

// ゲーム表示定義（表示順序）
const GAME_COLUMNS = [
  { id: 'paldea', label: 'SV', fullName: 'スカーレット・バイオレット', softZukan: true },
  { id: 'galar', label: 'SwSh', fullName: 'ソード・シールド', softZukan: true },
  { id: 'usum', label: 'USUM', fullName: 'ウルトラサン・ウルトラムーン', softZukan: false },
  { id: 'sm', label: 'SM', fullName: 'サン・ムーン', softZukan: false },
  { id: 'oras', label: 'ORAS', fullName: 'オメガルビー・アルファサファイア', softZukan: false },
  { id: 'xy', label: 'XY', fullName: 'X・Y', softZukan: false },
] as const

// デフォルトを「ソフト図鑑未登録」に → 未登録が最初に見える
const searchQuery = ref('')
const filterMode = ref<'all' | 'uncaught_any' | 'uncaught_game' | 'breedable'>('uncaught_any')
const filterTargetGame = ref('paldea')
const selectedPokemon = ref<PokemonMasterEntry | null>(null)
const isReady = ref(false)

// 初期化
onMounted(async () => {
  await master.loadMasterData()
  globalProgress.loadGlobalProgress()

  if (!globalProgress.isMigrated.value) {
    const gameIdToPokemonMap: Record<string, { id: string; name: string }[]> = {}
    for (const pokemon of master.allPokemon.value) {
      for (const [gameId, gameEntry] of Object.entries(pokemon.games)) {
        if (!gameIdToPokemonMap[gameId]) {
          gameIdToPokemonMap[gameId] = []
        }
        gameIdToPokemonMap[gameId].push({ id: gameEntry.id, name: pokemon.name })
      }
    }
    globalProgress.migrateFromPerGameProgress(gameIdToPokemonMap)
  }

  isReady.value = true
})

type CellStatus = 'caught' | 'available' | 'not_in_game'

const getCellStatus = (pokemon: PokemonMasterEntry, gameId: string): CellStatus => {
  if (!(gameId in pokemon.games)) return 'not_in_game'
  if (globalProgress.isCaughtInGame(pokemon.name, gameId)) return 'caught'
  return 'available'
}

const filteredPokemon = computed(() => {
  let list = master.allPokemon.value

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.trim().toLowerCase()
    list = list.filter(p => p.name.toLowerCase().includes(query))
  }

  switch (filterMode.value) {
    case 'uncaught_any':
      list = list.filter(p => {
        return GAME_COLUMNS
          .filter(g => g.softZukan)
          .some(g => g.id in p.games && !globalProgress.isCaughtInGame(p.name, g.id))
      })
      break
    case 'uncaught_game':
      list = list.filter(p => {
        return filterTargetGame.value in p.games &&
          !globalProgress.isCaughtInGame(p.name, filterTargetGame.value)
      })
      break
    case 'breedable':
      list = list.filter(p => {
        if (!p.breedable) return false
        if (!globalProgress.isCaughtAnywhere(p.name)) return false
        return GAME_COLUMNS
          .filter(g => g.softZukan)
          .some(g => g.id in p.games && !globalProgress.isCaughtInGame(p.name, g.id))
      })
      break
  }

  return list
})

const summary = computed(() => {
  const allPokemon = master.allPokemon.value
  const softZukanGames = GAME_COLUMNS.filter(g => g.softZukan)
  let total = 0, caught = 0, quickWins = 0

  for (const pokemon of allPokemon) {
    for (const game of softZukanGames) {
      if (game.id in pokemon.games) {
        total++
        if (globalProgress.isCaughtInGame(pokemon.name, game.id)) {
          caught++
        } else if (pokemon.breedable && globalProgress.isCaughtAnywhere(pokemon.name)) {
          quickWins++
        }
      }
    }
  }

  return {
    total, caught,
    remaining: total - caught,
    quickWins,
    percent: total > 0 ? Math.round((caught / total) * 100) : 0,
  }
})

const getAdvice = (pokemon: PokemonMasterEntry) => {
  const advice: { icon: string; text: string; type: string }[] = []
  const caughtGames = globalProgress.getCaughtGames(pokemon.name)

  for (const game of GAME_COLUMNS.filter(g => g.softZukan)) {
    if (!(game.id in pokemon.games)) continue
    if (globalProgress.isCaughtInGame(pokemon.name, game.id)) continue

    if (caughtGames.length > 0 && pokemon.breedable) {
      const src = GAME_COLUMNS.find(g => caughtGames.includes(g.id))
      advice.push({ icon: '🥚', text: `${src?.label ?? '別ゲーム'}で所持 → ${game.label}で孵化登録可`, type: 'breed' })
    } else if (caughtGames.length > 0 && !pokemon.breedable) {
      advice.push({ icon: '⚠️', text: `${game.label}: 孵化不可、直接捕獲が必要`, type: 'not_breedable' })
    } else {
      const excl = pokemon.games[game.id]?.versionExclusive
      if (excl) {
        const v = excl === 'sword' ? '剣' : excl === 'shield' ? '盾' : excl === 'scarlet' ? 'S' : 'V'
        advice.push({ icon: '🔒', text: `${game.label}: ${v}限定`, type: 'version_exclusive' })
      } else {
        advice.push({ icon: '🎯', text: `${game.label}で捕獲`, type: 'catch' })
      }
    }
  }
  return advice
}

const toggleCellCaught = (pokemon: PokemonMasterEntry, gameId: string) => {
  if (!(gameId in pokemon.games)) return
  if (globalProgress.isCaughtInGame(pokemon.name, gameId)) {
    globalProgress.markUncaught(pokemon.name, gameId)
  } else {
    globalProgress.markCaught(pokemon.name, gameId)
  }
}

const toggleDetail = (pokemon: PokemonMasterEntry) => {
  selectedPokemon.value = selectedPokemon.value?.name === pokemon.name ? null : pokemon
}
</script>

<template>
  <div class="container mx-auto px-3 py-4 md:px-4 md:py-8">
    <!-- Compact Header -->
    <div class="text-center mb-3 md:mb-6">
      <h1 class="text-2xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
        🔄 クロスチェック
      </h1>
      <p class="text-xs md:text-base text-gray-500 mt-1">全ゲーム横断チェックリスト</p>
    </div>

    <!-- Loading -->
    <div v-if="!isReady" class="text-center py-12">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600 mx-auto mb-3"></div>
      <span class="text-sm text-gray-500">読み込み中...</span>
    </div>

    <template v-if="isReady">
      <!-- Compact Summary (1 line on mobile) -->
      <div class="bg-white rounded-xl border border-gray-200 p-3 mb-3 md:mb-6">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold text-gray-500">ソフト図鑑</span>
          <span class="text-lg font-bold text-emerald-600">{{ summary.percent }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div
            class="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full transition-all duration-500"
            :style="{ width: `${summary.percent}%` }"
          ></div>
        </div>
        <div class="flex justify-between text-[11px] text-gray-500">
          <span>✅ {{ summary.caught }}</span>
          <span class="text-orange-600 font-medium">残り {{ summary.remaining }}</span>
          <span v-if="summary.quickWins > 0" class="text-purple-600 font-medium">🥚 {{ summary.quickWins }}</span>
        </div>
      </div>

      <!-- Search + Filter (Compact) -->
      <div class="mb-3 space-y-2">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="🔍 ポケモン名で検索..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
        />

        <!-- Filter Pills (horizontal scroll) -->
        <div class="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
          <button
            @click="filterMode = 'all'"
            class="flex-shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            :class="filterMode === 'all' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'"
          >すべて</button>
          <button
            @click="filterMode = 'uncaught_any'"
            class="flex-shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            :class="filterMode === 'uncaught_any' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-600'"
          >未登録</button>
          <button
            @click="filterMode = 'breedable'"
            class="flex-shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            :class="filterMode === 'breedable' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'"
          >🥚孵化可</button>
          <button
            @click="filterMode = 'uncaught_game'"
            class="flex-shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            :class="filterMode === 'uncaught_game' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'"
          >ゲーム指定</button>
        </div>

        <!-- Game Selector (when game filter active) -->
        <div v-if="filterMode === 'uncaught_game'" class="flex gap-1.5 flex-wrap">
          <button
            v-for="game in GAME_COLUMNS"
            :key="game.id"
            @click="filterTargetGame = game.id"
            class="px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors"
            :class="filterTargetGame === game.id ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-700'"
          >{{ GAME_ICON_MAP[game.id] }} {{ game.label }}</button>
        </div>

        <div class="text-[11px] text-gray-400">{{ filteredPokemon.length }}匹表示</div>
      </div>

      <!-- Cross Check Table (Mobile Optimized) -->
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-200">
                <th class="px-2 py-2 text-left text-[11px] font-semibold text-gray-600 sticky left-0 bg-gray-50 z-10 min-w-[90px] md:min-w-[120px]">
                  ポケモン
                </th>
                <th
                  v-for="game in GAME_COLUMNS"
                  :key="game.id"
                  class="px-1 py-2 text-center text-[10px] font-semibold min-w-[40px] md:min-w-[48px]"
                  :class="game.softZukan ? 'text-emerald-700 bg-emerald-50/50' : 'text-gray-400'"
                  :title="game.fullName"
                >
                  <div class="leading-tight">{{ GAME_ICON_MAP[game.id] }}</div>
                  <div class="leading-tight">{{ game.label }}</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="pokemon in filteredPokemon"
                :key="pokemon.name"
                class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer"
                @click="toggleDetail(pokemon)"
              >
                <!-- Pokemon Name (compact) -->
                <td class="px-2 py-1.5 sticky left-0 bg-white z-10">
                  <div class="flex items-center gap-1">
                    <span class="text-xs font-medium text-gray-800 truncate">{{ pokemon.name }}</span>
                    <span v-if="!pokemon.breedable" class="text-[9px] text-red-500" title="孵化不可">★</span>
                  </div>
                </td>

                <!-- Game Cells (compact) -->
                <td
                  v-for="game in GAME_COLUMNS"
                  :key="game.id"
                  class="px-0.5 py-1 text-center"
                  :class="game.softZukan ? 'bg-emerald-50/20' : ''"
                >
                  <button
                    v-if="getCellStatus(pokemon, game.id) !== 'not_in_game'"
                    @click.stop="toggleCellCaught(pokemon, game.id)"
                    class="w-7 h-7 rounded-md text-xs transition-all active:scale-95"
                    :class="getCellStatus(pokemon, game.id) === 'caught'
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-gray-50 text-gray-300'"
                  >
                    {{ getCellStatus(pokemon, game.id) === 'caught' ? '✅' : '⭕' }}
                  </button>
                  <span v-else class="text-gray-200 text-[10px]">ー</span>
                </td>
              </tr>

              <tr v-if="filteredPokemon.length === 0">
                <td :colspan="GAME_COLUMNS.length + 1" class="px-4 py-8 text-center text-gray-400">
                  <div class="text-2xl mb-2">🔍</div>
                  <div class="text-sm">該当するポケモンなし</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Detail Panel (Bottom Sheet) -->
      <Transition name="slide-up">
        <div
          v-if="selectedPokemon"
          class="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-emerald-300 shadow-2xl rounded-t-2xl px-4 py-4 z-50 max-h-[45vh] overflow-y-auto"
        >
          <div class="max-w-xl mx-auto">
            <div class="flex justify-between items-start mb-3">
              <div>
                <h3 class="text-base font-bold text-gray-800">{{ selectedPokemon.name }}</h3>
                <div class="flex gap-1.5 mt-1">
                  <span
                    class="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                    :class="selectedPokemon.breedable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                  >{{ selectedPokemon.breedable ? '🥚孵化可' : '🚫孵化不可' }}</span>
                  <span class="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">
                    {{ Object.keys(selectedPokemon.games).length }}ゲーム
                  </span>
                </div>
              </div>
              <button @click="selectedPokemon = null" class="text-gray-400 hover:text-gray-600 p-1">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Game Status Grid -->
            <div class="grid grid-cols-3 gap-1.5 mb-3">
              <div
                v-for="game in GAME_COLUMNS"
                :key="game.id"
                class="flex items-center gap-1 px-2 py-1.5 rounded-md text-[11px]"
                :class="getCellStatus(selectedPokemon, game.id) === 'caught' ? 'bg-emerald-50 text-emerald-700'
                  : getCellStatus(selectedPokemon, game.id) === 'available' ? 'bg-orange-50 text-orange-700'
                  : 'bg-gray-50 text-gray-300'"
              >
                <span>{{ GAME_ICON_MAP[game.id] }}</span>
                <span class="font-medium">{{ game.label }}</span>
                <span class="ml-auto">
                  {{ getCellStatus(selectedPokemon, game.id) === 'caught' ? '✅' :
                     getCellStatus(selectedPokemon, game.id) === 'available' ? '⭕' : 'ー' }}
                </span>
              </div>
            </div>

            <!-- Advice -->
            <div v-if="getAdvice(selectedPokemon).length > 0" class="space-y-1.5">
              <div
                v-for="(advice, i) in getAdvice(selectedPokemon)"
                :key="i"
                class="flex items-start gap-1.5 px-2 py-1.5 rounded-md text-[11px]"
                :class="{
                  'bg-purple-50 text-purple-700': advice.type === 'breed',
                  'bg-yellow-50 text-yellow-700': advice.type === 'not_breedable',
                  'bg-blue-50 text-blue-700': advice.type === 'catch',
                  'bg-orange-50 text-orange-700': advice.type === 'version_exclusive',
                }"
              >
                <span class="flex-shrink-0">{{ advice.icon }}</span>
                <span>{{ advice.text }}</span>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <Transition name="fade">
        <div
          v-if="selectedPokemon"
          class="fixed inset-0 bg-black/20 z-40"
          @click="selectedPokemon = null"
        ></div>
      </Transition>
    </template>

    <div class="mt-6 text-center text-gray-400 text-[10px]">
      🔄 クロスチェック | ソフト図鑑完成ガイド
    </div>
  </div>
</template>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.3s ease; }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(100%); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
