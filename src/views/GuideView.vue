<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePokemonMaster } from '@/composables/usePokemonMaster'
import { GAME_ICON_MAP } from '@/constants/icons'

const master = usePokemonMaster()
const isReady = ref(false)
const activeSection = ref<'sanchi' | 'trade' | 'tips'>('sanchi')

onMounted(async () => {
  await master.loadMasterData()
  isReady.value = true
})

// 通信交換進化ポケモン一覧
const tradeEvoPokemon = computed(() => {
  if (!isReady.value) return []
  return master.allPokemon.value
    .filter(p => p.tradeEvolution)
    .map(p => ({
      name: p.name,
      from: p.tradeEvolution!.from,
      method: p.tradeEvolution!.method,
      svLinkCord: p.tradeEvolution!.svLinkCord,
      gameCount: Object.keys(p.games).length,
      games: Object.keys(p.games),
    }))
})

// 通信交換を分類
const linkCordPokemon = computed(() => tradeEvoPokemon.value.filter(p => p.svLinkCord))
const itemTradePokemon = computed(() => tradeEvoPokemon.value.filter(p => !p.svLinkCord))
</script>

<template>
  <div class="container mx-auto px-3 py-4 md:px-4 md:py-8 max-w-2xl">
    <div class="text-center mb-3">
      <h1 class="text-2xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
        📖 ガイド
      </h1>
      <p class="text-xs text-gray-500 mt-1">ソフト図鑑の仕組みと攻略ヒント</p>
    </div>

    <!-- Section Tabs -->
    <div class="flex gap-1.5 mb-4 overflow-x-auto pb-1">
      <button
        @click="activeSection = 'sanchi'"
        class="flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all"
        :class="activeSection === 'sanchi' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'"
      >🏷️ 産地マーク</button>
      <button
        @click="activeSection = 'trade'"
        class="flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all"
        :class="activeSection === 'trade' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'"
      >📱 通信交換</button>
      <button
        @click="activeSection = 'tips'"
        class="flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all"
        :class="activeSection === 'tips' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'"
      >💡 攻略ヒント</button>
    </div>

    <!-- ==================== -->
    <!-- 産地マーク解説 -->
    <!-- ==================== -->
    <div v-if="activeSection === 'sanchi'" class="space-y-4">
      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <h2 class="text-base font-bold text-gray-800 mb-3">🏷️ ソフト図鑑とは？</h2>
        <div class="space-y-3 text-sm text-gray-700 leading-relaxed">
          <p>
            Pokémon HOME の<strong>ソフト図鑑</strong>は、各ゲームで捕まえたポケモンだけが登録される図鑑。
            全ポケモンをHOMEに集めるだけでは完成しない。
          </p>
          <div class="bg-indigo-50 rounded-lg p-3">
            <p class="text-xs font-semibold text-indigo-700 mb-1">ポイント</p>
            <p class="text-xs text-indigo-600">
              ポケモンには<strong>産地マーク</strong>がつき、捕まえたゲームの図鑑にだけ登録される。
              例: SwShで捕まえたイーブイ → ガラル図鑑に登録、パルデア図鑑には登録されない。
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <h2 class="text-base font-bold text-gray-800 mb-3">🥚 孵化で産地を変える</h2>
        <div class="space-y-3 text-sm text-gray-700">
          <p>
            別ゲームで持っているポケモンを<strong>孵化</strong>すれば、そのゲームの産地マークがつく。
          </p>

          <div class="bg-purple-50 rounded-lg p-3">
            <p class="text-xs font-semibold text-purple-700 mb-2">具体例: ガラル御三家をSVで登録する</p>
            <ol class="text-xs text-purple-600 space-y-1 list-decimal list-inside">
              <li>SwShでサルノリを捕獲（ガラルマーク付き）</li>
              <li>HOMEを経由してSVに送る</li>
              <li>SVでタマゴを作って孵化 → <strong>パルデアマーク</strong>付きに！</li>
              <li>HOMEに送る → SVのソフト図鑑に登録される</li>
            </ol>
          </div>

          <div class="bg-amber-50 rounded-lg p-3">
            <p class="text-xs font-semibold text-amber-700 mb-1">進化させても産地マークは変わらない</p>
            <p class="text-xs text-amber-600">
              パルデアマークのサルノリをSwShに送って進化させても、パルデアマークのまま。
              進化後にHOMEに送ればSVのソフト図鑑に登録される。
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <h2 class="text-base font-bold text-gray-800 mb-3">📋 対象ソフト</h2>
        <div class="text-xs text-gray-600 mb-3">ソフト図鑑はSwitch以降のソフトが対象</div>
        <div class="space-y-1.5">
          <div class="flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-lg">
            <span>🏔️</span>
            <span class="text-sm font-medium text-emerald-700 flex-1">SV（パルデア・キタカミ・ブルーベリー）</span>
            <span class="text-[10px] bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded-full">対象</span>
          </div>
          <div class="flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-lg">
            <span>⚔️</span>
            <span class="text-sm font-medium text-emerald-700 flex-1">SwSh（ガラル・ヨロイ・カンムリ）</span>
            <span class="text-[10px] bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded-full">対象</span>
          </div>
          <div class="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
            <span>🌺</span>
            <span class="text-sm text-gray-500 flex-1">USUM / SM / ORAS / XY</span>
            <span class="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">参考</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <h2 class="text-base font-bold text-gray-800 mb-3">🔄 DLC図鑑の重複登録</h2>
        <div class="text-sm text-gray-700 space-y-2">
          <p>同じソフト内の複数図鑑に登場するポケモンは、<strong>1回の捕獲で全図鑑に同時登録</strong>される。</p>
          <div class="bg-teal-50 rounded-lg p-3">
            <p class="text-xs text-teal-700">
              例: SVでコンパンを捕まえると → パルデア図鑑 ✓ / キタカミ図鑑 ✓ / ブルーベリー図鑑 ✓ の3枠同時！
            </p>
          </div>
          <div class="grid grid-cols-2 gap-2 text-center text-xs">
            <div class="bg-gray-50 rounded-lg p-2">
              <div class="font-bold text-gray-700">SV</div>
              <div class="text-gray-500">669枠 → ユニーク489匹</div>
            </div>
            <div class="bg-gray-50 rounded-lg p-2">
              <div class="font-bold text-gray-700">SwSh</div>
              <div class="text-gray-500">642枠 → ユニーク411匹</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== -->
    <!-- 通信交換進化 -->
    <!-- ==================== -->
    <div v-if="activeSection === 'trade'" class="space-y-4">
      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <h2 class="text-base font-bold text-gray-800 mb-2">📱 通信交換で進化するポケモン</h2>
        <p class="text-xs text-gray-500 mb-3">
          ソフト図鑑完成には進化形も必要。通信交換が必要なポケモンは要注意！
        </p>

        <div v-if="isReady" class="text-xs text-gray-500 mb-3">
          ゲーム内に登場する通信交換進化: <strong>{{ tradeEvoPokemon.length }}匹</strong>
        </div>
      </div>

      <!-- 通信交換の代替手段 -->
      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <h3 class="text-sm font-bold text-green-700 mb-2">✅ 通信交換なしで進化できるケース</h3>
        <div class="space-y-3">
          <div class="bg-green-50 rounded-lg p-3">
            <p class="text-xs font-semibold text-green-700 mb-1">🎮 レジェンズアルセウス「つながりのヒモ」</p>
            <p class="text-[11px] text-green-600">
              レジェンズアルセウスに登場するポケモンは、アルセウスに送って「つながりのヒモ」で進化させれば通信交換不要。
              進化後にHOMEで対象ゲームに戻せばソフト図鑑に登録できる。
            </p>
          </div>
          <div class="bg-blue-50 rounded-lg p-3">
            <p class="text-xs font-semibold text-blue-700 mb-1">⭐ レイドバトルで進化後を直接入手</p>
            <p class="text-[11px] text-blue-600">
              SV・SwShのレイドバトルでは、通信交換進化のポケモンが進化後の姿で出現することがある。
              レイドで捕まえれば通信交換なしで図鑑登録が可能。
            </p>
          </div>
        </div>
      </div>

      <!-- つながりのヒモ対応リスト -->
      <div v-if="linkCordPokemon.length > 0" class="bg-white rounded-xl border border-gray-200 p-4">
        <h3 class="text-sm font-bold text-green-700 mb-2">📋 つながりのヒモで進化可能なポケモン</h3>
        <p class="text-[11px] text-gray-500 mb-3">レジェンズアルセウスに送って「つながりのヒモ」で進化</p>
        <div class="space-y-1">
          <div
            v-for="p in linkCordPokemon"
            :key="p.name"
            class="flex items-center gap-2 px-2 py-1.5 bg-green-50 rounded-md"
          >
            <span class="text-xs font-medium text-gray-800 w-24 truncate">{{ p.name }}</span>
            <span class="text-[10px] text-gray-500">← {{ p.from }}</span>
            <span class="ml-auto flex gap-0.5">
              <span v-for="g in p.games" :key="g" class="text-[10px]">{{ GAME_ICON_MAP[g] }}</span>
            </span>
          </div>
        </div>
      </div>

      <!-- アイテム通信交換 -->
      <div v-if="itemTradePokemon.length > 0" class="bg-white rounded-xl border border-gray-200 p-4">
        <h3 class="text-sm font-bold text-orange-700 mb-2">⚠️ 通信交換が必要</h3>
        <p class="text-[11px] text-gray-500 mb-3">アイテムを持たせて通信交換、または特定条件（レイドで出現する場合あり）</p>
        <div class="space-y-1">
          <div
            v-for="p in itemTradePokemon"
            :key="p.name"
            class="flex items-center gap-2 px-2 py-1.5 bg-orange-50 rounded-md"
          >
            <div class="flex-1 min-w-0">
              <div class="text-xs font-medium text-gray-800">{{ p.name }}</div>
              <div class="text-[10px] text-gray-500 truncate">{{ p.method }}</div>
            </div>
            <span class="flex gap-0.5 flex-shrink-0">
              <span v-for="g in p.games" :key="g" class="text-[10px]">{{ GAME_ICON_MAP[g] }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== -->
    <!-- 攻略ヒント -->
    <!-- ==================== -->
    <div v-if="activeSection === 'tips'" class="space-y-4">
      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <h2 class="text-base font-bold text-gray-800 mb-3">💡 効率よく完成させるコツ</h2>
        <div class="space-y-3">
          <div class="bg-purple-50 rounded-lg p-3">
            <p class="text-xs font-semibold text-purple-700 mb-1">1. 🥚 孵化を最大限活用する</p>
            <p class="text-xs text-purple-600">
              別ゲームで持っているポケモンは、対象ゲームで孵化するだけで登録可能。
              「💡 アドバイザー」画面で孵化可能なポケモンを確認しよう。
            </p>
          </div>

          <div class="bg-blue-50 rounded-lg p-3">
            <p class="text-xs font-semibold text-blue-700 mb-1">2. 🎯 両バージョンを活用する</p>
            <p class="text-xs text-blue-600">
              バージョン限定ポケモンはそのバージョンでしか捕まえられない。
              友達と交換するか、2台持ちなら両方でプレイするのが効率的。
            </p>
          </div>

          <div class="bg-emerald-50 rounded-lg p-3">
            <p class="text-xs font-semibold text-emerald-700 mb-1">3. 🔄 重複ポケモンを優先する</p>
            <p class="text-xs text-emerald-600">
              複数図鑑に登場するポケモンを先に捕まえれば、1回の捕獲で複数枠が埋まる。
              SV: 180匹の重複、SwSh: 231匹の重複がある。
            </p>
          </div>

          <div class="bg-amber-50 rounded-lg p-3">
            <p class="text-xs font-semibold text-amber-700 mb-1">4. 📱 通信交換進化を忘れずに</p>
            <p class="text-xs text-amber-600">
              進化形もソフト図鑑に必要。通信交換でしか進化しないポケモンは「📱 通信交換」タブで確認。
              レジェンズアルセウスの「つながりのヒモ」やレイドバトルで代替できる場合もある。
            </p>
          </div>

          <div class="bg-rose-50 rounded-lg p-3">
            <p class="text-xs font-semibold text-rose-700 mb-1">5. ⚠️ 伝説・幻は孵化できない</p>
            <p class="text-xs text-rose-600">
              伝説・幻のポケモンは孵化不可。各ゲームで直接捕獲するしかない。
              「🔄 クロスチェック」画面で ★ マークのポケモンが対象。
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <h2 class="text-base font-bold text-gray-800 mb-3">📋 このアプリの使い方</h2>
        <div class="space-y-2">
          <div class="flex items-start gap-2 text-xs text-gray-700">
            <span class="bg-indigo-100 text-indigo-700 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 text-[10px] font-bold">1</span>
            <span>HOME でソフト図鑑を確認 → 未登録ポケモンを発見</span>
          </div>
          <div class="flex items-start gap-2 text-xs text-gray-700">
            <span class="bg-indigo-100 text-indigo-700 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 text-[10px] font-bold">2</span>
            <span>「💡 アドバイザー」でゲームを選択 → 残りと孵化可能数を確認</span>
          </div>
          <div class="flex items-start gap-2 text-xs text-gray-700">
            <span class="bg-indigo-100 text-indigo-700 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 text-[10px] font-bold">3</span>
            <span>孵化可能なポケモンから先に処理 → 効率よく図鑑を埋める</span>
          </div>
          <div class="flex items-start gap-2 text-xs text-gray-700">
            <span class="bg-indigo-100 text-indigo-700 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 text-[10px] font-bold">4</span>
            <span>捕まえたら「🎮 ゲーム別管理」でチェック → 進捗が全ページに反映</span>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6 text-center text-gray-400 text-[10px]">
      📖 ガイド | ソフト図鑑完成ガイド
    </div>
  </div>
</template>
