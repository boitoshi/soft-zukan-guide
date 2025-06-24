import { onMounted } from 'vue';
import AppNavigation from './components/AppNavigation.vue';
import GameSelector from './components/GameSelector.vue';
import StatsPanel from './components/StatsPanel.vue';
import FilterPanel from './components/FilterPanel.vue';
import PokemonCard from './components/PokemonCard.vue';
import { useGameData } from './composables/useGameData.js';
import { useLocalStorage } from './composables/useLocalStorage.js';
import { usePokemonFilter } from './composables/usePokemonFilter.js';
// Composables
const gameDataComposable = useGameData();
const localStorageComposable = useLocalStorage();
// Reactive refs for template access
const zukanData = gameDataComposable.zukanData;
const availableGames = gameDataComposable.availableGames;
const selectedGame = gameDataComposable.selectedGame;
const caughtCount = gameDataComposable.caughtCount;
const progressPercent = gameDataComposable.progressPercent;
const uniquePokemonCount = gameDataComposable.uniquePokemonCount;
// Initialize pokemon filter after game data is available
const pokemonFilterComposable = usePokemonFilter(zukanData, selectedGame);
const filters = pokemonFilterComposable.filters;
const filteredPokemon = pokemonFilterComposable.filteredPokemon;
// Methods
const handleSelectGame = async (gameId) => {
    await gameDataComposable.selectGame(gameId, localStorageComposable);
};
const handleBackToGameSelection = () => {
    gameDataComposable.backToGameSelection(localStorageComposable);
};
const handleToggleCaught = (pokemonId) => {
    gameDataComposable.toggleCaught(pokemonId, localStorageComposable);
};
const resetFilters = () => {
    pokemonFilterComposable.resetFilters();
};
// Lifecycle
onMounted(async () => {
    await gameDataComposable.loadAvailableGames();
    // Restore previously selected game with type safety
    const savedGame = localStorageComposable.loadSelectedGame();
    if (savedGame) {
        const gameExists = gameDataComposable.availableGames.value.find((g) => g.id === savedGame);
        if (gameExists) {
            await handleSelectGame(savedGame);
        }
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['custom-scrollbar']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-scrollbar']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-scrollbar']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "container mx-auto px-4 py-8" },
});
/** @type {[typeof AppNavigation, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(AppNavigation, new AppNavigation({
    currentPage: "index",
}));
const __VLS_1 = __VLS_0({
    currentPage: "index",
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "text-center mb-8" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-xl text-gray-600 mb-2" },
});
if (__VLS_ctx.selectedGame) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-center gap-4 text-sm text-gray-500" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.selectedGame.game);
    (__VLS_ctx.zukanData.stats?.total || 0);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.uniquePokemonCount);
}
/** @type {[typeof GameSelector, ]} */ ;
// @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(GameSelector, new GameSelector({
    ...{ 'onGameSelected': {} },
    ...{ 'onBackToSelection': {} },
    availableGames: (__VLS_ctx.availableGames),
    selectedGame: (__VLS_ctx.selectedGame),
    showBackButton: (true),
}));
const __VLS_4 = __VLS_3({
    ...{ 'onGameSelected': {} },
    ...{ 'onBackToSelection': {} },
    availableGames: (__VLS_ctx.availableGames),
    selectedGame: (__VLS_ctx.selectedGame),
    showBackButton: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_3));
let __VLS_6;
let __VLS_7;
let __VLS_8;
const __VLS_9 = {
    onGameSelected: (__VLS_ctx.handleSelectGame)
};
const __VLS_10 = {
    onBackToSelection: (__VLS_ctx.handleBackToGameSelection)
};
var __VLS_5;
if (__VLS_ctx.selectedGame) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    /** @type {[typeof StatsPanel, ]} */ ;
    // @ts-ignore
    const __VLS_11 = __VLS_asFunctionalComponent(StatsPanel, new StatsPanel({
        stats: (__VLS_ctx.zukanData.stats),
        caughtCount: (__VLS_ctx.caughtCount),
        totalCount: (__VLS_ctx.zukanData.stats?.total || 0),
        progressPercent: (__VLS_ctx.progressPercent),
    }));
    const __VLS_12 = __VLS_11({
        stats: (__VLS_ctx.zukanData.stats),
        caughtCount: (__VLS_ctx.caughtCount),
        totalCount: (__VLS_ctx.zukanData.stats?.total || 0),
        progressPercent: (__VLS_ctx.progressPercent),
    }, ...__VLS_functionalComponentArgsRest(__VLS_11));
    /** @type {[typeof FilterPanel, ]} */ ;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(FilterPanel, new FilterPanel({
        ...{ 'onResetFilters': {} },
        selectedGame: (__VLS_ctx.selectedGame),
        versionFilters: (__VLS_ctx.zukanData.version_filters),
        modelValue: (__VLS_ctx.filters),
    }));
    const __VLS_15 = __VLS_14({
        ...{ 'onResetFilters': {} },
        selectedGame: (__VLS_ctx.selectedGame),
        versionFilters: (__VLS_ctx.zukanData.version_filters),
        modelValue: (__VLS_ctx.filters),
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    let __VLS_17;
    let __VLS_18;
    let __VLS_19;
    const __VLS_20 = {
        onResetFilters: (__VLS_ctx.resetFilters)
    };
    var __VLS_16;
    const __VLS_21 = {}.Transition;
    /** @type {[typeof __VLS_components.Transition, typeof __VLS_components.Transition, ]} */ ;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
        name: "slide-down",
    }));
    const __VLS_23 = __VLS_22({
        name: "slide-down",
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
    __VLS_24.slots.default;
    if (__VLS_ctx.filteredPokemon.length > 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-4 mb-6" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "text-center" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-lg font-semibold text-purple-800" },
        });
        (__VLS_ctx.filteredPokemon.length);
        if (__VLS_ctx.filters.region === 'duplicates') {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "text-sm text-purple-600 ml-2" },
            });
        }
    }
    var __VLS_24;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-white rounded-2xl shadow-lg overflow-hidden" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-6 border-b bg-gradient-to-r from-purple-50 to-blue-50" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
        ...{ class: "text-2xl font-bold flex items-center" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "text-2xl mr-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-gray-600 mt-1" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "max-h-96 overflow-y-auto custom-scrollbar" },
    });
    const __VLS_25 = {}.TransitionGroup;
    /** @type {[typeof __VLS_components.TransitionGroup, typeof __VLS_components.TransitionGroup, ]} */ ;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
        name: "fade",
        tag: "div",
    }));
    const __VLS_27 = __VLS_26({
        name: "fade",
        tag: "div",
    }, ...__VLS_functionalComponentArgsRest(__VLS_26));
    __VLS_28.slots.default;
    for (const [pokemon] of __VLS_getVForSourceType((__VLS_ctx.filteredPokemon))) {
        /** @type {[typeof PokemonCard, ]} */ ;
        // @ts-ignore
        const __VLS_29 = __VLS_asFunctionalComponent(PokemonCard, new PokemonCard({
            ...{ 'onToggleCaught': {} },
            key: (pokemon.id),
            pokemon: (pokemon),
            selectedGame: (__VLS_ctx.selectedGame),
        }));
        const __VLS_30 = __VLS_29({
            ...{ 'onToggleCaught': {} },
            key: (pokemon.id),
            pokemon: (pokemon),
            selectedGame: (__VLS_ctx.selectedGame),
        }, ...__VLS_functionalComponentArgsRest(__VLS_29));
        let __VLS_32;
        let __VLS_33;
        let __VLS_34;
        const __VLS_35 = {
            onToggleCaught: (__VLS_ctx.handleToggleCaught)
        };
        var __VLS_31;
    }
    var __VLS_28;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mt-8 bg-white rounded-2xl shadow-lg p-6" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
        ...{ class: "text-2xl font-bold mb-6 flex items-center" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "text-2xl mr-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-3xl font-bold text-blue-600 mb-2" },
    });
    (__VLS_ctx.zukanData.stats?.duplicates || 0);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-sm text-blue-800" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-xs text-blue-600 mt-1" },
    });
    for (const [region] of __VLS_getVForSourceType((__VLS_ctx.selectedGame.regions))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (region.id),
            ...{ class: "text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "text-3xl font-bold text-green-600 mb-2" },
        });
        (__VLS_ctx.zukanData.stats?.regions?.[region.id]?.only || 0);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "text-sm text-green-800" },
        });
        (region.name);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "text-xs text-green-600 mt-1" },
        });
        (__VLS_ctx.zukanData.stats?.regions?.[region.id]?.total || 0);
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mt-8 text-center text-gray-500 text-sm" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "mt-1" },
});
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-br']} */ ;
/** @type {__VLS_StyleScopedClasses['from-blue-50']} */ ;
/** @type {__VLS_StyleScopedClasses['via-purple-50']} */ ;
/** @type {__VLS_StyleScopedClasses['to-pink-50']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-5xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-purple-600']} */ ;
/** @type {__VLS_StyleScopedClasses['to-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-clip-text']} */ ;
/** @type {__VLS_StyleScopedClasses['text-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-purple-100']} */ ;
/** @type {__VLS_StyleScopedClasses['to-blue-100']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-purple-800']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-purple-600']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-purple-50']} */ ;
/** @type {__VLS_StyleScopedClasses['to-blue-50']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['max-h-96']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-scrollbar']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:grid-cols-4']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-br']} */ ;
/** @type {__VLS_StyleScopedClasses['from-blue-50']} */ ;
/** @type {__VLS_StyleScopedClasses['to-blue-100']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['text-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-800']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-br']} */ ;
/** @type {__VLS_StyleScopedClasses['from-green-50']} */ ;
/** @type {__VLS_StyleScopedClasses['to-green-100']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['text-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-600']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-800']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-600']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            AppNavigation: AppNavigation,
            GameSelector: GameSelector,
            StatsPanel: StatsPanel,
            FilterPanel: FilterPanel,
            PokemonCard: PokemonCard,
            zukanData: zukanData,
            availableGames: availableGames,
            selectedGame: selectedGame,
            caughtCount: caughtCount,
            progressPercent: progressPercent,
            uniquePokemonCount: uniquePokemonCount,
            filters: filters,
            filteredPokemon: filteredPokemon,
            handleSelectGame: handleSelectGame,
            handleBackToGameSelection: handleBackToGameSelection,
            handleToggleCaught: handleToggleCaught,
            resetFilters: resetFilters,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
