import type { Pokemon, GameConfig } from '../index.js';
interface Props {
    pokemon: Pokemon;
    selectedGame: GameConfig;
}
declare const _default: import("vue", { with: { "resolution-mode": "import" } }).DefineComponent<Props, {}, {}, {}, {}, import("vue", { with: { "resolution-mode": "import" } }).ComponentOptionsMixin, import("vue", { with: { "resolution-mode": "import" } }).ComponentOptionsMixin, {
    "toggle-caught": (pokemonId: string) => any;
}, string, import("vue", { with: { "resolution-mode": "import" } }).PublicProps, Readonly<Props> & Readonly<{
    "onToggle-caught"?: ((pokemonId: string) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue", { with: { "resolution-mode": "import" } }).ComponentProvideOptions, false, {}, any>;
export default _default;
