/**
 * PokemonCard Component (TypeScript版)
 * 個別ポケモンの表示とクリック処理を担当
 */
import type { Pokemon, GameConfig } from '../types/index.js';
import type { PropType } from 'vue';

const PokemonCard = {
  name: 'PokemonCard',
  props: {
    pokemon: {
      type: Object as PropType<Pokemon>,
      required: true
    },
    selectedGame: {
      type: Object as PropType<GameConfig>,
      required: true
    }
  },
  emits: {
    'toggle-caught': (pokemonId: string) => typeof pokemonId === 'string'
  },
  setup(props: { pokemon: Pokemon; selectedGame: GameConfig }, { emit }: { emit: any }) {
    // 図鑑名取得
    const getRegionName = (regionId: string): string => {
      if (!props.selectedGame) return regionId;
      const region = props.selectedGame.regions.find(r => r.id === regionId);
      return region ? region.name : regionId;
    };

    // 図鑑バッジのスタイル取得
    const getRegionClass = (regionId: string): string => {
      const classMap: Record<string, string> = {
        paldea: 'bg-blue-100 text-blue-800',
        kitakami: 'bg-orange-100 text-orange-800', 
        blueberry: 'bg-purple-100 text-purple-800',
        galar: 'bg-green-100 text-green-800',
        armor: 'bg-yellow-100 text-yellow-800',
        crown: 'bg-pink-100 text-pink-800'
      };
      return classMap[regionId] || 'bg-gray-100 text-gray-800';
    };

    // クリック処理
    const handleClick = (): void => {
      emit('toggle-caught', props.pokemon.id);
    };

    return {
      getRegionName,
      getRegionClass,
      handleClick
    };
  },
  template: `
    <div @click="handleClick"
         class="pokemon-card flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
      
      <div class="flex-1">
        <div class="flex items-center">
          <span class="text-2xl mr-3">
            {{ pokemon.caught ? '✅' : '⭕' }}
          </span>
          <div>
            <div class="flex items-center space-x-2">
              <span class="text-lg font-medium" 
                    :class="pokemon.caught ? 'text-green-600' : 'text-gray-700'">
                {{ pokemon.name }}
              </span>
              
              <!-- バージョン限定アイコン -->
              <div class="flex space-x-1" v-if="pokemon.version_info">
                <!-- スカーレット・バイオレット アイコン -->
                <span v-if="pokemon.version_info?.scarlet_violet?.availability === 'scarlet'"
                      class="text-red-500 text-sm font-bold" title="スカーレット限定">🔴</span>
                <span v-else-if="pokemon.version_info?.scarlet_violet?.availability === 'violet'"
                      class="text-purple-500 text-sm font-bold" title="バイオレット限定">🟣</span>
                <span v-else-if="pokemon.version_info?.scarlet_violet?.availability === 'both'"
                      class="text-green-500 text-sm font-bold" title="スカバイ共通">🤝</span>
                
                <!-- ソード・シールド アイコン -->
                <span v-if="pokemon.version_info?.sword_shield?.availability === 'sword'"
                      class="text-blue-600 text-sm font-bold" title="ソード限定">🗡️</span>
                <span v-else-if="pokemon.version_info?.sword_shield?.availability === 'shield'"
                      class="text-gray-600 text-sm font-bold" title="シールド限定">🛡️</span>
                <span v-else-if="pokemon.version_info?.sword_shield?.availability === 'both'"
                      class="text-green-500 text-sm font-bold" title="剣盾共通">🤝</span>
              </div>
            </div>
            <div class="flex gap-2 mt-1">
              <span v-if="pokemon.regions.length > 1" 
                    class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                🔄 重複
              </span>
              <span v-for="region in pokemon.regions" :key="region"
                    class="text-xs px-2 py-1 rounded-full"
                    :class="getRegionClass(region)">
                {{ getRegionName(region) }}
              </span>
            </div>
          </div>
        </div>
        <div class="text-sm text-gray-500 mt-2 ml-11">
          <span v-for="(region, index) in pokemon.regions" :key="region">
            {{ getRegionName(region) }}図鑑 #{{ pokemon.pokedex_numbers?.[region] || '???' }}
            <span v-if="index < pokemon.regions.length - 1"> / </span>
          </span>
        </div>
      </div>
      
      <div class="text-right">
        <span class="text-sm px-3 py-1 rounded-full font-medium" 
              :class="pokemon.caught ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
          {{ pokemon.caught ? '🎉 ゲット済み' : '🎯 未ゲット' }}
        </span>
      </div>
    </div>
  `
};