#!/usr/bin/env node

/**
 * 汎用CSVコンバーター - 全図鑑対応版
 * 使用方法:
 * - npm run convert (対話式)
 * - npm run convert:paldea (パルデア図鑑)
 * - npm run convert:galar (ガラル図鑑)
 * - npm run convert:all (全図鑑)
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { parsePaldeaCSV } from './convert-paldea-data.js'
import { parseGalarCSV } from './convert-galar-data.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 図鑑設定
const ZUKAN_CONFIGS = {
  paldea: {
    name: 'パルデア図鑑',
    csvFile: 'SV図鑑_utf8.csv',
    outputFile: 'paldea_zukan_data.json',
    parser: parsePaldeaCSV
  },
  galar: {
    name: 'ガラル図鑑',
    csvFile: '剣盾図鑑.csv',
    outputFile: 'galar_zukan_data.json',
    parser: parseGalarCSV
  }
}

// 単一図鑑を変換
async function convertZukan(zukanId) {
  const config = ZUKAN_CONFIGS[zukanId]
  if (!config) {
    throw new Error(`未対応の図鑑ID: ${zukanId}`)
  }

  console.log(`🚀 ${config.name}データ変換開始...`)
  
  // CSVファイルパス
  const csvPath = path.join(__dirname, '../data/raw', config.csvFile)
  const outputPath = path.join(__dirname, '../public', config.outputFile)
  
  // CSVファイル存在確認
  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSVファイルが見つかりません: ${csvPath}`)
  }
  
  // CSVファイル読み込み
  let csvData
  try {
    csvData = fs.readFileSync(csvPath, 'utf-8')
  } catch (error) {
    // Shift_JISで再試行
    try {
      const { execSync } = await import('child_process')
      const tempPath = csvPath.replace('.csv', '_utf8.csv')
      execSync(`iconv -f shift_jis -t utf-8 "${csvPath}" > "${tempPath}"`)
      csvData = fs.readFileSync(tempPath, 'utf-8')
      console.log('📝 文字コード変換完了 (Shift_JIS -> UTF-8)')
    } catch (iconvError) {
      throw new Error(`ファイル読み込みエラー: ${error.message}`)
    }
  }
  
  console.log('📖 CSVファイル読み込み完了')
  
  // データ変換
  const zukanData = config.parser(csvData)
  
  // 結果をJSONファイルに出力
  fs.writeFileSync(outputPath, JSON.stringify(zukanData, null, 2), 'utf-8')
  
  console.log('✅ 変換完了!')
  console.log(`📁 出力先: ${outputPath}`)
  console.log(`📊 総ポケモン数: ${zukanData.stats.total}匹`)
  console.log(`🔄 重複ポケモン: ${zukanData.stats.duplicates}匹`)
  
  // 地域別統計表示
  Object.entries(zukanData.stats.regions).forEach(([regionId, stats]) => {
    const regionName = getRegionName(regionId)
    console.log(`${regionName}: ${stats.total}匹`)
  })
  
  return zukanData
}

// 地域名取得
function getRegionName(regionId) {
  const names = {
    paldea: '🏔️ パルデア図鑑',
    kitakami: '🍂 キタカミ図鑑',
    blueberry: '🫐 ブルーベリー図鑑',
    galar: '⚔️ ガラル図鑑',
    isle_of_armor: '🏝️ ヨロイ図鑑',
    crown_tundra: '❄️ カンムリ図鑑'
  }
  return names[regionId] || regionId
}

// 対話式選択
async function interactiveMode() {
  const readline = await import('readline')
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  
  return new Promise((resolve) => {
    console.log('🎮 図鑑データ変換ツール')
    console.log('変換したい図鑑を選択してください:')
    console.log('1. パルデア図鑑 (スカーレット・バイオレット)')
    console.log('2. ガラル図鑑 (ソード・シールド)')
    console.log('3. 全図鑑')
    console.log('4. 終了')
    
    rl.question('選択 (1-4): ', (answer) => {
      rl.close()
      
      switch (answer.trim()) {
        case '1':
          resolve('paldea')
          break
        case '2':
          resolve('galar')
          break
        case '3':
          resolve('all')
          break
        case '4':
          resolve('exit')
          break
        default:
          console.log('❌ 無効な選択です')
          resolve('exit')
      }
    })
  })
}

// メイン処理
async function main() {
  try {
    const args = process.argv.slice(2)
    let target = args[0]
    
    // 引数がない場合は対話モード
    if (!target) {
      target = await interactiveMode()
    }
    
    if (target === 'exit') {
      console.log('👋 終了します')
      return
    }
    
    // 変換実行
    if (target === 'all' || target === '--all') {
      console.log('🌍 全図鑑変換開始...')
      for (const zukanId of Object.keys(ZUKAN_CONFIGS)) {
        await convertZukan(zukanId)
        console.log('---')
      }
      console.log('🎉 全図鑑変換完了!')
    } else if (ZUKAN_CONFIGS[target]) {
      await convertZukan(target)
    } else {
      console.error('❌ 無効な図鑑ID:', target)
      console.log('利用可能な図鑑:', Object.keys(ZUKAN_CONFIGS).join(', '))
      process.exit(1)
    }
    
  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message)
    process.exit(1)
  }
}

// スクリプト実行
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { convertZukan, ZUKAN_CONFIGS }