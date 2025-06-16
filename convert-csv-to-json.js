const fs = require('fs');

// CSVファイルを読み込み
const csvData = fs.readFileSync('pokemon_data.csv', 'utf8');
const lines = csvData.split('\n').filter(line => line.trim() !== '');

// ヘッダーを除く
const dataLines = lines.slice(1);

const pokemonData = [];
const pokemonMap = new Map(); // 重複チェック用

dataLines.forEach((line, index) => {
  const columns = line.split(',');
  
  // データの整合性をチェック
  if (columns.length >= 6) {
    const paldeaNum = columns[0] ? parseInt(columns[0]) : null;
    const paldeaName = columns[1] || null;
    const kitakamiNum = columns[2] ? parseInt(columns[2]) : null;
    const kitakamiName = columns[3] || null;
    const blueberryNum = columns[4] ? parseInt(columns[4]) : null;
    const blueberryName = columns[5] || null;

    // パルデア図鑑のポケモンを処理
    if (paldeaName) {
      if (!pokemonMap.has(paldeaName)) {
        pokemonMap.set(paldeaName, {
          id: pokemonData.length + 1,
          name: paldeaName,
          regions: ['paldea'],
          pokedex_numbers: {
            paldea: paldeaNum,
            kitakami: null,
            blueberry: null
          },
          caught: false
        });
        pokemonData.push(pokemonMap.get(paldeaName));
      }
    }

    // キタカミ図鑑のポケモンを処理
    if (kitakamiName) {
      if (pokemonMap.has(kitakamiName)) {
        // 既存のポケモンに追加
        const pokemon = pokemonMap.get(kitakamiName);
        if (!pokemon.regions.includes('kitakami')) {
          pokemon.regions.push('kitakami');
          pokemon.pokedex_numbers.kitakami = kitakamiNum;
        }
      } else {
        // 新しいポケモンとして追加
        const newPokemon = {
          id: pokemonData.length + 1,
          name: kitakamiName,
          regions: ['kitakami'],
          pokedex_numbers: {
            paldea: null,
            kitakami: kitakamiNum,
            blueberry: null
          },
          caught: false
        };
        pokemonMap.set(kitakamiName, newPokemon);
        pokemonData.push(newPokemon);
      }
    }

    // ブルーベリー図鑑のポケモンを処理
    if (blueberryName) {
      if (pokemonMap.has(blueberryName)) {
        // 既存のポケモンに追加
        const pokemon = pokemonMap.get(blueberryName);
        if (!pokemon.regions.includes('blueberry')) {
          pokemon.regions.push('blueberry');
          pokemon.pokedex_numbers.blueberry = blueberryNum;
        }
      } else {
        // 新しいポケモンとして追加
        const newPokemon = {
          id: pokemonData.length + 1,
          name: blueberryName,
          regions: ['blueberry'],
          pokedex_numbers: {
            paldea: null,
            kitakami: null,
            blueberry: blueberryNum
          },
          caught: false
        };
        pokemonMap.set(blueberryName, newPokemon);
        pokemonData.push(newPokemon);
      }
    }
  }
});

// 統計情報を計算
const stats = {
  total: pokemonData.length,
  duplicates: pokemonData.filter(p => p.regions.length > 1).length,
  paldeaOnly: pokemonData.filter(p => p.regions.length === 1 && p.regions.includes('paldea')).length,
  kitakamiOnly: pokemonData.filter(p => p.regions.length === 1 && p.regions.includes('kitakami')).length,
  blueberryOnly: pokemonData.filter(p => p.regions.length === 1 && p.regions.includes('blueberry')).length,
  paldeaTotal: pokemonData.filter(p => p.regions.includes('paldea')).length,
  kitakamiTotal: pokemonData.filter(p => p.regions.includes('kitakami')).length,
  blueberryTotal: pokemonData.filter(p => p.regions.includes('blueberry')).length
};

// 結果をJSONファイルに保存
const outputData = {
  stats,
  pokemon: pokemonData
};

fs.writeFileSync('pokemon_data.json', JSON.stringify(outputData, null, 2));

console.log('🎉 変換完了！');
console.log(`📊 統計情報:`);
console.log(`   総ポケモン数: ${stats.total}`);
console.log(`   重複ポケモン: ${stats.duplicates}`);
console.log(`   パルデア専用: ${stats.paldeaOnly}`);
console.log(`   キタカミ専用: ${stats.kitakamiOnly}`);
console.log(`   ブルーベリー専用: ${stats.blueberryOnly}`);
console.log(`   パルデア合計: ${stats.paldeaTotal}`);
console.log(`   キタカミ合計: ${stats.kitakamiTotal}`);
console.log(`   ブルーベリー合計: ${stats.blueberryTotal}`);