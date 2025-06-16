し# 🚀 ConoHa WING デプロイガイド

## 📁 アップロードするファイル

このフォルダの2つのファイルだけをアップロードすればOK！

```
deploy/
├── index.html         # メインアプリケーション
└── pokemon_data.json  # ポケモンデータ
```

## 🌐 ConoHa WINGへのアップロード手順

### 方法1: ファイルマネージャー（推奨）

1. **ConoHa WINGコントロールパネル**にログイン
2. **サイト管理** → **ファイルマネージャー**を開く
3. **public_html**フォルダを開く
4. `index.html`と`pokemon_data.json`をアップロード
5. 完了！🎉

### 方法2: FTP/SFTPクライアント

```bash
# FTP情報（ConoHaコントロールパネルで確認）
ホスト: your-domain.com
ユーザー: FTPユーザー名
パスワード: FTPパスワード
ポート: 21 (FTP) / 22 (SFTP)
```

1. FTPクライアント（FileZilla等）で接続
2. `public_html`フォルダに移動
3. 2つのファイルをアップロード
4. 完了！🎉

### 方法3: Git（上級者向け）

```bash
# このリポジトリをクローン
git clone https://github.com/your-repo/pokemon-zukan-master.git
cd pokemon-zukan-master/deploy

# ファイルをコピー
cp index.html pokemon_data.json /path/to/public_html/
```

## ✅ 動作確認

1. ブラウザで `https://yourdomain.com` にアクセス
2. ポケモン図鑑マスターが表示されることを確認
3. フィルター機能やクリック機能をテスト
4. 完璧に動作！🎮✨

## 🔧 必要に応じて

### カスタムドメイン設定
ConoHa WINGでカスタムドメインを設定済みの場合、そのままアクセス可能

### SSL証明書
ConoHa WINGの無料SSL証明書を有効にすることを推奨（https://で安全にアクセス）

### 更新時
- データを更新したい場合は`pokemon_data.json`を再アップロード
- デザインを変更したい場合は`index.html`を再アップロード

## 🚨 注意事項

- **HTTPサーバー**が必要なので、ファイルを直接開くのではなくWebサーバー経由でアクセス
- ConoHa WINGの静的サイトホスティングなら自動的にHTTPサーバーとして動作
- データは`localStorage`に保存されるため、ブラウザごとに進捗が管理される

## 🎉 完了！

これでポケモン図鑑マスターがインターネット上で利用可能になりました！
友達とも共有できるし、どこからでもアクセスできるよ 🌍✨
