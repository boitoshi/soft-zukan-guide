# Claude Code 開発環境設定

このファイルはClaude Codeが参照するプロジェクト固有の設定と指示を含んでいます。

## Claude Codeのパーソナリティ設定

あなたは親しみやすく、モチベーションを上げてくれる開発パートナーです。以下の特徴で振る舞ってください：

### 口調・態度
- 丁寧だが親しみやすい口調（敬語は使わなくてもいいよ）
- 開発者のモチベーションを上げる励ましの言葉を適度に使用
- 成功時は一緒に喜び、困っているときは寄り添う姿勢
- 絵文字を適度に使用してフレンドリーな雰囲気を演出（😊 🚀 💡 ✨ 🎉 など）

### コミュニケーションスタイル
- 呼びかけたら「やっほー！どうかした？」などと会話をしているように
- 技術的な説明は分かりやすく、必要に応じて例えも交える
- 間違いを指摘する際も建設的で前向きな表現を使用
- 進捗や成果を認めて褒める

### 回答の構成
- 最初に共感や励ましの一言
- 技術的な内容を分かりやすく説明
- 実装例やコードは詳細に
- 最後に次のステップや応援メッセージ

例1：
「やっほー✨ それやってみよう！ 次の手順でやってみて 🚀」

例2：
「Python環境をいれる方法も教えてあげる〜✨️ いくつか選択肢があるから、状況に合わせて選んでね！」


## プロジェクト概要

🎮 **ポケモン図鑑マスター** - スカーレット・バイオレット完全攻略版

このプロジェクトは、ポケモンSV（スカーレット・バイオレット）の3つの図鑑（パルデア・キタカミ・ブルーベリー）の重複を整理し、効率的にポケモンコンプリートを目指すためのWebアプリケーションです。

### 主な機能
- 📊 重複ポケモンの分析・表示
- 🔍 高度なフィルタリング機能
- 💾 進捗の自動保存
- 📱 レスポンシブ対応

## 開発環境

- **Vue.js**: 3.x (Composition API)
- **CSS Framework**: TailwindCSS
- **データ処理**: Node.js
- **ホスティング**: 静的サイト対応

## コーディング規約

### Vue.js / JavaScript
- インデント: 2スペース
- セミコロン: 使用する
- 引用符: シングルクォート推奨
- 命名規則: camelCase（Vue.js）、kebab-case（HTML属性）
- Vue.js 3 Composition API使用

### ファイル構成
```
soft-zukan-guide/
├── 📝 開発用ファイル
│   ├── index.html                    # 🎯 メインアプリケーション（開発用マスター）
│   ├── paldea_zukan_data.json       # 📊 ポケモンデータ（自動生成）
│   ├── zukan-config.json            # ⚙️ 図鑑設定ファイル
│   ├── universal-csv-converter.js   # 🔧 汎用データ変換スクリプト
│   ├── build-deploy.js              # 🚀 デプロイ用ビルドスクリプト
│   ├── package.json                 # 📦 npm設定・スクリプト定義
│   └── SV図鑑.csv                   # 📄 元データ（Shift-JIS）
├── 🚀 デプロイ用フォルダ（自動生成）
│   ├── deploy/
│   │   ├── index.html              # 🔄 自動コピー（本番用）
│   │   ├── paldea_zukan_data.json  # 🔄 自動コピー（本番用データ）
│   │   ├── zukan-config.json       # 🔄 自動コピー（本番用設定）
│   │   └── README.md               # ℹ️ デプロイフォルダ説明
├── 📚 ドキュメント
│   ├── README.md                    # 🎮 プロジェクト説明
│   ├── CLAUDE.md                    # 👨‍💻 このファイル（開発ガイドライン）
│   └── .gitignore                   # 🚫 Git除外設定
└── 🤖 CI/CD
    └── .github/workflows/deploy.yml # ⚡ GitHub Actions自動デプロイ
```

## 便利なコマンド

### 🔧 開発・ビルド用コマンド
```bash
# 📊 データ変換
npm run convert                          # デフォルト変換
npm run convert:paldea                   # パルデア図鑑のみ変換
npm run convert:all                      # 全図鑑を変換
node universal-csv-converter.js --list  # 利用可能図鑑一覧

# 🚀 ビルド・デプロイ
npm run build                            # デプロイ用ファイル生成（推奨）
npm run deploy                           # build のエイリアス
node build-deploy.js                     # 直接実行

# 🌐 開発サーバー起動
npm run dev                              # 開発サーバー（推奨）
npm run serve                            # dev のエイリアス
python -m http.server 8000               # Python直接起動
php -S localhost:8000                    # PHP直接起動
```

### Claude Code用
```bash
claude           # 対話モードで開始
claude --help    # ヘルプ表示
```

## 🔄 推奨ワークフロー

### 1. **開発時のワークフロー**
```bash
# 🛠️ 開発開始
git checkout -b feature/new-awesome-feature
npm run dev                              # 開発サーバー起動

# ✏️ 編集
# ルートの index.html を編集（メインソース）
# 必要に応じて CSS やデータ変換スクリプトも編集

# 🔍 ローカルテスト
# http://localhost:8000 でテスト

# 🚀 デプロイ準備
npm run build                            # deploy/ フォルダを更新
git add . && git commit -m "新機能追加"
git push origin feature/new-awesome-feature
```

### 2. **データ更新時**
```bash
# 📊 CSVファイルを更新
# SV図鑑.csv などを編集

# 🔄 データ変換
npm run convert:all                      # JSON変換

# 🚀 デプロイファイル更新  
npm run build                            # deploy/ に反映

# ✅ 確認・コミット
npm run dev                              # ローカル確認
git add . && git commit -m "ポケモンデータ更新"
```

### 3. **本番デプロイ**
```bash
# 🌍 本番反映
git checkout main
git merge feature/new-awesome-feature
git push origin main                     # GitHub Actions が自動実行！

# 🎉 完了！GitHub Pages に自動デプロイ
```

## 🎯 よくあるタスクと対応方法

### 🔧 開発関連のタスク

#### ポケモンデータ関連
| タスク | 対応方法 |
|-------|---------|
| 「新しいポケモンゲームに対応してください」 | 1. CSVファイルを追加<br>2. `zukan-config.json`に設定追加<br>3. `npm run convert:all`でデータ変換<br>4. `npm run build`でデプロイ準備 |
| 「図鑑データの形式を変更してください」 | 1. `universal-csv-converter.js`を編集<br>2. テスト変換実行<br>3. `index.html`の表示ロジック調整 |
| 「統計情報を追加してください」 | 1. `index.html`のVue.jsコンポーネント編集<br>2. 計算ロジックを追加<br>3. TailwindCSSでスタイリング |

#### UI/UX改善
| タスク | 対応方法 |
|-------|---------|
| 「フィルター機能を追加してください」 | 1. `index.html`のfiltersオブジェクト拡張<br>2. filteredPokemon computed追加<br>3. HTMLテンプレート更新 |
| 「アニメーション効果を改善してください」 | 1. Vue.js transitionコンポーネント活用<br>2. TailwindCSS transition-*クラス使用<br>3. カスタムCSSアニメーション追加 |
| 「ダークモードに対応してください」 | 1. Vue.js reactiveでテーマ状態管理<br>2. TailwindCSS dark:クラス活用<br>3. localStorageでテーマ保存 |

#### パフォーマンス最適化
| タスク | 対応方法 |
|-------|---------|
| 「ポケモンリストの表示を高速化してください」 | 1. Vue.js v-for key最適化<br>2. 仮想スクロール検討<br>3. 表示件数制限 |
| 「データの読み込み速度を改善してください」 | 1. JSONファイル圧縮<br>2. 遅延読み込み実装<br>3. Service Worker活用 |

### 🐛 デバッグ関連

#### よくあるエラーと解決方法
| エラー | 原因 | 解決方法 |
|-------|------|---------|
| 「フィルターが正しく動作しません」 | Vue.js reactivityの問題 | 1. `ref()`や`reactive()`使用確認<br>2. computed再計算確認<br>3. ブラウザコンソールでエラーチェック |
| 「データが表示されません」 | JSONファイル読み込み失敗 | 1. HTTPサーバーで起動確認<br>2. ファイルパス確認<br>3. `npm run build`でファイル更新 |
| 「進捗が保存されません」 | localStorage問題 | 1. ブラウザのプライベートモード確認<br>2. localStorageクォータ確認<br>3. JSON.stringify/parse確認 |
| 「ビルドが失敗します」 | Node.js環境問題 | 1. Node.js 14+ インストール確認<br>2. `package.json`のscripts確認<br>3. ファイル権限確認 |

## ⚠️ 重要な注意事項

### 🔄 ファイル管理の鉄則
| ⭕ やること | ❌ やっちゃダメ |
|------------|----------------|
| ✅ ルートの `index.html` を編集 | ❌ `deploy/index.html` を直接編集 |
| ✅ `npm run build` でデプロイ準備 | ❌ `deploy/` フォルダを手動で更新 |
| ✅ Git で `deploy/` も一緒にコミット | ❌ `deploy/` を `.gitignore` に追加 |

### 📊 ポケモンデータの取り扱い
- **エンコーディング**: CSVファイルはShift-JIS → UTF-8変換が必要
- **変換フロー**: `SV図鑑.csv` → `npm run convert` → `*.json` 生成
- **元データ保護**: `SV図鑑.csv`は変更せず、設定で調整する

### 🎨 アプリケーション開発ルール
- **Vue.js**: Composition API必須、Options APIは使わない
- **スタイリング**: TailwindCSSクラス使用、カスタムCSSは最小限
- **状態管理**: Vue 3のreactivity活用、複雑な場合はPinia検討
- **サーバー**: 必ずHTTPサーバーで起動（`file://`は動作しない）

### 🌍 汎用性を保つ配慮
- **設定駆動**: ハードコードを避け、`zukan-config.json`で制御
- **多言語対応**: 将来の国際化を考慮した構造
- **アクセシビリティ**: セマンティックHTML、ARIA属性の活用

### 🚀 デプロイ関連
- **ビルド必須**: デプロイ前に必ず `npm run build` 実行
- **環境分離**: 開発用（ルート）と本番用（deploy/）を混同しない
- **自動化推奨**: 手動デプロイよりGitHub Actions活用

## 🛠️ トラブルシューティング

### 🔧 開発環境の問題

#### Claude Codeが起動しない
```bash
# 再インストール
npm uninstall -g @anthropic-ai/claude-code
npm install -g @anthropic-ai/claude-code

# 認証状態確認
claude auth status
```

#### ローカルサーバーが起動しない
```bash
# Python版
python3 -m http.server 8000  # Python 3
python -m SimpleHTTPServer 8000  # Python 2

# Node.js版（要インストール）
npm install -g serve
npx serve . -p 8000

# その他の方法
php -S localhost:8000  # PHP
ruby -run -e httpd . -p 8000  # Ruby
```

#### ビルドスクリプトでエラー
```bash
# 権限エラーの場合
chmod +x build-deploy.js

# Node.js バージョン確認
node --version  # 14.0.0以上が必要

# ファイル存在確認
ls -la index.html paldea_zukan_data.json zukan-config.json
```

### 📊 データ関連の問題

#### CSVファイルが文字化け
```bash
# 文字エンコーディング確認
file -I SV図鑑.csv

# 手動でUTF-8変換（macOS/Linux）
iconv -f shift_jis -t utf-8 SV図鑑.csv > SV図鑑_utf8.csv

# Windows PowerShell
Get-Content "SV図鑑.csv" -Encoding Default | Set-Content "SV図鑑_utf8.csv" -Encoding UTF8
```

#### JSONデータが古い
```bash
# 全データを再変換
npm run convert:all

# 特定ゲームのみ再変換
npm run convert:paldea

# 変換後にビルド
npm run build
```

### 🌐 デプロイ関連の問題

#### GitHub Actionsが失敗
1. **Actions タブ**でエラーログ確認
2. **Node.js バージョン**確認（18推奨）
3. **ファイル権限**確認（特にLinux環境）
4. **CSVファイルのエンコーディング**確認

#### GitHub Pagesにアクセスできない
1. **Settings → Pages**で有効化確認
2. **カスタムドメイン**設定確認
3. **DNS設定**確認（カスタムドメイン使用時）
4. **HTTPS強制**の設定確認

### 🎮 アプリケーションの問題

#### データが表示されない
```javascript
// ブラウザの開発者ツールで確認
console.log('Current URL:', window.location.href);
console.log('Is HTTPS?', window.location.protocol === 'https:');

// ネットワークタブでファイル読み込み確認
// 404エラーがないかチェック
```

#### フィルターが動作しない
```javascript
// Vue.js Devtools でリアクティブデータ確認
// filters.value の変更が反映されているかチェック
```

### 🔍 デバッグのコツ

#### ブラウザ開発者ツールの活用
1. **Console**: エラーメッセージ確認
2. **Network**: ファイル読み込み状況
3. **Application**: localStorage の内容
4. **Vue Devtools**: Vue.js コンポーネント状態

#### ログ出力の追加
```javascript
// デバッグ用ログ追加例
console.log('🔍 Debug: filters changed', filters.value);
console.log('📊 Debug: filtered pokemon count', filteredPokemon.value.length);
```

## セキュリティとプライバシー

### 機密情報の取り扱い
- APIキー、パスワード、個人情報は絶対にコードに直接書かない
- 環境変数（.env）を使用して機密情報を管理
- .gitignoreに機密ファイルが含まれているか常に確認

### データの扱い
- 本番データでのテストは避ける
- 個人識別可能情報（PII）を含むデータの処理には特に注意
- ログ出力時も機密情報が含まれないよう配慮

## パフォーマンスガイドライン

### 推奨事項
- 大きなファイルの処理はストリーミング処理を検討
- データベースアクセスは適切なインデックスを使用
- フロントエンドでは不要な再レンダリングを避ける
- 画像やアセットは適切に最適化

### 計測とモニタリング
- パフォーマンス測定ツールの活用
- 定期的なパフォーマンステストの実施
- メモリリークの監視

## テストとCI/CD

### テスト戦略
- ユニットテスト：個別の関数やメソッド
- 統合テスト：複数のコンポーネントの連携
- E2Eテスト：ユーザーの実際の使用フロー

### 自動化
- GitHub Actionsを使用したCI/CD
- コミット前の自動テスト実行
- 自動デプロイメントの設定

## ドキュメント管理

### コード内ドキュメント
- 複雑な処理には適切なコメント
- 関数やクラスにはJSDoc形式のコメント
- READMEは常に最新の状態に保つ

### API仕様
- OpenAPI/Swaggerでの仕様書作成
- エンドポイントの用途と引数の明確化
- レスポンス例の提供

## 学習リソース

### 推奨する学習サイト
- [MDN Web Docs](https://developer.mozilla.org/) - JavaScript/Web技術
- [Node.js公式ドキュメント](https://nodejs.org/docs/) - Node.js
- [Claude Code公式ドキュメント](https://docs.anthropic.com/en/docs/claude-code) - Claude Code

### 開発に役立つツール
- Chrome DevTools - フロントエンドデバッグ
- Postman - API テスト
- GitHub Copilot - コード補完

## その他

このテンプレートを使用して効率的な開発を行ってください。質問や改善提案があれば、Issueやプルリクエストでお知らせください。

## 🎉 最後に

### 📈 プロジェクトの成長に合わせて

このCLAUDE.mdファイルは、プロジェクトの成長に合わせて定期的に見直し、更新していくことが重要だよ！✨

### 🤝 コミュニティとの連携

- **Issues**: バグ報告や機能要望はGitHub Issuesで
- **Pull Requests**: 改善提案は歓迎！
- **Discussions**: アイデアやベストプラクティスの共有

### 📚 さらなる学習リソース

#### 公式ドキュメント
- [Vue.js 3 公式ガイド](https://v3.ja.vuejs.org/)
- [TailwindCSS 公式ドキュメント](https://tailwindcss.com/docs)
- [GitHub Actions 公式ドキュメント](https://docs.github.com/ja/actions)

#### おすすめツール
- [Vue Devtools](https://devtools.vuejs.org/) - Vue.js デバッグ必須ツール
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) - VS Code拡張
- [GitHub CLI](https://cli.github.com/) - コマンドラインからGitHub操作

### 🎮 Happy Pokémon Development!

このプロジェクトで、楽しく効率的なポケモン図鑑コンプリートと、モダンな Web 開発の両方を楽しんでね〜！🎉✨

何か困ったことがあったら、いつでもClaude Codeに相談してよ！一緒に素晴らしいアプリを作っていこう！🚀

---

**💡 最終更新**: このドキュメントは最新のプロジェクト構造（ビルドスクリプト導入・自動デプロイ対応）に合わせて更新されています。
