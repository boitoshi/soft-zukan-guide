#!/usr/bin/env node

/**
 * パルデア図鑑CSVデータをJSONに変換するスクリプト
 * SV図鑑_utf8.csv -> paldea_zukan_data.json
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ファイルパス設定
const csvPath = path.join(__dirname, '../data/raw/SV図鑑_utf8.csv')
const outputPath = path.join(__dirname, '../public/paldea_zukan_data.json')

// CSVを読み込んでパース
function parsePaldeaCSV(csvData) {
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
      // パルデア図鑑のポケモン（列1）
      if (parts[1]) {
        addPokemon(parts[0], parts[1], 'paldea')
      }
      
      // キタカミ図鑑のポケモン（列3）
      if (parts[3]) {
        addPokemon(parts[2], parts[3], 'kitakami')
      }
      
      // ブルーベリー図鑑のポケモン（列5）
      if (parts[5]) {
        addPokemon(parts[4], parts[5], 'blueberry')
      }
    }
  }
  
  function addPokemon(id, name, region) {
    if (!id || !name) return
    
    // 名前を正規化（♂♀、アローラ、ガラルなどを統一）
    const cleanName = normalizePokemonName(name)
    const originalName = name.trim()
    
    // フォルム情報を抽出
    const formInfo = extractFormInfo(originalName)
    
    // すでに存在するポケモンかチェック
    if (pokemonMap.has(cleanName)) {
      const existing = pokemonMap.get(cleanName)
      
      // 地域を追加
      if (!existing.regions.includes(region)) {
        existing.regions.push(region)
        // 地域ごとの図鑑番号を記録
        existing.pokedex_numbers = existing.pokedex_numbers || {}
        existing.pokedex_numbers[region] = id
      }
      
      // フォルム情報を追加
      existing.forms = existing.forms || []
      formInfo.forEach(form => {
        if (!existing.forms.includes(form)) {
          existing.forms.push(form)
        }
      })
      
    } else {
      // 新しいポケモンを追加
      const pokemonData = {
        id: id.padStart(3, '0'),
        name: getBasePokemonName(originalName), // ベース名を使用
        regions: [region],
        caught: false,
        forms: formInfo, // フォルム情報を追加
        pokedex_numbers: {
          [region]: id
        }
      }
      
      // バージョン限定情報を追加
      const versionInfo = getVersionInfo(cleanName, region)
      if (versionInfo) {
        pokemonData.version_info = versionInfo
      }
      
      pokemon.push(pokemonData)
      pokemonMap.set(cleanName, pokemonData)
    }
  }

  // ポケモン名を正規化する関数（フォルム違いを統合）
  function normalizePokemonName(name) {
    // ベースポケモン名を取得（フォルム情報を除去）
    return name
      .replace(/\s+/g, '') // 空白除去
      .replace(/[♂♀]/g, '') // 性別記号除去
      .replace(/\(.*?\)/g, '') // 括弧内のフォルム情報除去
      .replace(/アローラ$/, '') // アローラ除去
      .replace(/ガラル$/, '') // ガラル除去
      .replace(/ヒスイ$/, '') // ヒスイ除去
      .replace(/パルデア.*$/, '') // パルデア地方フォーム除去
      // ロトムのフォルム統合
      .replace(/^(ウォッシュ|カット|スピン|ヒート|フロスト)ロトム$/, 'ロトム')
      .toLowerCase()
  }

  // フォルム情報を抽出
  function extractFormInfo(name) {
    const forms = []
    
    // 括弧内のフォルム
    const bracketMatch = name.match(/\((.*?)\)/)
    if (bracketMatch) {
      forms.push(bracketMatch[1])
    }
    
    // 地方フォーム
    if (name.includes('アローラ')) forms.push('アローラ')
    if (name.includes('ガラル')) forms.push('ガラル')
    if (name.includes('ヒスイ')) forms.push('ヒスイ')
    if (name.includes('パルデア')) {
      // パルデアフォームの詳細を抽出
      if (name.includes('パルデア単')) forms.push('パルデア単')
      else if (name.includes('パルデア炎')) forms.push('パルデア炎')  
      else if (name.includes('パルデア水')) forms.push('パルデア水')
      else forms.push('パルデア')
    }
    
    // 性別
    if (name.includes('♂')) forms.push('♂')
    if (name.includes('♀')) forms.push('♀')
    
    // ロトムのフォルム
    if (name.includes('ウォッシュロトム')) forms.push('ウォッシュ')
    else if (name.includes('カットロトム')) forms.push('カット')
    else if (name.includes('スピンロトム')) forms.push('スピン')
    else if (name.includes('ヒートロトム')) forms.push('ヒート')
    else if (name.includes('フロストロトム')) forms.push('フロスト')
    else if (name === 'ロトム') forms.push('ノーマル')
    
    return forms.length > 0 ? forms : ['通常']
  }

  // ベースポケモン名を取得（表示用）
  function getBasePokemonName(name) {
    // フォルム情報を除去してベース名のみ返す
    return name
      .replace(/\(.*?\)/g, '') // 括弧内のフォルム情報除去
      .replace(/[♂♀]/g, '') // 性別記号除去
      .replace(/アローラ$/, '') // アローラ除去
      .replace(/ガラル$/, '') // ガラル除去
      .replace(/ヒスイ$/, '') // ヒスイ除去
      .replace(/パルデア.*$/, '') // パルデア地方フォーム除去
      .trim()
  }

  // バージョン限定情報を取得（Bulbapedia準拠）
  function getVersionInfo(cleanName, region) {
    // スカーレット限定ポケモン（Bulbapedia準拠）
    const scarletExclusives = [
      // タウロス（パルデアのすがた炎種）
      'タウロス',
      // ヨーギラス系統
      'ヨーギラス', 'サナギラス', 'バンギラス',
      // フワンテ系統
      'フワンテ', 'フワライド',
      // スカンプー系統
      'スカンプー', 'スカタンク',
      // モノズ系統
      'モノズ', 'ジヘッド', 'サザンドラ',
      // クズモー系統
      'クズモー', 'ドラミドロ',
      // ヤレユータン
      'ヤレユータン',
      // イシヘンジン
      'イシヘンジン',
      // 古代パラドックスポケモン
      'イダイナキバ', 'サケブシッポ', 'アラブルタケ', 'ハバタクカミ',
      'チヲハウハネ', 'スナノケガワ', 'トドロクツキ',
      // 伝説
      'コライドン'
    ]
    
    // バイオレット限定ポケモン（Bulbapedia準拠）
    const violetExclusives = [
      // タウロス（パルデアのすがた水種）
      'タウロス',
      // ムウマ系統
      'ムウマ', 'ムウマージ',
      // ゴクリン系統
      'ゴクリン', 'マルノーム',
      // タツベイ系統
      'タツベイ', 'コモルー', 'ボーマンダ',
      // ウデッポウ系統
      'ウデッポウ', 'ブロスター',
      // ナゲツケサル
      'ナゲツケサル',
      // コオリッポ
      'コオリッポ',
      // ドラメシヤ系統
      'ドラメシヤ', 'ドロンチ', 'ドラパルト',
      // 未来パラドックスポケモン
      'テツノワダチ', 'テツノツツミ', 'テツノカイナ', 'テツノコウベ',
      'テツノドクガ', 'テツノイバラ', 'テツノブジン',
      // 伝説
      'ミライドン'
    ]

    // スカーレット・バイオレットのすべての地域でバージョン情報を付与
    if (region === 'paldea' || region === 'kitakami' || region === 'blueberry') {
      // 正確な名前マッチング
      for (const scarletName of scarletExclusives) {
        if (cleanName.includes(scarletName.toLowerCase()) || 
            cleanName === scarletName.toLowerCase()) {
          return {
            scarlet_violet: {
              availability: 'scarlet'
            }
          }
        }
      }
      
      for (const violetName of violetExclusives) {
        if (cleanName.includes(violetName.toLowerCase()) || 
            cleanName === violetName.toLowerCase()) {
          return {
            scarlet_violet: {
              availability: 'violet'
            }
          }
        }
      }
      
      // デフォルトは両方
      return {
        scarlet_violet: {
          availability: 'both'
        }
      }
    }
    
    return null
  }
  
  // 元のCSV図鑑番号を保持（重複解消しない）
  // フォルム違いは同じ図鑑番号を持つのが正しい仕様

  // 全体をソート（元の図鑑番号順を保持）
  pokemon.sort((a, b) => {
    // パルデア図鑑のポケモンを優先
    if (a.regions.includes('paldea') && !b.regions.includes('paldea')) return -1
    if (!a.regions.includes('paldea') && b.regions.includes('paldea')) return 1
    
    if (a.regions.includes('paldea') && b.regions.includes('paldea')) {
      const aNum = parseInt(a.pokedex_numbers.paldea)
      const bNum = parseInt(b.pokedex_numbers.paldea)
      if (aNum !== bNum) return aNum - bNum
      // 同じ番号の場合は名前でソート（フォルム順）
      return a.name.localeCompare(b.name)
    }
    
    // キタカミ図鑑のポケモンを次に
    if (a.regions.includes('kitakami') && !b.regions.includes('kitakami')) return -1
    if (!a.regions.includes('kitakami') && b.regions.includes('kitakami')) return 1
    
    if (a.regions.includes('kitakami') && b.regions.includes('kitakami')) {
      const aNum = parseInt(a.pokedex_numbers.kitakami)
      const bNum = parseInt(b.pokedex_numbers.kitakami)
      if (aNum !== bNum) return aNum - bNum
      return a.name.localeCompare(b.name)
    }
    
    // ブルーベリー図鑑のポケモンを最後に
    if (a.regions.includes('blueberry') && b.regions.includes('blueberry')) {
      const aNum = parseInt(a.pokedex_numbers.blueberry)
      const bNum = parseInt(b.pokedex_numbers.blueberry)
      if (aNum !== bNum) return aNum - bNum
      return a.name.localeCompare(b.name)
    }
    
    return 0
  })

  // ユニークIDを再付与
  pokemon.forEach((p, index) => {
    p.id = (index + 1).toString().padStart(3, '0')
  })
  
  // 統計情報を計算
  const stats = calculateStats(pokemon)
  
  return {
    stats,
    pokemon,
    version_filters: {
      scarlet_violet: {
        name: "🔴 スカーレット・バイオレット",
        options: [
          { value: "", label: "🌍 全て表示" },
          { value: "both", label: "🟢 両バージョン" },
          { value: "scarlet", label: "🔴 スカーレット限定" },
          { value: "violet", label: "🟣 バイオレット限定" }
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
      paldea: { total: 0, only: 0 },
      kitakami: { total: 0, only: 0 },
      blueberry: { total: 0, only: 0 }
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
    console.log('🚀 パルデア図鑑データ変換開始...')
    
    // CSVファイル読み込み
    if (!fs.existsSync(csvPath)) {
      throw new Error(`CSVファイルが見つかりません: ${csvPath}`)
    }
    
    const csvData = fs.readFileSync(csvPath, 'utf-8')
    console.log('📖 CSVファイル読み込み完了')
    
    // データ変換
    const zukanData = parsePaldeaCSV(csvData)
    
    // 結果をJSONファイルに出力
    fs.writeFileSync(outputPath, JSON.stringify(zukanData, null, 2), 'utf-8')
    
    console.log('✅ 変換完了!')
    console.log(`📁 出力先: ${outputPath}`)
    console.log(`📊 総ポケモン数: ${zukanData.stats.total}匹`)
    console.log(`🔄 重複ポケモン: ${zukanData.stats.duplicates}匹`)
    console.log(`🏔️ パルデア図鑑: ${zukanData.stats.regions.paldea.total}匹`)
    console.log(`🍂 キタカミ図鑑: ${zukanData.stats.regions.kitakami.total}匹`)
    console.log(`🫐 ブルーベリー図鑑: ${zukanData.stats.regions.blueberry.total}匹`)
    
  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message)
    process.exit(1)
  }
}

// スクリプト実行
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { parsePaldeaCSV, calculateStats }