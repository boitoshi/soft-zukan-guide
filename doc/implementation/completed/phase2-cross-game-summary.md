# Phase 2: ソフト図鑑 クロスゲーム基盤 - 実装サマリー

## 概要

既存の「ゲーム別トラッカー」を壊さずに、Pokémon HOME ソフト図鑑完成ガイドの核心機能である「クロスゲーム管理」の基盤を構築した。

## 実装内容

### 2-1. ポケモンマスターデータ生成

全6ゲームのデータを統合し、ポケモン名をキーにしたクロスゲーム索引を構築。

**新規ファイル:**
- `data/non-breedable.json` — 孵化不可ポケモンリスト（伝説・幻・UB 約85匹）
- `scripts/generate-master-data.js` — マスターデータ生成スクリプト
- `public/pokemon-master.json` — 生成されたマスターデータ（1049匹）

**統計:**
- 全ポケモン: 1049種類
- 孵化可能: 989匹 / 孵化不可: 60匹
- 複数ゲーム登場: 607匹
- 全ゲーム数: 6

### 2-2. クロスゲーム進捗管理

ポケモン名をキーにした全ゲーム横断の進捗管理を追加。

**新規ファイル:**
- `src/types/softZukan.ts` — クロスゲーム関連の型定義
- `src/composables/usePokemonMaster.ts` — マスターデータ読み込み・検索（シングルトンキャッシュ）
- `src/composables/useGlobalProgress.ts` — グローバル進捗管理（localStorage + 既存データ移行）

**変更ファイル:**
- `src/types/index.ts` — `GameConfig` に `platform` / `softZukan` フィールド追加
- `public/zukan-config.json` — 全6ゲームに `platform` / `softZukan` フラグ追加
- `src/composables/useGameData.ts` — `toggleCaught` でグローバル進捗も同期更新

**設計ポイント:**
- デュアル localStorage: 既存 per-game 進捗を維持しつつ、新規グローバル進捗を並行運用
- 初回起動時に既存の per-game データからグローバル進捗へ自動移行
- `softZukan: true`（Switch）と `softZukan: false`（3DS）でソフト図鑑対象を区別

### 2-3. クロスチェックリスト画面

全ゲーム横断でポケモンの取得状況を一覧表示する新しいビュー。

**新規ファイル:**
- `src/views/CrossCheckView.vue` — クロスチェック画面

**変更ファイル:**
- `src/router/index.ts` — `/cross-check` ルート追加
- `src/components/PageNavigation.vue` — 「🔄 クロスチェック」ナビ追加

**機能:**
- 検索バー（ポケモン名検索）
- 4つのフィルター: すべて / ソフト図鑑未登録 / 孵化で登録可 / ゲーム指定
- テーブル: ポケモン名 | SV | SwSh | USUM | SM | ORAS | XY
- 各セル: ✅（取得済み）/ ⭕（未取得・登場あり）/ ー（登場なし）
- セルクリックでキャッチ状態トグル
- 行クリックで詳細パネル（ゲーム別状況 + アドバイス表示）
- ソフト図鑑完成度サマリーカード（完成率 / 登録済み / 残り / 孵化で登録可）

## DLC図鑑と重複登録の扱い

SV・SwShには1ソフトに複数の地方図鑑があり、同じポケモンが複数図鑑に登場する（重複）。
**1回の捕獲で同ソフト内の全図鑑に同時登録されるため、アプリではゲーム単位で捕獲を管理する。**
地方図鑑レベルでの個別追跡は不要。

## ビルド検証

- `npm run type-check` — TypeScript エラーなし
- `npm run build` — Vite ビルド成功
- 既存の HomeView / OverviewView に影響なし

---

*完了日: 2026年2月*
