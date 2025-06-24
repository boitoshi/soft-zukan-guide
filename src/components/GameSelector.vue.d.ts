import type { GameConfig } from '../index.js';
interface Props {
    availableGames?: GameConfig[];
    selectedGame?: GameConfig | null;
    showBackButton?: boolean;
}
declare const _default: import("vue", { with: { "resolution-mode": "import" } }).DefineComponent<Props, {}, {}, {}, {}, import("vue", { with: { "resolution-mode": "import" } }).ComponentOptionsMixin, import("vue", { with: { "resolution-mode": "import" } }).ComponentOptionsMixin, {
    "game-selected": (gameId: string) => any;
    "back-to-selection": () => any;
}, string, import("vue", { with: { "resolution-mode": "import" } }).PublicProps, Readonly<Props> & Readonly<{
    "onGame-selected"?: ((gameId: string) => any) | undefined;
    "onBack-to-selection"?: (() => any) | undefined;
}>, {
    availableGames: GameConfig[];
    selectedGame: GameConfig | null;
    showBackButton: boolean;
}, {}, {}, {}, string, import("vue", { with: { "resolution-mode": "import" } }).ComponentProvideOptions, false, {}, any>;
export default _default;
