# 🎮 ポケモン図鑑マスター

**スカーレット・バイオレット完全攻略版**

Vue.js で作られたモダンなポケモン図鑑コンプリートガイドです。パルデア、キタカミ、ブルーベリー図鑑の重複を整理し、効率的にポケモンコンプリートを目指せます！

![ポケモン図鑑マスター](https://img.shields.io/badge/ポケモン-781匹対応-blue) ![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC)

## ✨ 特徴

### 🔍 高度なフィルタリング機能
- **図鑑別表示**: パルデア・キタカミ・ブルーベリー図鑑それぞれで絞り込み
- **重複分析**: 複数図鑑に登録されているポケモンを一目で確認
- **ゲット状況**: ゲット済み・未ゲットで絞り込み
- **名前検索**: ポケモン名でリアルタイム検索

### 📊 詳細な統計情報
- 総ポケモン数: **781匹**
- 重複ポケモン: **32匹**
- パルデア専用: **314匹**
- キタカミ専用: **178匹**
- ブルーベリー専用: **257匹**

### 💾 自動保存機能
- ゲット状況はローカルストレージに自動保存
- ブラウザを閉じても進捗が保持される

### 🎨 モダンなUI/UX
- Vue.js 3 Composition API使用
- TailwindCSSによる美しいデザイン
- スムーズなアニメーション効果
- レスポンシブ対応

## 🚀 クイックスタート

### 1. ファイルをダウンロード

```bash
git clone https://github.com/your-username/pokemon-zukan-master.git
cd pokemon-zukan-master
```

### 2. データを準備

```bash
# CSVからJSONへの変換
node universal-csv-converter.js paldea
# または全図鑑を変換
node universal-csv-converter.js --all
```

### 3. アプリを起動

```bash
# 開発サーバーで起動（推奨）
python -m http.server 8000
# または
php -S localhost:8000
# または
npx serve .
```

### 4. ブラウザでアクセス

http://localhost:8000 にアクセスして完了！🎉

## 📁 プロジェクト構成

```
soft-zukan-guide/
├── index.html                    # メインアプリケーション（開発用）
├── paldea_zukan_data.json       # ポケモンデータ（自動生成）
├── zukan-config.json            # 図鑑設定ファイル
├── universal-csv-converter.js   # 汎用データ変換スクリプト
├── SV図鑑.csv                   # 元データ（Shift-JIS）
├── deploy/                      # 🚀 デプロイ用フォルダ
│   ├── index.html              # デプロイ版アプリ
│   ├── paldea_zukan_data.json  # デプロイ用データ
│   ├── zukan-config.json       # デプロイ用設定
│   └── DEPLOY.md               # デプロイガイド
├── README.md                    # このファイル
├── CLAUDE.md                    # 開発ガイドライン
└── .gitignore                   # Git除外設定
```

## 🎯 使い方

### 基本操作
1. **ポケモンリスト**からポケモンをクリックしてゲット状況を切り替え
2. **フィルター**で表示を絞り込み
3. **検索バー**でポケモン名を検索
4. **統計ダッシュボード**で進捗を確認

### フィルター機能詳細

| フィルター | 説明 |
|-----------|------|
| 🏔️ パルデア図鑑 | パルデア図鑑に登録されているポケモンのみ表示 |
| 🍂 キタカミ図鑑 | キタカミ図鑑に登録されているポケモンのみ表示 |
| 🫐 ブルーベリー図鑑 | ブルーベリー図鑑に登録されているポケモンのみ表示 |
| 🔄 重複ポケモン | 複数の図鑑に登録されているポケモンのみ表示 |
| ⭐ 重複なし | 1つの図鑑にのみ登録されているポケモンを表示 |

## 🔧 技術仕様

### フロントエンド
- **Vue.js 3** - Progressive Framework
- **Composition API** - モダンなVue開発手法
- **TailwindCSS** - ユーティリティファーストCSS
- **Vanilla JavaScript** - 軽量でシンプル

### データ処理
- **Node.js** - CSVからJSONへの変換
- **UTF-8エンコーディング** - 日本語文字対応
- **LocalStorage** - クライアントサイド保存

### 対応ブラウザ
- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 🎨 カスタマイズ

### 他のポケモンゲームに対応

1. **CSVデータを準備**
   ```csv
   図鑑名1,ポケモン名,図鑑名2,ポケモン名,図鑑名3,ポケモン名
   1,ピカチュウ,1,ピカチュウ,,
   ```

2. **変換スクリプトを実行**
   ```bash
   node convert-csv-to-json.js
   ```

3. **アプリの図鑑名を変更**
   ```javascript
   // index.html の getRegionName 関数を編集
   const getRegionName = (region) => {
       const names = {
           region1: '🔥 新図鑑1',
           region2: '💧 新図鑑2',
           region3: '⚡ 新図鑑3'
       };
       return names[region] || region;
   };
   ```

### デザインのカスタマイズ

TailwindCSSクラスを編集して、お好みの色合いやレイアウトにカスタマイズできます：

```html
<!-- グラデーション背景を変更 -->
<body class="bg-gradient-to-br from-red-50 via-yellow-50 to-orange-50">

<!-- カードの色を変更 -->
<div class="bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
```

## 🐛 トラブルシューティング

### データが表示されない
- `pokemon_data.json` が正しく生成されているか確認
- ブラウザの開発者ツールでコンソールエラーをチェック
- HTTPサーバーで起動しているか確認（file://では動作しません）

### 文字化けする
- CSVファイルのエンコーディングがShift-JISかUTF-8か確認
- `convert-csv-to-json.js`のエンコーディング設定を調整

### 進捗が保存されない
- ブラウザのローカルストレージが有効か確認
- プライベートブラウジングモードを使用していないか確認

## 🤝 コントリビュート

プルリクエストやイシューの報告を歓迎します！

1. このリポジトリをフォーク
2. フィーチャーブランチを作成
3. 変更をコミット
4. ブランチにプッシュ
5. プルリクエストを作成

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照

## 💡 今後の予定

- [ ] PWA対応（オフライン利用可能）
- [ ] ダークモード対応
- [ ] エクスポート・インポート機能
- [ ] ポケモン画像表示
- [ ] 音声対応（ポケモンの鳴き声）
- [ ] 図鑑説明文表示
- [ ] フィルター条件の保存
- [ ] 統計グラフ表示

## 🎉 謝辞

- ポケモンデータの提供元
- Vue.js & TailwindCSS コミュニティ
- すべてのコントリビューター

---

**Happy Pokémon Hunting! 🎮✨**

> このツールでポケモンコンプリートの旅を楽しんでください！
> バグ報告や機能要望があれば、お気軽にIssueを作成してくださいね 😊