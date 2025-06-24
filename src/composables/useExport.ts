/**
 * useExport Composable (TypeScript版)
 * 進捗データのエクスポート機能を担当
 */
import type { Pokemon, GameConfig, ZukanData } from '../index.js'

export interface ExportData {
  gameInfo: {
    id: string;
    name: string;
    exportDate: string;
    totalPokemon: number;
    caughtPokemon: number;
    completionRate: number;
  };
  progress: {
    id: string;
    name: string;
    regions: string[];
    caught: boolean;
    version_info?: any;
  }[];
}

export function useExport() {
  
  // JSONエクスポート
  const exportToJSON = (gameData: ZukanData, gameInfo: GameConfig): string => {
    const caughtCount = gameData.pokemon.filter(p => p.caught).length;
    const totalCount = gameData.stats.total;
    
    const exportData: ExportData = {
      gameInfo: {
        id: gameInfo.id,
        name: gameInfo.name,
        exportDate: new Date().toISOString(),
        totalPokemon: totalCount,
        caughtPokemon: caughtCount,
        completionRate: Math.round((caughtCount / totalCount) * 100)
      },
      progress: gameData.pokemon.map(pokemon => ({
        id: pokemon.id,
        name: pokemon.name,
        regions: pokemon.regions,
        caught: pokemon.caught,
        version_info: pokemon.version_info
      }))
    };
    
    return JSON.stringify(exportData, null, 2);
  };

  // CSVエクスポート
  const exportToCSV = (gameData: ZukanData, gameInfo: GameConfig): string => {
    const lines: string[] = [];
    
    // ヘッダー行
    lines.push('図鑑番号,ポケモン名,所属図鑑,ゲット状況,バージョン情報');
    
    // データ行
    gameData.pokemon.forEach(pokemon => {
      const regions = pokemon.regions.join('|');
      const caught = pokemon.caught ? 'ゲット済み' : '未ゲット';
      
      // バージョン情報を文字列化
      let versionInfo = '';
      if (pokemon.version_info) {
        const versions: string[] = [];
        if (pokemon.version_info.scarlet_violet) {
          versions.push(`スカーレット・バイオレット:${pokemon.version_info.scarlet_violet.availability}`);
        }
        if (pokemon.version_info.sword_shield) {
          versions.push(`ソード・シールド:${pokemon.version_info.sword_shield.availability}`);
        }
        versionInfo = versions.join('|');
      }
      
      lines.push(`${pokemon.id},${pokemon.name},${regions},${caught},${versionInfo}`);
    });
    
    return lines.join('\n');
  };

  // サマリーCSVエクスポート（統計情報のみ）
  const exportSummaryToCSV = (gameData: ZukanData, gameInfo: GameConfig): string => {
    const lines: string[] = [];
    const caughtCount = gameData.pokemon.filter(p => p.caught).length;
    const totalCount = gameData.stats.total;
    
    // ヘッダー行
    lines.push('項目,値');
    
    // 基本情報
    lines.push(`ゲーム名,${gameInfo.name}`);
    lines.push(`エクスポート日時,${new Date().toLocaleString('ja-JP')}`);
    lines.push(`総ポケモン数,${totalCount}`);
    lines.push(`ゲット済み,${caughtCount}`);
    lines.push(`未ゲット,${totalCount - caughtCount}`);
    lines.push(`完成率,${Math.round((caughtCount / totalCount) * 100)}%`);
    lines.push('');
    
    // 地域別統計
    lines.push('地域別統計');
    lines.push('地域名,総数,専用ポケモン');
    Object.entries(gameData.stats.regions).forEach(([regionId, stats]) => {
      const regionName = getRegionDisplayName(regionId);
      lines.push(`${regionName},${stats.total},${stats.only}`);
    });
    
    return lines.join('\n');
  };

  // 地域名を取得
  const getRegionDisplayName = (regionId: string): string => {
    const names: Record<string, string> = {
      paldea: 'パルデア図鑑',
      kitakami: 'キタカミ図鑑',
      blueberry: 'ブルーベリー図鑑',
      galar: 'ガラル図鑑',
      isle_of_armor: 'ヨロイ島図鑑',
      crown_tundra: 'カンムリ雪原図鑑'
    };
    return names[regionId] || regionId;
  };

  // ファイルダウンロード
  const downloadFile = (content: string, filename: string, mimeType: string = 'text/plain'): void => {
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  };

  // メイン エクスポート関数
  const exportProgress = (
    format: 'json' | 'csv' | 'summary-csv',
    gameData: ZukanData,
    gameInfo: GameConfig
  ): void => {
    const timestamp = new Date().toISOString().slice(0, 16).replace(/[:-]/g, '');
    const gameId = gameInfo.id;
    
    switch (format) {
      case 'json':
        const jsonContent = exportToJSON(gameData, gameInfo);
        downloadFile(jsonContent, `${gameId}_progress_${timestamp}.json`, 'application/json');
        break;
        
      case 'csv':
        const csvContent = exportToCSV(gameData, gameInfo);
        downloadFile(csvContent, `${gameId}_progress_${timestamp}.csv`, 'text/csv');
        break;
        
      case 'summary-csv':
        const summaryContent = exportSummaryToCSV(gameData, gameInfo);
        downloadFile(summaryContent, `${gameId}_summary_${timestamp}.csv`, 'text/csv');
        break;
        
      default:
        console.error('不明なエクスポート形式:', format);
    }
  };

  return {
    exportProgress,
    exportToJSON,
    exportToCSV,
    exportSummaryToCSV,
    downloadFile
  };
}