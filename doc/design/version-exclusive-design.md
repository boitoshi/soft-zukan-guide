# バージョン限定機能 - データ構造設計

## 現在のデータ構造
```json
{
  "id": 1,
  "name": "ニャオハ",
  "regions": ["paldea"],
  "pokedex_numbers": {
    "paldea": 1,
    "kitakami": null,
    "blueberry": null
  },
  "caught": false
}
```

## 新しいデータ構造（バージョン情報追加）

### 1. 個別ポケモンデータ
```json
{
  "id": 1,
  "name": "ニャオハ",
  "regions": ["paldea"],
  "pokedex_numbers": {
    "paldea": 1,
    "kitakami": null,
    "blueberry": null
  },
  "caught": false,
  "version_info": {
    "scarlet_violet": {
      "availability": "both",  // "scarlet", "violet", "both"
      "notes": null
    },
    "sword_shield": {
      "availability": "none",  // "sword", "shield", "both", "none"
      "notes": null
    }
  }
}
```

### 2. バージョン限定の場合
```json
{
  "id": 42,
  "name": "アルマロン",
  "regions": ["paldea"],
  "pokedex_numbers": {
    "paldea": 42
  },
  "caught": false,
  "version_info": {
    "scarlet_violet": {
      "availability": "scarlet",
      "notes": "スカーレット限定"
    },
    "sword_shield": {
      "availability": "none",
      "notes": null
    }
  }
}
```

### 3. ソード・シールド限定の場合
```json
{
  "id": 200,
  "name": "ザシアン", 
  "regions": ["galar"],
  "pokedex_numbers": {
    "galar": 200
  },
  "caught": false,
  "version_info": {
    "scarlet_violet": {
      "availability": "none",
      "notes": null
    },
    "sword_shield": {
      "availability": "sword",
      "notes": "ソード限定伝説ポケモン"
    }
  }
}
```

## アイコン表示ルール

### スカーレット・バイオレット
- 🔴 `scarlet` - スカーレット限定
- 🟣 `violet` - バイオレット限定  
- 🤝 `both` - 共通
- ⚫ `none` - 対象外

### ソード・シールド
- 🗡️ `sword` - ソード限定
- 🛡️ `shield` - シールド限定
- 🤝 `both` - 共通
- ⚫ `none` - 対象外

## フィルター機能

### 新しいフィルターオプション
```json
{
  "scarlet_violet_filter": {
    "all": "全て",
    "scarlet": "🔴 スカーレット限定",
    "violet": "🟣 バイオレット限定", 
    "both": "🤝 共通",
    "none": "対象外"
  },
  "sword_shield_filter": {
    "all": "全て",
    "sword": "🗡️ ソード限定",
    "shield": "🛡️ シールド限定",
    "both": "🤝 共通", 
    "none": "対象外"
  }
}
```

## 実装方針

### Phase 1: データ構造拡張
1. 既存JSONにversion_infoフィールド追加
2. 全ポケモンにデフォルト値設定
3. バージョン限定ポケモンの情報手動設定

### Phase 2: UI実装
1. フィルター機能拡張
2. ポケモンカードにアイコン表示
3. 統計情報にバージョン別カウント追加

### Phase 3: データ自動化
1. Serebii.netからのデータ取得スクリプト作成
2. 定期的なデータ更新機能

## 必要なバージョン限定ポケモンリスト

### スカーレット・バイオレット
**スカーレット限定:**
- アルマロン (Fire/Psychic)
- コライドン (Fighting/Dragon)
- その他パラドックスポケモン等

**バイオレット限定:**
- ソウブレイズ (Fire/Ghost)
- ミライドン (Electric/Dragon)
- その他パラドックスポケモン等

### ソード・シールド
**ソード限定:**
- ザシアン (Fairy/Steel)
- その他専用ポケモン

**シールド限定:**
- ザマゼンタ (Fighting/Steel)
- その他専用ポケモン

---
*作成日: 2025年6月24日*
*Phase 1実装開始予定*