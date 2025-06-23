const fs = require('fs');
const path = require('path');

// 設定ファイルを読み込み
const config = JSON.parse(fs.readFileSync('../zukan-config.json', 'utf8'));

/**
 * 汎用CSV→JSON変換関数
 * @param {string} gameId - ゲームID（設定ファイルのキー）
 */
function convertZukanData(gameId) {
  const gameConfig = config[gameId];
  
  if (!gameConfig) {
    console.error(`❌ ゲーム設定が見つかりません: ${gameId}`);
    console.log(`✅ 利用可能なゲーム: ${Object.keys(config).join(', ')}`);
    return;
  }

  console.log(`🎮 ${gameConfig.name} の図鑑データを変換中...`);

  // CSVファイルの存在確認
  if (!fs.existsSync(gameConfig.csvFile)) {
    console.error(`❌ CSVファイルが見つかりません: ${gameConfig.csvFile}`);
    return;
  }

  try {
    // CSVファイルを読み込み（エンコーディング対応）
    let csvData;
    if (gameConfig.encoding === 'shift_jis') {
      // Shift-JISの場合はUTF-8に変換
      const { execSync } = require('child_process');
      const tempFile = `temp_${gameId}.csv`;
      execSync(`iconv -f shift_jis -t utf-8 "${gameConfig.csvFile}" > "${tempFile}"`);
      csvData = fs.readFileSync(tempFile, 'utf8');
      fs.unlinkSync(tempFile); // 一時ファイル削除
    } else {
      csvData = fs.readFileSync(gameConfig.csvFile, gameConfig.encoding || 'utf8');
    }

    const lines = csvData.split('\n').filter(line => line.trim() !== '');
    const dataLines = lines.slice(1); // ヘッダーを除く

    const pokemonData = [];
    const pokemonMap = new Map();

    dataLines.forEach((line, index) => {
      const columns = line.split(',');
      
      // 各リージョンのデータを処理
      gameConfig.regions.forEach(region => {
        const [numCol, nameCol] = region.columns;
        
        if (columns.length > nameCol) {
          const pokemonNum = columns[numCol] ? parseInt(columns[numCol]) : null;
          const pokemonName = columns[nameCol] ? columns[nameCol].trim() : null;

          if (pokemonName) {
            if (pokemonMap.has(pokemonName)) {
              // 既存のポケモンにリージョンを追加
              const pokemon = pokemonMap.get(pokemonName);
              if (!pokemon.regions.includes(region.id)) {
                pokemon.regions.push(region.id);
                pokemon.pokedex_numbers[region.id] = pokemonNum;
              }
            } else {
              // 新しいポケモンを追加
              const newPokemon = {
                id: pokemonData.length + 1,
                name: pokemonName,
                regions: [region.id],
                pokedex_numbers: {},
                caught: false
              };
              
              // 全リージョンの番号を初期化
              gameConfig.regions.forEach(r => {
                newPokemon.pokedex_numbers[r.id] = null;
              });
              newPokemon.pokedex_numbers[region.id] = pokemonNum;

              pokemonMap.set(pokemonName, newPokemon);
              pokemonData.push(newPokemon);
            }
          }
        }
      });
    });

    // 統計情報を計算
    const stats = {
      total: pokemonData.length,
      duplicates: pokemonData.filter(p => p.regions.length > 1).length,
      game: gameConfig.name,
      regions: {}
    };

    // リージョン別統計
    gameConfig.regions.forEach(region => {
      const regionPokemon = pokemonData.filter(p => p.regions.includes(region.id));
      const regionOnly = pokemonData.filter(p => p.regions.length === 1 && p.regions.includes(region.id));
      
      stats.regions[region.id] = {
        name: region.name,
        total: regionPokemon.length,
        only: regionOnly.length
      };
    });

    // 結果をJSONファイルに保存
    const outputData = {
      game: gameConfig.name,
      displayName: gameConfig.displayName,
      regions: gameConfig.regions,
      stats,
      pokemon: pokemonData
    };

    const outputFile = `../data/${gameId}_zukan_data.json`;
    fs.writeFileSync(outputFile, JSON.stringify(outputData, null, 2));

    console.log(`\n🎉 変換完了！ファイル: ${outputFile}`);
    console.log(`📊 統計情報:`);
    console.log(`   ゲーム: ${stats.game}`);
    console.log(`   総ポケモン数: ${stats.total}`);
    console.log(`   重複ポケモン: ${stats.duplicates}`);
    
    gameConfig.regions.forEach(region => {
      const regionStats = stats.regions[region.id];
      console.log(`   ${region.name}: ${regionStats.total}匹 (専用: ${regionStats.only}匹)`);
    });

  } catch (error) {
    console.error(`❌ 変換エラー:`, error.message);
  }
}

/**
 * 全ゲームの変換を実行
 */
function convertAllGames() {
  console.log('🚀 全ゲームの図鑑データを変換中...\n');
  
  Object.keys(config).forEach(gameId => {
    const gameConfig = config[gameId];
    if (fs.existsSync(gameConfig.csvFile)) {
      convertZukanData(gameId);
      console.log(''); // 空行
    } else {
      console.log(`⏭️  スキップ: ${gameConfig.name} (${gameConfig.csvFile} が見つかりません)`);
    }
  });
}

/**
 * 利用可能なゲーム一覧を表示
 */
function listGames() {
  console.log('📚 利用可能なゲーム:');
  Object.entries(config).forEach(([gameId, gameConfig]) => {
    const exists = fs.existsSync(gameConfig.csvFile) ? '✅' : '❌';
    console.log(`   ${exists} ${gameId}: ${gameConfig.name} (${gameConfig.csvFile})`);
  });
}

// コマンドライン引数の処理
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`
🎮 汎用図鑑データ変換ツール

使用方法:
  node universal-csv-converter.js [ゲームID]     # 指定ゲームを変換
  node universal-csv-converter.js --all          # 全ゲームを変換
  node universal-csv-converter.js --list         # ゲーム一覧を表示

例:
  node universal-csv-converter.js paldea         # パルデア図鑑のみ変換
  node universal-csv-converter.js --all          # 全図鑑変換
`);
  listGames();
} else if (args[0] === '--all') {
  convertAllGames();
} else if (args[0] === '--list') {
  listGames();
} else {
  convertZukanData(args[0]);
}