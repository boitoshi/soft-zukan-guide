<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const showScrollTop = ref(false)
const showQuickNav = ref(false)

// ナビゲーションアイテム（現在のページ以外を表示）
const navItems = [
  { to: '/', icon: '🎮', label: 'ゲーム別管理' },
  { to: '/advisor', icon: '💡', label: 'アドバイザー' },
  { to: '/cross-check', icon: '🔄', label: 'クロスチェック' },
  { to: '/guide', icon: '📖', label: 'ガイド' },
  { to: '/overview', icon: '📋', label: '図鑑一覧' },
]

const onScroll = () => {
  showScrollTop.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const toggleQuickNav = () => {
  showQuickNav.value = !showQuickNav.value
}

const closeQuickNav = () => {
  showQuickNav.value = false
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <!-- Quick Nav Overlay -->
  <Transition name="fade">
    <div
      v-if="showQuickNav"
      class="fixed inset-0 bg-black/20 z-40"
      @click="closeQuickNav"
    ></div>
  </Transition>

  <!-- Quick Nav Menu -->
  <Transition name="slide-up">
    <div v-if="showQuickNav" class="fixed bottom-20 right-4 z-50 flex flex-col gap-2 items-end">
      <template v-for="item in navItems" :key="item.to">
        <router-link
          v-if="route.path !== item.to"
          :to="item.to"
          @click="closeQuickNav"
          class="flex items-center gap-2 bg-white shadow-lg rounded-full pl-3 pr-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors border border-gray-200"
        >
          <span>{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </router-link>
      </template>
    </div>
  </Transition>

  <!-- Floating Buttons -->
  <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 items-center">
    <!-- Scroll to Top -->
    <Transition name="fade">
      <button
        v-if="showScrollTop"
        @click="scrollToTop"
        class="w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 text-gray-500 hover:text-gray-800 hover:shadow-xl transition-all flex items-center justify-center"
        title="トップへ戻る"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </Transition>

    <!-- Quick Nav Toggle -->
    <button
      @click="toggleQuickNav"
      class="w-11 h-11 rounded-full shadow-lg transition-all flex items-center justify-center"
      :class="showQuickNav
        ? 'bg-gray-800 text-white hover:bg-gray-700'
        : 'bg-blue-600 text-white hover:bg-blue-700'"
      title="他の機能へ移動"
    >
      <svg v-if="!showQuickNav" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.25s ease;
}
.slide-up-enter-from, .slide-up-leave-to {
  opacity: 0;
  transform: translateY(16px);
}
</style>
