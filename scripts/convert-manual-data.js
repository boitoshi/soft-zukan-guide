#!/usr/bin/env node

/**
 * Manual JSON converter for version-exclusive datasets.
 * Input format (data/raw/<id>.json):
 * {
 *   "pokemon": [
 *     { "id": "001", "name": "Bulbasaur", "availability": "both", "pokedex": "001" }
 *   ]
 * }
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MANUAL_CONFIGS = {
  usum: {
    name: "Ultra Sun / Ultra Moon",
    inputFile: "usum.json",
    outputFile: "usum_zukan_data.json",
    regionId: "alola",
    regionName: "Alola",
    versionGroup: {
      key: "ultra_sun_ultra_moon",
      name: "🌞 ウルトラサン・ウルトラムーン",
      versions: [
        { value: "ultra_sun", label: "🌞 ウルトラサン限定" },
        { value: "ultra_moon", label: "🌚 ウルトラムーン限定" },
      ],
    },
  },
  sm: {
    name: "Sun / Moon",
    inputFile: "sm.json",
    outputFile: "sm_zukan_data.json",
    regionId: "alola",
    regionName: "Alola",
    versionGroup: {
      key: "sun_moon",
      name: "☀️ サン・ムーン",
      versions: [
        { value: "sun", label: "☀️ サン限定" },
        { value: "moon", label: "🌙 ムーン限定" },
      ],
    },
  },
  oras: {
    name: "Omega Ruby / Alpha Sapphire",
    inputFile: "oras.json",
    outputFile: "oras_zukan_data.json",
    regionId: "hoenn",
    regionName: "Hoenn",
    versionGroup: {
      key: "omega_ruby_alpha_sapphire",
      name: "🔥 オメガルビー・アルファサファイア",
      versions: [
        { value: "omega_ruby", label: "🔥 オメガルビー限定" },
        { value: "alpha_sapphire", label: "💧 アルファサファイア限定" },
      ],
    },
  },
  xy: {
    name: "X / Y",
    inputFile: "xy.json",
    outputFile: "xy_zukan_data.json",
    regionId: "kalos",
    regionName: "Kalos",
    versionGroup: {
      key: "x_y",
      name: "❎ X・Y",
      versions: [
        { value: "x", label: "❎ X限定" },
        { value: "y", label: "🟣 Y限定" },
      ],
    },
  },
};

const normalizeId = (value) => {
  const stringValue = String(value).trim();
  return stringValue.length >= 3 ? stringValue : stringValue.padStart(3, "0");
};

const readInput = (inputPath) => {
  const raw = JSON.parse(fs.readFileSync(inputPath, "utf-8"));
  if (Array.isArray(raw)) {
    return raw;
  }
  if (raw && Array.isArray(raw.pokemon)) {
    return raw.pokemon;
  }
  throw new Error('Input JSON must be an array or have a "pokemon" array');
};

const buildVersionFilters = (versionGroup) => {
  return {
    [versionGroup.key]: {
      name: versionGroup.name,
      options: [
        { value: "", label: "🌍 全て表示" },
        { value: "both", label: "🟢 両バージョン" },
        ...versionGroup.versions,
      ],
    },
  };
};

const buildStats = (regionId, total) => ({
  total,
  duplicates: 0,
  regions: {
    [regionId]: { total, only: total },
  },
});

const convertManual = (config) => {
  const inputPath = path.join(__dirname, "../data/raw", config.inputFile);
  const outputPath = path.join(__dirname, "../public", config.outputFile);

  if (!fs.existsSync(inputPath)) {
    throw new Error(`Input file not found: ${inputPath}`);
  }

  const entries = readInput(inputPath);
  const pokemon = entries.map((entry, index) => {
    if (!entry || !entry.name) {
      throw new Error(`Missing name for entry at index ${index}`);
    }

    const idValue = entry.id ?? entry.pokedex ?? index + 1;
    const id = normalizeId(idValue);
    const pokedexNumber = String(entry.pokedex ?? idValue).trim();
    const availability = entry.availability ?? "both";

    return {
      id,
      name: String(entry.name).trim(),
      regions: [config.regionId],
      caught: false,
      pokedex_numbers: {
        [config.regionId]: pokedexNumber,
      },
      version_info: {
        [config.versionGroup.key]: {
          availability,
        },
      },
    };
  });

  pokemon.sort((a, b) => {
    const aNum = parseInt(a.pokedex_numbers[config.regionId] ?? a.id, 10);
    const bNum = parseInt(b.pokedex_numbers[config.regionId] ?? b.id, 10);
    return aNum - bNum;
  });

  const stats = buildStats(config.regionId, pokemon.length);

  const zukanData = {
    stats,
    pokemon,
    version_filters: buildVersionFilters(config.versionGroup),
  };

  fs.writeFileSync(outputPath, JSON.stringify(zukanData, null, 2), "utf-8");

  console.log(`✅ Converted ${config.name}`);
  console.log(`📁 Output: ${outputPath}`);
  console.log(`📊 Total: ${stats.total}`);

  return zukanData;
};

const main = () => {
  const args = process.argv.slice(2);
  const target = args[0];

  if (!target) {
    console.log(
      "Usage: node scripts/convert-manual-data.js <usum|sm|oras|xy|--all>",
    );
    process.exit(1);
  }

  if (target === "--all") {
    const order = ["usum", "sm", "oras", "xy"];
    order.forEach((key) => {
      convertManual(MANUAL_CONFIGS[key]);
    });
    return;
  }

  const config = MANUAL_CONFIGS[target];
  if (!config) {
    throw new Error(`Unknown target: ${target}`);
  }

  convertManual(config);
};

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    main();
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

export { convertManual, MANUAL_CONFIGS };
