/**
 * GameSelector Component
 * ゲーム選択画面とゲーム切り替え機能を担当
 */
const GameSelector = {
  name: 'GameSelector',
  props: {
    availableGames: {
      type: Array,
      default: () => []
    },
    selectedGame: {
      type: Object,
      default: null
    },
    showBackButton: {
      type: Boolean,
      default: false
    }
  },
  emits: ['game-selected', 'back-to-selection'],
  setup(props, { emit }) {
    // ゲーム選択処理
    const selectGame = (gameId) => {
      emit('game-selected', gameId);
    };

    // ゲーム選択に戻る
    const backToGameSelection = () => {
      emit('back-to-selection');
    };

    // ゲームアイコン取得
    const getGameIcon = (gameId) => {
      const iconMap = {
        test: '🧪',
        paldea: '🏔️',
        galar: '⚔️',
        alola: '🌺',
        kalos: '🗼',
        unova: '🌉',
        sinnoh: '⛰️',
        hoenn: '🌊',
        johto: '🌸',
        kanto: '⚡'
      };
      return iconMap[gameId] || '🎮';
    };

    return {
      selectGame,
      backToGameSelection,
      getGameIcon
    };
  },
  template: `
    <div>
      <!-- 戻るボタン (選択済みの場合) -->
      <div v-if="showBackButton && selectedGame" class="mb-6 flex justify-between items-center">
        <button @click="backToGameSelection" 
                class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
          ← ゲーム選択に戻る
        </button>
        <div class="text-right">
          <h2 class="text-2xl font-bold text-gray-800">{{ selectedGame.game }}</h2>
          <p class="text-gray-600">{{ selectedGame.displayName }}</p>
        </div>
      </div>

      <!-- ゲーム選択画面 -->
      <transition name="slide-down">
        <div v-if="!selectedGame" class="mb-8">
          <h2 class="text-3xl font-bold text-center mb-6 text-gray-800">
            🎯 プレイ中のゲームを選択してください
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="game in availableGames" :key="game.id"
                 @click="selectGame(game.id)"
                 class="game-card bg-white rounded-2xl shadow-lg p-6 text-center cursor-pointer transform hover:scale-105 transition-all">
              <div class="text-4xl mb-4">{{ getGameIcon(game.id) }}</div>
              <h3 class="text-xl font-bold text-gray-800 mb-2">{{ game.name }}</h3>
              <p class="text-gray-600 text-sm mb-4">{{ game.displayName }}</p>
              <div class="flex flex-wrap justify-center gap-2">
                <span v-for="region in game.regions" :key="region.id"
                      class="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800">
                  {{ region.name }}
                </span>
              </div>
              <div class="mt-4 text-sm text-gray-500">
                {{ game.stats?.total || '?' }}匹のポケモン
              </div>
            </div>
          </div>

          <div class="text-center mt-8">
            <p class="text-gray-600 mb-4">新しいゲーム図鑑を追加したい場合</p>
            <div class="bg-white rounded-lg p-4 max-w-md mx-auto">
              <p class="text-sm text-gray-700">
                📁 CSVファイルを追加 → 🔧 変換スクリプト実行 → 🎮 図鑑利用可能！
              </p>
            </div>
          </div>
        </div>
      </transition>
    </div>
  `
};