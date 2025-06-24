import type { ZukanData, GameConfig, UsePokemonFilterReturn } from '../index.js';
import type { Ref } from 'vue';
export declare function usePokemonFilter(zukanData: Ref<ZukanData>, selectedGame: Ref<GameConfig | null>): UsePokemonFilterReturn;
