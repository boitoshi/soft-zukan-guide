#!/usr/bin/env node

/**
 * ガラル図鑑CSVデータをJSONに変換するスクリプト
 * 剣盾図鑑.csv -> galar_zukan_data.json
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ファイルパス設定
const csvPath = path.join(__dirname, '../data/raw/剣盾図鑑.csv')
const outputPath = path.join(__dirname, '../public/galar_zukan_data.json')

// CSVを読み込んでパース
function parseGalarCSV(csvData) {
  const lines = csvData.split('\n').filter(line => line.trim())
  const header = lines[0]
  
  console.log('📊 ヘッダー:', header)
  
  const pokemon = []
  const pokemonMap = new Map() // 重複チェック用
  
  // データ行を処理
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    
    // CSV解析（カンマで分割、名前部分を取得）
    const parts = line.split(',').map(part => part.trim())
    
    if (parts.length >= 6) {
      // ガラル図鑑のポケモン（列1）
      if (parts[1]) {
        addPokemon(parts[0], parts[1], 'galar')
      }
      
      // ヨロイ図鑑のポケモン（列3）
      if (parts[3]) {
        addPokemon(parts[2], parts[3], 'isle_of_armor')
      }
      
      // カンムリ図鑑のポケモン（列5）
      if (parts[5]) {
        addPokemon(parts[4], parts[5], 'crown_tundra')
      }
    }
  }
  
  function addPokemon(id, name, region) {
    if (!id || !name) return
    
    // 名前をクリーンアップ
    const cleanName = name.replace(/\s+/g, '').replace(/[\(\)]/g, '')
    const originalName = name.trim()
    
    // すでに存在するポケモンかチェック
    if (pokemonMap.has(cleanName)) {
      const existing = pokemonMap.get(cleanName)
      if (!existing.regions.includes(region)) {
        existing.regions.push(region)
      }
    } else {
      // 新しいポケモンを追加
      const pokemonData = {
        id: id.padStart(3, '0'),
        name: originalName,
        regions: [region],
        caught: false
      }
      
      // バージョン限定情報を追加（ガラルの場合）
      if (region === 'galar') {
        pokemonData.version_info = {
          sword_shield: {
            availability: 'both' // デフォルトは両方、特殊なケースは手動調整
          }
        }
      }
      
      pokemon.push(pokemonData)
      pokemonMap.set(cleanName, pokemonData)
    }
  }
  
  // IDでソート
  pokemon.sort((a, b) => a.id.localeCompare(b.id))
  
  // 統計情報を計算
  const stats = calculateStats(pokemon)
  
  return {
    stats,
    pokemon,
    version_filters: {
      sword_shield: {
        name: "⚔️ ソード・シールド",
        options: [
          { value: "", label: "🌍 全て表示" },
          { value: "both", label: "🟢 両バージョン" },
          { value: "sword", label: "⚔️ ソード限定" },
          { value: "shield", label: "🛡️ シールド限定" }
        ]
      }
    }
  }
}

// 統計情報を計算
function calculateStats(pokemon) {
  const stats = {
    total: pokemon.length,
    duplicates: 0,
    regions: {
      galar: { total: 0, only: 0 },
      isle_of_armor: { total: 0, only: 0 },
      crown_tundra: { total: 0, only: 0 }
    }
  }
  
  pokemon.forEach(p => {
    // 重複チェック
    if (p.regions.length > 1) {
      stats.duplicates++
    }
    
    // 地域別統計
    p.regions.forEach(region => {
      if (stats.regions[region]) {
        stats.regions[region].total++
        
        // 専用ポケモンチェック
        if (p.regions.length === 1) {
          stats.regions[region].only++
        }
      }
    })
  })
  
  return stats
}

// メイン処理
async function main() {
  try {
    console.log('🚀 ガラル図鑑データ変換開始...')
    
    // CSVファイル読み込み
    if (!fs.existsSync(csvPath)) {
      throw new Error(`CSVファイルが見つかりません: ${csvPath}`)
    }
    
    const csvData = fs.readFileSync(csvPath, 'utf-8')
    console.log('📖 CSVファイル読み込み完了')
    
    // データ変換
    const zukanData = parseGalarCSV(csvData)
    
    // 結果をJSONファイルに出力
    fs.writeFileSync(outputPath, JSON.stringify(zukanData, null, 2), 'utf-8')
    
    console.log('✅ 変換完了!')
    console.log(`📁 出力先: ${outputPath}`)
    console.log(`📊 総ポケモン数: ${zukanData.stats.total}匹`)
    console.log(`🔄 重複ポケモン: ${zukanData.stats.duplicates}匹`)
    console.log(`⚔️ ガラル図鑑: ${zukanData.stats.regions.galar.total}匹`)
    console.log(`🏝️ ヨロイ図鑑: ${zukanData.stats.regions.isle_of_armor.total}匹`)
    console.log(`❄️ カンムリ図鑑: ${zukanData.stats.regions.crown_tundra.total}匹`)
    
  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message)
    process.exit(1)
  }
}

// スクリプト実行
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { parseGalarCSV, calculateStats }