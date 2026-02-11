# ポケモンHOMEソフト図鑑ガイド - 設計書

## プロジェクト概要

**Pokémon HOME のソフト図鑑完成を支援するWebアプリ**

### 技術スタック
- **フロントエンド**: Vue 3.5+ (`<script setup>`) + TypeScript 5.6+
- **ビルド**: Vite 6.0+
- **CSS**: TailwindCSS 4.x (npm版)
- **ルーティング**: Vue Router 4.x
- **永続化**: localStorage
- **データ**: 静的JSON（pokemon-master.json + ゲーム別データ）

### ユーザーの使い方
1. Pokémon HOME でソフト図鑑を確認 → 未登録ポケモンを発見
2. このアプリを開く → そのポケモンを検索
3. アプリが教える:
   - どのゲームで捕まえられる？
   - バージョン限定？
   - 別のゲームで持ってるなら孵化でOK？

---

## アーキテクチャ

### ページ構成

| パス | ビュー | 説明 |
|------|--------|------|
| `/` | HomeView | ゲーム別トラッカー（既存機能） |
| `/cross-check` | CrossCheckView | 全ゲーム横断チェックリスト |
| `/overview` | OverviewView | 図鑑一覧表示 |
| `/advisor` | AdvisorView | スマートアドバイス（Phase 3予定） |
| `/guide` | GuideView | 産地マークガイド（Phase 4予定） |

### Composables

| ファイル | 責務 |
|----------|------|
| `useGameData.ts` | ゲーム別データの読み込み・管理・トグル |
| `useLocalStorage.ts` | per-game 進捗のlocalStorage読み書き |
| `usePokemonFilter.ts` | ポケモンリストのフィルタリング |
| `usePokemonMaster.ts` | マスターデータ（全ゲーム横断索引）の読み込み・検索 |
| `useGlobalProgress.ts` | 全ゲーム横断の進捗管理（ポケモン名ベース） |

### データフロー

```
zukan-config.json ─→ useGameData ─→ HomeView / OverviewView
                                  ↓
                           useLocalStorage (per-game進捗)
                                  ↓
pokemon-master.json ─→ usePokemonMaster ─→ CrossCheckView
                                          ↓
                                   useGlobalProgress (横断進捗)
```

### localStorage 設計

| キー | 用途 | 管理元 |
|------|------|--------|
| `pokemonProgress_{gameId}` | ゲーム別進捗（ID→caught） | useLocalStorage |
| `selectedGame` | 最後に選択したゲーム | useLocalStorage |
| `softZukanProgress` | グローバル進捗（名前→ゲームID配列） | useGlobalProgress |
| `softZukanMigrated` | per-game→グローバル移行済みフラグ | useGlobalProgress |

---

## データ設計

### ポケモンマスターデータ（pokemon-master.json）

全6ゲームのデータを統合した横断索引。ポケモン名をユニークキーとして使用。

```json
{
  "name": "イーブイ",
  "breedable": true,
  "games": {
    "paldea": { "id": "179", "regions": ["paldea"] },
    "galar": { "id": "074", "regions": ["galar", "crown_tundra"] }
  }
}
```

- **ユニークキー**: ポケモン名（日本語）— 全1049種で一意性を検証済み
- **孵化判定**: ネガティブリスト方式（`data/non-breedable.json` に約85匹の伝説・幻を列挙）

### ゲーム設定（zukan-config.json）

```json
{
  "id": "paldea",
  "name": "スカーレット・バイオレット",
  "platform": "switch",
  "softZukan": true,
  "dataFile": "/paldea_zukan_data.json",
  "regions": [...]
}
```

- **`softZukan: true`**: ソフト図鑑完成対象（Switch以降）
- **`softZukan: false`**: 参考情報のみ（3DSソフト）

### DLC図鑑と重複登録

SV・SwShには1ソフトに複数の地方図鑑がある。

**重要ルール: 同じソフト内の複数図鑑に登場するポケモンは、1回の捕獲で全図鑑に同時登録される。**

例: SVのコンパンはパルデア・キタカミ・ブルーベリーの3図鑑に登場 → 1匹捕まえれば3枠埋まる。

そのため、ソフト図鑑完成に必要な実際の捕獲数は「ユニークポケモン数」（＝総数 − 重複数）。

| ソフト | 図鑑合計枠 | 重複 | ユニーク数 |
|--------|-----------|------|-----------|
| SV | 669 | 180 | 489 |
| SwSh | 642 | 231 | 411 |

アプリ内ではゲーム単位（例: `paldea`）で捕獲を管理する。地方図鑑レベルでの個別追跡は不要。

### バージョン限定データ

ガラル（ソード・シールド）のバージョン限定を実装済み。

```json
{
  "version_info": {
    "sword_shield": { "availability": "sword" | "shield" | "both" }
  }
}
```

- ソード限定: 36匹（ザシアン含む）
- シールド限定: 33匹（ザマゼンタ含む）

---

## 設計上の重要な判断

### ポケモン名をクロスゲームキーに採用
- 全6ゲームでポケモン名はユニーク（1049種類で検証済み）
- 既存データファイルの変更不要
- 地方図鑑番号はゲーム間で異なるため使えない

### デュアルlocalStorage（既存 + グローバル）
- 既存の per-game 進捗をそのまま維持（後方互換）
- 新規のグローバル進捗を並行運用
- `toggleCaught` で両方を同期更新
- 初回起動時に既存データから自動移行

### ゲーム内捕獲場所データは含めない
- ルート情報は膨大で、攻略wikiの領域
- このアプリは「どのゲームで？孵化で行ける？」に特化

---

*最終更新: 2026年2月 - Phase 2（クロスゲーム基盤）実装完了時点*
