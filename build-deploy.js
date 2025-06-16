#!/usr/bin/env node

/**
 * 🚀 デプロイ用ビルドスクリプト
 * 
 * このスクリプトは以下を行います：
 * 1. ルートのindex.htmlをdeploy/にコピー
 * 2. 必要なデータファイルもdeploy/にコピー
 * 3. デプロイ準備完了！
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 デプロイ用ビルドを開始...');

// コピーするファイル一覧
const filesToCopy = [
    {
        src: 'index.html',
        dest: 'deploy/index.html',
        description: 'メインアプリケーション'
    },
    {
        src: 'paldea_zukan_data.json',
        dest: 'deploy/paldea_zukan_data.json',
        description: 'ポケモンデータ'
    },
    {
        src: 'zukan-config.json',
        dest: 'deploy/zukan-config.json',
        description: '図鑑設定'
    }
];

// deploy フォルダが存在しない場合は作成
if (!fs.existsSync('deploy')) {
    fs.mkdirSync('deploy');
    console.log('📁 deploy フォルダを作成しました');
}

// ファイルをコピー
let successCount = 0;
let errorCount = 0;

filesToCopy.forEach(file => {
    try {
        if (fs.existsSync(file.src)) {
            fs.copyFileSync(file.src, file.dest);
            console.log(`✅ ${file.description}: ${file.src} → ${file.dest}`);
            successCount++;
        } else {
            console.log(`⚠️  ${file.description}: ${file.src} が見つかりません（スキップ）`);
        }
    } catch (error) {
        console.error(`❌ ${file.description}: ${file.src} のコピーに失敗`, error.message);
        errorCount++;
    }
});

// 結果表示
console.log('\n📊 ビルド結果:');
console.log(`✅ 成功: ${successCount}ファイル`);
if (errorCount > 0) {
    console.log(`❌ エラー: ${errorCount}ファイル`);
}

if (errorCount === 0) {
    console.log('\n🎉 デプロイ準備完了！');
    console.log('💡 deploy/ フォルダの内容をサーバーにアップロードしてください');
} else {
    console.log('\n🚨 エラーが発生しました。上記のメッセージを確認してください');
    process.exit(1);
}