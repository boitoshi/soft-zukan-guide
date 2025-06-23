#!/usr/bin/env node

/**
 * 🔧 剣盾図鑑CSV → JSON変換スクリプト (新版)
 * 
 * カンマ区切りの剣盾図鑑データをJSON形式に変換します
 * - ガラル図鑑
 * - ヨロイ図鑑  
 * - カンムリ図鑑
 */

const fs = require('fs');
const path = require('path');

console.log('🗡️ 剣盾図鑑CSV（新版）の変換を開始...');

// 入力ファイル確認
const inputFile = '../data/raw/剣盾図鑑.csv';
if (!fs.existsSync(inputFile)) {
    console.error('❌ data/raw/剣盾図鑑.csv が見つかりません');
    process.exit(1);
}

// ファイル読み込み
const content = fs.readFileSync(inputFile, 'utf-8');
const lines = content.split('\n').filter(line => line.trim());

console.log(`📖 ${lines.length}行のデータを読み込みました`);

// ヘッダー行をスキップして処理
const pokemonMap = new Map();
let processedCount = 0;

for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // CSVパース（カンマ区切り）
    const parts = line.split(',').map(part => part.trim());
    
    // 各図鑑の情報を処理
    const regions = [];
    const pokedex_numbers = {};
    
    // ガラル図鑑 (列0,1)
    if (parts[0] && parts[1]) {
        regions.push('galar');
        pokedex_numbers.galar = parts[0].padStart(3, '0');
    }
    
    // ヨロイ図鑑 (列2,3)
    if (parts[2] && parts[3] && parts[2] !== parts[0]) {
        regions.push('armor');
        pokedex_numbers.armor = parts[2].padStart(3, '0');
    }
    
    // カンムリ図鑑 (列4,5)
    if (parts[4] && parts[5] && parts[4] !== parts[2]) {
        regions.push('crown');
        pokedex_numbers.crown = parts[4].padStart(3, '0');
    }
    
    // ポケモン名（ガラル図鑑の名前を基準とする）
    const pokemonName = parts[1];
    if (!pokemonName) continue;
    
    // 重複チェック（同じポケモンが複数の図鑑に登録されている場合）
    if (pokemonMap.has(pokemonName)) {
        const existing = pokemonMap.get(pokemonName);
        
        // 新しい図鑑情報をマージ
        regions.forEach(region => {
            if (!existing.regions.includes(region)) {
                existing.regions.push(region);
                existing.pokedex_numbers[region] = pokedex_numbers[region];
            }
        });
    } else {
        // 新しいポケモンを登録
        const pokemonId = `pokemon_${processedCount.toString().padStart(4, '0')}`;
        
        pokemonMap.set(pokemonName, {
            id: pokemonId,
            name: pokemonName,
            regions: regions,
            pokedex_numbers: pokedex_numbers,
            caught: false
        });
        
        processedCount++;
    }
}

// Map を配列に変換
const pokemonArray = Array.from(pokemonMap.values());

// 統計情報を計算
const stats = {
    total: pokemonArray.length,
    galar_only: pokemonArray.filter(p => p.regions.length === 1 && p.regions.includes('galar')).length,
    armor_only: pokemonArray.filter(p => p.regions.length === 1 && p.regions.includes('armor')).length,
    crown_only: pokemonArray.filter(p => p.regions.length === 1 && p.regions.includes('crown')).length,
    duplicates: pokemonArray.filter(p => p.regions.length > 1).length,
    regions: {
        galar: pokemonArray.filter(p => p.regions.includes('galar')).length,
        armor: pokemonArray.filter(p => p.regions.includes('armor')).length,
        crown: pokemonArray.filter(p => p.regions.includes('crown')).length
    }
};

// JSON データ構造
const jsonData = {
    meta: {
        game: "剣盾",
        title: "ポケットモンスター ソード・シールド",
        regions: [
            { id: "galar", name: "ガラル図鑑" },
            { id: "armor", name: "ヨロイ図鑑" },
            { id: "crown", name: "カンムリ図鑑" }
        ],
        generated_at: new Date().toISOString(),
        source: "剣盾図鑑.csv"
    },
    stats: stats,
    pokemon: pokemonArray
};

// JSONファイルに出力
const outputFile = '../data/galar_zukan_data.json';
fs.writeFileSync(outputFile, JSON.stringify(jsonData, null, 2), 'utf-8');

// 設定ファイルの更新
const configFile = '../zukan-config.json';
let config = {};

try {
    if (fs.existsSync(configFile)) {
        config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
    }
} catch (error) {
    console.log('⚠️ 設定ファイルを新規作成します');
}

// 剣盾の設定を更新
config.galar = {
    name: "剣盾",
    displayName: "ポケットモンスター ソード・シールド",
    game: "剣盾",
    regions: [
        { id: "galar", name: "ガラル図鑑" },
        { id: "armor", name: "ヨロイ図鑑" },
        { id: "crown", name: "カンムリ図鑑" }
    ]
};

fs.writeFileSync(configFile, JSON.stringify(config, null, 2), 'utf-8');

// 結果報告
console.log('\n📊 変換結果:');
console.log(`✅ 総ポケモン数: ${stats.total}匹`);
console.log(`⚔️ ガラル図鑑: ${stats.regions.galar}匹`);
console.log(`🛡️ ヨロイ図鑑: ${stats.regions.armor}匹`);
console.log(`👑 カンムリ図鑑: ${stats.regions.crown}匹`);
console.log(`🔄 重複ポケモン: ${stats.duplicates}匹`);
console.log(`📁 出力ファイル: ${outputFile}`);
console.log(`⚙️ 設定ファイル: ${configFile}`);

console.log('\n🎉 変換完了！');
console.log('💡 次のコマンドでサーバーを起動してテストできます:');
console.log('npm run dev');