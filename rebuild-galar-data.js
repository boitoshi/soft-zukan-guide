#!/usr/bin/env node

/**
 * 🔧 剣盾図鑑データ完全再構築スクリプト
 * 
 * CSVファイルから正確な図鑑登録状況を読み取り、
 * 各ポケモンがどの図鑑に登録されているかを正確に設定します
 */

const fs = require('fs');
const path = require('path');

console.log('🗡️ 剣盾図鑑データを完全再構築します...');

// 入力ファイルのパス
const inputFile = '/Users/akabros/Downloads/SV・剣盾図鑑 - 剣盾まとめ.csv';
if (!fs.existsSync(inputFile)) {
    console.error('❌ CSVファイルが見つかりません:', inputFile);
    process.exit(1);
}

// ファイル読み込み
const content = fs.readFileSync(inputFile, 'utf-8');
const lines = content.split('\n').filter(line => line.trim());

console.log(`📖 ${lines.length}行のデータを読み込みました`);

// ポケモンデータを格納するマップ
const pokemonMap = new Map();
let pokemonCounter = 0;

// ヘッダー行をスキップして処理
for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // CSVパース（カンマ区切り）
    const parts = line.split(',').map(part => part.trim());
    
    // データ構造: [ガラル番号, ガラル名, ヨロイ番号, ヨロイ名, カンムリ番号, カンムリ名]
    const galarNum = parts[0];
    const galarName = parts[1];
    const armorNum = parts[2];
    const armorName = parts[3];
    const crownNum = parts[4];
    const crownName = parts[5];
    
    // ガラル図鑑の処理（必須）
    if (galarNum && galarName) {
        const pokemonKey = galarName;
        
        if (!pokemonMap.has(pokemonKey)) {
            pokemonMap.set(pokemonKey, {
                id: `pokemon_${pokemonCounter.toString().padStart(4, '0')}`,
                name: galarName,
                regions: [],
                pokedex_numbers: {},
                caught: false
            });
            pokemonCounter++;
        }
        
        const pokemon = pokemonMap.get(pokemonKey);
        if (!pokemon.regions.includes('galar')) {
            pokemon.regions.push('galar');
            pokemon.pokedex_numbers.galar = galarNum.padStart(3, '0');
        }
    }
    
    // ヨロイ図鑑の処理
    if (armorNum && armorName) {
        const pokemonKey = armorName;
        
        if (!pokemonMap.has(pokemonKey)) {
            // ヨロイ図鑑のみに登録されているポケモン
            pokemonMap.set(pokemonKey, {
                id: `pokemon_${pokemonCounter.toString().padStart(4, '0')}`,
                name: armorName,
                regions: [],
                pokedex_numbers: {},
                caught: false
            });
            pokemonCounter++;
        }
        
        const pokemon = pokemonMap.get(pokemonKey);
        if (!pokemon.regions.includes('armor')) {
            pokemon.regions.push('armor');
            pokemon.pokedex_numbers.armor = armorNum.padStart(3, '0');
        }
    }
    
    // カンムリ図鑑の処理
    if (crownNum && crownName) {
        const pokemonKey = crownName;
        
        if (!pokemonMap.has(pokemonKey)) {
            // カンムリ図鑑のみに登録されているポケモン
            pokemonMap.set(pokemonKey, {
                id: `pokemon_${pokemonCounter.toString().padStart(4, '0')}`,
                name: crownName,
                regions: [],
                pokedex_numbers: {},
                caught: false
            });
            pokemonCounter++;
        }
        
        const pokemon = pokemonMap.get(pokemonKey);
        if (!pokemon.regions.includes('crown')) {
            pokemon.regions.push('crown');
            pokemon.pokedex_numbers.crown = crownNum.padStart(3, '0');
        }
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
        source: "SV・剣盾図鑑 - 剣盾まとめ.csv"
    },
    stats: stats,
    pokemon: pokemonArray
};

// JSONファイルに出力
const outputFile = 'galar_zukan_data.json';
fs.writeFileSync(outputFile, JSON.stringify(jsonData, null, 2), 'utf-8');

// 設定ファイルの更新
const configFile = 'zukan-config.json';
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

// 詳細な結果報告
console.log('\n📊 完全再構築結果:');
console.log(`✅ 総ポケモン数: ${stats.total}匹`);
console.log(`⚔️ ガラル図鑑: ${stats.regions.galar}匹`);
console.log(`🛡️ ヨロイ図鑑: ${stats.regions.armor}匹`);
console.log(`👑 カンムリ図鑑: ${stats.regions.crown}匹`);
console.log(`\n🔍 専用ポケモン:`);
console.log(`⚔️ ガラル専用: ${stats.galar_only}匹`);
console.log(`🛡️ ヨロイ専用: ${stats.armor_only}匹`);
console.log(`👑 カンムリ専用: ${stats.crown_only}匹`);
console.log(`🔄 重複ポケモン: ${stats.duplicates}匹`);

// サンプルデータ表示
console.log(`\n🔍 サンプルデータ:`);
const samplePokemon = pokemonArray.slice(0, 5);
samplePokemon.forEach(p => {
    console.log(`  ${p.name}: ${p.regions.join(', ')} (${Object.values(p.pokedex_numbers).join(', ')})`);
});

console.log(`\n📁 出力ファイル: ${outputFile}`);
console.log(`⚙️ 設定ファイル: ${configFile}`);

console.log('\n🎉 完全再構築完了！');
console.log('💡 各図鑑の登録状況が正確に反映されました');