# Vue 3 コンポーネント設計書

## 🎯 現状分析

**現在のindex.html**は、全ての機能が1つのファイルに入っていて：
- ゲーム選択
- フィルター機能  
- ポケモンリスト表示
- 統計ダッシュボード
- バージョン限定機能

これらを**再利用可能なコンポーネント**に分割します。

## 🧩 コンポーネント設計

### 1. **AppNavigation.js**
```javascript
// ナビゲーションヘッダー
props: {
  currentPage: String
}
```

### 2. **GameSelector.js**
```javascript  
// ゲーム選択画面
props: {
  availableGames: Array
}
emits: {
  'game-selected': (gameId) => {...}
}
```

### 3. **StatsPanel.js**
```javascript
// 統計ダッシュボード
props: {
  stats: Object,
  caughtCount: Number,
  totalCount: Number,
  progressPercent: Number
}
```

### 4. **FilterPanel.js**
```javascript
// フィルター機能（バージョン限定含む）
props: {
  selectedGame: Object,
  versionFilters: Object
}
emits: {
  'filter-change': (filters) => {...}
}
```

### 5. **PokemonCard.js**
```javascript
// 個別ポケモンカード
props: {
  pokemon: Object,
  selectedGame: Object
}
emits: {
  'toggle-caught': (pokemonId) => {...}
}
```

### 6. **PokemonList.js**
```javascript
// ポケモンリスト容器
props: {
  filteredPokemon: Array,
  selectedGame: Object
}
emits: {
  'toggle-caught': (pokemonId) => {...}
}
```

## 📁 ディレクトリ構造

```
soft-zukan-guide/
├── components/
│   ├── AppNavigation.js
│   ├── GameSelector.js
│   ├── StatsPanel.js
│   ├── FilterPanel.js
│   ├── PokemonCard.js
│   └── PokemonList.js
├── composables/
│   ├── useGameData.js      // ゲームデータ管理
│   ├── usePokemonFilter.js // フィルター機能
│   └── useLocalStorage.js  // 進捗保存
├── data/
│   └── (既存のJSONファイル)
├── index.html              // メインアプリ
└── zukan-overview.html     // 一覧表示
```

## 🔄 データフロー

```
App (index.html)
├── AppNavigation
├── GameSelector → emit: game-selected
├── StatsPanel ← props: stats
├── FilterPanel → emit: filter-change  
└── PokemonList
    └── PokemonCard → emit: toggle-caught
```

## 🚀 実装ステップ

### Phase 1: 基本コンポーネント
1. AppNavigation コンポーネント作成
2. PokemonCard コンポーネント抽出
3. 既存index.htmlでコンポーネント利用開始

### Phase 2: 複雑なコンポーネント
4. FilterPanel コンポーネント作成（バージョンフィルター含む）
5. GameSelector コンポーネント作成
6. StatsPanel コンポーネント作成

### Phase 3: Composables作成
7. useGameData composable作成
8. usePokemonFilter composable作成
9. useLocalStorage composable作成

### Phase 4: 統合テスト
10. 全機能の動作確認
11. パフォーマンス最適化

## 💡 Vue 3の活用ポイント

- **Composition API**: setup()関数でロジック整理
- **defineComponent**: 型安全なコンポーネント定義
- **reactive/ref**: リアクティブなデータ管理
- **computed**: 計算済みプロパティの活用
- **emit**: 親子間の通信
- **composables**: ロジックの再利用

---
*設計日: 2025年6月24日*
*実装開始準備完了*