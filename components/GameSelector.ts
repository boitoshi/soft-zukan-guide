/**
 * GameSelector Component (TypeScript版)
 * ゲーム選択画面とゲーム切り替え機能を担当
 */
import type { GameConfig } from '../types/index.js';
import type { PropType } from 'vue';

const GameSelector = {
  name: 'GameSelector',
  props: {
    availableGames: {
      type: Array as PropType<GameConfig[]>,
      default: () => []
    },
    selectedGame: {
      type: Object as PropType<GameConfig | null>,
      default: null
    },
    showBackButton: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    'game-selected': (gameId: string) => typeof gameId === 'string',
    'back-to-selection': () => true
  },
  setup(props: { 
    availableGames: GameConfig[]; 
    selectedGame: GameConfig | null; 
    showBackButton: boolean; 
  }, { emit }: { emit: any }) {
    
    // ゲーム選択処理
    const selectGame = (gameId: string): void => {
      emit('game-selected', gameId);
    };

    // ゲーム選択画面に戻る
    const backToGameSelection = (): void => {
      emit('back-to-selection');
    };

    // ゲームアイコン取得
    const getGameIcon = (gameId: string): string => {
      const iconMap: Record<string, string> = {
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
      <!-- ゲーム選択済みの場合: 切り替えボタン -->
      <div v-if="selectedGame" class="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <span class="text-3xl mr-3">{{ getGameIcon(selectedGame.id) }}</span>
            <div>
              <h2 class="text-xl font-bold text-gray-800">{{ selectedGame.displayName }}</h2>
              <p class="text-gray-600">現在選択中のゲーム</p>
            </div>
          </div>
          <button v-if="showBackButton" 
                  @click="backToGameSelection" 
                  class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors">
            🔄 ゲーム切り替え
          </button>
        </div>
      </div>

      <!-- ゲーム未選択の場合: 選択画面 -->
      <div v-else class="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h2 class="text-2xl font-bold mb-6 text-center">
          🎮 ゲームを選択してください
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="game in availableGames" 
               :key="game.id"
               @click="selectGame(game.id)"
               class="game-card p-6 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-purple-500 hover:shadow-lg transition-all">
            
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
        
        <div v-if="availableGames.length === 0" class="text-center py-8">
          <div class="text-4xl mb-3">🔍</div>
          <p class="text-gray-600">利用可能なゲームが見つかりません</p>
          <p class="text-sm text-gray-500 mt-2">データファイルを確認してください</p>
        </div>
      </div>
    </div>
  `
};