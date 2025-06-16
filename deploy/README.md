# 🚀 デプロイフォルダ

⚠️ **重要**: このフォルダのファイルは自動生成されます！直接編集しないでください。

## 📁 構成

```
deploy/
├── index.html                # 🔄 自動生成（ルートからコピー）
├── paldea_zukan_data.json   # 🔄 自動生成（ルートからコピー）
├── zukan-config.json        # 🔄 自動生成（ルートからコピー）
└── README.md                # このファイル
```

## 🔧 ビルド方法

### 自動ビルド（推奨）

```bash
# npm scripts を使用
npm run build
# または
npm run deploy
```

### 手動ビルド

```bash
# Node.js スクリプトを直接実行
node build-deploy.js
```

## 🌐 デプロイ方法

### GitHub Pages
- GitHub Actions で自動デプロイ
- main ブランチにプッシュ時に自動実行

### レンタルサーバー（ConoHa WING等）
```bash
# このフォルダの内容をサーバーの public_html にアップロード
scp deploy/* user@server:/path/to/public_html/
```

### その他のホスティング
- このフォルダの内容をそのままアップロード
- `index.html` がエントリーポイント

## ⚠️ 注意事項

1. **直接編集禁止**: このフォルダのファイルを直接編集しないでください
2. **ソースはルート**: 編集はルートの `index.html` などで行ってください
3. **自動同期**: ビルドコマンドで最新の状態に同期されます

## 🔄 更新フロー

1. ルートの `index.html` を編集
2. `npm run build` でデプロイフォルダを更新
3. Git にコミット・プッシュ
4. 自動デプロイ実行 🎉