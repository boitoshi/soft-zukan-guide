#!/usr/bin/env node
/**
 * ポケモンマスターデータ生成スクリプト
 *
 * 全ゲームのJSONデータを統合し、ポケモン名をキーにした
 * クロスゲーム索引（pokemon-master.json）を生成する。
 *
 * Usage: node scripts/generate-master-data.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, '../public');
const DATA_DIR = path.join(__dirname, '../data');

// ゲーム設定を読み込み
function loadGameConfigs() {
  const configPath = path.join(PUBLIC_DIR, 'zukan-config.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  return config.games;
}

// 通信交換進化リストを読み込み
function loadTradeEvolutions() {
  const listPath = path.join(DATA_DIR, 'trade-evolutions.json');
  const data = JSON.parse(fs.readFileSync(listPath, 'utf-8'));

  const tradeMap = new Map();
  for (const entry of data.pokemon) {
    tradeMap.set(entry.name, {
      from: entry.from,
      method: entry.method,
      svLinkCord: entry.svLinkCord || false,
    });
  }
  return tradeMap;
}

// 孵化不可リストを読み込み
function loadNonBreedableList() {
  const listPath = path.join(DATA_DIR, 'non-breedable.json');
  const data = JSON.parse(fs.readFileSync(listPath, 'utf-8'));

  const nonBreedable = new Set();
  for (const category of ['legendaries', 'mythicals', 'ultra_beasts', 'special_non_breedable']) {
    if (data[category]) {
      data[category].forEach(name => nonBreedable.add(name));
    }
  }
  return nonBreedable;
}

// 各ゲームのポケモンデータを読み込み
function loadGameData(gameConfig) {
  const dataFile = gameConfig.dataFile.startsWith('/')
    ? gameConfig.dataFile.slice(1)
    : gameConfig.dataFile;
  const filePath = path.join(PUBLIC_DIR, dataFile);

  if (!fs.existsSync(filePath)) {
    console.warn(`  ⚠️  ${filePath} が見つかりません、スキップ`);
    return null;
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// バージョン限定情報を取得
function getVersionExclusivity(pokemon, gameId) {
  if (!pokemon.version_info) return null;

  // version_info のキーを探す（sword_shield, scarlet_violet, etc.）
  for (const [key, info] of Object.entries(pokemon.version_info)) {
    if (info.availability && info.availability !== 'both') {
      return info.availability;
    }
  }
  return null;
}

function generateMasterData() {
  console.log('🚀 ポケモンマスターデータ生成開始...\n');

  const gameConfigs = loadGameConfigs();
  const nonBreedable = loadNonBreedableList();
  const tradeEvolutions = loadTradeEvolutions();

  console.log(`📋 孵化不可ポケモン: ${nonBreedable.size}匹`);
  console.log(`🔄 通信交換進化: ${tradeEvolutions.size}匹\n`);

  // ポケモン名 → マスターデータのマップ
  const pokemonMap = new Map();

  // 各ゲームのデータを統合
  for (const gameConfig of gameConfigs) {
    console.log(`📁 ${gameConfig.displayName} (${gameConfig.id})`);
    const gameData = loadGameData(gameConfig);
    if (!gameData) continue;

    // ポケモン名の重複チェック（同一ゲーム内）
    const seenNames = new Map();

    for (const pokemon of gameData.pokemon) {
      const name = pokemon.name;

      // 同じゲーム内で同じ名前が複数ある場合（地方違い）
      // → regions を統合する
      if (seenNames.has(name)) {
        const existingEntry = pokemonMap.get(name);
        if (existingEntry && existingEntry.games[gameConfig.id]) {
          // regions を統合
          const existing = existingEntry.games[gameConfig.id];
          for (const region of pokemon.regions) {
            if (!existing.regions.includes(region)) {
              existing.regions.push(region);
            }
          }
        }
        continue;
      }
      seenNames.set(name, true);

      // マスターデータのエントリを作成/更新
      if (!pokemonMap.has(name)) {
        const entry = {
          name,
          breedable: !nonBreedable.has(name),
          games: {},
        };

        // 通信交換進化情報を付加
        const tradeInfo = tradeEvolutions.get(name);
        if (tradeInfo) {
          entry.tradeEvolution = tradeInfo;
        }

        pokemonMap.set(name, entry);
      }

      const entry = pokemonMap.get(name);
      const versionExclusive = getVersionExclusivity(pokemon, gameConfig.id);

      entry.games[gameConfig.id] = {
        id: pokemon.id,
        regions: [...pokemon.regions],
      };

      if (versionExclusive) {
        entry.games[gameConfig.id].versionExclusive = versionExclusive;
      }
    }

    console.log(`  ✅ ${gameData.pokemon.length}匹読み込み（ユニーク: ${seenNames.size}匹）`);
  }

  // 統計
  const totalPokemon = pokemonMap.size;
  const breedable = [...pokemonMap.values()].filter(p => p.breedable).length;
  const nonBreedableCount = totalPokemon - breedable;
  const multiGame = [...pokemonMap.values()].filter(p => Object.keys(p.games).length > 1).length;
  const tradeEvoCount = [...pokemonMap.values()].filter(p => p.tradeEvolution).length;

  // ソート（名前順）して配列に変換
  const pokemonArray = [...pokemonMap.values()].sort((a, b) =>
    a.name.localeCompare(b.name, 'ja')
  );

  const masterData = {
    version: '1.0.0',
    generated: new Date().toISOString(),
    stats: {
      totalPokemon,
      breedable,
      nonBreedable: nonBreedableCount,
      multiGamePokemon: multiGame,
      totalGames: gameConfigs.length,
      tradeEvolutions: tradeEvoCount,
    },
    pokemon: pokemonArray,
  };

  // 出力
  const outputPath = path.join(PUBLIC_DIR, 'pokemon-master.json');
  fs.writeFileSync(outputPath, JSON.stringify(masterData, null, 2), 'utf-8');

  console.log('\n' + '━'.repeat(40));
  console.log('🎉 マスターデータ生成完了！');
  console.log(`  📊 総ポケモン数: ${totalPokemon}匹`);
  console.log(`  🥚 孵化可能: ${breedable}匹`);
  console.log(`  🚫 孵化不可: ${nonBreedableCount}匹`);
  console.log(`  🔄 複数ゲーム登場: ${multiGame}匹`);
  console.log(`  📱 通信交換進化: ${tradeEvoCount}匹`);
  console.log(`  📁 出力: ${outputPath}`);
}

generateMasterData();
