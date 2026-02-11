#!/usr/bin/env node
/**
 * ガラル図鑑 バージョン限定データ更新スクリプト
 *
 * ソード・シールドのバージョン限定ポケモンを正確に設定する
 * 対象: ガラル図鑑 + ヨロイ島図鑑 + カンムリ雪原図鑑
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========== ソード限定ポケモン ==========
const SWORD_EXCLUSIVES = [
  // ガラル図鑑 - ソード限定
  'タネボー', 'コノハナ', 'ダーテング',
  'ペロッパフ', 'ペロリーム',
  'カモネギ',  // ガラルのすがた
  'ネギガナイト',
  'ズルッグ', 'ズルズキン',
  'ゴチム', 'ゴチミル', 'ゴチルゼル',
  'ソルロック',
  'ダルマッカ', 'ヒヒダルマ',  // ガラルのすがた
  'ワシボン', 'ウォーグル',
  'クチート',
  'ナゲツケサル',
  'バクガメス',
  'モノズ', 'ジヘッド', 'サザンドラ',
  'ジャラコ', 'ジャランゴ', 'ジャラランガ',
  'イシヘンジン',
  'ザシアン',

  // ヨロイ島図鑑 - ソード限定
  'カイロス',
  'ウデッポウ', 'ブロスター',

  // カンムリ雪原図鑑 - ソード限定
  'オムナイト', 'オムスター',
  'タツベイ', 'コモルー', 'ボーマンダ',
  'ホウオウ',
  'ラティオス',
  'グラードン',
  'ディアルガ',
  'トルネロス',
  'レシラム',
  'ゼルネアス',
  'ソルガレオ',
];

// ========== シールド限定ポケモン ==========
const SHIELD_EXCLUSIVES = [
  // ガラル図鑑 - シールド限定
  'ハスボー', 'ハスブレロ', 'ルンパッパ',
  'シュシュプ', 'フレフワン',
  'ポニータ', 'ギャロップ',  // ガラルのすがた
  'サニーゴ',  // ガラルのすがた
  'サニゴーン',
  'ユニラン', 'ダブラン', 'ランクルス',
  'ルナトーン',
  'ヤミラミ',
  'バルチャイ', 'バルジーナ',
  'ヤレユータン',
  'ジジーロン',
  'ヨーギラス', 'サナギラス', 'バンギラス',
  'ヌメラ', 'ヌメイル', 'ヌメルゴン',
  'コオリッポ',
  'ザマゼンタ',

  // ヨロイ島図鑑 - シールド限定
  'ヘラクロス',
  'クズモー', 'ドラミドロ',

  // カンムリ雪原図鑑 - シールド限定
  'カブト', 'カブトプス',
  'フカマル', 'ガバイト', 'ガブリアス',
  'ルギア',
  'ラティアス',
  'カイオーガ',
  'パルキア',
  'ボルトロス',
  'ゼクロム',
  'イベルタル',
  'ルナアーラ',
];

function updateGalarExclusives() {
  const filePath = path.join(__dirname, '../public/galar_zukan_data.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  let swordCount = 0;
  let shieldCount = 0;
  let bothCount = 0;
  let noInfoCount = 0;

  for (const pokemon of data.pokemon) {
    const name = pokemon.name;

    // version_info が無い場合は追加
    if (!pokemon.version_info) {
      pokemon.version_info = { sword_shield: { availability: 'both' } };
    }
    if (!pokemon.version_info.sword_shield) {
      pokemon.version_info.sword_shield = { availability: 'both' };
    }

    if (SWORD_EXCLUSIVES.includes(name)) {
      pokemon.version_info.sword_shield.availability = 'sword';
      swordCount++;
    } else if (SHIELD_EXCLUSIVES.includes(name)) {
      pokemon.version_info.sword_shield.availability = 'shield';
      shieldCount++;
    } else {
      pokemon.version_info.sword_shield.availability = 'both';
      bothCount++;
    }
  }

  // version_filters を追加/更新
  data.version_filters = {
    sword_shield: {
      name: '🗡️ ソード・シールド',
      options: [
        { value: 'sword', label: '🗡️ ソード限定' },
        { value: 'shield', label: '🛡️ シールド限定' },
      ],
    },
  };

  // ファイル書き込み
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');

  console.log('🎉 ガラル図鑑 バージョン限定データ更新完了！');
  console.log(`  🗡️  ソード限定: ${swordCount}匹`);
  console.log(`  🛡️  シールド限定: ${shieldCount}匹`);
  console.log(`  🤝 両バージョン: ${bothCount}匹`);
}

updateGalarExclusives();
