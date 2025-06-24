const props = defineProps();
const emit = defineEmits();
// 図鑑名取得
const getRegionName = (regionId) => {
    if (!props.selectedGame)
        return regionId;
    const region = props.selectedGame.regions.find(r => r.id === regionId);
    return region ? region.name : regionId;
};
// 図鑑バッジのスタイル取得
const getRegionClass = (regionId) => {
    const classMap = {
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
const handleClick = () => {
    emit('toggle-caught', props.pokemon.id);
};
// バージョン限定情報の表示判定
const hasVersionInfo = () => {
    return !!(props.pokemon.version_info?.scarlet_violet || props.pokemon.version_info?.sword_shield);
};
// バージョン限定バッジの生成
const getVersionBadges = () => {
    const badges = [];
    const svInfo = props.pokemon.version_info?.scarlet_violet;
    if (svInfo?.availability === 'scarlet') {
        badges.push({ text: 'スカーレット限定', class: 'bg-red-100 text-red-800' });
    }
    else if (svInfo?.availability === 'violet') {
        badges.push({ text: 'バイオレット限定', class: 'bg-purple-100 text-purple-800' });
    }
    const ssInfo = props.pokemon.version_info?.sword_shield;
    if (ssInfo?.availability === 'sword') {
        badges.push({ text: 'ソード限定', class: 'bg-blue-100 text-blue-800' });
    }
    else if (ssInfo?.availability === 'shield') {
        badges.push({ text: 'シールド限定', class: 'bg-pink-100 text-pink-800' });
    }
    return badges;
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['pokemon-card']} */ ;
/** @type {__VLS_StyleScopedClasses['pokemon-card']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onClick: (__VLS_ctx.handleClick) },
    ...{ class: "pokemon-card flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors group" },
    ...{ class: ({ 'bg-green-50 border-green-200': __VLS_ctx.pokemon.caught }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex-1" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center mb-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center mr-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-2xl mr-2" },
    ...{ class: ({ 'grayscale-0': __VLS_ctx.pokemon.caught, 'grayscale': !__VLS_ctx.pokemon.caught }) },
});
(__VLS_ctx.pokemon.caught ? '✅' : '⭕');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-sm text-gray-500 mr-2" },
});
(props.pokemon.id);
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "font-bold text-lg" },
    ...{ class: ({ 'text-green-700': props.pokemon.caught, 'text-gray-800': !props.pokemon.caught }) },
});
(props.pokemon.name);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex flex-wrap gap-1 mb-2" },
});
for (const [regionId] of __VLS_getVForSourceType((__VLS_ctx.pokemon.regions))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        key: (regionId),
        ...{ class: (__VLS_ctx.getRegionClass(regionId)) },
        ...{ class: "px-2 py-1 rounded text-xs font-medium" },
    });
    (__VLS_ctx.getRegionName(regionId));
}
if (__VLS_ctx.hasVersionInfo()) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex flex-wrap gap-1" },
    });
    for (const [badge] of __VLS_getVForSourceType((__VLS_ctx.getVersionBadges()))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            key: (badge.text),
            ...{ class: (badge.class) },
            ...{ class: "px-2 py-1 rounded text-xs font-medium" },
        });
        (badge.text);
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center ml-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "text-right" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "text-sm font-medium" },
    ...{ class: ({ 'text-green-600': __VLS_ctx.pokemon.caught, 'text-gray-500': !__VLS_ctx.pokemon.caught }) },
});
(__VLS_ctx.pokemon.caught ? 'ゲット済み' : '未ゲット');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "text-xs text-gray-400 group-hover:text-blue-500 transition-colors" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ml-3 text-2xl opacity-50 group-hover:opacity-100 transition-opacity" },
});
(__VLS_ctx.pokemon.caught ? '🎉' : '🎯');
/** @type {__VLS_StyleScopedClasses['pokemon-card']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-green-50']} */ ;
/** @type {__VLS_StyleScopedClasses['border-green-200']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['grayscale-0']} */ ;
/** @type {__VLS_StyleScopedClasses['grayscale']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-right']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['group-hover:text-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-50']} */ ;
/** @type {__VLS_StyleScopedClasses['group-hover:opacity-100']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-opacity']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            getRegionName: getRegionName,
            getRegionClass: getRegionClass,
            handleClick: handleClick,
            hasVersionInfo: hasVersionInfo,
            getVersionBadges: getVersionBadges,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
