# 🚀 GitHub Pages デプロイガイド

## 📋 デプロイ手順

### 1. リポジトリ設定

1. **GitHub リポジトリ**にコードをプッシュ
2. **Settings** → **Pages** を開く
3. **Source** で「GitHub Actions」を選択
4. 自動デプロイが開始される 🎉

### 2. アクセス方法

デプロイ完了後、以下のURLでアクセス可能：

```
https://[ユーザー名].github.io/[リポジトリ名]/
```

### 3. 自動デプロイの仕組み

- **mainブランチ**にプッシュ時に自動実行
- **CSVファイル**を自動的にJSONに変換
- **GitHub Pages**に最新版をデプロイ

## 🎮 新しいゲーム図鑑の追加方法

### 1. CSVファイルを準備

```csv
図鑑番号1,ポケモン名1,図鑑番号2,ポケモン名2,図鑑番号3,ポケモン名3
1,ピカチュウ,1,ピカチュウ,,
2,ライチュウ,,,1,ライチュウ
```

### 2. 設定ファイルに追加

`zukan-config.json` に新しいゲーム設定を追加：

```json
{
  "new_game": {
    "name": "新しいゲーム",
    "displayName": "🎮 新ゲーム図鑑",
    "csvFile": "new_game.csv",
    "encoding": "shift_jis",
    "regions": [
      {
        "id": "region1",
        "name": "🔥 エリア1",
        "columns": [0, 1]
      }
    ]
  }
}
```

### 3. GitHubにプッシュ

```bash
git add .
git commit -m "新しいゲーム図鑑を追加"
git push origin main
```

自動的に変換・デプロイされます！🎉

## 🛠️ ローカルでのテスト

### データ変換テスト

```bash
# 特定のゲームを変換
node universal-csv-converter.js paldea

# 全ゲームを変換
node universal-csv-converter.js --all

# 利用可能なゲーム一覧
node universal-csv-converter.js --list
```

### ローカルサーバー起動

```bash
# Python
python -m http.server 8000

# Node.js
npx serve .

# PHP
php -S localhost:8000
```

## 📊 対応済みゲーム

| ゲーム | 設定ID | CSVファイル | 状況 |
|--------|--------|-------------|------|
| スカーレット・バイオレット | `paldea` | `SV図鑑.csv` | ✅ 対応済み |
| ソード・シールド | `galar` | `swsh_zukan.csv` | 🔄 設定のみ |
| サン・ムーン | `alola` | `sm_zukan.csv` | 🔄 設定のみ |

## 🔧 トラブルシューティング

### デプロイが失敗する場合

1. **Actions タブ**でエラーログを確認
2. **CSVファイル**のエンコーディングを確認
3. **設定ファイル**の JSON 構文をチェック

### データが表示されない場合

1. **ブラウザの開発者ツール**でエラーを確認
2. **JSONファイル**が正しく生成されているかチェック
3. **HTTPSアクセス**を確認（GitHub Pagesは自動HTTPS）

## 🎯 カスタムドメイン設定

1. **Settings** → **Pages** → **Custom domain**
2. ドメイン名を入力（例: `pokemon.example.com`）
3. DNSでCNAMEレコードを設定
4. SSL証明書が自動発行される

## 📱 PWA対応（将来予定）

- オフライン対応
- アプリとしてインストール可能
- プッシュ通知対応

---

**Happy Pokémon Hunting with GitHub! 🎮✨**