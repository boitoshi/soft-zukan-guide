import type { ZukanStats } from '../index.js';
interface Props {
    stats?: ZukanStats;
    caughtCount?: number;
    totalCount?: number;
    progressPercent?: number;
}
declare const _default: import("vue", { with: { "resolution-mode": "import" } }).DefineComponent<Props, {}, {}, {}, {}, import("vue", { with: { "resolution-mode": "import" } }).ComponentOptionsMixin, import("vue", { with: { "resolution-mode": "import" } }).ComponentOptionsMixin, {}, string, import("vue", { with: { "resolution-mode": "import" } }).PublicProps, Readonly<Props> & Readonly<{}>, {
    stats: ZukanStats;
    caughtCount: number;
    totalCount: number;
    progressPercent: number;
}, {}, {}, {}, string, import("vue", { with: { "resolution-mode": "import" } }).ComponentProvideOptions, false, {}, any>;
export default _default;
