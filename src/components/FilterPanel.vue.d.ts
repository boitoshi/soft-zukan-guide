import type { GameConfig, FilterState } from '../index.js';
interface VersionFilterOption {
    value: string;
    label: string;
}
interface VersionFilter {
    name: string;
    options: VersionFilterOption[];
}
interface Props {
    selectedGame: GameConfig;
    versionFilters?: Record<string, VersionFilter>;
    modelValue: FilterState;
}
declare const _default: import("vue", { with: { "resolution-mode": "import" } }).DefineComponent<Props, {}, {}, {}, {}, import("vue", { with: { "resolution-mode": "import" } }).ComponentOptionsMixin, import("vue", { with: { "resolution-mode": "import" } }).ComponentOptionsMixin, {
    "update:modelValue": (value: FilterState) => any;
    "reset-filters": () => any;
}, string, import("vue", { with: { "resolution-mode": "import" } }).PublicProps, Readonly<Props> & Readonly<{
    "onUpdate:modelValue"?: ((value: FilterState) => any) | undefined;
    "onReset-filters"?: (() => any) | undefined;
}>, {
    versionFilters: Record<string, VersionFilter>;
}, {}, {}, {}, string, import("vue", { with: { "resolution-mode": "import" } }).ComponentProvideOptions, false, {}, any>;
export default _default;
