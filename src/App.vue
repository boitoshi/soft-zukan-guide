<script setup lang="ts">
import PageNavigation from '@/components/PageNavigation.vue'
</script>

<template>
  <div class="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen">
    <div class="container mx-auto px-4 py-8">
      <PageNavigation />
      <RouterView />
    </div>
  </div>
</template>
